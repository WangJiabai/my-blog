from datetime import datetime

from pydantic import BaseModel


class CommentCreate(BaseModel):
    body: str


class CommentResponse(BaseModel):
    id: int
    article_id: int
    author_id: int
    body: str
    is_approved: bool
    created_at: datetime
    author_name: str | None = None

    model_config = {"from_attributes": True}
