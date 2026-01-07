"""
Governance Backlog Tables Migration

Revision ID: 001_governance_backlog
Revises: (depends on existing CHE·NU migrations)
Create Date: 2026-01-07

Tables:
- backlog_items: Stores governance backlog entries
- backlog_event_links: Links backlog items to source events
- governance_signals: Audit log of all CEA signals
- orchestrator_decisions: Audit log of orchestrator decisions
- policy_tuning_history: History of policy parameter changes

R&D Compliance:
- Rule #6: Full traceability with created_at, created_by, id
- Rule #7: Aligns with governance canon documentation
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import uuid

# revision identifiers
revision = '001_governance_backlog'
down_revision = None  # Set to latest existing migration
branch_labels = None
depends_on = None


def upgrade() -> None:
    # =========================================================================
    # BACKLOG ITEMS TABLE
    # =========================================================================
    op.create_table(
        'backlog_items',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('thread_id', postgresql.UUID(as_uuid=True), nullable=False, index=True),
        sa.Column('identity_id', postgresql.UUID(as_uuid=True), nullable=False, index=True),
        
        # Type: error | signal | decision | cost | governance_debt
        sa.Column('backlog_type', sa.String(50), nullable=False, index=True),
        
        # Severity: low | medium | high | critical
        sa.Column('severity', sa.String(20), nullable=False, index=True),
        
        # Content
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('context', postgresql.JSONB, nullable=True),  # Structured context
        
        # Source tracking
        sa.Column('source_spec', sa.String(100), nullable=True),  # Which spec/CEA generated this
        sa.Column('source_event_type', sa.String(100), nullable=True),
        
        # Resolution
        sa.Column('status', sa.String(50), nullable=False, default='open', index=True),
        sa.Column('resolution', sa.Text, nullable=True),
        sa.Column('resolved_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('resolved_at', sa.DateTime(timezone=True), nullable=True),
        
        # Policy tuning flag
        sa.Column('fed_to_policy_tuner', sa.Boolean, default=False),
        sa.Column('policy_tuner_processed_at', sa.DateTime(timezone=True), nullable=True),
        
        # Traceability (R&D Rule #6)
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
        
        # Constraints
        sa.CheckConstraint(
            "backlog_type IN ('error', 'signal', 'decision', 'cost', 'governance_debt')",
            name='ck_backlog_items_type'
        ),
        sa.CheckConstraint(
            "severity IN ('low', 'medium', 'high', 'critical')",
            name='ck_backlog_items_severity'
        ),
        sa.CheckConstraint(
            "status IN ('open', 'in_progress', 'resolved', 'wont_fix', 'duplicate')",
            name='ck_backlog_items_status'
        ),
    )
    
    # Indexes for common queries
    op.create_index(
        'ix_backlog_items_thread_status',
        'backlog_items',
        ['thread_id', 'status']
    )
    op.create_index(
        'ix_backlog_items_type_severity',
        'backlog_items',
        ['backlog_type', 'severity']
    )
    op.create_index(
        'ix_backlog_items_created_at',
        'backlog_items',
        ['created_at']
    )
    
    # =========================================================================
    # BACKLOG EVENT LINKS TABLE
    # =========================================================================
    op.create_table(
        'backlog_event_links',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('backlog_item_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('event_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('event_type', sa.String(100), nullable=False),
        sa.Column('link_type', sa.String(50), nullable=False, default='source'),  # source | related | resolution
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        
        sa.ForeignKeyConstraint(
            ['backlog_item_id'],
            ['backlog_items.id'],
            name='fk_backlog_event_links_backlog_item',
            ondelete='CASCADE'
        ),
        sa.CheckConstraint(
            "link_type IN ('source', 'related', 'resolution')",
            name='ck_backlog_event_links_type'
        ),
    )
    
    op.create_index(
        'ix_backlog_event_links_backlog_item',
        'backlog_event_links',
        ['backlog_item_id']
    )
    op.create_index(
        'ix_backlog_event_links_event',
        'backlog_event_links',
        ['event_id']
    )
    
    # =========================================================================
    # GOVERNANCE SIGNALS TABLE (Audit Log)
    # =========================================================================
    op.create_table(
        'governance_signals',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('thread_id', postgresql.UUID(as_uuid=True), nullable=False, index=True),
        sa.Column('identity_id', postgresql.UUID(as_uuid=True), nullable=False, index=True),
        
        # Signal details
        sa.Column('cea_name', sa.String(100), nullable=False, index=True),
        sa.Column('criterion', sa.String(100), nullable=False),
        sa.Column('level', sa.String(20), nullable=False),  # WARN | CORRECT | PAUSE | BLOCK | ESCALATE
        sa.Column('message', sa.Text, nullable=False),
        sa.Column('details', postgresql.JSONB, nullable=True),
        
        # Patch instruction (if level = CORRECT)
        sa.Column('patch_target', sa.String(100), nullable=True),
        sa.Column('patch_instruction', postgresql.JSONB, nullable=True),
        
        # Processing
        sa.Column('processed', sa.Boolean, default=False),
        sa.Column('processed_by_decision_id', postgresql.UUID(as_uuid=True), nullable=True),
        
        # Traceability
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        
        sa.CheckConstraint(
            "level IN ('WARN', 'CORRECT', 'PAUSE', 'BLOCK', 'ESCALATE')",
            name='ck_governance_signals_level'
        ),
    )
    
    op.create_index(
        'ix_governance_signals_thread_created',
        'governance_signals',
        ['thread_id', 'created_at']
    )
    op.create_index(
        'ix_governance_signals_level',
        'governance_signals',
        ['level']
    )
    
    # =========================================================================
    # ORCHESTRATOR DECISIONS TABLE (Audit Log)
    # =========================================================================
    op.create_table(
        'orchestrator_decisions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('thread_id', postgresql.UUID(as_uuid=True), nullable=False, index=True),
        sa.Column('identity_id', postgresql.UUID(as_uuid=True), nullable=False, index=True),
        
        # Decision details
        sa.Column('decision', sa.String(50), nullable=False),  # PROCEED | BLOCK | CORRECT | ESCALATE | ASK_HUMAN
        sa.Column('reason', sa.Text, nullable=False),
        
        # QCT results
        sa.Column('qct_required_quality', sa.Float, nullable=True),
        sa.Column('qct_expected_error_rate', sa.Float, nullable=True),
        sa.Column('qct_selected_config', sa.String(10), nullable=True),
        sa.Column('qct_estimated_cost', sa.Integer, nullable=True),
        
        # SES results
        sa.Column('ses_segment_scores', postgresql.JSONB, nullable=True),
        sa.Column('ses_escalation_triggered', sa.Boolean, default=False),
        
        # RDC results
        sa.Column('rdc_intervention', sa.String(20), nullable=True),
        sa.Column('rdc_signal_count', sa.Integer, nullable=True),
        
        # Signals that informed this decision
        sa.Column('input_signal_ids', postgresql.ARRAY(postgresql.UUID(as_uuid=True)), nullable=True),
        
        # Execution outcome
        sa.Column('executed', sa.Boolean, default=False),
        sa.Column('execution_result', postgresql.JSONB, nullable=True),
        
        # Checkpoint (if ASK_HUMAN or BLOCK)
        sa.Column('checkpoint_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('checkpoint_resolved', sa.Boolean, nullable=True),
        sa.Column('checkpoint_resolution', sa.String(50), nullable=True),
        
        # Traceability
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        
        sa.CheckConstraint(
            "decision IN ('PROCEED', 'BLOCK', 'CORRECT', 'ESCALATE', 'ASK_HUMAN')",
            name='ck_orchestrator_decisions_decision'
        ),
    )
    
    op.create_index(
        'ix_orchestrator_decisions_thread_created',
        'orchestrator_decisions',
        ['thread_id', 'created_at']
    )
    op.create_index(
        'ix_orchestrator_decisions_decision',
        'orchestrator_decisions',
        ['decision']
    )
    
    # =========================================================================
    # POLICY TUNING HISTORY TABLE
    # =========================================================================
    op.create_table(
        'policy_tuning_history',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        
        # Parameter being tuned
        sa.Column('parameter_name', sa.String(100), nullable=False, index=True),
        sa.Column('parameter_scope', sa.String(100), nullable=True),  # global, thread_type, sphere, etc.
        
        # Values
        sa.Column('old_value', sa.Float, nullable=False),
        sa.Column('new_value', sa.Float, nullable=False),
        sa.Column('change_magnitude', sa.Float, nullable=False),  # |new - old| / old
        
        # Reason
        sa.Column('reason', sa.Text, nullable=False),
        sa.Column('metrics_snapshot', postgresql.JSONB, nullable=True),  # escape_rate, fix_cost_median, etc.
        
        # Approval (if change > threshold)
        sa.Column('requires_approval', sa.Boolean, default=False),
        sa.Column('approved', sa.Boolean, nullable=True),
        sa.Column('approved_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('approved_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('applied', sa.Boolean, default=False),
        sa.Column('applied_at', sa.DateTime(timezone=True), nullable=True),
        
        # Traceability
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('created_by', sa.String(100), nullable=False, default='policy_tuner'),
    )
    
    op.create_index(
        'ix_policy_tuning_history_parameter',
        'policy_tuning_history',
        ['parameter_name', 'created_at']
    )
    op.create_index(
        'ix_policy_tuning_history_pending_approval',
        'policy_tuning_history',
        ['requires_approval', 'approved'],
        postgresql_where=sa.text("requires_approval = true AND approved IS NULL")
    )
    
    # =========================================================================
    # MATURITY CACHE TABLE
    # =========================================================================
    op.create_table(
        'thread_maturity_cache',
        sa.Column('thread_id', postgresql.UUID(as_uuid=True), primary_key=True),
        
        # Maturity data
        sa.Column('score', sa.Integer, nullable=False),
        sa.Column('level', sa.Integer, nullable=False),  # 0-5
        sa.Column('level_name', sa.String(50), nullable=False),
        
        # Signal breakdown
        sa.Column('signals', postgresql.JSONB, nullable=False),
        
        # Cache metadata
        sa.Column('computed_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('stale_after', sa.DateTime(timezone=True), nullable=False),
        sa.Column('event_count_at_compute', sa.Integer, nullable=False),
        
        sa.CheckConstraint('level >= 0 AND level <= 5', name='ck_maturity_cache_level'),
        sa.CheckConstraint('score >= 0 AND score <= 100', name='ck_maturity_cache_score'),
    )


def downgrade() -> None:
    op.drop_table('thread_maturity_cache')
    op.drop_table('policy_tuning_history')
    op.drop_table('orchestrator_decisions')
    op.drop_table('governance_signals')
    op.drop_table('backlog_event_links')
    op.drop_table('backlog_items')
