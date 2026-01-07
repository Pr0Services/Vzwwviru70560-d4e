"""
TESTS: test_decision_point_service.py
MODULE: decision_point_service.py
COVERAGE TARGET: ≥80%

Tests for Decision Point system including:
- Creation with AI suggestions
- User responses (validate, redirect, comment, defer, archive)
- Aging level computation
- Auto-archive logic
"""

import pytest
from datetime import datetime, timedelta
from uuid import uuid4

from backend.schemas.governance_schemas import (
    DecisionPoint,
    DecisionPointCreate,
    DecisionPointType,
    AgingLevel,
    AISuggestion,
    UserResponse,
    UserResponseType,
    compute_aging_level,
)
from backend.services.governance.decision_point_service import (
    DecisionPointService,
    DecisionPointRepository,
    SuggestionGenerator,
    AgingManager,
)


# ═══════════════════════════════════════════════════════════════════════════════
# FIXTURES
# ═══════════════════════════════════════════════════════════════════════════════

@pytest.fixture
def service():
    """Create a fresh service for each test."""
    return DecisionPointService()


@pytest.fixture
def repository():
    """Create a fresh repository for each test."""
    return DecisionPointRepository()


@pytest.fixture
def user_id():
    """Generate a test user ID."""
    return str(uuid4())


@pytest.fixture
def thread_id():
    """Generate a test thread ID."""
    return str(uuid4())


@pytest.fixture
def sample_create_data(thread_id):
    """Sample decision point create data."""
    return DecisionPointCreate(
        point_type=DecisionPointType.CONFIRMATION,
        thread_id=thread_id,
        title="Sauvegarder le fichier?",
        description="Un nouveau fichier a été reçu",
        context={"file_name": "document.pdf", "size": 1024},
    )


# ═══════════════════════════════════════════════════════════════════════════════
# AGING LEVEL COMPUTATION TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestAgingLevelComputation:
    """Tests for compute_aging_level function."""
    
    def test_green_level_fresh(self):
        """Test GREEN level for items < 24 hours."""
        now = datetime.utcnow()
        assert compute_aging_level(now) == AgingLevel.GREEN
        assert compute_aging_level(now - timedelta(hours=12)) == AgingLevel.GREEN
        assert compute_aging_level(now - timedelta(hours=23)) == AgingLevel.GREEN
    
    def test_yellow_level_1_to_3_days(self):
        """Test YELLOW level for items 24h-3 days."""
        now = datetime.utcnow()
        assert compute_aging_level(now - timedelta(hours=25)) == AgingLevel.YELLOW
        assert compute_aging_level(now - timedelta(days=2)) == AgingLevel.YELLOW
        assert compute_aging_level(now - timedelta(days=2, hours=23)) == AgingLevel.YELLOW
    
    def test_red_level_3_to_7_days(self):
        """Test RED level for items 3-7 days."""
        now = datetime.utcnow()
        assert compute_aging_level(now - timedelta(days=3, hours=1)) == AgingLevel.RED
        assert compute_aging_level(now - timedelta(days=5)) == AgingLevel.RED
        assert compute_aging_level(now - timedelta(days=6, hours=23)) == AgingLevel.RED
    
    def test_blink_level_7_to_10_days(self):
        """Test BLINK level for items 7-10 days."""
        now = datetime.utcnow()
        assert compute_aging_level(now - timedelta(days=7, hours=1)) == AgingLevel.BLINK
        assert compute_aging_level(now - timedelta(days=8)) == AgingLevel.BLINK
        assert compute_aging_level(now - timedelta(days=9, hours=23)) == AgingLevel.BLINK
    
    def test_archive_level_over_10_days(self):
        """Test ARCHIVE level for items > 10 days."""
        now = datetime.utcnow()
        assert compute_aging_level(now - timedelta(days=10, hours=1)) == AgingLevel.ARCHIVE
        assert compute_aging_level(now - timedelta(days=30)) == AgingLevel.ARCHIVE
        assert compute_aging_level(now - timedelta(days=365)) == AgingLevel.ARCHIVE


# ═══════════════════════════════════════════════════════════════════════════════
# SUGGESTION GENERATOR TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestSuggestionGenerator:
    """Tests for AI suggestion generation."""
    
    @pytest.fixture
    def generator(self):
        return SuggestionGenerator()
    
    @pytest.mark.asyncio
    async def test_generates_suggestion_for_confirmation(self, generator):
        """Test suggestion generation for confirmation type."""
        suggestion = await generator.generate_suggestion(
            point_type=DecisionPointType.CONFIRMATION,
            title="Confirmer l'envoi",
            description="Email prêt à être envoyé",
        )
        
        assert suggestion is not None
        assert isinstance(suggestion, AISuggestion)
        assert suggestion.summary
        assert suggestion.suggested_action
        assert len(suggestion.alternatives) > 0
        assert 0 <= suggestion.confidence <= 1
    
    @pytest.mark.asyncio
    async def test_generates_suggestion_for_decision(self, generator):
        """Test suggestion generation for decision type."""
        suggestion = await generator.generate_suggestion(
            point_type=DecisionPointType.DECISION,
            title="Choisir la stratégie",
            context={"options": ["A", "B", "C"]},
        )
        
        assert suggestion is not None
        assert "décid" in suggestion.summary.lower() or "choisir" in suggestion.summary.lower() or suggestion.summary
    
    @pytest.mark.asyncio
    async def test_generates_suggestion_for_checkpoint(self, generator):
        """Test suggestion generation for checkpoint type."""
        suggestion = await generator.generate_suggestion(
            point_type=DecisionPointType.CHECKPOINT,
            title="Approbation requise",
        )
        
        assert suggestion is not None
        assert suggestion.confidence >= 0.7  # Checkpoints have higher confidence


# ═══════════════════════════════════════════════════════════════════════════════
# REPOSITORY TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestDecisionPointRepository:
    """Tests for repository operations."""
    
    @pytest.mark.asyncio
    async def test_create_point(self, repository, user_id, thread_id):
        """Test creating a decision point."""
        point = DecisionPoint(
            point_type=DecisionPointType.TASK,
            thread_id=thread_id,
            title="Test task",
            created_by=user_id,
        )
        
        created = await repository.create(point)
        
        assert created.id == point.id
        assert created.thread_id == thread_id
        assert repository.points[point.id] == created
    
    @pytest.mark.asyncio
    async def test_get_point(self, repository, user_id, thread_id):
        """Test retrieving a decision point."""
        point = DecisionPoint(
            point_type=DecisionPointType.TASK,
            thread_id=thread_id,
            title="Test task",
            created_by=user_id,
        )
        await repository.create(point)
        
        retrieved = await repository.get(point.id)
        
        assert retrieved is not None
        assert retrieved.id == point.id
    
    @pytest.mark.asyncio
    async def test_get_nonexistent_point(self, repository):
        """Test retrieving a nonexistent point returns None."""
        retrieved = await repository.get("nonexistent-id")
        assert retrieved is None
    
    @pytest.mark.asyncio
    async def test_list_active_points(self, repository, user_id, thread_id):
        """Test listing active points."""
        # Create some points
        for i in range(5):
            point = DecisionPoint(
                point_type=DecisionPointType.TASK,
                thread_id=thread_id,
                title=f"Task {i}",
                created_by=user_id,
            )
            await repository.create(point)
        
        # Archive one
        points = list(repository.points.values())
        points[0].is_archived = True
        
        active = await repository.list_active()
        
        assert len(active) == 4
    
    @pytest.mark.asyncio
    async def test_count_by_aging(self, repository, user_id, thread_id):
        """Test counting by aging level."""
        # Create points with different aging levels
        for level in [AgingLevel.GREEN, AgingLevel.YELLOW, AgingLevel.RED]:
            point = DecisionPoint(
                point_type=DecisionPointType.TASK,
                thread_id=thread_id,
                title=f"Task {level}",
                created_by=user_id,
                aging_level=level,
            )
            await repository.create(point)
        
        counts = await repository.count_by_aging()
        
        assert counts[AgingLevel.GREEN] == 1
        assert counts[AgingLevel.YELLOW] == 1
        assert counts[AgingLevel.RED] == 1


# ═══════════════════════════════════════════════════════════════════════════════
# SERVICE TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestDecisionPointService:
    """Tests for the main service."""
    
    @pytest.mark.asyncio
    async def test_create_decision_point(self, service, user_id, sample_create_data):
        """Test creating a decision point."""
        point = await service.create_decision_point(
            create_data=sample_create_data,
            created_by=user_id,
        )
        
        assert point is not None
        assert point.id
        assert point.point_type == DecisionPointType.CONFIRMATION
        assert point.thread_id == sample_create_data.thread_id
        assert point.title == sample_create_data.title
        assert point.created_by == user_id
        assert point.aging_level == AgingLevel.GREEN
        assert point.is_active is True
    
    @pytest.mark.asyncio
    async def test_create_with_suggestion(self, service, user_id, sample_create_data):
        """Test creating with AI suggestion."""
        point = await service.create_decision_point(
            create_data=sample_create_data,
            created_by=user_id,
            generate_suggestion=True,
        )
        
        assert point.suggestion is not None
        assert point.suggestion.summary
        assert point.suggestion.alternatives
    
    @pytest.mark.asyncio
    async def test_validate_suggestion(self, service, user_id, sample_create_data):
        """Test validating AI suggestion."""
        point = await service.create_decision_point(
            create_data=sample_create_data,
            created_by=user_id,
        )
        
        validated = await service.validate_suggestion(
            point_id=point.id,
            user_id=user_id,
        )
        
        assert validated is not None
        assert validated.user_response is not None
        assert validated.user_response.response_type == UserResponseType.VALIDATE
        assert validated.user_response.responded_by == user_id
        assert validated.is_active is False
    
    @pytest.mark.asyncio
    async def test_redirect_decision(self, service, user_id, sample_create_data):
        """Test redirecting to alternative."""
        point = await service.create_decision_point(
            create_data=sample_create_data,
            created_by=user_id,
        )
        
        redirected = await service.redirect_decision(
            point_id=point.id,
            alternative="save_elsewhere",
            user_id=user_id,
            comment="Changed my mind",
        )
        
        assert redirected is not None
        assert redirected.user_response.response_type == UserResponseType.REDIRECT
        assert redirected.user_response.selected_alternative == "save_elsewhere"
        assert redirected.user_response.comment == "Changed my mind"
        assert redirected.is_active is False
    
    @pytest.mark.asyncio
    async def test_add_comment(self, service, user_id, sample_create_data):
        """Test adding comment (doesn't close point)."""
        point = await service.create_decision_point(
            create_data=sample_create_data,
            created_by=user_id,
        )
        
        commented = await service.add_comment(
            point_id=point.id,
            comment="Need more info",
            user_id=user_id,
        )
        
        assert commented is not None
        assert commented.user_response.response_type == UserResponseType.COMMENT
        assert commented.user_response.comment == "Need more info"
        # Comment doesn't close the point
        assert commented.is_active is True
    
    @pytest.mark.asyncio
    async def test_defer_point(self, service, user_id, sample_create_data):
        """Test deferring resets aging to GREEN."""
        point = await service.create_decision_point(
            create_data=sample_create_data,
            created_by=user_id,
        )
        # Manually set to YELLOW to test reset
        point.aging_level = AgingLevel.YELLOW
        await service.repository.update(point)
        
        deferred = await service.defer_point(
            point_id=point.id,
            user_id=user_id,
        )
        
        assert deferred is not None
        assert deferred.aging_level == AgingLevel.GREEN
        assert deferred.reminder_count == 0
    
    @pytest.mark.asyncio
    async def test_archive_point(self, service, user_id, sample_create_data):
        """Test archiving a point."""
        point = await service.create_decision_point(
            create_data=sample_create_data,
            created_by=user_id,
        )
        
        archived = await service.archive_point(
            point_id=point.id,
            user_id=user_id,
            reason="no_longer_needed",
        )
        
        assert archived is not None
        assert archived.is_archived is True
        assert archived.is_active is False
        assert archived.archive_reason == "no_longer_needed"
        assert archived.archived_at is not None
    
    @pytest.mark.asyncio
    async def test_get_urgent_points(self, service, user_id, thread_id):
        """Test getting urgent points only."""
        # Create points with different aging levels
        for level in [AgingLevel.GREEN, AgingLevel.YELLOW, AgingLevel.RED, AgingLevel.BLINK]:
            create_data = DecisionPointCreate(
                point_type=DecisionPointType.TASK,
                thread_id=thread_id,
                title=f"Task {level.value}",
                urgency_override=level,
            )
            await service.create_decision_point(
                create_data=create_data,
                created_by=user_id,
            )
        
        urgent = await service.get_urgent_points()
        
        assert len(urgent) == 2
        assert all(p.aging_level in [AgingLevel.RED, AgingLevel.BLINK] for p in urgent)
    
    @pytest.mark.asyncio
    async def test_get_aging_summary(self, service, user_id, thread_id):
        """Test getting aging summary."""
        # Create points with different aging levels
        for level in [AgingLevel.GREEN, AgingLevel.GREEN, AgingLevel.YELLOW, AgingLevel.RED]:
            create_data = DecisionPointCreate(
                point_type=DecisionPointType.TASK,
                thread_id=thread_id,
                title=f"Task {level.value}",
                urgency_override=level,
            )
            await service.create_decision_point(
                create_data=create_data,
                created_by=user_id,
            )
        
        summary = await service.get_aging_summary()
        
        assert summary["total_active"] == 4
        assert summary["urgent_count"] == 1
        assert summary["has_urgent"] is True
        assert summary["has_critical"] is False
        assert summary["counts"]["green"] == 2
        assert summary["counts"]["yellow"] == 1
        assert summary["counts"]["red"] == 1


# ═══════════════════════════════════════════════════════════════════════════════
# AGING MANAGER TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestAgingManager:
    """Tests for aging manager."""
    
    @pytest.mark.asyncio
    async def test_update_aging_levels(self, repository, user_id, thread_id):
        """Test aging level updates."""
        manager = AgingManager(repository)
        
        # Create an old point (should be YELLOW)
        old_point = DecisionPoint(
            point_type=DecisionPointType.TASK,
            thread_id=thread_id,
            title="Old task",
            created_by=user_id,
            created_at=datetime.utcnow() - timedelta(hours=30),
            aging_level=AgingLevel.GREEN,  # Will need update
        )
        await repository.create(old_point)
        
        changes = await manager.update_aging_levels()
        
        assert old_point.id in changes
        assert changes[old_point.id] == AgingLevel.YELLOW
        assert old_point.aging_level == AgingLevel.YELLOW
    
    @pytest.mark.asyncio
    async def test_auto_archive_old_items(self, repository, user_id, thread_id):
        """Test auto-archiving items > 10 days."""
        manager = AgingManager(repository)
        
        # Create a very old point
        old_point = DecisionPoint(
            point_type=DecisionPointType.TASK,
            thread_id=thread_id,
            title="Very old task",
            created_by=user_id,
            created_at=datetime.utcnow() - timedelta(days=11),
            aging_level=AgingLevel.BLINK,
        )
        await repository.create(old_point)
        
        changes = await manager.update_aging_levels()
        
        assert old_point.id in changes
        assert old_point.aging_level == AgingLevel.ARCHIVE
        assert old_point.is_archived is True
        assert old_point.archive_reason == "timeout"


# ═══════════════════════════════════════════════════════════════════════════════
# INTEGRATION TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestIntegration:
    """Integration tests for full workflows."""
    
    @pytest.mark.asyncio
    async def test_full_validation_workflow(self, service, user_id, thread_id):
        """Test complete workflow: create → view → validate."""
        # Create
        create_data = DecisionPointCreate(
            point_type=DecisionPointType.APPROVAL,
            thread_id=thread_id,
            title="Approve document",
        )
        point = await service.create_decision_point(
            create_data=create_data,
            created_by=user_id,
        )
        
        # View (get active)
        active = await service.get_active_points(thread_id=thread_id)
        assert len(active) == 1
        assert active[0].id == point.id
        
        # Validate
        validated = await service.validate_suggestion(
            point_id=point.id,
            user_id=user_id,
        )
        
        # Verify no longer active
        active_after = await service.get_active_points(thread_id=thread_id)
        assert len(active_after) == 0
    
    @pytest.mark.asyncio
    async def test_full_redirect_workflow(self, service, user_id, thread_id):
        """Test complete workflow: create → view alternatives → redirect."""
        # Create
        create_data = DecisionPointCreate(
            point_type=DecisionPointType.DECISION,
            thread_id=thread_id,
            title="Choose path",
        )
        point = await service.create_decision_point(
            create_data=create_data,
            created_by=user_id,
        )
        
        # Get suggestion alternatives
        assert point.suggestion is not None
        alternatives = point.suggestion.alternatives
        assert len(alternatives) > 0
        
        # Redirect
        redirected = await service.redirect_decision(
            point_id=point.id,
            alternative=alternatives[0],
            user_id=user_id,
        )
        
        assert redirected.user_response.selected_alternative == alternatives[0]
        assert redirected.is_active is False


# ═══════════════════════════════════════════════════════════════════════════════
# RUN TESTS
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--asyncio-mode=auto"])
