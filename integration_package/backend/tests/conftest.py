"""
CHE·NU Test Configuration & Fixtures

Shared fixtures for all test modules.
R&D Compliance: All tests verify human sovereignty, identity boundary, and traceability.
"""

import pytest
import asyncio
from datetime import datetime, timedelta
from typing import AsyncGenerator, Generator
from uuid import uuid4
from unittest.mock import AsyncMock, MagicMock, patch

# ============================================================================
# ASYNC EVENT LOOP FIXTURE
# ============================================================================

@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


# ============================================================================
# MOCK DATABASE SESSION
# ============================================================================

@pytest.fixture
def mock_db_session() -> AsyncMock:
    """Mock database session for service tests."""
    session = AsyncMock()
    session.execute = AsyncMock()
    session.commit = AsyncMock()
    session.rollback = AsyncMock()
    session.refresh = AsyncMock()
    session.add = MagicMock()
    session.delete = MagicMock()
    
    # Context manager support
    session.__aenter__ = AsyncMock(return_value=session)
    session.__aexit__ = AsyncMock(return_value=None)
    
    return session


@pytest.fixture
def mock_session_factory(mock_db_session: AsyncMock) -> MagicMock:
    """Mock session factory that returns the mock session."""
    factory = MagicMock()
    factory.return_value.__aenter__ = AsyncMock(return_value=mock_db_session)
    factory.return_value.__aexit__ = AsyncMock(return_value=None)
    return factory


# ============================================================================
# USER FIXTURES
# ============================================================================

@pytest.fixture
def user_id() -> str:
    """Generate a unique user ID."""
    return str(uuid4())


@pytest.fixture
def other_user_id() -> str:
    """Generate another unique user ID for identity boundary tests."""
    return str(uuid4())


@pytest.fixture
def mock_user(user_id: str) -> MagicMock:
    """Create a mock user object."""
    user = MagicMock()
    user.id = uuid4()
    user.email = "test@example.com"
    user.first_name = "Test"
    user.last_name = "User"
    user.display_name = "Test User"
    user.is_active = True
    user.is_verified = True
    user.is_superuser = False
    user.hashed_password = "$2b$12$mock_hashed_password"
    user.created_at = datetime.utcnow()
    user.updated_at = datetime.utcnow()
    user.preferences = {}
    user.metadata = {}
    return user


@pytest.fixture
def mock_superuser() -> MagicMock:
    """Create a mock superuser object."""
    user = MagicMock()
    user.id = uuid4()
    user.email = "admin@example.com"
    user.first_name = "Admin"
    user.last_name = "User"
    user.display_name = "Admin User"
    user.is_active = True
    user.is_verified = True
    user.is_superuser = True
    user.hashed_password = "$2b$12$mock_hashed_password"
    user.created_at = datetime.utcnow()
    user.updated_at = datetime.utcnow()
    return user


# ============================================================================
# SPHERE FIXTURES
# ============================================================================

@pytest.fixture
def sphere_id() -> str:
    """Generate a unique sphere ID."""
    return str(uuid4())


@pytest.fixture
def mock_sphere(sphere_id: str, user_id: str) -> MagicMock:
    """Create a mock sphere object."""
    sphere = MagicMock()
    sphere.id = uuid4()
    sphere.identity_id = uuid4()
    sphere.sphere_type = "personal"
    sphere.name = "Personal"
    sphere.description = "Personal sphere"
    sphere.icon = "home"
    sphere.color = "#4A90D9"
    sphere.display_order = 0
    sphere.is_active = True
    sphere.settings = {}
    sphere.metadata = {}
    sphere.thread_count = 0
    sphere.active_thread_count = 0
    sphere.created_at = datetime.utcnow()
    sphere.updated_at = datetime.utcnow()
    return sphere


@pytest.fixture
def all_sphere_types() -> list:
    """List of all 9 CHE·NU sphere types."""
    return [
        "personal",
        "business", 
        "government",
        "creative_studio",
        "community",
        "social_media",
        "entertainment",
        "my_team",
        "scholar"
    ]


# ============================================================================
# THREAD FIXTURES
# ============================================================================

@pytest.fixture
def thread_id() -> str:
    """Generate a unique thread ID."""
    return str(uuid4())


@pytest.fixture
def mock_thread(thread_id: str, user_id: str, sphere_id: str) -> MagicMock:
    """Create a mock thread object."""
    thread = MagicMock()
    thread.id = uuid4()
    thread.identity_id = uuid4()
    thread.sphere_id = uuid4()
    thread.parent_thread_id = None
    thread.founding_intent = "Test thread founding intent - IMMUTABLE"
    thread.title = "Test Thread"
    thread.current_intent = "Test thread current intent"
    thread.thread_type = "personal"
    thread.status = "active"
    thread.visibility = "private"
    thread.tags = ["test"]
    thread.metadata = {}
    thread.event_count = 0
    thread.decision_count = 0
    thread.action_count = 0
    thread.pending_action_count = 0
    thread.created_at = datetime.utcnow()
    thread.updated_at = datetime.utcnow()
    thread.created_by = uuid4()
    return thread


@pytest.fixture
def mock_thread_event(thread_id: str, user_id: str) -> MagicMock:
    """Create a mock thread event object."""
    event = MagicMock()
    event.id = uuid4()
    event.thread_id = uuid4()
    event.sequence_number = 1
    event.parent_event_id = None
    event.event_type = "thread.created"
    event.payload = {"action": "created"}
    event.summary = "Thread created"
    event.source = "user"
    event.agent_id = None
    event.created_at = datetime.utcnow()
    event.created_by = uuid4()
    return event


# ============================================================================
# CHECKPOINT FIXTURES
# ============================================================================

@pytest.fixture
def checkpoint_id() -> str:
    """Generate a unique checkpoint ID."""
    return str(uuid4())


@pytest.fixture
def mock_checkpoint(checkpoint_id: str, user_id: str, thread_id: str) -> MagicMock:
    """Create a mock governance checkpoint."""
    checkpoint = MagicMock()
    checkpoint.id = uuid4()
    checkpoint.identity_id = uuid4()
    checkpoint.thread_id = uuid4()
    checkpoint.checkpoint_type = "sensitive"
    checkpoint.reason = "Action requires approval"
    checkpoint.action_data = {"action": "delete", "target_id": str(uuid4())}
    checkpoint.options = ["approve", "reject"]
    checkpoint.status = "pending"
    checkpoint.resolution = None
    checkpoint.resolution_reason = None
    checkpoint.resolved_at = None
    checkpoint.resolved_by = None
    checkpoint.expires_at = datetime.utcnow() + timedelta(hours=24)
    checkpoint.metadata = {}
    checkpoint.created_at = datetime.utcnow()
    return checkpoint


# ============================================================================
# REQUEST FIXTURES (for API tests)
# ============================================================================

@pytest.fixture
def mock_request() -> MagicMock:
    """Create a mock FastAPI request object."""
    request = MagicMock()
    request.client = MagicMock()
    request.client.host = "127.0.0.1"
    request.headers = {
        "user-agent": "pytest-test-agent/1.0",
        "authorization": "Bearer mock_token"
    }
    request.state = MagicMock()
    return request


# ============================================================================
# TOKEN FIXTURES
# ============================================================================

@pytest.fixture
def valid_access_token() -> str:
    """Generate a mock valid access token."""
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_valid_token"


@pytest.fixture
def expired_access_token() -> str:
    """Generate a mock expired access token."""
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_expired_token"


@pytest.fixture
def valid_refresh_token() -> str:
    """Generate a mock valid refresh token."""
    return "mock_refresh_token_" + str(uuid4())


# ============================================================================
# DATETIME FIXTURES
# ============================================================================

@pytest.fixture
def now() -> datetime:
    """Current datetime for tests."""
    return datetime.utcnow()


@pytest.fixture
def yesterday(now: datetime) -> datetime:
    """Yesterday's datetime."""
    return now - timedelta(days=1)


@pytest.fixture
def tomorrow(now: datetime) -> datetime:
    """Tomorrow's datetime."""
    return now + timedelta(days=1)


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def create_mock_result(items: list) -> MagicMock:
    """Create a mock SQLAlchemy result with scalars."""
    result = MagicMock()
    result.scalars.return_value.all.return_value = items
    result.scalars.return_value.first.return_value = items[0] if items else None
    result.scalar_one_or_none.return_value = items[0] if items else None
    result.scalar.return_value = len(items)
    return result


def create_mock_scalar_result(value) -> MagicMock:
    """Create a mock SQLAlchemy result with a scalar value."""
    result = MagicMock()
    result.scalar_one_or_none.return_value = value
    result.scalar.return_value = value
    return result


# ============================================================================
# ASYNC HELPERS
# ============================================================================

@pytest.fixture
def async_return():
    """Helper to create async return values."""
    def _async_return(value):
        async def _inner(*args, **kwargs):
            return value
        return _inner
    return _async_return


# ============================================================================
# VALIDATION HELPERS
# ============================================================================

@pytest.fixture
def assert_identity_boundary():
    """Helper to assert identity boundary is enforced."""
    def _assert(response_identity_id: str, expected_identity_id: str):
        assert response_identity_id == expected_identity_id, \
            f"Identity boundary violation: expected {expected_identity_id}, got {response_identity_id}"
    return _assert


@pytest.fixture  
def assert_traceability():
    """Helper to assert traceability fields are present."""
    def _assert(obj: dict):
        assert "id" in obj, "Missing 'id' field for traceability"
        assert "created_at" in obj, "Missing 'created_at' field for traceability"
        if "created_by" in obj:
            assert obj["created_by"] is not None, "'created_by' should not be None"
    return _assert


@pytest.fixture
def assert_immutable():
    """Helper to assert a field is immutable."""
    def _assert(original_value, new_value, field_name: str = "field"):
        assert original_value == new_value, \
            f"Immutability violation: {field_name} changed from {original_value} to {new_value}"
    return _assert


# ============================================================================
# R&D COMPLIANCE MARKERS
# ============================================================================

# Custom pytest markers for R&D compliance categories
pytest.mark.human_sovereignty = pytest.mark.human_sovereignty
pytest.mark.identity_boundary = pytest.mark.identity_boundary
pytest.mark.append_only = pytest.mark.append_only
pytest.mark.traceability = pytest.mark.traceability
pytest.mark.checkpoint = pytest.mark.checkpoint
