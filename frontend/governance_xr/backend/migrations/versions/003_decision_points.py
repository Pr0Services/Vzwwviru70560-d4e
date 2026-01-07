"""
Database migration: Create decision_points table

Revision ID: 003_decision_points
Revises: 002_governance_tables
Create Date: 2026-01-07
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = '003_decision_points'
down_revision = '002_governance_tables'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create decision_points and related tables."""
    
    # Create enum types
    op.execute("""
        CREATE TYPE decision_point_type AS ENUM (
            'confirmation',
            'task', 
            'decision',
            'checkpoint',
            'approval',
            'review'
        );
    """)
    
    op.execute("""
        CREATE TYPE aging_level AS ENUM (
            'green',
            'yellow',
            'red',
            'blink',
            'archive'
        );
    """)
    
    op.execute("""
        CREATE TYPE user_response_type AS ENUM (
            'validate',
            'redirect',
            'comment',
            'defer',
            'reject'
        );
    """)
    
    # Create decision_points table
    op.create_table(
        'decision_points',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('point_type', sa.Enum(
            'confirmation', 'task', 'decision', 'checkpoint', 'approval', 'review',
            name='decision_point_type'
        ), nullable=False),
        sa.Column('thread_id', sa.String(36), nullable=False, index=True),
        sa.Column('title', sa.String(500), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('context', postgresql.JSONB, nullable=True),
        
        # AI Suggestion (stored as JSONB)
        sa.Column('suggestion', postgresql.JSONB, nullable=True),
        
        # Aging
        sa.Column('aging_level', sa.Enum(
            'green', 'yellow', 'red', 'blink', 'archive',
            name='aging_level'
        ), nullable=False, default='green'),
        sa.Column('last_reminded_at', sa.DateTime, nullable=True),
        sa.Column('reminder_count', sa.Integer, nullable=False, default=0),
        
        # Status
        sa.Column('is_active', sa.Boolean, nullable=False, default=True),
        sa.Column('is_archived', sa.Boolean, nullable=False, default=False),
        sa.Column('archived_at', sa.DateTime, nullable=True),
        sa.Column('archive_reason', sa.String(100), nullable=True),
        
        # User Response (stored as JSONB)
        sa.Column('user_response', postgresql.JSONB, nullable=True),
        
        # Source tracking
        sa.Column('source_event_id', sa.String(36), nullable=True),
        sa.Column('source_module', sa.String(100), nullable=True),
        sa.Column('checkpoint_id', sa.String(36), nullable=True),
        
        # Ownership & timestamps
        sa.Column('created_by', sa.String(36), nullable=False, index=True),
        sa.Column('sphere_id', sa.String(36), nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    
    # Create indexes for common queries
    op.create_index(
        'ix_decision_points_aging_active',
        'decision_points',
        ['aging_level', 'is_active'],
        postgresql_where=sa.text('is_active = true')
    )
    
    op.create_index(
        'ix_decision_points_thread_active',
        'decision_points',
        ['thread_id', 'is_active'],
        postgresql_where=sa.text('is_active = true')
    )
    
    op.create_index(
        'ix_decision_points_user_active',
        'decision_points',
        ['created_by', 'is_active'],
        postgresql_where=sa.text('is_active = true')
    )
    
    op.create_index(
        'ix_decision_points_created_at',
        'decision_points',
        ['created_at']
    )
    
    # Create decision_point_history table for audit trail
    op.create_table(
        'decision_point_history',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('decision_point_id', sa.String(36), nullable=False, index=True),
        sa.Column('action', sa.String(50), nullable=False),  # created, updated, responded, archived
        sa.Column('previous_state', postgresql.JSONB, nullable=True),
        sa.Column('new_state', postgresql.JSONB, nullable=False),
        sa.Column('changed_by', sa.String(36), nullable=False),
        sa.Column('changed_at', sa.DateTime, nullable=False, server_default=sa.func.now()),
        sa.Column('metadata', postgresql.JSONB, nullable=True),
        
        sa.ForeignKeyConstraint(
            ['decision_point_id'],
            ['decision_points.id'],
            ondelete='CASCADE'
        ),
    )
    
    # Create trigger for updated_at
    op.execute("""
        CREATE OR REPLACE FUNCTION update_decision_points_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    """)
    
    op.execute("""
        CREATE TRIGGER trigger_decision_points_updated_at
        BEFORE UPDATE ON decision_points
        FOR EACH ROW
        EXECUTE FUNCTION update_decision_points_updated_at();
    """)


def downgrade() -> None:
    """Remove decision_points tables."""
    
    # Drop trigger
    op.execute("DROP TRIGGER IF EXISTS trigger_decision_points_updated_at ON decision_points;")
    op.execute("DROP FUNCTION IF EXISTS update_decision_points_updated_at();")
    
    # Drop tables
    op.drop_table('decision_point_history')
    op.drop_table('decision_points')
    
    # Drop enum types
    op.execute("DROP TYPE IF EXISTS user_response_type;")
    op.execute("DROP TYPE IF EXISTS aging_level;")
    op.execute("DROP TYPE IF EXISTS decision_point_type;")
