# CreatorZone

HashFame is a free-tier creator discovery build for Indian influencer workflows. The current app keeps the existing Supabase-backed Next.js discovery UI, and adds the backend, ingestion, and local search/vector infrastructure expected by the HashFame architecture.

## Stack

- Frontend: Next.js App Router, TypeScript, Tailwind, TanStack Query.
- Database: Supabase Postgres free plan.
- Backend: FastAPI with Celery.
- Ingestion: Notion API sync, idempotent upserts into Postgres.
- Local search infra: Meilisearch, Qdrant, Redis through Docker Compose.
- Embeddings: configured for OpenAI `text-embedding-3-small`, not called by CI.

## Free-Tier Guardrails

- CI uses mocked API tests only. It does not call Notion, Instagram, OpenAI, Supabase, Meilisearch, or Qdrant.
- PII contact data is encrypted or omitted from indexable rows before downstream search work.
- The frontend never fetches the full creator dataset; list views use service functions and paginated RPC/query calls.
- Local Docker services are configured for small development machines and are not production infrastructure.

## Local Setup

1. Install frontend dependencies:

```bash
npm install
```

2. Install backend dependencies:

```bash
python -m pip install -r backend/requirements.txt
```

3. Copy env values:

```bash
copy .env.example .env
```

4. Start local search/queue infrastructure:

```bash
docker-compose up
```

5. Run FastAPI:

```bash
uvicorn backend.app.main:app --reload --port 8000
```

6. Run frontend:

```bash
npm run dev
```

Health check: `GET http://localhost:8000/health`.

## Notion Sync

Run a manual sync after setting `NOTION_API_KEY`, `NOTION_DATABASE_ID`, `SUPABASE_URL`, and `SUPABASE_KEY`:

```bash
python -m ingestion.sync_notion
```

The sync uses Notion `/databases/query`, applies the 3 requests/sec limit, retries 429 responses with backoff, maps Notion property types, and upserts by `notion_page_id`.

## Validation

Frontend:

```bash
npm run lint
npm run typecheck
npm run build
```

Backend and ingestion:

```bash
python -m ruff check backend ingestion
python -m pytest backend/tests ingestion/tests
```

## Current Scope

Implemented from the HashFame prompt:

- Chunk 0 skeleton: backend, ingestion, infra, CI, README, env contract.
- Chunk 1 foundation: Alembic SQL migration, Notion sync module, PII handling, mocked tests.
- Existing frontend remains a complete Supabase-backed discovery app.

Not implemented yet:

- Real Meilisearch indexing hook after every Notion upsert.
- Qdrant semantic search and OpenAI embedding jobs.
- Instagram Graph API metrics ingestion.
- Production deployment configuration.
