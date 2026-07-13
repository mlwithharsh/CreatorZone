from typing import Any

from supabase import create_client

from ingestion.config import get_ingestion_settings
from ingestion.mappers import contact_from_page, notion_page_to_creator
from ingestion.notion_client import NotionClient
from ingestion.pii import encrypt_contact
from backend.app.search import index_creator_document


def run_sync(last_edited_after: str | None = None) -> dict[str, int]:
    settings = get_ingestion_settings()
    notion = NotionClient(
        api_key=settings.notion_api_key,
        database_id=settings.notion_database_id,
        requests_per_second=settings.notion_max_requests_per_second,
    )
    supabase = create_client(settings.supabase_url, settings.supabase_key)
    upserted = 0

    for page in notion.iter_database_pages(last_edited_after=last_edited_after):
        creator = build_creator_row(page, settings.contact_encryption_key)
        response = supabase.table("creators").upsert(creator, on_conflict="notion_page_id").execute()
        if response.data:
            index_creator_document(response.data[0])
        upserted += 1

    return {"upserted": upserted}


def build_creator_row(page: dict[str, Any], encryption_key: str) -> dict[str, Any]:
    contact = contact_from_page(page)
    encrypted = encrypt_contact(contact, encryption_key)
    return notion_page_to_creator(page, contact_encrypted=encrypted)


if __name__ == "__main__":
    result = run_sync()
    print(result)
