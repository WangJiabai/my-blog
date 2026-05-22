import ssl
from logging.config import fileConfig
from urllib.parse import parse_qs, urlparse, urlunparse

from alembic import context
from sqlalchemy import create_engine

from app.config import settings
from app.database import Base

import app.models.user  # noqa: F401
import app.models.article  # noqa: F401
import app.models.comment  # noqa: F401

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def get_sync_url_and_ssl():
    url = settings.DATABASE_URL.replace("+aiomysql", "+pymysql").replace("+aiosqlite", "+pysqlite")
    connect_args = {}

    if "mysql" in url:
        parsed = urlparse(url)
        qs = parse_qs(parsed.query, keep_blank_values=True)
        ssl_ca = qs.get("ssl_ca", [None])[0]
        if ssl_ca:
            connect_args["ssl"] = {"ca": ssl_ca}
        clean_qs = {k: v[0] for k, v in qs.items() if not k.startswith("ssl_")}
        url = urlunparse(parsed._replace(query="&".join(f"{k}={v}" for k, v in clean_qs.items())))

    return url, connect_args


def run_migrations_offline() -> None:
    url, _ = get_sync_url_and_ssl()
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    url, connect_args = get_sync_url_and_ssl()
    connectable = create_engine(url, connect_args=connect_args if connect_args else {})
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
