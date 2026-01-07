-- ═══════════════════════════════════════════════════════════════════════════════
-- CHE·NU — AGENT INBOX SYSTEM
-- SQL Schema - PostgreSQL
-- ═══════════════════════════════════════════════════════════════════════════════

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE sender_type AS ENUM ('USER', 'AGENT', 'SYSTEM');
CREATE TYPE message_type AS ENUM ('TASK', 'NOTE', 'COMMENT', 'QUESTION', 'DECISION', 'VOICE_TRANSCRIPT');
CREATE TYPE priority_level AS ENUM ('LOW', 'NORMAL', 'HIGH', 'CRITICAL');
CREATE TYPE message_status AS ENUM ('NEW', 'READ', 'ACKNOWLEDGED', 'ARCHIVED');
CREATE TYPE task_type AS ENUM ('EXECUTE', 'ANALYZE', 'REVIEW', 'DECIDE', 'RESEARCH');
CREATE TYPE task_status AS ENUM ('PENDING', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED', 'CANCELLED');
CREATE TYPE task_update_type AS ENUM ('STATUS_CHANGE', 'COMMENT', 'RESULT', 'BLOCKER');
CREATE TYPE voice_status AS ENUM ('PENDING', 'TRANSCRIBED', 'CONFIRMED', 'CANCELLED', 'EXPIRED');

-- =============================================================================
-- AGENT INBOX
-- =============================================================================

CREATE TABLE agent_inboxes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sphere_id UUID NOT NULL REFERENCES spheres(id),
    agent_id UUID NOT NULL REFERENCES agent_instances(id),
    
    -- Cached counts for UI performance
    unread_count INTEGER DEFAULT 0 CHECK (unread_count >= 0),
    pending_task_count INTEGER DEFAULT 0 CHECK (pending_task_count >= 0),
    
    -- State
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    is_muted BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(sphere_id, agent_id)
);

CREATE INDEX idx_agent_inboxes_agent_id ON agent_inboxes(agent_id);
CREATE INDEX idx_agent_inboxes_last_activity ON agent_inboxes(last_activity_at DESC);

-- =============================================================================
-- INBOX MESSAGE
-- =============================================================================

CREATE TABLE inbox_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inbox_id UUID NOT NULL REFERENCES agent_inboxes(id),
    
    -- Sender identification
    sender_type sender_type NOT NULL,
    sender_id UUID NOT NULL,
    
    -- Classification
    message_type message_type NOT NULL,
    priority priority_level DEFAULT 'NORMAL',
    
    -- Content
    content_text TEXT NOT NULL,
    content_summary TEXT,
    
    -- Voice-specific fields
    voice_file_ref VARCHAR(500),
    transcription_confidence FLOAT CHECK (transcription_confidence >= 0 AND transcription_confidence <= 1),
    requires_confirmation BOOLEAN DEFAULT FALSE,
    confirmed_at TIMESTAMPTZ,
    confirmed_by UUID,
    
    -- Relations to other entities
    related_task_id UUID,
    related_decision_id UUID,
    
    -- Threading
    parent_message_id UUID REFERENCES inbox_messages(id),
    thread_id UUID,
    
    -- Status tracking
    status message_status DEFAULT 'NEW',
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by UUID,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    archived_at TIMESTAMPTZ
);

CREATE INDEX idx_inbox_messages_inbox_status ON inbox_messages(inbox_id, status);
CREATE INDEX idx_inbox_messages_inbox_created ON inbox_messages(inbox_id, created_at DESC);
CREATE INDEX idx_inbox_messages_type ON inbox_messages(message_type);
CREATE INDEX idx_inbox_messages_priority ON inbox_messages(priority);
CREATE INDEX idx_inbox_messages_thread ON inbox_messages(thread_id);
CREATE INDEX idx_inbox_messages_related_task ON inbox_messages(related_task_id);
CREATE INDEX idx_inbox_messages_requires_confirmation ON inbox_messages(requires_confirmation) WHERE requires_confirmation = TRUE;

-- =============================================================================
-- TASK
-- =============================================================================

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sphere_id UUID NOT NULL REFERENCES spheres(id),
    
    -- Assignment
    assigned_agent_id UUID NOT NULL REFERENCES agent_instances(id),
    created_by_type sender_type NOT NULL,
    created_by_id UUID NOT NULL,
    
    -- Content
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Classification
    task_type task_type NOT NULL,
    priority priority_level DEFAULT 'NORMAL',
    
    -- Status
    status task_status DEFAULT 'PENDING',
    blocked_reason TEXT,
    
    -- Result
    result TEXT,
    result_artifacts JSONB,
    
    -- Timing
    due_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    archived_at TIMESTAMPTZ,
    
    -- Source message (if created from TASK message)
    source_message_id UUID REFERENCES inbox_messages(id)
);

CREATE INDEX idx_tasks_sphere ON tasks(sphere_id);
CREATE INDEX idx_tasks_assigned_agent ON tasks(assigned_agent_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_at ON tasks(due_at) WHERE due_at IS NOT NULL;
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_tasks_active ON tasks(status) WHERE status IN ('PENDING', 'IN_PROGRESS', 'BLOCKED');

-- Add FK from inbox_messages to tasks
ALTER TABLE inbox_messages 
ADD CONSTRAINT fk_related_task 
FOREIGN KEY (related_task_id) REFERENCES tasks(id);

-- =============================================================================
-- TASK UPDATE
-- =============================================================================

CREATE TABLE task_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id),
    
    -- Actor
    actor_type sender_type NOT NULL,
    actor_id UUID NOT NULL,
    
    -- Change details
    update_type task_update_type NOT NULL,
    content TEXT NOT NULL,
    
    -- For status changes
    previous_status task_status,
    new_status task_status,
    
    -- Metadata
    metadata JSONB,
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_task_updates_task ON task_updates(task_id);
CREATE INDEX idx_task_updates_created ON task_updates(created_at DESC);
CREATE INDEX idx_task_updates_type ON task_updates(update_type);

-- =============================================================================
-- VOICE RECORDING
-- =============================================================================

CREATE TABLE voice_recordings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Recording details
    user_id UUID NOT NULL,
    target_agent_id UUID NOT NULL REFERENCES agent_instances(id),
    
    -- Audio
    audio_file_ref VARCHAR(500) NOT NULL,
    duration_seconds FLOAT NOT NULL CHECK (duration_seconds > 0),
    
    -- Transcription
    raw_transcript TEXT,
    cleaned_transcript TEXT,
    summary TEXT,
    transcription_confidence FLOAT CHECK (transcription_confidence >= 0 AND transcription_confidence <= 1),
    
    -- AI Analysis
    detected_message_type message_type,
    detected_priority priority_level,
    extracted_entities JSONB,
    
    -- Status
    status voice_status DEFAULT 'PENDING',
    
    -- Confirmation
    confirmed_at TIMESTAMPTZ,
    result_message_id UUID REFERENCES inbox_messages(id),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL -- 90 days from creation
);

CREATE INDEX idx_voice_recordings_user ON voice_recordings(user_id);
CREATE INDEX idx_voice_recordings_target_agent ON voice_recordings(target_agent_id);
CREATE INDEX idx_voice_recordings_status ON voice_recordings(status);
CREATE INDEX idx_voice_recordings_expires ON voice_recordings(expires_at) WHERE status NOT IN ('CONFIRMED', 'CANCELLED');

-- =============================================================================
-- AUDIT LOG
-- =============================================================================

CREATE TABLE inbox_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- What happened
    action VARCHAR(50) NOT NULL,
    
    -- Who did it
    actor_type sender_type NOT NULL,
    actor_id UUID NOT NULL,
    
    -- What was affected
    entity_type VARCHAR(50) NOT NULL, -- INBOX | MESSAGE | TASK | VOICE
    entity_id UUID NOT NULL,
    
    -- Details
    details JSONB,
    
    -- Context
    sphere_id UUID,
    agent_id UUID,
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inbox_audit_entity ON inbox_audit_logs(entity_type, entity_id);
CREATE INDEX idx_inbox_audit_actor ON inbox_audit_logs(actor_type, actor_id);
CREATE INDEX idx_inbox_audit_action ON inbox_audit_logs(action);
CREATE INDEX idx_inbox_audit_created ON inbox_audit_logs(created_at DESC);
CREATE INDEX idx_inbox_audit_sphere ON inbox_audit_logs(sphere_id) WHERE sphere_id IS NOT NULL;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Update last_activity_at on inbox when message is created
CREATE OR REPLACE FUNCTION update_inbox_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE agent_inboxes 
    SET last_activity_at = NOW(), updated_at = NOW()
    WHERE id = NEW.inbox_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_inbox_activity
AFTER INSERT ON inbox_messages
FOR EACH ROW EXECUTE FUNCTION update_inbox_activity();

-- Update unread_count on inbox when message is created
CREATE OR REPLACE FUNCTION increment_unread_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'NEW' THEN
        UPDATE agent_inboxes 
        SET unread_count = unread_count + 1
        WHERE id = NEW.inbox_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_unread
AFTER INSERT ON inbox_messages
FOR EACH ROW EXECUTE FUNCTION increment_unread_count();

-- Update unread_count when message status changes
CREATE OR REPLACE FUNCTION update_unread_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status = 'NEW' AND NEW.status != 'NEW' THEN
        UPDATE agent_inboxes 
        SET unread_count = GREATEST(0, unread_count - 1)
        WHERE id = NEW.inbox_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_unread_status
AFTER UPDATE OF status ON inbox_messages
FOR EACH ROW EXECUTE FUNCTION update_unread_on_status_change();

-- Update pending_task_count on inbox
CREATE OR REPLACE FUNCTION update_pending_task_count()
RETURNS TRIGGER AS $$
DECLARE
    inbox_id_val UUID;
BEGIN
    -- Get the inbox_id for this agent
    SELECT id INTO inbox_id_val 
    FROM agent_inboxes 
    WHERE agent_id = COALESCE(NEW.assigned_agent_id, OLD.assigned_agent_id)
    LIMIT 1;
    
    IF inbox_id_val IS NOT NULL THEN
        UPDATE agent_inboxes 
        SET pending_task_count = (
            SELECT COUNT(*) FROM tasks 
            WHERE assigned_agent_id = COALESCE(NEW.assigned_agent_id, OLD.assigned_agent_id)
            AND status IN ('PENDING', 'IN_PROGRESS', 'BLOCKED')
        )
        WHERE id = inbox_id_val;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pending_tasks
AFTER INSERT OR UPDATE OF status OR DELETE ON tasks
FOR EACH ROW EXECUTE FUNCTION update_pending_task_count();

-- Update task updated_at timestamp
CREATE OR REPLACE FUNCTION update_task_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_task_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION update_task_timestamp();

-- Auto-create audit log for important actions
CREATE OR REPLACE FUNCTION audit_message_created()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO inbox_audit_logs (action, actor_type, actor_id, entity_type, entity_id, sphere_id, agent_id, details)
    SELECT 
        'MESSAGE_CREATED',
        NEW.sender_type,
        NEW.sender_id,
        'MESSAGE',
        NEW.id,
        ai.sphere_id,
        ai.agent_id,
        jsonb_build_object(
            'message_type', NEW.message_type,
            'priority', NEW.priority,
            'requires_confirmation', NEW.requires_confirmation
        )
    FROM agent_inboxes ai WHERE ai.id = NEW.inbox_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_message
AFTER INSERT ON inbox_messages
FOR EACH ROW EXECUTE FUNCTION audit_message_created();

-- =============================================================================
-- VIEWS
-- =============================================================================

-- Inbox summary view for UI
CREATE OR REPLACE VIEW inbox_summaries AS
SELECT 
    ai.id,
    ai.agent_id,
    ag.name as agent_name,
    ai.sphere_id,
    ai.unread_count,
    ai.pending_task_count,
    ai.last_activity_at,
    ai.is_muted,
    (SELECT COUNT(*) FROM inbox_messages im 
     WHERE im.inbox_id = ai.id 
     AND im.priority IN ('HIGH', 'CRITICAL') 
     AND im.status = 'NEW') as high_priority_count,
    (SELECT COUNT(*) FROM inbox_messages im 
     WHERE im.inbox_id = ai.id 
     AND im.requires_confirmation = TRUE 
     AND im.confirmed_at IS NULL) as needs_confirmation_count
FROM agent_inboxes ai
JOIN agent_instances ag ON ai.agent_id = ag.id;

-- Active tasks view
CREATE OR REPLACE VIEW active_tasks AS
SELECT 
    t.*,
    ag.name as agent_name,
    CASE 
        WHEN t.due_at < NOW() AND t.status NOT IN ('COMPLETED', 'CANCELLED') 
        THEN TRUE 
        ELSE FALSE 
    END as is_overdue
FROM tasks t
JOIN agent_instances ag ON t.assigned_agent_id = ag.id
WHERE t.status IN ('PENDING', 'IN_PROGRESS', 'BLOCKED')
AND t.archived_at IS NULL;

-- =============================================================================
-- CLEANUP JOB (for expired voice recordings)
-- =============================================================================

-- This should be run periodically (e.g., daily cron job)
CREATE OR REPLACE FUNCTION cleanup_expired_voice_recordings()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    WITH deleted AS (
        DELETE FROM voice_recordings
        WHERE expires_at < NOW()
        AND status NOT IN ('CONFIRMED', 'CANCELLED')
        RETURNING id
    )
    SELECT COUNT(*) INTO deleted_count FROM deleted;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
