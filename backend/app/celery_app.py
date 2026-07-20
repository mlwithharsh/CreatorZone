from celery import Celery

from backend.app.config import get_settings

settings = get_settings()

celery_app = Celery(
    "creatorzone",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=["backend.app.tasks"],
)

celery_app.conf.beat_schedule = {
    "notion-sync-every-30-minutes": {
        "task": "backend.app.tasks.notion_sync",
        "schedule": 30 * 60,
    },
}
