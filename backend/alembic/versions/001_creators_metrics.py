"""creators and metrics snapshot

Revision ID: 001_creators_metrics
Revises:
Create Date: 2026-07-14
"""

from alembic import op

revision = "001_creators_metrics"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        create table if not exists creators (
          id uuid primary key default gen_random_uuid(),
          name text not null,
          bio text,
          category text,
          languages text[] not null default '{}',
          region text,
          contact_encrypted text,
          notion_page_id text unique,
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now()
        );

        create table if not exists metrics_snapshot (
          id uuid primary key default gen_random_uuid(),
          creator_id uuid not null references creators(id) on delete cascade,
          followers integer not null default 0,
          avg_likes integer not null default 0,
          avg_comments integer not null default 0,
          engagement_rate numeric(6,3) not null default 0,
          snap_date date not null default current_date,
          platform text not null,
          created_at timestamptz not null default now(),
          unique (creator_id, snap_date, platform)
        );

        create index if not exists idx_creators_notion_page_id on creators(notion_page_id);
        create index if not exists idx_creators_category on creators(category);
        create index if not exists idx_creators_region on creators(region);
        create index if not exists idx_creators_languages on creators using gin(languages);
        create index if not exists idx_metrics_creator_platform_date on metrics_snapshot(creator_id, platform, snap_date desc);
        """
    )


def downgrade() -> None:
    op.execute("drop table if exists metrics_snapshot;")
    op.execute("drop table if exists creators;")
