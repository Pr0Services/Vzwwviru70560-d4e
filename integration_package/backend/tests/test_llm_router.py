"""
TEST LLM ROUTER
===============

Comprehensive tests for the LLM Router system.

Tests cover:
- Model selection and routing strategies
- Provider registration and configuration
- Budget management
- Rate limiting
- Fallback handling
- R&D compliance

VERSION: 1.0.0
"""

import pytest
from uuid import uuid4
from datetime import datetime, timedelta
from decimal import Decimal
from unittest.mock import AsyncMock, patch

from backend.services.llm.llm_router import (
    LLMRouter,
    LLMProvider,
    TaskType,
    RoutingStrategy,
    LLMRequest,
    LLMResponse,
    TokenBudget,
    ProviderConfig,
    ModelSpec,
    MODEL_REGISTRY,
    TASK_PROVIDER_RECOMMENDATIONS,
    LLMRouterError,
    BudgetExceededError,
    RateLimitExceededError,
    ModelNotFoundError,
    ProviderNotAvailableError,
    get_llm_router
)


# =============================================================================
# FIXTURES
# =============================================================================

@pytest.fixture
def router():
    """Fresh router instance"""
    return LLMRouter()


@pytest.fixture
def configured_router():
    """Router with providers configured"""
    router = LLMRouter()
    
    # Register providers
    router.register_provider(ProviderConfig(
        provider=LLMProvider.ANTHROPIC,
        api_key="test-key",
        models=["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022"],
        is_available=True,
        priority=1,
        cost_per_1k_input=Decimal("0.003"),
        cost_per_1k_output=Decimal("0.015"),
        supports_vision=True,
        supports_function_calling=True,
        max_context_length=200000
    ))
    
    router.register_provider(ProviderConfig(
        provider=LLMProvider.OPENAI,
        api_key="test-key",
        models=["gpt-4o", "gpt-4o-mini"],
        is_available=True,
        priority=2,
        cost_per_1k_input=Decimal("0.0025"),
        cost_per_1k_output=Decimal("0.01"),
        supports_vision=True,
        supports_function_calling=True,
        max_context_length=128000
    ))
    
    router.register_provider(ProviderConfig(
        provider=LLMProvider.GROQ,
        api_key="test-key",
        models=["llama-3.3-70b-versatile"],
        is_available=True,
        priority=3,
        cost_per_1k_input=Decimal("0.0"),
        cost_per_1k_output=Decimal("0.0"),
        supports_vision=False,
        supports_function_calling=True,
        max_context_length=128000
    ))
    
    return router


@pytest.fixture
def identity_id():
    """Test identity ID"""
    return str(uuid4())


@pytest.fixture
def thread_id():
    """Test thread ID"""
    return str(uuid4())


@pytest.fixture
def basic_request(identity_id):
    """Basic LLM request"""
    return LLMRequest(
        messages=[{"role": "user", "content": "Hello, how are you?"}],
        task_type=TaskType.CHAT,
        identity_id=identity_id
    )


@pytest.fixture
def analysis_request(identity_id, thread_id):
    """Analysis task request"""
    return LLMRequest(
        messages=[{"role": "user", "content": "Analyze this data..."}],
        task_type=TaskType.ANALYSIS,
        identity_id=identity_id,
        thread_id=thread_id,
        strategy=RoutingStrategy.QUALITY_OPTIMIZED
    )


@pytest.fixture
def vision_request(identity_id):
    """Request requiring vision"""
    return LLMRequest(
        messages=[{"role": "user", "content": "What's in this image?"}],
        task_type=TaskType.VISION,
        identity_id=identity_id,
        requires_vision=True
    )


# =============================================================================
# PROVIDER TESTS
# =============================================================================

class TestProviderRegistration:
    """Test provider registration and configuration"""
    
    def test_register_provider(self, router):
        """Test provider registration"""
        config = ProviderConfig(
            provider=LLMProvider.ANTHROPIC,
            api_key="test-key",
            is_available=True
        )
        
        router.register_provider(config)
        
        retrieved = router.get_provider(LLMProvider.ANTHROPIC)
        assert retrieved is not None
        assert retrieved.provider == LLMProvider.ANTHROPIC
    
    def test_register_multiple_providers(self, router):
        """Test registering multiple providers"""
        providers = [LLMProvider.ANTHROPIC, LLMProvider.OPENAI, LLMProvider.MISTRAL]
        
        for provider in providers:
            router.register_provider(ProviderConfig(
                provider=provider,
                api_key="test-key"
            ))
        
        for provider in providers:
            assert router.get_provider(provider) is not None
    
    def test_provider_not_found(self, router):
        """Test getting non-existent provider"""
        result = router.get_provider(LLMProvider.OLLAMA)
        assert result is None
    
    def test_provider_availability(self, configured_router):
        """Test provider availability check"""
        # Anthropic should be available
        assert configured_router._is_provider_available(LLMProvider.ANTHROPIC)
        
        # Unconfigured provider should not be available
        assert not configured_router._is_provider_available(LLMProvider.COHERE)
    
    def test_provider_unavailable_after_failures(self, configured_router):
        """Test provider becomes unavailable after consecutive failures"""
        provider_config = configured_router.get_provider(LLMProvider.ANTHROPIC)
        provider_config.consecutive_failures = 5
        provider_config.last_failure = datetime.utcnow()
        
        # Should be unavailable due to failures
        assert not configured_router._is_provider_available(LLMProvider.ANTHROPIC)


# =============================================================================
# MODEL SELECTION TESTS
# =============================================================================

class TestModelSelection:
    """Test model selection and routing"""
    
    def test_select_specific_model(self, configured_router, identity_id):
        """Test selecting a specific model"""
        request = LLMRequest(
            messages=[{"role": "user", "content": "Test"}],
            identity_id=identity_id,
            preferred_model="claude-3-5-sonnet-20241022"
        )
        
        model_id, provider = configured_router.select_model(request)
        
        assert model_id == "claude-3-5-sonnet-20241022"
        assert provider == LLMProvider.ANTHROPIC
    
    def test_select_specific_provider(self, configured_router, identity_id):
        """Test selecting from specific provider"""
        request = LLMRequest(
            messages=[{"role": "user", "content": "Test"}],
            identity_id=identity_id,
            preferred_provider=LLMProvider.OPENAI
        )
        
        model_id, provider = configured_router.select_model(request)
        
        assert provider == LLMProvider.OPENAI
        assert "gpt" in model_id
    
    def test_cost_optimized_routing(self, configured_router, identity_id):
        """Test cost-optimized routing selects cheapest"""
        request = LLMRequest(
            messages=[{"role": "user", "content": "Test"}],
            identity_id=identity_id,
            strategy=RoutingStrategy.COST_OPTIMIZED
        )
        
        model_id, provider = configured_router.select_model(request)
        
        # Groq is free, should be selected
        # Or fallback to cheapest available
        model_spec = MODEL_REGISTRY.get(model_id)
        assert model_spec is not None
    
    def test_quality_optimized_routing(self, configured_router, identity_id):
        """Test quality-optimized routing selects best"""
        request = LLMRequest(
            messages=[{"role": "user", "content": "Test"}],
            identity_id=identity_id,
            strategy=RoutingStrategy.QUALITY_OPTIMIZED,
            task_type=TaskType.REASONING
        )
        
        model_id, provider = configured_router.select_model(request)
        
        model_spec = MODEL_REGISTRY.get(model_id)
        assert model_spec is not None
        # Should select high-quality model
        assert model_spec.quality_score >= 90
    
    def test_speed_optimized_routing(self, configured_router, identity_id):
        """Test speed-optimized routing selects fastest"""
        request = LLMRequest(
            messages=[{"role": "user", "content": "Test"}],
            identity_id=identity_id,
            strategy=RoutingStrategy.SPEED_OPTIMIZED
        )
        
        model_id, provider = configured_router.select_model(request)
        
        model_spec = MODEL_REGISTRY.get(model_id)
        assert model_spec is not None
    
    def test_balanced_routing(self, configured_router, identity_id):
        """Test balanced routing"""
        request = LLMRequest(
            messages=[{"role": "user", "content": "Test"}],
            identity_id=identity_id,
            strategy=RoutingStrategy.BALANCED
        )
        
        model_id, provider = configured_router.select_model(request)
        
        assert model_id is not None
        assert provider is not None
    
    def test_vision_requirement_filtering(self, configured_router, vision_request):
        """Test that vision-required requests get vision-capable models"""
        model_id, provider = configured_router.select_model(vision_request)
        
        model_spec = MODEL_REGISTRY.get(model_id)
        assert model_spec is not None
        assert model_spec.supports_vision is True
    
    def test_function_calling_requirement(self, configured_router, identity_id):
        """Test function calling requirement filtering"""
        request = LLMRequest(
            messages=[{"role": "user", "content": "Test"}],
            identity_id=identity_id,
            requires_function_calling=True
        )
        
        model_id, provider = configured_router.select_model(request)
        
        model_spec = MODEL_REGISTRY.get(model_id)
        assert model_spec is not None
        assert model_spec.supports_function_calling is True


# =============================================================================
# EXECUTION TESTS
# =============================================================================

class TestExecution:
    """Test LLM completion execution"""
    
    @pytest.mark.asyncio
    async def test_basic_completion(self, configured_router, basic_request):
        """Test basic completion"""
        response = await configured_router.complete(basic_request)
        
        assert response is not None
        assert response.request_id == basic_request.request_id
        assert response.content is not None
        assert response.provider is not None
        assert response.model is not None
    
    @pytest.mark.asyncio
    async def test_completion_tracks_tokens(self, configured_router, basic_request):
        """Test that completion tracks token usage"""
        response = await configured_router.complete(basic_request)
        
        assert response.input_tokens > 0
        assert response.output_tokens > 0
        assert response.total_tokens == response.input_tokens + response.output_tokens
    
    @pytest.mark.asyncio
    async def test_completion_tracks_cost(self, configured_router, basic_request):
        """Test that completion tracks cost"""
        response = await configured_router.complete(basic_request)
        
        assert response.cost_usd >= Decimal("0")
    
    @pytest.mark.asyncio
    async def test_completion_records_latency(self, configured_router, basic_request):
        """Test that completion records latency"""
        response = await configured_router.complete(basic_request)
        
        assert response.latency_ms > 0
    
    @pytest.mark.asyncio
    async def test_completion_updates_stats(self, configured_router, basic_request):
        """Test that completion updates global stats"""
        initial_requests = configured_router.get_stats()["total_requests"]
        
        await configured_router.complete(basic_request)
        
        final_requests = configured_router.get_stats()["total_requests"]
        assert final_requests == initial_requests + 1


class TestFallback:
    """Test fallback handling"""
    
    @pytest.mark.asyncio
    async def test_fallback_on_provider_failure(self, configured_router, basic_request):
        """Test fallback when primary provider fails"""
        # Mark primary provider as unavailable
        anthropic_config = configured_router.get_provider(LLMProvider.ANTHROPIC)
        anthropic_config.consecutive_failures = 10
        anthropic_config.last_failure = datetime.utcnow()
        
        # Should still complete using fallback
        response = await configured_router.complete(basic_request)
        
        assert response is not None
        # Should use OpenAI or another fallback
        assert response.provider != LLMProvider.ANTHROPIC
    
    def test_get_fallback_provider(self, configured_router, basic_request):
        """Test getting fallback provider"""
        fallback = configured_router._get_fallback_provider(
            basic_request,
            exclude={LLMProvider.ANTHROPIC}
        )
        
        assert fallback is not None
        model_id, provider = fallback
        assert provider != LLMProvider.ANTHROPIC


# =============================================================================
# BUDGET TESTS
# =============================================================================

class TestBudgetManagement:
    """Test token budget management"""
    
    def test_check_budget_creates_default(self, configured_router, identity_id):
        """Test that checking budget creates default if not exists"""
        result = configured_router._check_budget(identity_id, None)
        
        assert result is True
        budget = configured_router.get_budget(identity_id)
        assert budget is not None
    
    def test_budget_limits_enforced(self, configured_router, identity_id):
        """Test that budget limits are enforced"""
        # Set a budget
        configured_router.set_budget_limits(
            identity_id=identity_id,
            daily_limit=100,
            monthly_limit=1000
        )
        
        budget = configured_router.get_budget(identity_id)
        budget.daily_used = 200  # Exceed limit
        
        result = configured_router._check_budget(identity_id, None)
        assert result is False
    
    def test_budget_cost_limits_enforced(self, configured_router, identity_id):
        """Test that cost limits are enforced"""
        configured_router.set_budget_limits(
            identity_id=identity_id,
            daily_cost_limit=Decimal("1.0")
        )
        
        budget = configured_router.get_budget(identity_id)
        budget.daily_cost_used = Decimal("5.0")  # Exceed limit
        
        result = configured_router._check_budget(identity_id, None)
        assert result is False
    
    @pytest.mark.asyncio
    async def test_completion_rejected_on_budget_exceeded(self, configured_router, identity_id):
        """Test that completion is rejected when budget exceeded"""
        configured_router.set_budget_limits(identity_id=identity_id, daily_limit=10)
        budget = configured_router.get_budget(identity_id)
        budget.daily_used = 1000  # Way over limit
        
        request = LLMRequest(
            messages=[{"role": "user", "content": "Test"}],
            identity_id=identity_id
        )
        
        with pytest.raises(BudgetExceededError):
            await configured_router.complete(request)
    
    @pytest.mark.asyncio
    async def test_completion_updates_budget(self, configured_router, basic_request):
        """Test that completion updates budget"""
        initial_budget = configured_router.get_budget(basic_request.identity_id)
        initial_used = initial_budget.daily_used if initial_budget else 0
        
        response = await configured_router.complete(basic_request)
        
        budget = configured_router.get_budget(basic_request.identity_id)
        assert budget.daily_used > initial_used
    
    def test_budget_daily_reset(self, configured_router, identity_id):
        """Test that daily budget resets after 24 hours"""
        configured_router._check_budget(identity_id, None)
        budget = configured_router.get_budget(identity_id)
        budget.daily_used = 50000
        budget.daily_reset_at = datetime.utcnow() - timedelta(days=2)
        
        # Check budget should reset it
        configured_router._check_budget(identity_id, None)
        
        updated_budget = configured_router.get_budget(identity_id)
        assert updated_budget.daily_used == 0


# =============================================================================
# RATE LIMITING TESTS
# =============================================================================

class TestRateLimiting:
    """Test rate limiting"""
    
    def test_check_rate_limit(self, configured_router):
        """Test rate limit checking"""
        result = configured_router._check_rate_limit(LLMProvider.ANTHROPIC)
        assert result is True  # Fresh provider should pass
    
    @pytest.mark.asyncio
    async def test_rate_limit_fallback(self, configured_router, basic_request):
        """Test fallback when rate limited"""
        # Simulate rate limit exceeded for primary
        configured_router._rate_limits[LLMProvider.ANTHROPIC] = {
            "requests_this_minute": 1000,
            "tokens_this_minute": 10000000,
            "minute_start": datetime.utcnow()
        }
        
        # Should still complete using fallback
        response = await configured_router.complete(basic_request)
        assert response is not None


# =============================================================================
# MODEL REGISTRY TESTS
# =============================================================================

class TestModelRegistry:
    """Test model registry"""
    
    def test_model_registry_populated(self):
        """Test that model registry has models"""
        assert len(MODEL_REGISTRY) > 0
    
    def test_anthropic_models_exist(self):
        """Test Anthropic models in registry"""
        assert "claude-3-5-sonnet-20241022" in MODEL_REGISTRY
        assert "claude-3-5-haiku-20241022" in MODEL_REGISTRY
    
    def test_openai_models_exist(self):
        """Test OpenAI models in registry"""
        assert "gpt-4o" in MODEL_REGISTRY
        assert "gpt-4o-mini" in MODEL_REGISTRY
    
    def test_model_specs_complete(self):
        """Test that model specs have required fields"""
        for model_id, spec in MODEL_REGISTRY.items():
            assert spec.model_id == model_id
            assert spec.provider is not None
            assert spec.display_name is not None
            assert spec.max_context_length > 0
            assert spec.quality_score >= 0
    
    def test_task_recommendations_exist(self):
        """Test that task recommendations exist"""
        assert TaskType.CHAT in TASK_PROVIDER_RECOMMENDATIONS
        assert TaskType.ANALYSIS in TASK_PROVIDER_RECOMMENDATIONS
        assert TaskType.CODE_GENERATION in TASK_PROVIDER_RECOMMENDATIONS


# =============================================================================
# STATS TESTS
# =============================================================================

class TestStats:
    """Test statistics tracking"""
    
    def test_get_stats(self, configured_router):
        """Test getting stats"""
        stats = configured_router.get_stats()
        
        assert "total_requests" in stats
        assert "total_tokens" in stats
        assert "total_cost_usd" in stats
    
    @pytest.mark.asyncio
    async def test_stats_updated_after_completion(self, configured_router, basic_request):
        """Test stats updated after completion"""
        initial_stats = configured_router.get_stats()
        
        await configured_router.complete(basic_request)
        
        final_stats = configured_router.get_stats()
        assert final_stats["total_requests"] > initial_stats["total_requests"]
    
    def test_list_models(self, configured_router):
        """Test listing models"""
        models = configured_router.list_models()
        
        assert len(models) > 0
        assert all(isinstance(m, dict) for m in models)
    
    def test_get_model_info(self, configured_router):
        """Test getting model info"""
        info = configured_router.get_model_info("claude-3-5-sonnet-20241022")
        
        assert info is not None
        assert info["model_id"] == "claude-3-5-sonnet-20241022"
        assert info["provider"] == "anthropic"


# =============================================================================
# SINGLETON TESTS
# =============================================================================

class TestSingleton:
    """Test singleton pattern"""
    
    def test_get_llm_router_singleton(self):
        """Test that get_llm_router returns singleton"""
        router1 = get_llm_router()
        router2 = get_llm_router()
        
        assert router1 is router2
    
    def test_singleton_has_default_providers(self):
        """Test singleton has default providers"""
        router = get_llm_router()
        
        # Should have some providers registered
        assert router.get_provider(LLMProvider.ANTHROPIC) is not None


# =============================================================================
# R&D COMPLIANCE TESTS
# =============================================================================

@pytest.mark.human_sovereignty
class TestRDComplianceRule1:
    """Test Rule #1: Human Sovereignty - LLM outputs are drafts"""
    
    @pytest.mark.asyncio
    async def test_response_is_draft(self, configured_router, basic_request):
        """Test that LLM response is a draft (not auto-executed)"""
        response = await configured_router.complete(basic_request)
        
        # Response should just be content, not an executed action
        assert response.content is not None
        assert "Mock response" in response.content  # Mock indicates not real execution
    
    def test_no_auto_action_in_model_registry(self):
        """Test that no model has auto-action capability"""
        for model_id, spec in MODEL_REGISTRY.items():
            # Models should not have auto-execute capability
            assert not hasattr(spec, "auto_execute")


@pytest.mark.traceability
class TestRDComplianceRule6:
    """Test Rule #6: Module Traceability"""
    
    @pytest.mark.asyncio
    async def test_request_has_identity(self, configured_router, basic_request):
        """Test that requests require identity"""
        assert basic_request.identity_id is not None
        
        response = await configured_router.complete(basic_request)
        assert response is not None
    
    @pytest.mark.asyncio
    async def test_response_has_timestamps(self, configured_router, basic_request):
        """Test that responses have timestamps"""
        response = await configured_router.complete(basic_request)
        
        assert response.created_at is not None
        assert isinstance(response.created_at, datetime)
    
    @pytest.mark.asyncio
    async def test_response_has_request_id(self, configured_router, basic_request):
        """Test that responses reference request ID"""
        response = await configured_router.complete(basic_request)
        
        assert response.request_id == basic_request.request_id
    
    def test_budget_tracks_identity(self, configured_router, identity_id):
        """Test that budget is tracked per identity"""
        configured_router._check_budget(identity_id, None)
        budget = configured_router.get_budget(identity_id)
        
        assert budget.identity_id == identity_id


# =============================================================================
# ERROR HANDLING TESTS
# =============================================================================

class TestErrorHandling:
    """Test error handling"""
    
    @pytest.mark.asyncio
    async def test_budget_exceeded_error(self, configured_router, identity_id):
        """Test budget exceeded raises proper error"""
        configured_router.set_budget_limits(identity_id=identity_id, daily_limit=0)
        
        request = LLMRequest(
            messages=[{"role": "user", "content": "Test"}],
            identity_id=identity_id
        )
        
        with pytest.raises(BudgetExceededError) as exc_info:
            await configured_router.complete(request)
        
        assert identity_id in str(exc_info.value)
    
    def test_model_not_found_error(self, configured_router, identity_id):
        """Test model not found handling"""
        request = LLMRequest(
            messages=[{"role": "user", "content": "Test"}],
            identity_id=identity_id,
            preferred_model="non-existent-model"
        )
        
        # Should fall back to default, not error
        model_id, provider = configured_router.select_model(request)
        assert model_id is not None


# =============================================================================
# INTEGRATION TESTS
# =============================================================================

class TestIntegration:
    """Integration tests"""
    
    @pytest.mark.asyncio
    async def test_full_workflow(self, configured_router, identity_id, thread_id):
        """Test complete workflow: request → route → execute → track"""
        # Create request
        request = LLMRequest(
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Analyze this financial data..."}
            ],
            task_type=TaskType.ANALYSIS,
            identity_id=identity_id,
            thread_id=thread_id,
            strategy=RoutingStrategy.QUALITY_OPTIMIZED
        )
        
        # Execute
        response = await configured_router.complete(request)
        
        # Verify response
        assert response.request_id == request.request_id
        assert response.content is not None
        assert response.provider is not None
        assert response.model is not None
        assert response.total_tokens > 0
        assert response.cost_usd >= Decimal("0")
        
        # Verify tracking
        stats = configured_router.get_stats()
        assert stats["total_requests"] >= 1
        
        budget = configured_router.get_budget(identity_id)
        assert budget is not None
        assert budget.daily_used > 0
    
    @pytest.mark.asyncio
    async def test_multiple_requests_same_identity(self, configured_router, identity_id):
        """Test multiple requests from same identity"""
        for i in range(3):
            request = LLMRequest(
                messages=[{"role": "user", "content": f"Request {i}"}],
                identity_id=identity_id
            )
            
            response = await configured_router.complete(request)
            assert response is not None
        
        budget = configured_router.get_budget(identity_id)
        assert budget.daily_used > 0
    
    @pytest.mark.asyncio
    async def test_different_task_types(self, configured_router, identity_id):
        """Test different task types get appropriate models"""
        task_types = [TaskType.CHAT, TaskType.ANALYSIS, TaskType.CODE_GENERATION]
        
        for task_type in task_types:
            request = LLMRequest(
                messages=[{"role": "user", "content": "Test"}],
                identity_id=identity_id,
                task_type=task_type
            )
            
            model_id, provider = configured_router.select_model(request)
            model_spec = MODEL_REGISTRY.get(model_id)
            
            # Model should be suitable for task
            assert model_spec is not None


# =============================================================================
# PROVIDER ENUM TESTS
# =============================================================================

class TestEnums:
    """Test enums"""
    
    def test_llm_provider_enum(self):
        """Test LLM provider enum values"""
        assert LLMProvider.ANTHROPIC.value == "anthropic"
        assert LLMProvider.OPENAI.value == "openai"
        assert LLMProvider.GOOGLE.value == "google"
    
    def test_task_type_enum(self):
        """Test task type enum values"""
        assert TaskType.CHAT.value == "chat"
        assert TaskType.ANALYSIS.value == "analysis"
        assert TaskType.CODE_GENERATION.value == "code_generation"
    
    def test_routing_strategy_enum(self):
        """Test routing strategy enum values"""
        assert RoutingStrategy.COST_OPTIMIZED.value == "cost_optimized"
        assert RoutingStrategy.QUALITY_OPTIMIZED.value == "quality_optimized"
        assert RoutingStrategy.SPEED_OPTIMIZED.value == "speed_optimized"
