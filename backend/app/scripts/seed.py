"""Seed demo data: 5 users, 20 items, 10 AI call logs."""

import asyncio
import logging

from sqlalchemy import func, select

from app.core.security import hash_password
from app.db.models import AILog, Item, User
from app.db.session import AsyncSessionLocal

logger = logging.getLogger(__name__)

DEMO_PASSWORD = "demo123"

DEMO_USERS = [
    ("demo1@hackathon.dev", "Demo User One"),
    ("demo2@hackathon.dev", "Demo User Two"),
    ("demo3@hackathon.dev", "Demo User Three"),
    ("demo4@hackathon.dev", "Demo User Four"),
    ("demo5@hackathon.dev", "Demo User Five"),
]

ITEM_STATUSES = ["draft", "active", "archived"]
AI_PROVIDERS = ["mock", "openai", "groq", "anthropic"]


async def seed() -> None:
    async with AsyncSessionLocal() as session:
        existing = await session.scalar(select(func.count()).select_from(User))
        if existing and existing > 0:
            logger.info("Database already seeded (%s users). Skipping.", existing)
            return

        users: list[User] = []
        for email, full_name in DEMO_USERS:
            user = User(
                email=email,
                full_name=full_name,
                hashed_password=hash_password(DEMO_PASSWORD),
                is_active=True,
            )
            session.add(user)
            users.append(user)

        await session.flush()

        for index in range(1, 21):
            owner = users[(index - 1) % len(users)]
            session.add(
                Item(
                    title=f"Demo Item {index}",
                    description=f"Seeded description for item {index}",
                    status=ITEM_STATUSES[index % len(ITEM_STATUSES)],
                    owner_id=owner.id,
                )
            )

        for index in range(1, 11):
            owner = users[(index - 1) % len(users)]
            session.add(
                AILog(
                    user_id=owner.id,
                    provider=AI_PROVIDERS[index % len(AI_PROVIDERS)],
                    model="gpt-4o-mini" if index % 2 == 0 else "llama-3.1-70b",
                    prompt_tokens=80 + index * 5,
                    completion_tokens=120 + index * 3,
                    latency_ms=200 + index * 15,
                )
            )

        await session.commit()
        logger.info(
            "Seeded %s users, 20 items, 10 AI logs. Login password: %s",
            len(users),
            DEMO_PASSWORD,
        )


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    asyncio.run(seed())


if __name__ == "__main__":
    main()
