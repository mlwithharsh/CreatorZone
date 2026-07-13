from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from backend.app.dependencies import get_supabase, normalize_creator
from backend.app.search import search_creator_index
from backend.app.schemas import CreatorDetail, HealthResponse, SearchResponse

app = FastAPI(title="HashFame API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse()


@app.get("/search", response_model=SearchResponse)
def search(
    q: Annotated[str | None, Query(max_length=120)] = None,
    category: str | None = None,
    language: str | None = None,
    region: str | None = None,
    limit: Annotated[int, Query(ge=1, le=50)] = 24,
    supabase=Depends(get_supabase),
) -> SearchResponse:
    try:
        hits = search_creator_index(q, category, language, region, limit)
        if hits:
            rows = [normalize_creator(row) for row in hits]
            return SearchResponse(results=rows, total=len(rows))
    except Exception:
        # Keep the MVP usable when local Meilisearch is not running.
        pass

    query = (
        supabase.table("creators")
        .select("id,name,bio,category,categories,languages,region,location_country,followers,avg_likes,engagement_rate,created_at,updated_at")
        .limit(limit)
    )

    if q:
        query = query.or_(f"name.ilike.%{q}%,bio.ilike.%{q}%")
    if category:
        query = query.eq("category", category)
    if language:
        query = query.contains("languages", [language])
    if region:
        query = query.eq("region", region)

    response = query.execute()
    rows = [normalize_creator(row) for row in (response.data or [])]
    return SearchResponse(results=rows, total=len(rows))


@app.get("/creators/{creator_id}", response_model=CreatorDetail)
def creator_detail(creator_id: str, supabase=Depends(get_supabase)) -> CreatorDetail:
    response = (
        supabase.table("creators")
        .select("id,name,bio,category,categories,languages,region,location_country,followers,avg_likes,engagement_rate,created_at,updated_at")
        .eq("id", creator_id)
        .limit(1)
        .execute()
    )
    if not response.data:
        raise HTTPException(status_code=404, detail="Creator not found")
    return CreatorDetail(**normalize_creator(response.data[0]))
