from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import get_current_user, require_admin, require_user
from app.models.user import User
from app.schemas.article import ArticleCreate, ArticleListItem, ArticleResponse, ArticleUpdate, PaginatedResponse
from app.schemas.comment import CommentCreate, CommentResponse
from app.services import article_service, comment_service

router = APIRouter()


@router.get("", response_model=PaginatedResponse)
async def list_articles(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    is_admin = current_user is not None and current_user.is_admin
    return await article_service.get_articles_paginated(db, page, page_size, is_admin=is_admin)


@router.get("/{article_id}/comments", response_model=PaginatedResponse)
async def list_comments(
    article_id: int,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    article = await article_service.get_article_by_id(db, article_id)
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")
    return await comment_service.get_comments_paginated(db, article_id, page, page_size)


@router.post("/{article_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(
    article_id: int,
    data: CommentCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_user),
):
    article = await article_service.get_article_by_id(db, article_id)
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")
    comment = await comment_service.create_comment(db, article_id, user.id, data)
    return {
        "id": comment.id,
        "article_id": comment.article_id,
        "author_id": comment.author_id,
        "body": comment.body,
        "is_approved": comment.is_approved,
        "created_at": comment.created_at,
        "author_name": comment.author.display_name if comment.author else None,
    }


@router.post("", response_model=ArticleResponse, status_code=status.HTTP_201_CREATED)
async def create_article(
    data: ArticleCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    article = await article_service.create_article(db, data, admin.id)
    return article_service.article_to_response(article)


@router.put("/{article_id}", response_model=ArticleResponse)
async def update_article(
    article_id: int,
    data: ArticleUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    article = await article_service.get_article_by_id(db, article_id)
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")
    article = await article_service.update_article(db, article, data)
    return article_service.article_to_response(article)


@router.delete("/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_article(
    article_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    article = await article_service.get_article_by_id(db, article_id)
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")
    await article_service.delete_article(db, article)


@router.get("/{slug}", response_model=ArticleResponse)
async def get_article(slug: str, db: AsyncSession = Depends(get_db)):
    article = await article_service.get_article_by_slug(db, slug)
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")
    return article_service.article_to_response(article)
