import asyncio
from sqlalchemy import select
from app.database import async_session
from app.models.user import User
from app.utils.security import hash_password


async def create_admin(username: str, email: str, password: str, display_name: str):
    async with async_session() as db:
        result = await db.execute(select(User).where(User.email == email))
        if result.scalar_one_or_none():
            print(f"User with email {email} already exists.")
            return

        user = User(
            username=username,
            email=email,
            password_hash=hash_password(password),
            display_name=display_name,
            is_admin=True,
        )
        db.add(user)
        await db.commit()
        print(f"Admin user '{username}' created successfully.")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Create an admin user")
    parser.add_argument("--username", required=True)
    parser.add_argument("--email", required=True)
    parser.add_argument("--password", required=True)
    parser.add_argument("--display-name", required=True)
    args = parser.parse_args()

    asyncio.run(create_admin(args.username, args.email, args.password, args.display_name))
