from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.comment import Comment
from app.schemas.comment import CommentCreate
from app.utils.pagination import paginate


async def get_comments_paginated(
    db: AsyncSession, article_id: int, page: int = 1, page_size: int = 20
) -> dict:
    total_result = await db.execute(
        select(func.count(Comment.id)).where(
            Comment.article_id == article_id, Comment.is_approved == True
        )
    )
    total = total_result.scalar()

    result = await db.execute(
        select(Comment)
        .options(selectinload(Comment.author))
        .where(Comment.article_id == article_id, Comment.is_approved == True)
        .order_by(Comment.created_at.asc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    comments = result.scalars().all()

    items = []
    for c in comments:
        items.append({
            "id": c.id,
            "article_id": c.article_id,
            "author_id": c.author_id,
            "body": c.body,
            "is_approved": c.is_approved,
            "created_at": c.created_at,
            "author_name": c.author.display_name if c.author else None,
        })

    return paginate(items, total, page, page_size)


async def create_comment(db: AsyncSession, article_id: int, author_id: int, data: CommentCreate) -> Comment:
    comment = Comment(article_id=article_id, author_id=author_id, body=data.body)
    db.add(comment)
    await db.commit()
    await db.refresh(comment)
    return comment


async def get_comment_by_id(db: AsyncSession, comment_id: int) -> Comment | None:
    result = await db.execute(select(Comment).where(Comment.id == comment_id))
    return result.scalar_one_or_none()


async def delete_comment(db: AsyncSession, comment: Comment) -> None:
    await db.delete(comment)
    await db.commit()
