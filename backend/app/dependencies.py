from typing import Any

from supabase import Client, create_client

from backend.app.config import get_settings

_supabase_client: Client | None = None


def get_supabase() -> Client:
    global _supabase_client
    settings = get_settings()
    if not settings.supabase_url or not settings.supabase_key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_KEY are required for database access.")
    if _supabase_client is None:
        _supabase_client = create_client(settings.supabase_url, settings.supabase_key)
    return _supabase_client


def normalize_creator(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": row.get("id"),
        "name": row.get("name", ""),
        "bio": row.get("bio"),
        "category": row.get("category") or first_value(row.get("categories")),
        "languages": row.get("languages") or [],
        "region": row.get("region") or row.get("location_country"),
        "followers": row.get("followers"),
        "avg_likes": row.get("avg_likes"),
        "engagement_rate": float(row["engagement_rate"]) if row.get("engagement_rate") is not None else None,
        "created_at": row.get("created_at"),
        "updated_at": row.get("updated_at"),
    }


def first_value(value: Any) -> str | None:
    if isinstance(value, list) and value:
        return str(value[0])
    return None
