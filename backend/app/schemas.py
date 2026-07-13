from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "hashfame-api"


class CreatorSummary(BaseModel):
    id: UUID | str
    name: str
    bio: str | None = None
    category: str | None = None
    languages: list[str] = Field(default_factory=list)
    region: str | None = None
    followers: int | None = None
    avg_likes: int | None = None
    engagement_rate: float | None = None


class SearchResponse(BaseModel):
    results: list[CreatorSummary]
    total: int


class CreatorDetail(CreatorSummary):
    created_at: datetime | str | None = None
    updated_at: datetime | str | None = None
