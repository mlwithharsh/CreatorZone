import time
from collections.abc import Iterator
from typing import Any

import httpx


class NotionClient:
    def __init__(self, api_key: str, database_id: str, requests_per_second: float = 3.0) -> None:
        if not api_key or not database_id:
            raise RuntimeError("NOTION_API_KEY and NOTION_DATABASE_ID are required.")
        self.database_id = database_id
        self.min_interval = 1 / requests_per_second
        self.last_request_at = 0.0
        self.client = httpx.Client(
            base_url="https://api.notion.com/v1",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Notion-Version": "2022-06-28",
                "Content-Type": "application/json",
            },
            timeout=30,
        )

    def iter_database_pages(self, last_edited_after: str | None = None) -> Iterator[dict[str, Any]]:
        payload: dict[str, Any] = {"page_size": 100}
        if last_edited_after:
            payload["filter"] = {
                "timestamp": "last_edited_time",
                "last_edited_time": {"after": last_edited_after},
            }

        while True:
            data = self._post_with_backoff(f"/databases/{self.database_id}/query", payload)
            yield from data.get("results", [])
            if not data.get("has_more"):
                break
            payload["start_cursor"] = data.get("next_cursor")

    def _post_with_backoff(self, path: str, payload: dict[str, Any]) -> dict[str, Any]:
        delay = 1.0
        for attempt in range(5):
            self._respect_rate_limit()
            response = self.client.post(path, json=payload)
            if response.status_code == 429:
                retry_after = float(response.headers.get("Retry-After", delay))
                time.sleep(retry_after)
                delay *= 2
                continue
            response.raise_for_status()
            return response.json()
        raise RuntimeError(f"Notion API remained rate-limited after {attempt + 1} attempts.")

    def _respect_rate_limit(self) -> None:
        elapsed = time.monotonic() - self.last_request_at
        remaining = self.min_interval - elapsed
        if remaining > 0:
            time.sleep(remaining)
        self.last_request_at = time.monotonic()
