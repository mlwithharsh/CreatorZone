from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class IngestionSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    notion_api_key: str = Field(default="", alias="NOTION_API_KEY")
    notion_database_id: str = Field(default="", alias="NOTION_DATABASE_ID")
    supabase_url: str = Field(default="", alias="SUPABASE_URL")
    supabase_key: str = Field(default="", alias="SUPABASE_KEY")
    contact_encryption_key: str = Field(default="", alias="CONTACT_ENCRYPTION_KEY")
    notion_max_requests_per_second: float = Field(default=3.0, alias="NOTION_MAX_REQUESTS_PER_SECOND")


@lru_cache
def get_ingestion_settings() -> IngestionSettings:
    return IngestionSettings()
