-- Optional backlog tables (PostgreSQL) for governance learning.
-- These tables are NOT canonical truth; they are analytics/learning stores linked to thread_events.

CREATE TABLE IF NOT EXISTS backlog_items (
  id            TEXT PRIMARY KEY,
  thread_id     TEXT NOT NULL,
  backlog_type  TEXT NOT NULL CHECK (backlog_type IN ('error','signal','decision','cost','governance_debt')),
  severity      TEXT,
  title         TEXT,
  description   TEXT NOT NULL,
  segment_id    TEXT,
  references    JSONB,
  metrics       JSONB,
  status        TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','triaged','in_progress','resolved','won_t_fix')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_backlog_thread ON backlog_items(thread_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_backlog_type ON backlog_items(backlog_type, status);

CREATE TABLE IF NOT EXISTS backlog_event_links (
  backlog_id  TEXT NOT NULL REFERENCES backlog_items(id) ON DELETE CASCADE,
  event_id    TEXT NOT NULL,
  PRIMARY KEY (backlog_id, event_id)
);
