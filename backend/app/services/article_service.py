import html
import re

from datetime import datetime, timezone

from markdown_it import MarkdownIt
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from slugify import slugify

from app.models.article import Article
from app.schemas.article import ArticleCreate, ArticleUpdate
from app.utils.pagination import paginate

md = MarkdownIt("commonmark", {"breaks": True, "html": False})


def render_markdown(content_md: str) -> str:
    return md.render(content_md)


def strip_html(text: str) -> str:
    return re.sub(r"<[^>]+>", "", text)


def generate_unique_slug(title: str, existing_slugs: set[str]) -> str:
    slug = slugify(title)
    if slug not in existing_slugs:
        return slug
    i = 2
    while f"{slug}-{i}" in existing_slugs:
        i += 1
    return f"{slug}-{i}"


async def get_articles_paginated(
    db: AsyncSession,
    page: int = 1,
    page_size: int = 20,
    status: str = "published",
    is_admin: bool = False,
) -> dict:
    conditions = [Article.status == status] if not is_admin else []
    if is_admin:
        conditions = None  # admin sees all
    else:
        conditions = [Article.status == "published"]

    base = select(Article).options(selectinload(Article.author))
    base_count = select(func.count(Article.id))

    if conditions is not None:
        base = base.where(*conditions)
        base_count = base_count.where(*conditions)

    total_result = await db.execute(base_count)
    total = total_result.scalar()

    result = await db.execute(
        base.order_by(Article.published_at.desc(), Article.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    articles = result.scalars().all()

    items = []
    for a in articles:
        items.append({
            "id": a.id,
            "title": a.title,
            "slug": a.slug,
            "summary": a.summary,
            "status": a.status,
            "published_at": a.published_at,
            "created_at": a.created_at,
            "author_name": a.author.display_name if a.author else None,
        })

    return paginate(items, total, page, page_size)


async def get_article_by_slug(db: AsyncSession, slug: str) -> Article | None:
    result = await db.execute(
        select(Article).options(selectinload(Article.author)).where(Article.slug == slug)
    )
    return result.scalar_one_or_none()


async def get_article_by_id(db: AsyncSession, article_id: int) -> Article | None:
    result = await db.execute(
        select(Article).options(selectinload(Article.author)).where(Article.id == article_id)
    )
    return result.scalar_one_or_none()


async def create_article(db: AsyncSession, data: ArticleCreate, author_id: int) -> Article:
    existing_result = await db.execute(select(Article.slug))
    existing_slugs = {row[0] for row in existing_result.all()}

    content_html = render_markdown(data.content_md)
    summary = data.summary or strip_html(content_html)[:200]

    published_at = datetime.now(timezone.utc) if data.status == "published" else None

    article = Article(
        author_id=author_id,
        title=data.title,
        slug=generate_unique_slug(data.title, existing_slugs),
        summary=summary,
        content_md=data.content_md,
        content_html=content_html,
        status=data.status,
        published_at=published_at,
    )
    db.add(article)
    await db.commit()
    await db.refresh(article)
    return article


async def update_article(db: AsyncSession, article: Article, data: ArticleUpdate) -> Article:
    if data.title is not None:
        article.title = data.title
        existing_result = await db.execute(
            select(Article.slug).where(Article.id != article.id)
        )
        existing_slugs = {row[0] for row in existing_result.all()}
        article.slug = generate_unique_slug(data.title, existing_slugs)

    if data.content_md is not None:
        article.content_md = data.content_md
        article.content_html = render_markdown(data.content_md)
        article.summary = data.summary or strip_html(article.content_html)[:200]
    elif data.summary is not None:
        article.summary = data.summary

    if data.status is not None:
        article.status = data.status
        if data.status == "published" and article.published_at is None:
            from datetime import datetime, timezone
            article.published_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(article)
    return article


async def delete_article(db: AsyncSession, article: Article) -> None:
    article.status = "archived"
    await db.commit()


def article_to_response(article: Article) -> dict:
    return {
        "id": article.id,
        "author_id": article.author_id,
        "title": article.title,
        "slug": article.slug,
        "summary": article.summary,
        "content_md": article.content_md,
        "content_html": article.content_html,
        "status": article.status,
        "published_at": article.published_at,
        "created_at": article.created_at,
        "updated_at": article.updated_at,
        "author_name": article.author.display_name if article.author else None,
    }
