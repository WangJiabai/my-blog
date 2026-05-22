import ssl
from urllib.parse import parse_qs, urlparse, urlunparse

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

connect_args: dict = {}

if "mysql" in settings.DATABASE_URL:
    parsed = urlparse(settings.DATABASE_URL)
    qs = parse_qs(parsed.query, keep_blank_values=True)
    ssl_ca = qs.get("ssl_ca", [None])[0]

    if ssl_ca:
        ctx = ssl.create_default_context(cafile=ssl_ca)
        connect_args["ssl"] = ctx

    # Remove ssl params from URL — they're in connect_args
    clean_qs = {k: v[0] for k, v in qs.items() if not k.startswith("ssl_")}
    clean_url = urlunparse(parsed._replace(query="&".join(f"{k}={v}" for k, v in clean_qs.items())))
else:
    clean_url = settings.DATABASE_URL

engine = create_async_engine(
    clean_url,
    echo=settings.ENVIRONMENT == "development",
    connect_args=connect_args if connect_args else None,
)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()
