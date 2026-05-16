from fastapi import APIRouter

from app.api.v1 import ai, auth, health, items, users, ws
from app.config import get_settings

settings = get_settings()

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router, prefix=settings.api_v1_prefix)
api_router.include_router(users.router, prefix=settings.api_v1_prefix)
api_router.include_router(items.router, prefix=settings.api_v1_prefix)
api_router.include_router(ai.router, prefix=settings.api_v1_prefix)
api_router.include_router(ws.router, prefix=settings.api_v1_prefix)
