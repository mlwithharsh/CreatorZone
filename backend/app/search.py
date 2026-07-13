from typing import Any

import meilisearch

from backend.app.config import get_settings

INDEX_NAME = "creators"


def get_meili_index():
    settings = get_settings()
    client = meilisearch.Client(settings.meilisearch_host, settings.meilisearch_key)
    return client.index(INDEX_NAME)


def configure_creator_index() -> None:
    index = get_meili_index()
    index.update_searchable_attributes(["name", "bio", "category", "tags"])
    index.update_filterable_attributes(["category", "languages", "region"])


def index_creator_document(row: dict[str, Any]) -> None:
    document = {
        "id": row["id"],
        "name": row.get("name"),
        "bio": row.get("bio"),
        "category": row.get("category"),
        "languages": row.get("languages") or [],
        "region": row.get("region"),
    }
    get_meili_index().add_documents([document])


def search_creator_index(q: str | None, category: str | None, language: str | None, region: str | None, limit: int) -> list[dict[str, Any]]:
    filters = []
    if category:
        filters.append(f'category = "{category}"')
    if language:
        filters.append(f'languages = "{language}"')
    if region:
        filters.append(f'region = "{region}"')

    result = get_meili_index().search(
        q or "",
        {
            "limit": limit,
            "filter": " AND ".join(filters) if filters else None,
        },
    )
    return list(result.get("hits", []))
