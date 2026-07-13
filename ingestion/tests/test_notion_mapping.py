from ingestion.mappers import contact_from_page, notion_page_to_creator


FIXTURE = {
    "id": "notion-page-1",
    "last_edited_time": "2026-07-14T00:00:00.000Z",
    "properties": {
        "Name": {"title": [{"plain_text": "Asha Creator"}]},
        "Bio": {"rich_text": [{"plain_text": "Fashion creator in Mumbai"}]},
        "Category": {"select": {"name": "Fashion"}},
        "Languages": {"multi_select": [{"name": "Hindi"}, {"name": "English"}]},
        "Region": {"rich_text": [{"plain_text": "Mumbai"}]},
        "Email": {"email": "asha@example.com"},
    },
}


def test_notion_page_to_creator() -> None:
    row = notion_page_to_creator(FIXTURE, contact_encrypted="encrypted")
    assert row["name"] == "Asha Creator"
    assert row["category"] == "Fashion"
    assert row["languages"] == ["Hindi", "English"]
    assert row["contact_encrypted"] == "encrypted"
    assert row["notion_page_id"] == "notion-page-1"


def test_contact_is_separate_from_indexable_fields() -> None:
    assert contact_from_page(FIXTURE) == "asha@example.com"
    row = notion_page_to_creator(FIXTURE)
    assert "asha@example.com" not in str(row)
