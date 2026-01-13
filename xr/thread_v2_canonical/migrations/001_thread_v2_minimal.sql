-- CHE-NU Thread v2 — minimal PostgreSQL schema (adapt to your framework)

CREATE TABLE IF NOT EXISTS threads (
  id              TEXT PRIMARY KEY,
  type            TEXT NOT NULL CHECK (type IN ('personal','collective','inter_sphere')),
  title           TEXT,
  founding_intent TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','dormant','archived')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS thread_participants (
  thread_id     TEXT NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  subject_type  TEXT NOT NULL CHECK (subject_type IN ('human','agent')),
  subject_id    TEXT NOT NULL,
  role          TEXT NOT NULL,
  permissions   JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (thread_id, subject_type, subject_id)
);

CREATE TABLE IF NOT EXISTS thread_events (
  event_id        TEXT PRIMARY KEY,
  thread_id       TEXT NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  event_type      TEXT NOT NULL,
  actor_type      TEXT NOT NULL CHECK (actor_type IN ('human','agent')),
  actor_id        TEXT NOT NULL,
  payload         JSONB NOT NULL,
  links           JSONB,
  redaction_level TEXT NOT NULL DEFAULT 'private' CHECK (redaction_level IN ('public','semi_private','private')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_thread_events_thread_time ON thread_events(thread_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_thread_events_type ON thread_events(thread_id, event_type);

CREATE TABLE IF NOT EXISTS thread_snapshots (
  snapshot_id   TEXT PRIMARY KEY,
  thread_id     TEXT NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  snapshot_type TEXT NOT NULL,
  content       TEXT NOT NULL,
  references    JSONB,
  created_by    TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_thread_snapshots_latest ON thread_snapshots(thread_id, snapshot_type, created_at DESC);

-- Optional: enforce exactly one memory agent per thread (recommended)
-- CREATE UNIQUE INDEX IF NOT EXISTS uniq_one_memory_agent_per_thread
--   ON thread_participants(thread_id)
--   WHERE (subject_type='agent' AND role='memory_agent');
