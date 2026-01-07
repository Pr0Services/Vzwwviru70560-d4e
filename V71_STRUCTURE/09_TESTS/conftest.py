"""
CHE·NU™ V71 — Test Configuration
================================
Pytest fixtures and configuration
"""

import pytest
import sys
import asyncio

# Add project root to path
sys.path.insert(0, '/home/claude/CHENU_V71_PLATFORM')


# =============================================================================
# ASYNC FIXTURES
# =============================================================================

@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


# =============================================================================
# SYNAPTIC FIXTURES
# =============================================================================

@pytest.fixture
def fresh_switcher():
    """Create fresh SynapticSwitcher (not singleton)"""
    from backend.core.synaptic import SynapticSwitcher
    return SynapticSwitcher()


@pytest.fixture
def fresh_graph():
    """Create fresh SynapticGraph (not singleton)"""
    from backend.core.synaptic import SynapticGraph
    return SynapticGraph()


@pytest.fixture
def fresh_yellow_pages():
    """Create fresh YellowPages (not singleton)"""
    from backend.core.synaptic import YellowPages
    return YellowPages()


@pytest.fixture
def sample_context():
    """Create sample SynapticContext"""
    from backend.core.synaptic import create_task_context
    return create_task_context("test_task", "test_sphere", "test_user")


# =============================================================================
# QUANTUM FIXTURES
# =============================================================================

@pytest.fixture
def fresh_orchestrator():
    """Create fresh QuantumOrchestrator (not singleton)"""
    from backend.core.quantum import QuantumOrchestrator
    return QuantumOrchestrator()


@pytest.fixture
def fresh_qkd():
    """Create fresh QKDKeyManager"""
    from backend.core.quantum import QKDKeyManager
    return QKDKeyManager()


@pytest.fixture
def fresh_sensor_sync():
    """Create fresh SensorSynchronizer"""
    from backend.core.quantum import SensorSynchronizer
    return SensorSynchronizer()


# =============================================================================
# MULTITECH FIXTURES
# =============================================================================

@pytest.fixture
def fresh_integration():
    """Create fresh MultiTechIntegration (not singleton)"""
    from backend.core.multitech import MultiTechIntegration
    return MultiTechIntegration()


@pytest.fixture
def fresh_registry():
    """Create fresh TechnologyRegistry"""
    from backend.core.multitech import TechnologyRegistry
    return TechnologyRegistry()


# =============================================================================
# API FIXTURES
# =============================================================================

@pytest.fixture
def test_client():
    """Create FastAPI test client"""
    from fastapi.testclient import TestClient
    from backend.api.main import app
    return TestClient(app)


# =============================================================================
# CLEANUP FIXTURES
# =============================================================================

@pytest.fixture(autouse=True)
def reset_singletons():
    """Reset singletons before each test (optional)"""
    yield
    # Could reset singletons here if needed


# =============================================================================
# MARKERS
# =============================================================================

def pytest_configure(config):
    """Register custom markers"""
    config.addinivalue_line(
        "markers", "slow: marks tests as slow (deselect with '-m \"not slow\"')"
    )
    config.addinivalue_line(
        "markers", "integration: marks tests as integration tests"
    )
    config.addinivalue_line(
        "markers", "api: marks tests as API tests"
    )
