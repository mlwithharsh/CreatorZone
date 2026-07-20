# CreatorZone — Deployment Guide

> **Stack**: Next.js 15 (frontend) · FastAPI + Celery (backend) · Supabase (database/auth) · Meilisearch (search) · Qdrant (vectors) · Redis (queue)

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Local Development (Fast Start)](#local-development-fast-start)
4. [Infrastructure Services (Docker)](#infrastructure-services-docker)
5. [Backend (FastAPI)](#backend-fastapi)
6. [Data Ingestion](#data-ingestion)
7. [Production Build & Deploy](#production-build--deploy)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | >= 20 | https://nodejs.org |
| npm | >= 10 | bundled with Node |
| Python | >= 3.11 | https://python.org |
| Docker Desktop | latest | https://docker.com |
| Git | any | https://git-scm.com |

---

## Environment Variables

### Frontend (`.env.local`)

Create `.env.local` at the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# Optional — FastAPI backend (defaults to localhost:8000)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> **Note**: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are also hard-coded in `next.config.ts` as a build-time fallback. For production, always override via env vars so you do not have to rebuild per environment.

### Backend (`backend/.env`)

Create `backend/.env`:

```env
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_SERVICE_KEY=<your-service-role-key>

# Meilisearch
MEILI_URL=http://localhost:7700
MEILI_MASTER_KEY=dev-master-key

# Qdrant
QDRANT_URL=http://localhost:6333

# Redis / Celery
REDIS_URL=redis://localhost:6379/0

# CORS — add your production frontend URL here
ALLOWED_ORIGINS=http://localhost:3000
```

---

## Local Development (Fast Start)

```bash
# 1. Clone & install
git clone https://github.com/<your-org>/CreatorZone.git
cd CreatorZone
npm install

# 2. Copy env template (fill in your Supabase credentials)
# Create .env.local manually with the values above

# 3. Start infrastructure (Meilisearch, Qdrant, Redis) in background
docker compose up -d

# 4. Start Next.js dev server with Turbopack (fast HMR)
npm run dev
```

The app will be live at **http://localhost:3000**.

---

## Infrastructure Services (Docker)

All services are defined in `infra/docker-compose.yml` and composed via the root `docker-compose.yml`.

```bash
# Start all services
docker compose up -d

# Check status
docker compose ps

# Stop all services
docker compose down

# Reset data volumes (destructive)
docker compose down -v
```

| Service | URL | Default Key |
|---------|-----|-------------|
| Meilisearch | http://localhost:7700 | `dev-master-key` |
| Qdrant | http://localhost:6333 | — |
| Redis | localhost:6379 | — |

> **Production tip**: Change `MEILI_MASTER_KEY` to a strong random secret and set `MEILI_ENV=production` in `infra/docker-compose.yml`.

---

## Backend (FastAPI)

```bash
cd backend

# Create & activate virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run API server (development)
uvicorn backend.app.main:app --reload --port 8000

# Run Celery worker (for background jobs)
celery -A backend.app.celery_app worker --loglevel=info
```

API docs available at **http://localhost:8000/docs** (Swagger UI).

### Run Tests

```bash
# From repo root
pytest backend/tests/ -v
```

### Lint & Format

```bash
ruff check backend/
ruff format backend/
```

---

## Data Ingestion

The `scripts/` directory contains one-time ingestion utilities to populate Supabase from CSV files.

> **Important**: Raw CSV files live in the **`Data/`** directory which is git-ignored (large files). Place them there before running scripts.

```bash
# Activate Python venv first (see Backend section above)

# 1. Upload creator data to Supabase
python scripts/upload_to_supabase.py

# 2. Build Meilisearch index + upload all data
python scripts/build_and_upload_all.py

# 3. Apply Supabase Row-Level Security policies
python scripts/apply_rls_policies.py
```

---

## Production Build & Deploy

### Next.js (Vercel — Recommended)

```bash
# Verify build locally first
npm run build
npm run start        # preview at http://localhost:3000
```

**Deploy to Vercel:**
1. Push to GitHub
2. Import repo at https://vercel.com/new
3. Set env vars in Vercel Dashboard > Settings > Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL` (your FastAPI URL)
4. Deploy — Vercel auto-deploys on every push to `main`

### FastAPI (Production)

```bash
# Using Gunicorn + Uvicorn workers
pip install gunicorn
gunicorn backend.app.main:app \
  -w 4 \
  -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
```

Or containerize with a `Dockerfile` in `backend/` and deploy to:
- **Railway** / **Render** / **Fly.io** for managed hosting
- **GCP Cloud Run** / **AWS ECS** for serverless containers

### Update CORS for Production

In `backend/app/main.py`, add your production frontend URL to `allow_origins`:

```python
allow_origins=[
    "http://localhost:3000",
    "https://your-app.vercel.app",   # add this
],
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `npm run dev` fails with module errors | Run `npm install` again |
| Supabase auth not working | Check `NEXT_PUBLIC_SUPABASE_URL` and anon key in `.env.local` |
| Meilisearch search returns empty | Run `docker compose up -d` and re-run `build_and_upload_all.py` |
| Backend 500 errors | Confirm `backend/.env` has correct `SUPABASE_SERVICE_KEY` |
| CORS errors from frontend | Add your frontend origin to `allow_origins` in `backend/app/main.py` |
| `__pycache__` appears in git status | Run `git rm -r --cached **/__pycache__/` once then commit |
| `tsconfig.tsbuildinfo` in git | Run `git rm --cached tsconfig.tsbuildinfo` then commit |

---

## Quick Reference

```bash
# Frontend dev
npm run dev

# Type-check
npm run typecheck

# Lint frontend
npm run lint

# Generate Supabase types
npm run supabase:types

# All infra up
docker compose up -d

# Backend dev
uvicorn backend.app.main:app --reload --port 8000

# Backend tests
pytest backend/tests/ -v
```
