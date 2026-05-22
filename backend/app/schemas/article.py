from datetime import datetime

from pydantic import BaseModel


class ArticleCreate(BaseModel):
    title: str
    summary: str | None = None
    content_md: str
    status: str = "draft"


class ArticleUpdate(BaseModel):
    title: str | None = None
    summary: str | None = None
    content_md: str | None = None
    status: str | None = None


class ArticleResponse(BaseModel):
    id: int
    author_id: int
    title: str
    slug: str
    summary: str | None
    content_md: str
    content_html: str
    status: str
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime
    author_name: str | None = None

    model_config = {"from_attributes": True}


class ArticleListItem(BaseModel):
    id: int
    title: str
    slug: str
    summary: str | None
    status: str
    published_at: datetime | None
    created_at: datetime
    author_name: str | None = None

    model_config = {"from_attributes": True}


class PaginatedResponse(BaseModel):
    items: list
    total: int
    page: int
    page_size: int
    total_pages: int
