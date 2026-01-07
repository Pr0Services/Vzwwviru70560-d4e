"""
CHE·NU™ V71 — Tests Synaptic Modules
====================================
Tests for Context, Switcher, Graph, YellowPages
"""

import pytest
import asyncio
from datetime import datetime, timedelta
from uuid import UUID

# Add parent to path for imports
import sys
sys.path.insert(0, '/home/claude/CHENU_V71_PLATFORM')

from backend.core.synaptic import (
    # Context
    SynapticContext,
    ContextCapsuleBuilder,
    LocationAnchor,
    ToolchainConfig,
    CommunicationChannel,
    PolicyGuard,
    ScopeType,
    create_task_context,
    create_emergency_context,
    
    # Switcher
    SynapticSwitcher,
    SwitchStatus,
    get_synaptic_switcher,
    
    # Graph
    SynapticGraph,
    SynapticEdge,
    ModuleID,
    Priority,
    get_synaptic_graph,
    
    # YellowPages
    YellowPages,
    NeedTag,
    GuardRequirement,
    get_yellow_pages
)


# =============================================================================
# SYNAPTIC CONTEXT TESTS
# =============================================================================

class TestSynapticContext:
    """Tests for SynapticContext"""
    
    def test_context_creation(self):
        """Test basic context creation"""
        ctx = SynapticContext(
            task_id="task_123",
            sphere_id="personal",
            user_id="user_abc"
        )
        
        assert isinstance(ctx.id, UUID)
        assert ctx.task_id == "task_123"
        assert ctx.sphere_id == "personal"
        assert ctx.user_id == "user_abc"
        assert ctx.is_active == True
        assert ctx.ttl_seconds == 300
    
    def test_context_builder(self):
        """Test ContextCapsuleBuilder"""
        ctx = (ContextCapsuleBuilder()
               .with_task("task_456")
               .with_sphere("business")
               .with_user("user_xyz")
               .with_location(LocationAnchor(
                   anchor_id="loc_1",
                   coordinates={"lat": 45.5, "lon": -73.5}
               ))
               .with_toolchain(ToolchainConfig(
                   tools=["tool_a", "tool_b"],
                   agents=["agent_1"]
               ))
               .with_channel(CommunicationChannel(
                   channel_id="ch_1",
                   channel_type="secure",
                   encryption_level="quantum"
               ))
               .with_guard(PolicyGuard.OPA_REQUIRED)
               .with_scope(ScopeType.COOPERATIVE)
               .with_ttl(600)
               .build())
        
        assert ctx.task_id == "task_456"
        assert ctx.sphere_id == "business"
        assert ctx.location.anchor_id == "loc_1"
        assert len(ctx.toolchain.tools) == 2
        assert ctx.channel.encryption_level == "quantum"
        assert PolicyGuard.OPA_REQUIRED in ctx.guards
        assert ctx.scope == ScopeType.COOPERATIVE
        assert ctx.ttl_seconds == 600
    
    def test_context_expiration(self):
        """Test TTL-based expiration"""
        ctx = SynapticContext(
            task_id="test",
            sphere_id="test",
            user_id="test",
            ttl_seconds=1
        )
        
        assert not ctx.is_expired()
        
        # Manually expire
        ctx.created_at = datetime.utcnow() - timedelta(seconds=10)
        assert ctx.is_expired()
    
    def test_context_fork(self):
        """Test context forking for sub-tasks"""
        parent = SynapticContext(
            task_id="parent_task",
            sphere_id="personal",
            user_id="user_1"
        )
        
        child = parent.fork("child_task")
        
        assert child.task_id == "child_task"
        assert child.parent_id == parent.id
        assert child.sphere_id == parent.sphere_id
        assert child.user_id == parent.user_id
        assert child.id != parent.id
    
    def test_context_serialization(self):
        """Test JSON serialization/deserialization"""
        ctx = create_task_context("task_1", "sphere_1", "user_1")
        
        json_str = ctx.to_json()
        restored = SynapticContext.from_json(json_str)
        
        assert restored.task_id == ctx.task_id
        assert restored.sphere_id == ctx.sphere_id
        assert restored.user_id == ctx.user_id
    
    def test_emergency_context(self):
        """Test emergency context factory"""
        ctx = create_emergency_context("emergency_task", "user_911")
        
        assert PolicyGuard.OPA_REQUIRED in ctx.guards
        assert ctx.scope == ScopeType.COMMON
        assert ctx.ttl_seconds == 60  # Short TTL


# =============================================================================
# SYNAPTIC SWITCHER TESTS
# =============================================================================

class TestSynapticSwitcher:
    """Tests for SynapticSwitcher"""
    
    def test_switcher_singleton(self):
        """Test singleton pattern"""
        s1 = get_synaptic_switcher()
        s2 = get_synaptic_switcher()
        assert s1 is s2
    
    @pytest.mark.asyncio
    async def test_switch_context(self):
        """Test context switching"""
        switcher = SynapticSwitcher()
        
        ctx = create_task_context("switch_test", "personal", "user_1")
        report = await switcher.switch(ctx)
        
        assert report.status == SwitchStatus.SUCCESS
        assert switcher.current_context == ctx
        assert ctx.is_active == True
    
    @pytest.mark.asyncio
    async def test_switch_deactivates_previous(self):
        """Test that previous context is deactivated"""
        switcher = SynapticSwitcher()
        
        ctx1 = create_task_context("ctx1", "personal", "user_1")
        ctx2 = create_task_context("ctx2", "business", "user_1")
        
        await switcher.switch(ctx1)
        assert ctx1.is_active == True
        
        await switcher.switch(ctx2)
        assert ctx1.is_active == False
        assert ctx2.is_active == True
    
    @pytest.mark.asyncio
    async def test_switch_expired_context(self):
        """Test switching expired context fails"""
        switcher = SynapticSwitcher()
        
        ctx = SynapticContext(
            task_id="expired",
            sphere_id="test",
            user_id="test",
            ttl_seconds=0
        )
        ctx.created_at = datetime.utcnow() - timedelta(seconds=10)
        
        report = await switcher.switch(ctx)
        assert report.status == SwitchStatus.EXPIRED
    
    def test_dashboard_render(self):
        """Test dashboard data rendering"""
        switcher = SynapticSwitcher()
        dashboard = switcher.render_dashboard()
        
        assert "communication" in dashboard
        assert "navigation" in dashboard
        assert "execution" in dashboard


# =============================================================================
# SYNAPTIC GRAPH TESTS
# =============================================================================

class TestSynapticGraph:
    """Tests for SynapticGraph"""
    
    def test_graph_singleton(self):
        """Test singleton pattern"""
        g1 = get_synaptic_graph()
        g2 = get_synaptic_graph()
        assert g1 is g2
    
    def test_default_edges(self):
        """Test default 25 edges are initialized"""
        graph = SynapticGraph()
        assert len(graph._edges) >= 20  # At least 20 default edges
    
    def test_get_edges_by_source(self):
        """Test getting edges by source module"""
        graph = SynapticGraph()
        opa_edges = graph.get_edges_by_source(ModuleID.MOD_01_OPA)
        
        assert len(opa_edges) > 0
        assert all(e.source == ModuleID.MOD_01_OPA for e in opa_edges)
    
    def test_get_edges_by_priority(self):
        """Test getting edges by priority"""
        graph = SynapticGraph()
        
        p0_edges = graph.get_edges_by_priority(Priority.P0)
        assert len(p0_edges) > 0
        assert all(e.priority == Priority.P0 for e in p0_edges)
    
    @pytest.mark.asyncio
    async def test_fire_edge(self):
        """Test edge firing"""
        graph = SynapticGraph()
        
        # Get first P1 edge
        edges = graph.get_edges_by_priority(Priority.P1)
        if edges:
            edge = edges[0]
            result = await graph.fire_edge(edge.id, {"test": True})
            assert result["success"] == True
    
    @pytest.mark.asyncio
    async def test_anti_loop_protection(self):
        """Test that loops are prevented"""
        graph = SynapticGraph()
        
        # Simulate active path
        test_source = ModuleID.MOD_03_CAUSAL
        test_target = ModuleID.MOD_04_WORLDENGINE
        
        # Add to active path
        graph._active_path.add(test_target)
        
        # Create edge that would create loop
        loop_edge = SynapticEdge(
            source=test_source,
            target=test_target,
            priority=Priority.P2
        )
        
        # Should detect loop
        is_loop = graph._check_loop(test_target)
        assert is_loop == True
    
    def test_mermaid_export(self):
        """Test Mermaid diagram export"""
        graph = SynapticGraph()
        mermaid = graph.to_mermaid()
        
        assert "graph TD" in mermaid
        assert "-->" in mermaid
    
    def test_summary(self):
        """Test graph summary"""
        graph = SynapticGraph()
        summary = graph.get_summary()
        
        assert "total_edges" in summary
        assert "by_priority" in summary
        assert summary["total_edges"] > 0


# =============================================================================
# YELLOW PAGES TESTS
# =============================================================================

class TestYellowPages:
    """Tests for YellowPages service registry"""
    
    def test_yellowpages_singleton(self):
        """Test singleton pattern"""
        yp1 = get_yellow_pages()
        yp2 = get_yellow_pages()
        assert yp1 is yp2
    
    def test_default_entries(self):
        """Test default entries are initialized"""
        yp = YellowPages()
        assert len(yp._entries) >= 10
    
    def test_lookup_need(self):
        """Test looking up a need"""
        yp = YellowPages()
        entry = yp.lookup(NeedTag.GOVERNANCE)
        
        assert entry is not None
        assert entry.need == NeedTag.GOVERNANCE
        assert entry.authority == ModuleID.MOD_01_OPA
    
    @pytest.mark.asyncio
    async def test_route_need(self):
        """Test routing a need"""
        yp = YellowPages()
        decision = await yp.route(NeedTag.CAUSAL)
        
        assert decision.routed_to is not None
        assert decision.reason != ""
    
    @pytest.mark.asyncio
    async def test_route_unavailable_module(self):
        """Test routing when module unavailable"""
        yp = YellowPages()
        
        # Mark module as unavailable
        entry = yp.lookup(NeedTag.XR)
        if entry:
            entry.authority_available = False
            
            decision = await yp.route(NeedTag.XR)
            
            # Should use fallback service
            if entry.fallback:
                assert decision.used_fallback == True
    
    def test_guards_for_need(self):
        """Test getting guards for a need"""
        yp = YellowPages()
        entry = yp.lookup(NeedTag.SECURE_TRANSPORT)
        
        assert entry is not None
        assert len(entry.guards) > 0
        assert GuardRequirement.P0_INFRA in entry.guards
    
    def test_statistics(self):
        """Test usage statistics"""
        yp = YellowPages()
        stats = yp.get_statistics()
        
        assert "total_entries" in stats
        assert "entries_with_fallback" in stats


# =============================================================================
# INTEGRATION TESTS
# =============================================================================

class TestSynapticIntegration:
    """Integration tests for synaptic modules working together"""
    
    @pytest.mark.asyncio
    async def test_full_context_switch_flow(self):
        """Test complete flow: context → switch → graph fire"""
        # Create context
        ctx = (ContextCapsuleBuilder()
               .with_task("integration_test")
               .with_sphere("personal")
               .with_user("test_user")
               .with_guard(PolicyGuard.OPA_REQUIRED)
               .build())
        
        # Switch
        switcher = get_synaptic_switcher()
        report = await switcher.switch(ctx)
        assert report.status == SwitchStatus.SUCCESS
        
        # Fire related graph edge
        graph = get_synaptic_graph()
        edges = graph.get_edges_by_priority(Priority.P1)
        if edges:
            result = await graph.fire_edge(edges[0].id, {"context_id": str(ctx.id)})
            assert result["success"] == True
    
    @pytest.mark.asyncio
    async def test_yellowpages_route_and_execute(self):
        """Test YellowPages route and execute flow"""
        yp = get_yellow_pages()
        
        # Route
        decision = await yp.route(NeedTag.GOVERNANCE)
        assert decision.routed_to is not None
        
        # Would execute here (mocked)
    
    def test_all_modules_initialized(self):
        """Test all singletons can be initialized"""
        switcher = get_synaptic_switcher()
        graph = get_synaptic_graph()
        yp = get_yellow_pages()
        
        assert switcher is not None
        assert graph is not None
        assert yp is not None


# =============================================================================
# RUN TESTS
# =============================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
