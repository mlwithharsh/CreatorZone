from backend.app.celery_app import celery_app
from ingestion.sync_notion import run_sync


@celery_app.task(name="backend.app.tasks.notion_sync", autoretry_for=(Exception,), retry_backoff=True, retry_kwargs={"max_retries": 3})
def notion_sync() -> dict[str, int]:
    return run_sync()
