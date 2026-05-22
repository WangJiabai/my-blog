from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.middleware.auth import require_admin
from app.models.article import Article
from app.models.comment import Comment
from app.models.user import User
from app.services.article_service import article_to_response

router = APIRouter()


@router.get("/articles/{article_id}")
async def get_article_for_edit(
    article_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    result = await db.execute(
        select(Article).options(selectinload(Article.author)).where(Article.id == article_id)
    )
    article = result.scalar_one_or_none()
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")
    return article_to_response(article)


@router.get("/stats")
async def get_stats(db: AsyncSession = Depends(get_db), _admin: User = Depends(require_admin)):
    article_count = await db.execute(select(func.count(Article.id)))
    published_count = await db.execute(
        select(func.count(Article.id)).where(Article.status == "published")
    )
    draft_count = await db.execute(
        select(func.count(Article.id)).where(Article.status == "draft")
    )
    comment_count = await db.execute(select(func.count(Comment.id)))
    user_count = await db.execute(select(func.count(User.id)))

    return {
        "total_articles": article_count.scalar(),
        "published_articles": published_count.scalar(),
        "draft_articles": draft_count.scalar(),
        "total_comments": comment_count.scalar(),
        "total_users": user_count.scalar(),
    }
