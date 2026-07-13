from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    supabase_url: str = Field(default="", alias="SUPABASE_URL")
    supabase_key: str = Field(default="", alias="SUPABASE_KEY")
    notion_api_key: str = Field(default="", alias="NOTION_API_KEY")
    notion_database_id: str = Field(default="", alias="NOTION_DATABASE_ID")
    openai_api_key: str = Field(default="", alias="OPENAI_API_KEY")
    meilisearch_host: str = Field(default="http://localhost:7700", alias="MEILISEARCH_HOST")
    meilisearch_key: str = Field(default="dev-master-key", alias="MEILISEARCH_KEY")
    qdrant_url: str = Field(default="http://localhost:6333", alias="QDRANT_URL")
    qdrant_key: str = Field(default="", alias="QDRANT_KEY")
    redis_url: str = Field(default="redis://localhost:6379/0", alias="REDIS_URL")
    instagram_access_token: str = Field(default="", alias="INSTAGRAM_ACCESS_TOKEN")
    admin_api_token: str = Field(default="dev-admin-token", alias="ADMIN_API_TOKEN")
    contact_encryption_key: str = Field(default="", alias="CONTACT_ENCRYPTION_KEY")
    embedding_batch_cap: int = Field(default=1000, alias="EMBEDDING_BATCH_CAP")


@lru_cache
def get_settings() -> Settings:
    return Settings()
