from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import auth, articles, comments, admin


def create_app() -> FastAPI:
    app = FastAPI(title="Personal Blog API", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
    app.include_router(articles.router, prefix="/api/articles", tags=["articles"])
    app.include_router(comments.router, prefix="/api/comments", tags=["comments"])
    app.include_router(admin.router, prefix="/api/admin", tags=["admin"])

    return app


app = create_app()
