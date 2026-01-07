"""
CHE·NU™ Integration Tests - Governance & XR Systems

Test Suite Covering:
- Orchestrator decision flow
- CEA signal generation
- Backlog management
- Maturity computation
- XR blueprint generation
- Thread lobby data

R&D Compliance:
- Rule #1: Tests verify human gates
- Rule #3: Tests verify XR is projection only
- Rule #6: Tests verify traceability
"""

import pytest
from uuid import uuid4
from datetime import datetime, timedelta
from unittest.mock import AsyncMock, MagicMock, patch

# Import services (adjust paths as needed for actual integration)
import sys
sys.path.insert(0, '/home/claude/chenu_implementation/output/backend')

from schemas.governance_schemas import (
    GovernanceSignalLevel,
    GovernanceCriterion,
    OrchestratorDecision,
    BacklogType,
    BacklogSeverity,
)
from schemas.xr_schemas import (
    MaturityLevel,
    ZoneType,
    ItemKind,
    ThreadEntryMode,
    ViewerRole,
)


# =============================================================================
# FIXTURES
# =============================================================================

@pytest.fixture
def user_id():
    return uuid4()

@pytest.fixture
def thread_id():
    return uuid4()

@pytest.fixture
def identity_id():
    return uuid4()

@pytest.fixture
def mock_thread_state():
    """Create a mock thread state for testing."""
    return {
        "id": str(uuid4()),
        "title": "Test Thread",
        "founding_intent": "Test the governance system",
        "thread_type": "personal",
        "sphere_id": str(uuid4()),
        "status": "active",
        "visibility": "private",
        "created_at": datetime.utcnow().isoformat(),
    }


# =============================================================================
# ORCHESTRATOR TESTS
# =============================================================================

class TestOrchestratorService:
    """Tests for the Orchestrator decision-making system."""

    def test_qct_selects_cheapest_config_meeting_quality(self):
        """QCT should select the cheapest config that meets required quality."""
        from services.governance.orchestrator_service import QCTAlgorithm
        
        qct = QCTAlgorithm()
        segment_scores = {
            "doc": 0.6,
            "code": 0.5,
            "workflow": 0.7,
            "xr": 0.4,
        }
        budgets = {"tokens": 5000, "latency_ms": 3000}
        
        result = qct.compute(segment_scores, budgets, is_live=False)
        
        assert result is not None
        assert result.required_quality >= 0.0
        assert result.required_quality <= 1.0
        assert result.selected_config in ["A", "B", "C", "D", "E"]
        assert result.estimated_cost > 0

    def test_qct_live_mode_restricts_configs(self):
        """In live mode, QCT should not select heavy configs D or E."""
        from services.governance.orchestrator_service import QCTAlgorithm
        
        qct = QCTAlgorithm()
        segment_scores = {
            "doc": 0.9,  # High scores = high RQ
            "code": 0.9,
            "workflow": 0.9,
            "xr": 0.9,
        }
        budgets = {"tokens": 10000, "latency_ms": 1000}  # Tight latency
        
        result = qct.compute(segment_scores, budgets, is_live=True)
        
        # Live mode should restrict to A, B, C unless critical
        if result.required_quality < 0.85:
            assert result.selected_config in ["A", "B", "C"]

    def test_ses_triggers_escalation_on_high_quality(self):
        """SES should trigger escalation when RQ > 0.85."""
        from services.governance.orchestrator_service import SESAlgorithm
        
        ses = SESAlgorithm()
        segment_scores = {
            "doc": 0.95,  # Very high
            "code": 0.90,
            "workflow": 0.88,
            "xr": 0.85,
        }
        
        result = ses.evaluate(segment_scores)
        
        assert result.escalation_triggered == True

    def test_rdc_decides_based_on_signal_levels(self):
        """RDC should decide intervention based on CEA signals."""
        from services.governance.orchestrator_service import RDCAlgorithm
        from schemas.governance_schemas import GovernanceSignal
        
        rdc = RDCAlgorithm()
        
        # Create signals with BLOCK level
        signals = [
            GovernanceSignal(
                id=str(uuid4()),
                cea_name="SECURITY_GUARD",
                criterion=GovernanceCriterion.SECURITY,
                level=GovernanceSignalLevel.BLOCK,
                message="SQL injection detected",
                created_at=datetime.utcnow().isoformat(),
            )
        ]
        
        intervention, patches = rdc.decide(signals)
        
        assert intervention == GovernanceSignalLevel.BLOCK

    def test_orchestrator_makes_decision_with_traceability(self, thread_id, identity_id):
        """Orchestrator decisions should include full traceability."""
        from services.governance.orchestrator_service import OrchestratorService
        
        service = OrchestratorService()
        
        # Mock signals
        signals = []
        
        result = service.make_decision(
            thread_id=thread_id,
            identity_id=identity_id,
            signals=signals,
            segment_scores={"doc": 0.5, "code": 0.5, "workflow": 0.5, "xr": 0.5},
            budgets={"tokens": 5000, "latency_ms": 3000},
            is_live=False,
        )
        
        # Verify traceability
        assert result.id is not None
        assert result.thread_id == thread_id
        assert result.created_at is not None
        assert result.decision in [d.value for d in OrchestratorDecision]


# =============================================================================
# CEA TESTS
# =============================================================================

class TestCEAService:
    """Tests for Criterion Enforcement Agents."""

    def test_canon_guard_detects_permission_bypass(self):
        """CANON_GUARD should detect permission bypass attempts."""
        from services.governance.cea_service import CanonGuardCEA
        
        cea = CanonGuardCEA()
        
        # Content attempting to bypass permissions
        content = {
            "action": "delete_all_threads",
            "bypass_auth": True,
        }
        
        signals = cea.evaluate(content, {})
        
        # Should generate at least one signal
        assert len(signals) > 0
        assert any(s.criterion == GovernanceCriterion.CANON for s in signals)

    def test_security_guard_detects_injection(self):
        """SECURITY_GUARD should detect injection patterns."""
        from services.governance.cea_service import SecurityGuardCEA
        
        cea = SecurityGuardCEA()
        
        content = {
            "query": "SELECT * FROM users; DROP TABLE users;--",
        }
        
        signals = cea.evaluate(content, {})
        
        assert len(signals) > 0
        assert any(s.level == GovernanceSignalLevel.BLOCK for s in signals)

    def test_budget_guard_warns_on_threshold(self):
        """BUDGET_GUARD should warn at 80% budget consumption."""
        from services.governance.cea_service import BudgetGuardCEA
        
        cea = BudgetGuardCEA()
        
        context = {
            "token_budget": 10000,
            "tokens_used": 8500,  # 85% - should trigger warn
        }
        
        signals = cea.evaluate({}, context)
        
        assert any(s.level == GovernanceSignalLevel.WARN for s in signals)

    def test_budget_guard_blocks_on_exceeded(self):
        """BUDGET_GUARD should block when budget is exceeded."""
        from services.governance.cea_service import BudgetGuardCEA
        
        cea = BudgetGuardCEA()
        
        context = {
            "token_budget": 10000,
            "tokens_used": 9600,  # 96% - should trigger block
        }
        
        signals = cea.evaluate({}, context)
        
        assert any(s.level == GovernanceSignalLevel.BLOCK for s in signals)

    def test_cea_registry_runs_all_always_on(self):
        """CEA Registry should run all always-on CEAs."""
        from services.governance.cea_service import CEARegistry
        
        registry = CEARegistry()
        
        # Register some CEAs
        registry.register_defaults()
        
        signals = registry.run_all(content={}, context={})
        
        # Should have processed through all always-on CEAs
        assert isinstance(signals, list)


# =============================================================================
# BACKLOG TESTS
# =============================================================================

class TestBacklogService:
    """Tests for the governance backlog system."""

    def test_create_backlog_item_with_traceability(self, thread_id, user_id):
        """Backlog items should have full traceability."""
        from services.governance.backlog_service import BacklogService
        
        service = BacklogService()
        
        item = service.create_item(
            thread_id=thread_id,
            identity_id=user_id,
            backlog_type=BacklogType.ERROR,
            severity=BacklogSeverity.HIGH,
            title="Test Error",
            description="Test description",
            created_by=user_id,
        )
        
        assert item.id is not None
        assert item.created_at is not None
        assert item.created_by == user_id
        assert item.status == "open"

    def test_resolve_backlog_item(self, thread_id, user_id):
        """Resolving a backlog item should update status and record resolution."""
        from services.governance.backlog_service import BacklogService
        
        service = BacklogService()
        
        # Create item
        item = service.create_item(
            thread_id=thread_id,
            identity_id=user_id,
            backlog_type=BacklogType.SIGNAL,
            severity=BacklogSeverity.MEDIUM,
            title="Test Signal",
            created_by=user_id,
        )
        
        # Resolve it
        resolved = service.resolve_item(
            item_id=item.id,
            resolution="Fixed by updating validation",
            resolved_by=user_id,
        )
        
        assert resolved.status == "resolved"
        assert resolved.resolution is not None
        assert resolved.resolved_by == user_id
        assert resolved.resolved_at is not None

    def test_policy_tuner_requires_approval_for_large_changes(self):
        """Policy tuner should require human approval for large changes."""
        from services.governance.backlog_service import PolicyTuner
        
        tuner = PolicyTuner()
        
        # Simulate metrics that would trigger a large change
        metrics = {
            "escape_rate": 0.25,  # High escape rate
            "fix_cost_median": 500,
            "noise_rate": 0.05,
        }
        
        proposals = tuner.suggest_adjustments(metrics)
        
        # Large changes should require approval
        large_changes = [p for p in proposals if p.get("change_magnitude", 0) > 0.15]
        for proposal in large_changes:
            assert proposal.get("requires_approval") == True


# =============================================================================
# MATURITY TESTS
# =============================================================================

class TestMaturityService:
    """Tests for thread maturity computation."""

    def test_maturity_score_is_deterministic(self, thread_id):
        """Same signals should always produce same score."""
        from services.xr.maturity_service import MaturityScorer
        
        scorer = MaturityScorer()
        
        signals = {
            "summary_count": 5,
            "decision_count": 3,
            "action_count": 10,
            "action_completed_count": 7,
            "participant_count": 2,
            "live_session_count": 1,
            "link_count": 4,
            "message_count": 20,
            "learning_event_count": 2,
            "age_days": 30,
            "portal_count": 1,
        }
        
        score1 = scorer.compute_score(signals)
        score2 = scorer.compute_score(signals)
        
        assert score1 == score2

    def test_maturity_level_thresholds(self):
        """Verify maturity level thresholds are correct."""
        from services.xr.maturity_service import MaturityScorer
        
        scorer = MaturityScorer()
        
        # Test each level threshold
        assert scorer.score_to_level(0) == MaturityLevel.SEED
        assert scorer.score_to_level(9) == MaturityLevel.SEED
        assert scorer.score_to_level(10) == MaturityLevel.SPROUT
        assert scorer.score_to_level(24) == MaturityLevel.SPROUT
        assert scorer.score_to_level(25) == MaturityLevel.WORKSHOP
        assert scorer.score_to_level(44) == MaturityLevel.WORKSHOP
        assert scorer.score_to_level(45) == MaturityLevel.STUDIO
        assert scorer.score_to_level(64) == MaturityLevel.STUDIO
        assert scorer.score_to_level(65) == MaturityLevel.ORG
        assert scorer.score_to_level(84) == MaturityLevel.ORG
        assert scorer.score_to_level(85) == MaturityLevel.ECOSYSTEM
        assert scorer.score_to_level(100) == MaturityLevel.ECOSYSTEM

    def test_maturity_zones_increase_with_level(self):
        """Higher maturity levels should have more zones."""
        from services.xr.maturity_service import MaturityService
        
        service = MaturityService()
        
        zones_level_0 = service.get_zones_for_level(MaturityLevel.SEED)
        zones_level_2 = service.get_zones_for_level(MaturityLevel.WORKSHOP)
        zones_level_5 = service.get_zones_for_level(MaturityLevel.ECOSYSTEM)
        
        assert len(zones_level_0) < len(zones_level_2) < len(zones_level_5)


# =============================================================================
# XR RENDERER TESTS
# =============================================================================

class TestXRRendererService:
    """Tests for XR blueprint generation."""

    def test_blueprint_is_projection_only(self, thread_id, mock_thread_state):
        """XR blueprint should be derived from thread state, never canonical."""
        from services.xr.xr_renderer_service import XRRendererService
        
        service = XRRendererService()
        
        blueprint = service.generate_blueprint(
            thread_state=mock_thread_state,
            maturity_level=MaturityLevel.WORKSHOP,
            viewer_role=ViewerRole.OWNER,
        )
        
        # Blueprint should have generated_at timestamp
        assert blueprint.generated_at is not None
        
        # Blueprint should reference thread but not modify it
        assert blueprint.thread_id == mock_thread_state["id"]

    def test_blueprint_respects_redaction(self, mock_thread_state):
        """Blueprint should redact items based on viewer role."""
        from services.xr.xr_renderer_service import XRRendererService
        
        service = XRRendererService()
        
        # Generate for owner (full access)
        owner_blueprint = service.generate_blueprint(
            thread_state=mock_thread_state,
            maturity_level=MaturityLevel.STUDIO,
            viewer_role=ViewerRole.OWNER,
        )
        
        # Generate for guest (limited access)
        guest_blueprint = service.generate_blueprint(
            thread_state=mock_thread_state,
            maturity_level=MaturityLevel.STUDIO,
            viewer_role=ViewerRole.GUEST,
        )
        
        # Guest should have more redaction
        assert guest_blueprint.redaction_level.value >= owner_blueprint.redaction_level.value

    def test_xr_interaction_creates_thread_event(self, thread_id, user_id):
        """XR interactions should create ThreadEvents, not modify directly."""
        from services.xr.xr_renderer_service import XRRendererService
        from schemas.xr_schemas import ActionStatus
        
        service = XRRendererService()
        
        # Simulate action completion in XR
        event = service.create_action_update_event(
            thread_id=thread_id,
            action_id=uuid4(),
            new_status=ActionStatus.COMPLETED,
            user_id=user_id,
            completion_note="Done via XR",
        )
        
        # Should return an event, not modify state directly
        assert event.event_type == "ACTION_UPDATED"
        assert event.payload["new_status"] == ActionStatus.COMPLETED.value
        assert event.created_by == user_id

    def test_thread_lobby_includes_mode_recommendation(self, thread_id, mock_thread_state):
        """Thread lobby should recommend appropriate mode based on maturity."""
        from services.xr.xr_renderer_service import XRRendererService
        
        service = XRRendererService()
        
        # Low maturity thread
        lobby_seed = service.get_thread_lobby(
            thread_state=mock_thread_state,
            maturity_level=MaturityLevel.SEED,
        )
        
        # Chat should be recommended for seed
        assert lobby_seed.recommended_mode == ThreadEntryMode.CHAT
        
        # High maturity thread
        lobby_studio = service.get_thread_lobby(
            thread_state=mock_thread_state,
            maturity_level=MaturityLevel.STUDIO,
        )
        
        # Live or XR should be available for studio
        assert ThreadEntryMode.LIVE in lobby_studio.available_modes


# =============================================================================
# GOVERNANCE FLOW INTEGRATION TESTS
# =============================================================================

class TestGovernanceFlow:
    """Integration tests for complete governance flow."""

    def test_signal_to_decision_flow(self, thread_id, identity_id):
        """Test complete flow from CEA signal to orchestrator decision."""
        from services.governance.cea_service import CEARegistry
        from services.governance.orchestrator_service import OrchestratorService
        
        cea_registry = CEARegistry()
        cea_registry.register_defaults()
        orchestrator = OrchestratorService()
        
        # Step 1: Generate signals
        content = {"action": "create_thread"}
        context = {"token_budget": 10000, "tokens_used": 1000}
        
        signals = cea_registry.run_all(content, context)
        
        # Step 2: Make decision based on signals
        decision = orchestrator.make_decision(
            thread_id=thread_id,
            identity_id=identity_id,
            signals=signals,
            segment_scores={"doc": 0.5, "code": 0.5, "workflow": 0.5, "xr": 0.5},
            budgets={"tokens": 10000, "latency_ms": 3000},
            is_live=False,
        )
        
        # Step 3: Verify decision is valid
        assert decision.decision in [d.value for d in OrchestratorDecision]

    def test_block_decision_creates_checkpoint(self, thread_id, identity_id):
        """BLOCK decision should create a checkpoint requiring human approval."""
        from services.governance.orchestrator_service import OrchestratorService
        from schemas.governance_schemas import GovernanceSignal
        
        orchestrator = OrchestratorService()
        
        # Create blocking signal
        signals = [
            GovernanceSignal(
                id=str(uuid4()),
                cea_name="SECURITY_GUARD",
                criterion=GovernanceCriterion.SECURITY,
                level=GovernanceSignalLevel.BLOCK,
                message="Security violation detected",
                created_at=datetime.utcnow().isoformat(),
            )
        ]
        
        decision = orchestrator.make_decision(
            thread_id=thread_id,
            identity_id=identity_id,
            signals=signals,
            segment_scores={"doc": 0.5, "code": 0.5, "workflow": 0.5, "xr": 0.5},
            budgets={"tokens": 10000, "latency_ms": 3000},
            is_live=False,
        )
        
        # BLOCK should have checkpoint
        assert decision.decision == OrchestratorDecision.BLOCK.value
        assert decision.checkpoint_id is not None


# =============================================================================
# RUN TESTS
# =============================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
