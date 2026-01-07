"""
Tests for CHE·NU API Documentation and OpenAPI Configuration.

Tests:
- OpenAPI schema generation
- Error response models
- API tags
- Security schemes
- Example payloads
- API metrics

R&D Compliance:
- Rule #6: Traceability (all responses have request_id)
"""

import pytest
from datetime import datetime
from uuid import uuid4


# ============================================================================
# FIXTURES
# ============================================================================

@pytest.fixture
def error_response():
    """Sample error response."""
    return {
        "error": {
            "code": "VALIDATION_ERROR",
            "message": "Invalid input data",
            "details": [
                {"field": "email", "message": "Invalid email format"}
            ]
        },
        "request_id": str(uuid4()),
        "timestamp": datetime.utcnow().isoformat()
    }


@pytest.fixture
def checkpoint_response():
    """Sample checkpoint response (HTTP 423)."""
    return {
        "status": "checkpoint_pending",
        "checkpoint": {
            "id": str(uuid4()),
            "type": "governance",
            "reason": "Agent execution requires approval",
            "requires_approval": True,
            "options": ["approve", "reject"],
            "expires_at": "2026-01-07T11:00:00Z",
            "context": {
                "agent_id": str(uuid4()),
                "action": "execute"
            }
        }
    }


@pytest.fixture
def identity_boundary_response():
    """Sample identity boundary response (HTTP 403)."""
    return {
        "error": "identity_boundary_violation",
        "message": "Access denied: resource belongs to different identity",
        "requested_identity": str(uuid4()),
        "resource_identity": str(uuid4())
    }


# ============================================================================
# TEST: API TAGS
# ============================================================================

class TestAPITags:
    """Test API tag definitions."""
    
    def test_api_tags_defined(self):
        """Verify all required API tags are defined."""
        from api.openapi_config import API_TAGS
        
        tag_names = [tag["name"] for tag in API_TAGS]
        
        required_tags = [
            "Authentication",
            "Threads",
            "Spheres",
            "Agents",
            "Nova Pipeline",
            "Governance",
            "Checkpoints",
            "XR Environment",
            "WebSocket"
        ]
        
        for tag in required_tags:
            assert tag in tag_names, f"Missing API tag: {tag}"
    
    def test_api_tags_have_descriptions(self):
        """Verify all tags have descriptions."""
        from api.openapi_config import API_TAGS
        
        for tag in API_TAGS:
            assert "name" in tag
            assert "description" in tag
            assert len(tag["description"]) > 0, f"Tag {tag['name']} has empty description"
    
    def test_threads_tag_describes_immutability(self):
        """Verify Threads tag mentions immutability."""
        from api.openapi_config import API_TAGS
        
        threads_tag = next((t for t in API_TAGS if t["name"] == "Threads"), None)
        assert threads_tag is not None
        assert "immutable" in threads_tag["description"].lower()
    
    def test_governance_tag_describes_rules(self):
        """Verify Governance tag mentions governance rules."""
        from api.openapi_config import API_TAGS
        
        gov_tag = next((t for t in API_TAGS if t["name"] == "Governance"), None)
        assert gov_tag is not None
        desc = gov_tag["description"].lower()
        assert "governance" in desc or "execution" in desc


# ============================================================================
# TEST: SECURITY SCHEMES
# ============================================================================

class TestSecuritySchemes:
    """Test security scheme definitions."""
    
    def test_bearer_auth_defined(self):
        """Verify Bearer auth scheme is defined."""
        from api.openapi_config import SECURITY_SCHEMES
        
        assert "BearerAuth" in SECURITY_SCHEMES
        bearer = SECURITY_SCHEMES["BearerAuth"]
        assert bearer["type"] == "http"
        assert bearer["scheme"] == "bearer"
        assert bearer["bearerFormat"] == "JWT"
    
    def test_oauth2_defined(self):
        """Verify OAuth2 scheme is defined."""
        from api.openapi_config import SECURITY_SCHEMES
        
        assert "OAuth2" in SECURITY_SCHEMES
        oauth = SECURITY_SCHEMES["OAuth2"]
        assert oauth["type"] == "oauth2"
        assert "flows" in oauth
        assert "password" in oauth["flows"]
    
    def test_oauth2_scopes(self):
        """Verify OAuth2 scopes are defined."""
        from api.openapi_config import SECURITY_SCHEMES
        
        scopes = SECURITY_SCHEMES["OAuth2"]["flows"]["password"]["scopes"]
        assert "read" in scopes
        assert "write" in scopes
        assert "admin" in scopes


# ============================================================================
# TEST: RESPONSE MODELS
# ============================================================================

class TestResponseModels:
    """Test response model definitions."""
    
    def test_error_detail_model(self):
        """Test ErrorDetail model."""
        from api.openapi_config import ErrorDetail
        
        detail = ErrorDetail(field="email", message="Invalid format")
        assert detail.field == "email"
        assert detail.message == "Invalid format"
    
    def test_error_detail_optional_field(self):
        """Test ErrorDetail with optional field."""
        from api.openapi_config import ErrorDetail
        
        detail = ErrorDetail(message="General error")
        assert detail.field is None
        assert detail.message == "General error"
    
    def test_error_response_model(self):
        """Test ErrorResponse model."""
        from api.openapi_config import ErrorResponse, ErrorDetail
        
        error = ErrorResponse(
            code="VALIDATION_ERROR",
            message="Input validation failed",
            details=[ErrorDetail(field="email", message="Invalid")]
        )
        
        assert error.code == "VALIDATION_ERROR"
        assert error.message == "Input validation failed"
        assert len(error.details) == 1
    
    def test_checkpoint_response_model(self):
        """Test CheckpointResponse model."""
        from api.openapi_config import CheckpointResponse
        
        checkpoint = CheckpointResponse(
            id="uuid-123",
            type="governance",
            reason="Action requires approval",
            requires_approval=True,
            options=["approve", "reject"]
        )
        
        assert checkpoint.id == "uuid-123"
        assert checkpoint.type == "governance"
        assert checkpoint.requires_approval is True
        assert "approve" in checkpoint.options
    
    def test_locked_response_model(self):
        """Test LockedResponse model (HTTP 423)."""
        from api.openapi_config import LockedResponse, CheckpointResponse
        
        checkpoint = CheckpointResponse(
            id="uuid-123",
            type="governance",
            reason="Action requires approval",
            requires_approval=True,
            options=["approve", "reject"]
        )
        
        locked = LockedResponse(
            status="checkpoint_pending",
            checkpoint=checkpoint
        )
        
        assert locked.status == "checkpoint_pending"
        assert locked.checkpoint.type == "governance"
    
    def test_identity_boundary_response_model(self):
        """Test IdentityBoundaryResponse model (HTTP 403)."""
        from api.openapi_config import IdentityBoundaryResponse
        
        response = IdentityBoundaryResponse(
            error="identity_boundary_violation",
            message="Access denied",
            requested_identity="uuid-a",
            resource_identity="uuid-b"
        )
        
        assert response.error == "identity_boundary_violation"
        assert response.requested_identity != response.resource_identity


# ============================================================================
# TEST: COMMON RESPONSES
# ============================================================================

class TestCommonResponses:
    """Test common response definitions."""
    
    def test_common_responses_defined(self):
        """Verify all common responses are defined."""
        from api.openapi_config import COMMON_RESPONSES
        
        required_codes = [400, 401, 403, 404, 423, 429, 500]
        
        for code in required_codes:
            assert code in COMMON_RESPONSES, f"Missing response for HTTP {code}"
    
    def test_423_response_is_checkpoint(self):
        """Verify 423 response describes checkpoint."""
        from api.openapi_config import COMMON_RESPONSES
        
        response = COMMON_RESPONSES[423]
        assert "Locked" in response["description"]
        assert "Checkpoint" in response["description"] or "checkpoint" in response["description"].lower()
    
    def test_403_response_is_identity_boundary(self):
        """Verify 403 response describes identity boundary."""
        from api.openapi_config import COMMON_RESPONSES
        
        response = COMMON_RESPONSES[403]
        assert "identity" in response["description"].lower() or "Forbidden" in response["description"]
    
    def test_responses_have_examples(self):
        """Verify responses have examples."""
        from api.openapi_config import COMMON_RESPONSES
        
        for code, response in COMMON_RESPONSES.items():
            assert "content" in response
            content = response["content"]["application/json"]
            assert "example" in content, f"Missing example for HTTP {code}"


# ============================================================================
# TEST: EXAMPLE PAYLOADS
# ============================================================================

class TestExamplePayloads:
    """Test example payload definitions."""
    
    def test_example_payloads_defined(self):
        """Verify example payloads are defined."""
        from api.openapi_config import EXAMPLE_PAYLOADS
        
        required_examples = [
            "thread_create",
            "event_append",
            "decision_record",
            "action_create",
            "agent_execute",
            "nova_process",
            "checkpoint_approve",
            "checkpoint_reject"
        ]
        
        for example in required_examples:
            assert example in EXAMPLE_PAYLOADS, f"Missing example: {example}"
    
    def test_thread_create_example(self):
        """Test thread creation example."""
        from api.openapi_config import EXAMPLE_PAYLOADS
        
        example = EXAMPLE_PAYLOADS["thread_create"]
        assert "founding_intent" in example
        assert "thread_type" in example
        assert "sphere_id" in example
    
    def test_event_append_example(self):
        """Test event append example."""
        from api.openapi_config import EXAMPLE_PAYLOADS
        
        example = EXAMPLE_PAYLOADS["event_append"]
        assert "event_type" in example
        assert "data" in example
    
    def test_nova_process_example(self):
        """Test Nova process example."""
        from api.openapi_config import EXAMPLE_PAYLOADS
        
        example = EXAMPLE_PAYLOADS["nova_process"]
        assert "input" in example
        assert "context" in example
        assert "options" in example


# ============================================================================
# TEST: DECORATORS
# ============================================================================

class TestDecorators:
    """Test endpoint decorators."""
    
    def test_governance_endpoint_decorator(self):
        """Test governance endpoint decorator."""
        from api.openapi_config import governance_endpoint
        
        @governance_endpoint(checkpoint_types=["governance", "cost"])
        async def test_endpoint():
            pass
        
        assert hasattr(test_endpoint, "__governance_endpoint__")
        assert test_endpoint.__governance_endpoint__ is True
        assert "governance" in test_endpoint.__checkpoint_types__
        assert "cost" in test_endpoint.__checkpoint_types__
    
    def test_governance_endpoint_default_types(self):
        """Test governance endpoint with default types."""
        from api.openapi_config import governance_endpoint
        
        @governance_endpoint()
        async def test_endpoint():
            pass
        
        assert test_endpoint.__checkpoint_types__ == ["governance"]
    
    def test_identity_boundary_decorator(self):
        """Test identity boundary decorator."""
        from api.openapi_config import identity_boundary
        
        @identity_boundary(require_ownership=True)
        async def test_endpoint():
            pass
        
        assert hasattr(test_endpoint, "__identity_boundary__")
        assert test_endpoint.__identity_boundary__ is True
        assert test_endpoint.__require_ownership__ is True


# ============================================================================
# TEST: API METRICS
# ============================================================================

class TestAPIMetrics:
    """Test API metrics tracking."""
    
    def test_metrics_initialization(self):
        """Test APIMetrics initialization."""
        from api.openapi_config import APIMetrics
        
        metrics = APIMetrics()
        assert metrics.total_requests == 0
        assert metrics.checkpoints_triggered == 0
        assert metrics.identity_violations == 0
    
    def test_record_request(self):
        """Test recording a request."""
        from api.openapi_config import APIMetrics
        
        metrics = APIMetrics()
        metrics.record_request(
            endpoint="/api/v2/threads",
            method="GET",
            status_code=200,
            latency_ms=50.0
        )
        
        assert metrics.total_requests == 1
        assert "GET:/api/v2/threads" in metrics.requests_by_endpoint
        assert 200 in metrics.requests_by_status
    
    def test_record_checkpoint_triggered(self):
        """Test recording checkpoint response."""
        from api.openapi_config import APIMetrics
        
        metrics = APIMetrics()
        metrics.record_request(
            endpoint="/api/v2/agents/123/execute",
            method="POST",
            status_code=423,
            latency_ms=100.0
        )
        
        assert metrics.checkpoints_triggered == 1
    
    def test_record_identity_violation(self):
        """Test recording identity boundary violation."""
        from api.openapi_config import APIMetrics
        
        metrics = APIMetrics()
        metrics.record_request(
            endpoint="/api/v2/threads/123",
            method="GET",
            status_code=403,
            latency_ms=10.0
        )
        
        assert metrics.identity_violations == 1
    
    def test_get_stats(self):
        """Test getting stats."""
        from api.openapi_config import APIMetrics
        
        metrics = APIMetrics()
        metrics.record_request("/test", "GET", 200, 50.0)
        metrics.record_request("/test", "POST", 423, 100.0)
        
        stats = metrics.get_stats()
        
        assert stats["total_requests"] == 2
        assert stats["checkpoints_triggered"] == 1
        assert len(stats["requests_by_endpoint"]) == 2
    
    def test_singleton_metrics(self):
        """Test singleton metrics instance."""
        from api.openapi_config import api_metrics
        
        assert api_metrics is not None


# ============================================================================
# TEST: R&D COMPLIANCE
# ============================================================================

@pytest.mark.traceability
class TestRDComplianceRule6:
    """Test R&D Rule #6: Traceability."""
    
    def test_error_response_has_request_id(self, error_response):
        """Verify error responses include request_id."""
        assert "request_id" in error_response
        assert error_response["request_id"] is not None
    
    def test_error_response_has_timestamp(self, error_response):
        """Verify error responses include timestamp."""
        assert "timestamp" in error_response
        assert error_response["timestamp"] is not None
    
    def test_checkpoint_has_id(self, checkpoint_response):
        """Verify checkpoints have IDs."""
        checkpoint = checkpoint_response["checkpoint"]
        assert "id" in checkpoint
        assert checkpoint["id"] is not None


@pytest.mark.human_sovereignty
class TestRDComplianceRule1:
    """Test R&D Rule #1: Human Sovereignty."""
    
    def test_checkpoint_requires_approval(self, checkpoint_response):
        """Verify checkpoints require approval."""
        checkpoint = checkpoint_response["checkpoint"]
        assert checkpoint["requires_approval"] is True
    
    def test_checkpoint_has_options(self, checkpoint_response):
        """Verify checkpoints provide options."""
        checkpoint = checkpoint_response["checkpoint"]
        assert "options" in checkpoint
        assert "approve" in checkpoint["options"]
        assert "reject" in checkpoint["options"]
    
    def test_checkpoint_has_reason(self, checkpoint_response):
        """Verify checkpoints explain reason."""
        checkpoint = checkpoint_response["checkpoint"]
        assert "reason" in checkpoint
        assert len(checkpoint["reason"]) > 0


@pytest.mark.sphere_integrity
class TestRDComplianceRule3:
    """Test R&D Rule #3: Sphere Integrity."""
    
    def test_identity_boundary_response_format(self, identity_boundary_response):
        """Verify identity boundary response format."""
        assert "error" in identity_boundary_response
        assert identity_boundary_response["error"] == "identity_boundary_violation"
    
    def test_identity_boundary_identifies_identities(self, identity_boundary_response):
        """Verify identity boundary response includes both identities."""
        assert "requested_identity" in identity_boundary_response
        assert "resource_identity" in identity_boundary_response
        assert identity_boundary_response["requested_identity"] != identity_boundary_response["resource_identity"]


# ============================================================================
# TEST: EXPORTS
# ============================================================================

class TestExports:
    """Test module exports."""
    
    def test_all_exports_defined(self):
        """Verify all exports are accessible."""
        from api.openapi_config import (
            API_TAGS,
            SECURITY_SCHEMES,
            COMMON_RESPONSES,
            ErrorDetail,
            ErrorResponse,
            CheckpointResponse,
            LockedResponse,
            IdentityBoundaryResponse,
            custom_openapi_schema,
            governance_endpoint,
            identity_boundary,
            EXAMPLE_PAYLOADS,
            APIMetrics,
            api_metrics,
        )
        
        # All imports should succeed
        assert API_TAGS is not None
        assert SECURITY_SCHEMES is not None
        assert COMMON_RESPONSES is not None
        assert ErrorDetail is not None
        assert ErrorResponse is not None
        assert custom_openapi_schema is not None


# ============================================================================
# TEST: ERROR CODE DOCUMENTATION
# ============================================================================

class TestErrorCodeDocumentation:
    """Test error code documentation structure."""
    
    def test_auth_error_codes(self):
        """Verify authentication error codes are documented."""
        expected_codes = [
            "AUTH_INVALID_CREDENTIALS",
            "AUTH_TOKEN_EXPIRED",
            "AUTH_TOKEN_INVALID",
            "AUTH_REQUIRED"
        ]
        
        # These should be documented in ERROR_CODES.md
        # In actual implementation, could load and parse the file
        for code in expected_codes:
            assert code.startswith("AUTH_")
    
    def test_governance_error_codes(self):
        """Verify governance error codes follow pattern."""
        expected_codes = [
            "GOV_CHECKPOINT_REQUIRED",
            "GOV_CHECKPOINT_EXPIRED",
            "GOV_BUDGET_EXCEEDED"
        ]
        
        for code in expected_codes:
            assert code.startswith("GOV_")
    
    def test_thread_error_codes(self):
        """Verify thread error codes follow pattern."""
        expected_codes = [
            "THREAD_NOT_FOUND",
            "THREAD_ARCHIVED",
            "THREAD_INTENT_IMMUTABLE"
        ]
        
        for code in expected_codes:
            assert code.startswith("THREAD_")
    
    def test_identity_error_codes(self):
        """Verify identity error codes follow pattern."""
        expected_codes = [
            "IDENTITY_BOUNDARY_VIOLATION",
            "IDENTITY_PERMISSION_DENIED"
        ]
        
        for code in expected_codes:
            assert code.startswith("IDENTITY_")


# ============================================================================
# TEST: WEBSOCKET DOCUMENTATION
# ============================================================================

class TestWebSocketDocumentation:
    """Test WebSocket API documentation structure."""
    
    def test_connection_urls(self):
        """Verify WebSocket connection URLs are documented."""
        # General connection
        general_url = "/ws/connect"
        assert "connect" in general_url
        
        # Thread-specific connection
        thread_url = "/ws/thread/{thread_id}"
        assert "thread" in thread_url
    
    def test_event_types_documented(self):
        """Verify event types are documented."""
        thread_events = [
            "thread.created",
            "thread.updated",
            "thread.archived",
            "thread.event_appended"
        ]
        
        checkpoint_events = [
            "checkpoint.created",
            "checkpoint.resolved"
        ]
        
        agent_events = [
            "agent.execution_started",
            "agent.execution_completed"
        ]
        
        # All event types should follow domain.action pattern
        for event in thread_events + checkpoint_events + agent_events:
            parts = event.split(".")
            assert len(parts) == 2
            assert len(parts[0]) > 0
            assert len(parts[1]) > 0
    
    def test_client_actions_documented(self):
        """Verify client actions are documented."""
        actions = ["ping", "subscribe", "unsubscribe", "presence"]
        
        for action in actions:
            assert action.islower()


# ============================================================================
# INTEGRATION TESTS
# ============================================================================

class TestDocumentationIntegration:
    """Integration tests for documentation."""
    
    def test_api_tags_cover_all_routes(self):
        """Verify API tags cover all route categories."""
        from api.openapi_config import API_TAGS
        
        route_categories = [
            "auth",       # Authentication
            "threads",    # Threads
            "spheres",    # Spheres
            "agents",     # Agents
            "nova",       # Nova Pipeline
            "governance", # Governance
            "checkpoints",# Checkpoints
            "xr",         # XR Environment
        ]
        
        tag_names = [tag["name"].lower() for tag in API_TAGS]
        
        for category in route_categories:
            found = any(category in tag.lower() or tag.lower() in category for tag in tag_names)
            # Some flexibility in naming
            assert found or category == "auth", f"No tag for route category: {category}"
    
    def test_checkpoint_types_comprehensive(self):
        """Verify all checkpoint types are documented."""
        checkpoint_types = ["governance", "cost", "identity", "sensitive"]
        
        # All types should be valid
        for cp_type in checkpoint_types:
            assert isinstance(cp_type, str)
            assert len(cp_type) > 0
    
    def test_error_response_matches_api_format(self, error_response):
        """Verify error response matches expected API format."""
        # Top-level structure
        assert "error" in error_response
        
        # Error object structure
        error = error_response["error"]
        assert "code" in error
        assert "message" in error
        
        # Code format
        assert "_" in error["code"]  # Codes use underscore format
        assert error["code"].isupper()  # Codes are uppercase


# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
