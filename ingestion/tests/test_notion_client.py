import respx
from httpx import Response

from ingestion.notion_client import NotionClient


@respx.mock
def test_iter_database_pages_handles_pagination() -> None:
    route = respx.post("https://api.notion.com/v1/databases/db/query").mock(
        side_effect=[
            Response(
                200,
                json={"results": [{"id": "one"}], "has_more": True, "next_cursor": "cursor-2"},
            ),
            Response(200, json={"results": [{"id": "two"}], "has_more": False}),
        ]
    )
    client = NotionClient("secret", "db", requests_per_second=1000)
    pages = list(client.iter_database_pages())
    assert pages == [{"id": "one"}, {"id": "two"}]
    assert route.call_count == 2
