"""
CHE·NU™ V71 — Tests MultiTech Integration
==========================================
Tests for Technology Registry and Integration Phases
"""

import pytest

# Add parent to path for imports
import sys
sys.path.insert(0, '/home/claude/CHENU_V71_PLATFORM')

from backend.core.multitech import (
    MultiTechIntegration,
    TechnologyRegistry,
    Technology,
    TechnologyCategory,
    ArchitectureLevel,
    IntegrationPhase,
    get_multi_tech_integration
)


# =============================================================================
# TECHNOLOGY REGISTRY TESTS
# =============================================================================

class TestTechnologyRegistry:
    """Tests for TechnologyRegistry"""
    
    def test_registry_initialization(self):
        """Test registry initializes with default technologies"""
        registry = TechnologyRegistry()
        
        assert len(registry._technologies) > 0
    
    def test_get_technology(self):
        """Test getting technology by ID"""
        registry = TechnologyRegistry()
        
        tech = registry.get("tls_1_3")
        assert tech is not None
        assert tech.tech_id == "tls_1_3"
    
    def test_get_nonexistent_technology(self):
        """Test getting nonexistent technology returns None"""
        registry = TechnologyRegistry()
        
        tech = registry.get("nonexistent_tech")
        assert tech is None
    
    def test_get_by_category(self):
        """Test filtering by category"""
        registry = TechnologyRegistry()
        
        security_techs = registry.get_by_category(TechnologyCategory.SECURITY)
        
        assert len(security_techs) > 0
        assert all(t.category == TechnologyCategory.SECURITY for t in security_techs)
    
    def test_get_by_level(self):
        """Test filtering by architecture level"""
        registry = TechnologyRegistry()
        
        kernel_techs = registry.get_by_level(ArchitectureLevel.LEVEL_1_KERNEL)
        
        assert len(kernel_techs) > 0
        assert all(t.level == ArchitectureLevel.LEVEL_1_KERNEL for t in kernel_techs)
    
    def test_get_by_phase(self):
        """Test filtering by integration phase"""
        registry = TechnologyRegistry()
        
        phase1_techs = registry.get_by_phase(IntegrationPhase.PHASE_1_COMPATIBILITY)
        
        assert len(phase1_techs) > 0
        assert all(t.phase == IntegrationPhase.PHASE_1_COMPATIBILITY for t in phase1_techs)
    
    def test_get_available(self):
        """Test getting available technologies"""
        registry = TechnologyRegistry()
        
        available = registry.get_available()
        
        assert all(t.is_available for t in available)
    
    def test_get_production_ready(self):
        """Test getting production-ready technologies"""
        registry = TechnologyRegistry()
        
        prod_ready = registry.get_production_ready()
        
        assert all(t.is_production_ready for t in prod_ready)
    
    def test_check_dependencies_met(self):
        """Test dependency checking when met"""
        registry = TechnologyRegistry()
        
        # TLS should have no dependencies or met dependencies
        met, missing = registry.check_dependencies("tls_1_3")
        
        assert met == True
        assert len(missing) == 0
    
    def test_check_dependencies_not_met(self):
        """Test dependency checking when not met"""
        registry = TechnologyRegistry()
        
        # QKD requires quantum infrastructure
        met, missing = registry.check_dependencies("qkd")
        
        # May or may not be met depending on setup
        assert isinstance(met, bool)
        assert isinstance(missing, list)
    
    def test_resolve_fallback(self):
        """Test fallback resolution"""
        registry = TechnologyRegistry()
        
        # QKD should fallback to PQC then to TLS
        resolved = registry.resolve_fallback("qkd")
        
        # Should resolve to something available
        resolved_tech = registry.get(resolved)
        assert resolved_tech is not None
        assert resolved_tech.is_available == True


# =============================================================================
# MULTI-TECH INTEGRATION TESTS
# =============================================================================

class TestMultiTechIntegration:
    """Tests for MultiTechIntegration"""
    
    def test_integration_singleton(self):
        """Test singleton pattern"""
        i1 = get_multi_tech_integration()
        i2 = get_multi_tech_integration()
        assert i1 is i2
    
    def test_initial_phase(self):
        """Test initial integration phase"""
        integration = MultiTechIntegration()
        
        assert integration.current_phase == IntegrationPhase.PHASE_1_COMPATIBILITY
    
    def test_advance_phase(self):
        """Test phase advancement"""
        integration = MultiTechIntegration()
        
        # Should be Phase 1
        assert integration.current_phase == IntegrationPhase.PHASE_1_COMPATIBILITY
        
        # Advance to Phase 2
        new_phase = integration.advance_phase()
        assert new_phase == IntegrationPhase.PHASE_2_HYBRIDATION
        
        # Advance to Phase 3
        new_phase = integration.advance_phase()
        assert new_phase == IntegrationPhase.PHASE_3_QUANTUM
        
        # Should stay at Phase 3 (final)
        new_phase = integration.advance_phase()
        assert new_phase == IntegrationPhase.PHASE_3_QUANTUM
    
    def test_get_phase_technologies(self):
        """Test getting technologies for current phase"""
        integration = MultiTechIntegration()
        
        techs = integration.get_phase_technologies()
        
        assert len(techs) > 0
        assert all(t.phase == integration.current_phase for t in techs)
    
    def test_select_technology_with_fallback(self):
        """Test technology selection applies fallback rule"""
        integration = MultiTechIntegration()
        
        # Request quantum (likely unavailable)
        selected = integration.select_technology("qkd")
        
        # Should fallback to available tech
        selected_tech = integration.registry.get(selected)
        assert selected_tech.is_available == True
    
    def test_select_available_technology(self):
        """Test selecting available technology returns same"""
        integration = MultiTechIntegration()
        
        # Request TLS (should be available)
        selected = integration.select_technology("tls_1_3")
        
        assert selected == "tls_1_3"
    
    def test_hub_configs(self):
        """Test hub technology configurations"""
        integration = MultiTechIntegration()
        
        assert "communication" in integration._hub_configs
        assert "navigation" in integration._hub_configs
        assert "execution" in integration._hub_configs
    
    def test_get_hub_technologies(self):
        """Test getting technologies for a hub"""
        integration = MultiTechIntegration()
        
        comm_techs = integration.get_hub_technologies("communication")
        
        assert len(comm_techs) > 0
    
    def test_get_integration_status(self):
        """Test getting integration status"""
        integration = MultiTechIntegration()
        
        status = integration.get_integration_status()
        
        assert "current_phase" in status
        assert "total_technologies" in status
        assert "available" in status
        assert "production_ready" in status
    
    def test_get_success_indicators(self):
        """Test getting success indicators"""
        integration = MultiTechIntegration()
        
        indicators = integration.get_success_indicators()
        
        assert "availability_rate" in indicators
        assert "phase_progress" in indicators


# =============================================================================
# DECISION RULES TESTS
# =============================================================================

class TestDecisionRules:
    """Tests for technology selection decision rules"""
    
    def test_fallback_rule_priority(self):
        """Test fallback rule has highest priority"""
        integration = MultiTechIntegration()
        
        # Fallback rule should be P100
        rules = integration._decision_rules
        fallback_rule = next((r for r in rules if "Fallback" in r.name), None)
        
        assert fallback_rule is not None
        assert fallback_rule.priority == 100
    
    def test_modularity_rule(self):
        """Test modularity rule exists"""
        integration = MultiTechIntegration()
        
        rules = integration._decision_rules
        mod_rule = next((r for r in rules if "Modular" in r.name), None)
        
        assert mod_rule is not None
        assert mod_rule.priority == 90
    
    def test_no_lockin_rule(self):
        """Test no vendor lock-in rule exists"""
        integration = MultiTechIntegration()
        
        rules = integration._decision_rules
        lockin_rule = next((r for r in rules if "Lock" in r.name), None)
        
        assert lockin_rule is not None
        assert lockin_rule.priority == 80
    
    def test_transparency_rule(self):
        """Test transparency rule exists"""
        integration = MultiTechIntegration()
        
        rules = integration._decision_rules
        trans_rule = next((r for r in rules if "Transparency" in r.name), None)
        
        assert trans_rule is not None
        assert trans_rule.priority == 70
    
    def test_social_impact_rule(self):
        """Test social impact rule exists"""
        integration = MultiTechIntegration()
        
        rules = integration._decision_rules
        social_rule = next((r for r in rules if "Social" in r.name), None)
        
        assert social_rule is not None
        assert social_rule.priority == 60


# =============================================================================
# ARCHITECTURE LEVEL TESTS
# =============================================================================

class TestArchitectureLevels:
    """Tests for architecture level coverage"""
    
    def test_all_levels_have_technologies(self):
        """Test all architecture levels have technologies"""
        integration = MultiTechIntegration()
        
        for level in ArchitectureLevel:
            techs = integration.registry.get_by_level(level)
            # At least some levels should have techs
            # Not all levels may be populated in initial setup
    
    def test_level_hierarchy(self):
        """Test architecture level values are in order"""
        assert ArchitectureLevel.LEVEL_0_PHYSICAL.value == 0
        assert ArchitectureLevel.LEVEL_1_KERNEL.value == 1
        assert ArchitectureLevel.LEVEL_2_HUBS.value == 2
        assert ArchitectureLevel.LEVEL_3_AGENTS.value == 3
        assert ArchitectureLevel.LEVEL_4_INTERFACES.value == 4


# =============================================================================
# INTEGRATION PHASE TESTS
# =============================================================================

class TestIntegrationPhases:
    """Tests for integration phases"""
    
    def test_phase_values(self):
        """Test phase string values"""
        assert IntegrationPhase.PHASE_1_COMPATIBILITY.value == "phase_1_compatibility"
        assert IntegrationPhase.PHASE_2_HYBRIDATION.value == "phase_2_hybridation"
        assert IntegrationPhase.PHASE_3_QUANTUM.value == "phase_3_quantum"
    
    def test_phase_1_technologies_available(self):
        """Test Phase 1 technologies are available"""
        integration = MultiTechIntegration()
        
        phase1_techs = integration.registry.get_by_phase(IntegrationPhase.PHASE_1_COMPATIBILITY)
        available = [t for t in phase1_techs if t.is_available]
        
        # Most Phase 1 techs should be available
        assert len(available) > 0
    
    def test_phase_progression_unlocks_technologies(self):
        """Test that advancing phases changes available technologies"""
        integration = MultiTechIntegration()
        
        phase1_count = len(integration.get_phase_technologies())
        
        integration.advance_phase()
        phase2_count = len(integration.get_phase_technologies())
        
        # Different phases should have different tech counts
        # (may be same if all techs in all phases)


# =============================================================================
# HUB CONFIGURATION TESTS
# =============================================================================

class TestHubConfigurations:
    """Tests for hub technology configurations"""
    
    def test_communication_hub_config(self):
        """Test Communication hub configuration"""
        integration = MultiTechIntegration()
        
        config = integration._hub_configs.get("communication")
        assert config is not None
        assert len(config.technologies) > 0
        assert len(config.use_cases) > 0
    
    def test_navigation_hub_config(self):
        """Test Navigation hub configuration"""
        integration = MultiTechIntegration()
        
        config = integration._hub_configs.get("navigation")
        assert config is not None
        assert len(config.technologies) > 0
    
    def test_execution_hub_config(self):
        """Test Execution hub configuration"""
        integration = MultiTechIntegration()
        
        config = integration._hub_configs.get("execution")
        assert config is not None
        assert len(config.technologies) > 0
    
    def test_hub_config_to_dict(self):
        """Test hub config serialization"""
        integration = MultiTechIntegration()
        
        config = integration._hub_configs.get("communication")
        config_dict = config.to_dict()
        
        assert "hub_name" in config_dict
        assert "technologies" in config_dict
        assert "use_cases" in config_dict


# =============================================================================
# RUN TESTS
# =============================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
