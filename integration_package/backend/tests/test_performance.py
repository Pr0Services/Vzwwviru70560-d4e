"""
TESTS: test_performance.py
MODULE: Performance Module (Cache, Query Optimizer, Monitor)
COVERAGE TARGET: ≥80%

Tests for:
- Cache service
- Caching middleware
- Query optimizer
- Performance monitor
"""

import pytest
import asyncio
import time
from datetime import datetime, timedelta
from uuid import uuid4
from unittest.mock import Mock, AsyncMock, patch

# ═══════════════════════════════════════════════════════════════════════════════
# IMPORTS
# ═══════════════════════════════════════════════════════════════════════════════

# Cache Service
from services.cache.cache_service import (
    CacheService,
    CacheConfig,
    CacheTier,
    CachePolicy,
    CacheKeyBuilder,
    CacheWarmer,
    LRUCache,
    cached,
    cache_invalidate,
    get_cache_service,
    configure_cache,
)

# Caching Middleware
from api.middleware.caching_middleware import (
    CachingMiddleware,
    CachePolicy as ResponseCachePolicy,
    CacheScope,
    ETagGenerator,
    ResponseCache,
    CachedResponse,
    DEFAULT_POLICIES,
    NEVER_CACHE_STATUSES,
)

# Query Optimizer
from services.performance.query_optimizer import (
    QueryOptimizer,
    QueryMetrics,
    QueryPlan,
    PreparedStatementCache,
    BatchQueryExecutor,
    NPlusOneDetector,
    EagerLoadingOptimizer,
    optimized_query,
    get_query_optimizer,
)

# Performance Monitor
from services.performance.performance_monitor import (
    PerformanceMonitor,
    Histogram,
    RateCalculator,
    Alert,
    AlertSeverity,
    HealthScore,
    track_performance,
    get_performance_monitor,
)


# ═══════════════════════════════════════════════════════════════════════════════
# TEST LRU CACHE
# ═══════════════════════════════════════════════════════════════════════════════

class TestLRUCache:
    """Test LRU cache implementation"""
    
    @pytest.fixture
    def cache(self):
        return LRUCache(max_size=5, default_ttl=60)
    
    @pytest.mark.asyncio
    async def test_basic_get_set(self, cache):
        """Test basic get/set operations"""
        await cache.set("key1", "value1")
        value = await cache.get("key1")
        assert value == "value1"
    
    @pytest.mark.asyncio
    async def test_get_missing_returns_none(self, cache):
        """Test getting missing key returns None"""
        value = await cache.get("nonexistent")
        assert value is None
    
    @pytest.mark.asyncio
    async def test_ttl_expiration(self, cache):
        """Test TTL expiration"""
        await cache.set("key1", "value1", ttl=1)
        
        # Should exist immediately
        assert await cache.get("key1") == "value1"
        
        # Wait for expiration
        await asyncio.sleep(1.1)
        
        # Should be expired
        assert await cache.get("key1") is None
    
    @pytest.mark.asyncio
    async def test_lru_eviction(self, cache):
        """Test LRU eviction when full"""
        # Fill cache
        for i in range(5):
            await cache.set(f"key{i}", f"value{i}")
        
        # Access key0 to make it recently used
        await cache.get("key0")
        
        # Add new item (should evict key1, oldest unused)
        await cache.set("key5", "value5")
        
        # key0 should still exist
        assert await cache.get("key0") is not None
        # key5 should exist
        assert await cache.get("key5") is not None
    
    @pytest.mark.asyncio
    async def test_delete_key(self, cache):
        """Test key deletion"""
        await cache.set("key1", "value1")
        assert await cache.get("key1") is not None
        
        deleted = await cache.delete("key1")
        assert deleted is True
        assert await cache.get("key1") is None
    
    @pytest.mark.asyncio
    async def test_delete_nonexistent(self, cache):
        """Test deleting nonexistent key"""
        deleted = await cache.delete("nonexistent")
        assert deleted is False
    
    @pytest.mark.asyncio
    async def test_delete_pattern(self, cache):
        """Test pattern deletion"""
        await cache.set("user:1:profile", "p1")
        await cache.set("user:2:profile", "p2")
        await cache.set("thread:1:data", "t1")
        
        count = await cache.delete_pattern("user:*")
        assert count == 2
        
        assert await cache.get("user:1:profile") is None
        assert await cache.get("thread:1:data") is not None
    
    @pytest.mark.asyncio
    async def test_clear(self, cache):
        """Test cache clear"""
        await cache.set("key1", "value1")
        await cache.set("key2", "value2")
        
        await cache.clear()
        
        assert await cache.get("key1") is None
        assert await cache.get("key2") is None
    
    @pytest.mark.asyncio
    async def test_stats(self, cache):
        """Test cache statistics"""
        await cache.set("key1", "value1")
        await cache.get("key1")  # Hit
        await cache.get("key2")  # Miss
        
        stats = cache.get_stats()
        
        assert stats["size"] == 1
        assert stats["hits"] == 1
        assert stats["misses"] == 1
        assert stats["hit_rate"] == 50.0


# ═══════════════════════════════════════════════════════════════════════════════
# TEST CACHE KEY BUILDER
# ═══════════════════════════════════════════════════════════════════════════════

class TestCacheKeyBuilder:
    """Test cache key building"""
    
    def test_simple_key(self):
        """Test simple key building"""
        key = CacheKeyBuilder.build("threads", "list")
        assert key == "threads:list"
    
    def test_key_with_uuid(self):
        """Test key with UUID"""
        uid = uuid4()
        key = CacheKeyBuilder.build("threads", str(uid))
        assert str(uid) in key
    
    def test_key_with_kwargs(self):
        """Test key with keyword arguments"""
        key = CacheKeyBuilder.build("threads", page=1, limit=10)
        assert "page=1" in key
        assert "limit=10" in key
    
    def test_key_sorting(self):
        """Test kwargs are sorted for consistency"""
        key1 = CacheKeyBuilder.build("threads", a=1, b=2)
        key2 = CacheKeyBuilder.build("threads", b=2, a=1)
        assert key1 == key2
    
    def test_for_thread(self):
        """Test thread key helper"""
        tid = uuid4()
        key = CacheKeyBuilder.for_thread(tid, "events")
        assert f"thread:{tid}:events" == key
    
    def test_for_sphere(self):
        """Test sphere key helper"""
        sid = uuid4()
        key = CacheKeyBuilder.for_sphere(sid)
        assert f"sphere:{sid}" == key
    
    def test_for_user(self):
        """Test user key helper"""
        uid = uuid4()
        key = CacheKeyBuilder.for_user(uid, "profile")
        assert f"user:{uid}:profile" == key
    
    def test_long_key_hashing(self):
        """Test long keys are hashed"""
        # Create very long key
        key = CacheKeyBuilder.build("namespace", *["a" * 50 for _ in range(10)])
        assert len(key) <= 200


# ═══════════════════════════════════════════════════════════════════════════════
# TEST CACHE SERVICE
# ═══════════════════════════════════════════════════════════════════════════════

class TestCacheService:
    """Test cache service"""
    
    @pytest.fixture
    def cache(self):
        config = CacheConfig(l1_max_size=100, l1_ttl_seconds=60)
        return CacheService(config)
    
    @pytest.mark.asyncio
    async def test_get_set_l1(self, cache):
        """Test L1 cache operations"""
        await cache.set("key1", {"data": "value1"}, tier=CacheTier.L1_MEMORY)
        result = await cache.get("key1", tier=CacheTier.L1_MEMORY)
        
        assert result == {"data": "value1"}
    
    @pytest.mark.asyncio
    async def test_get_missing(self, cache):
        """Test getting missing key"""
        result = await cache.get("nonexistent")
        assert result is None
    
    @pytest.mark.asyncio
    async def test_delete(self, cache):
        """Test key deletion"""
        await cache.set("key1", "value1")
        await cache.delete("key1")
        
        result = await cache.get("key1")
        assert result is None
    
    @pytest.mark.asyncio
    async def test_delete_pattern(self, cache):
        """Test pattern deletion"""
        await cache.set("thread:1:data", "d1")
        await cache.set("thread:2:data", "d2")
        await cache.set("user:1:data", "u1")
        
        count = await cache.delete_pattern("thread:*")
        
        assert count == 2
        assert await cache.get("user:1:data") == "u1"
    
    @pytest.mark.asyncio
    async def test_invalidate_thread(self, cache):
        """Test thread cache invalidation"""
        tid = uuid4()
        await cache.set(f"thread:{tid}:events", "events")
        await cache.set(f"thread:{tid}:snapshot", "snapshot")
        
        count = await cache.invalidate_thread(tid)
        assert count == 2
    
    @pytest.mark.asyncio
    async def test_get_many(self, cache):
        """Test bulk get"""
        await cache.set("key1", "value1")
        await cache.set("key2", "value2")
        
        results = await cache.get_many(["key1", "key2", "key3"])
        
        assert results["key1"] == "value1"
        assert results["key2"] == "value2"
        assert "key3" not in results
    
    @pytest.mark.asyncio
    async def test_set_many(self, cache):
        """Test bulk set"""
        await cache.set_many({
            "key1": "value1",
            "key2": "value2"
        })
        
        assert await cache.get("key1") == "value1"
        assert await cache.get("key2") == "value2"
    
    @pytest.mark.asyncio
    async def test_stats(self, cache):
        """Test cache statistics"""
        await cache.set("key1", "value1")
        await cache.get("key1")  # Hit
        await cache.get("key2")  # Miss
        
        stats = cache.get_stats()
        
        assert "l1" in stats
        assert "total_writes" in stats
        assert stats["total_writes"] == 1


# ═══════════════════════════════════════════════════════════════════════════════
# TEST ETAG GENERATOR
# ═══════════════════════════════════════════════════════════════════════════════

class TestETagGenerator:
    """Test ETag generation"""
    
    def test_generate_etag(self):
        """Test ETag generation"""
        content = b'{"data": "test"}'
        etag = ETagGenerator.generate(content)
        
        assert etag.startswith('"')
        assert etag.endswith('"')
        assert len(etag) == 18  # 16 chars + 2 quotes
    
    def test_generate_weak_etag(self):
        """Test weak ETag generation"""
        content = b'{"data": "test"}'
        etag = ETagGenerator.generate_weak(content)
        
        assert etag.startswith('W/"')
        assert etag.endswith('"')
    
    def test_same_content_same_etag(self):
        """Test same content produces same ETag"""
        content = b'{"data": "test"}'
        etag1 = ETagGenerator.generate(content)
        etag2 = ETagGenerator.generate(content)
        
        assert etag1 == etag2
    
    def test_different_content_different_etag(self):
        """Test different content produces different ETag"""
        etag1 = ETagGenerator.generate(b'content1')
        etag2 = ETagGenerator.generate(b'content2')
        
        assert etag1 != etag2
    
    def test_matches(self):
        """Test ETag matching"""
        etag = '"abc123"'
        
        assert ETagGenerator.matches(etag, '"abc123"') is True
        assert ETagGenerator.matches(etag, '"xyz789"') is False
    
    def test_matches_wildcard(self):
        """Test wildcard matching"""
        etag = '"abc123"'
        assert ETagGenerator.matches(etag, "*") is True
    
    def test_matches_multiple(self):
        """Test multiple ETags in If-None-Match"""
        etag = '"abc123"'
        assert ETagGenerator.matches(etag, '"xyz", "abc123", "def"') is True
    
    def test_matches_weak_strong(self):
        """Test weak/strong ETag comparison"""
        strong = '"abc123"'
        weak = 'W/"abc123"'
        
        assert ETagGenerator.matches(strong, weak) is True


# ═══════════════════════════════════════════════════════════════════════════════
# TEST RESPONSE CACHE
# ═══════════════════════════════════════════════════════════════════════════════

class TestResponseCache:
    """Test response cache"""
    
    @pytest.fixture
    def cache(self):
        return ResponseCache(max_size=100)
    
    @pytest.fixture
    def mock_request(self):
        request = Mock()
        request.method = "GET"
        request.url.path = "/api/v2/threads"
        request.query_params = {}
        request.state = Mock()
        request.state.__dict__ = {"user_id": uuid4()}
        return request
    
    def test_get_miss(self, cache, mock_request):
        """Test cache miss"""
        result = cache.get(mock_request)
        assert result is None
        assert cache.misses == 1
    
    def test_set_and_get(self, cache, mock_request):
        """Test set and get"""
        response = Mock()
        response.status_code = 200
        response.headers = {}
        
        cache.set(
            mock_request,
            response,
            body=b'{"data": "test"}',
            etag='"abc123"',
            max_age=60
        )
        
        result = cache.get(mock_request)
        
        assert result is not None
        assert result.status_code == 200
        assert result.body == b'{"data": "test"}'
        assert result.etag == '"abc123"'
    
    def test_expiration(self, cache, mock_request):
        """Test cache expiration"""
        response = Mock()
        response.status_code = 200
        response.headers = {}
        
        cache.set(
            mock_request,
            response,
            body=b'{"data": "test"}',
            etag='"abc123"',
            max_age=0  # Expire immediately
        )
        
        # Force expiration
        import time
        time.sleep(0.1)
        
        result = cache.get(mock_request)
        assert result is None
    
    def test_stats(self, cache, mock_request):
        """Test cache statistics"""
        cache.get(mock_request)  # Miss
        
        response = Mock()
        response.status_code = 200
        response.headers = {}
        cache.set(mock_request, response, b'data', '"etag"', 60)
        
        cache.get(mock_request)  # Hit
        
        stats = cache.get_stats()
        
        assert stats["hits"] == 1
        assert stats["misses"] == 1
        assert stats["size"] == 1


# ═══════════════════════════════════════════════════════════════════════════════
# TEST HISTOGRAM
# ═══════════════════════════════════════════════════════════════════════════════

class TestHistogram:
    """Test histogram for distributions"""
    
    @pytest.fixture
    def histogram(self):
        return Histogram(window_size=100, window_seconds=300)
    
    def test_observe(self, histogram):
        """Test recording observations"""
        histogram.observe(10)
        histogram.observe(20)
        histogram.observe(30)
        
        assert histogram.count == 3
    
    def test_mean(self, histogram):
        """Test mean calculation"""
        for v in [10, 20, 30]:
            histogram.observe(v)
        
        assert histogram.mean == 20.0
    
    def test_median(self, histogram):
        """Test median calculation"""
        for v in [10, 20, 30, 40, 50]:
            histogram.observe(v)
        
        assert histogram.median == 30.0
    
    def test_percentile(self, histogram):
        """Test percentile calculation"""
        for v in range(1, 101):
            histogram.observe(v)
        
        assert histogram.percentile(50) == 50
        assert histogram.percentile(90) == 90
        assert histogram.percentile(99) == 99
    
    def test_min_max(self, histogram):
        """Test min/max"""
        for v in [5, 10, 15, 20, 25]:
            histogram.observe(v)
        
        assert histogram.min == 5
        assert histogram.max == 25
    
    def test_summary(self, histogram):
        """Test summary generation"""
        for v in [10, 20, 30, 40, 50]:
            histogram.observe(v)
        
        summary = histogram.summary()
        
        assert "count" in summary
        assert "mean" in summary
        assert "median" in summary
        assert "p50" in summary
        assert "p90" in summary
        assert "p95" in summary
        assert "p99" in summary


# ═══════════════════════════════════════════════════════════════════════════════
# TEST RATE CALCULATOR
# ═══════════════════════════════════════════════════════════════════════════════

class TestRateCalculator:
    """Test rate calculation"""
    
    @pytest.fixture
    def calculator(self):
        return RateCalculator(window_seconds=1)
    
    def test_record(self, calculator):
        """Test event recording"""
        calculator.record()
        calculator.record()
        calculator.record()
        
        assert calculator.count == 3
    
    def test_rate(self, calculator):
        """Test rate calculation"""
        for _ in range(10):
            calculator.record()
        
        # Rate should be 10/second
        assert calculator.rate == 10.0
    
    def test_window_expiration(self, calculator):
        """Test window expiration"""
        calculator.record()
        
        # Wait for window to expire
        time.sleep(1.1)
        
        # Record should be gone
        assert calculator.count == 0


# ═══════════════════════════════════════════════════════════════════════════════
# TEST PERFORMANCE MONITOR
# ═══════════════════════════════════════════════════════════════════════════════

class TestPerformanceMonitor:
    """Test performance monitoring"""
    
    @pytest.fixture
    def monitor(self):
        return PerformanceMonitor(
            alert_latency_p99_ms=100.0,
            alert_error_rate_percent=5.0
        )
    
    @pytest.mark.asyncio
    async def test_record_request(self, monitor):
        """Test recording requests"""
        await monitor.record_request(
            endpoint="/api/threads",
            method="GET",
            duration_ms=50.0,
            status_code=200
        )
        
        summary = monitor.get_summary()
        assert summary["total_requests"] == 1
    
    @pytest.mark.asyncio
    async def test_record_error(self, monitor):
        """Test recording errors"""
        await monitor.record_request(
            endpoint="/api/threads",
            method="GET",
            duration_ms=50.0,
            status_code=500
        )
        
        summary = monitor.get_summary()
        assert summary["total_errors"] == 1
    
    @pytest.mark.asyncio
    async def test_latency_alert(self, monitor):
        """Test latency alert triggering"""
        # Record many slow requests
        for _ in range(100):
            await monitor.record_request(
                endpoint="/api/threads",
                method="GET",
                duration_ms=200.0,  # Above threshold
                status_code=200
            )
        
        alerts = monitor.get_active_alerts()
        assert any(a.metric_name == "request_latency_p99_ms" for a in alerts)
    
    @pytest.mark.asyncio
    async def test_error_rate_alert(self, monitor):
        """Test error rate alert"""
        # Record mostly errors
        for _ in range(10):
            await monitor.record_request(
                endpoint="/api/threads",
                method="GET",
                duration_ms=50.0,
                status_code=500  # Error
            )
        
        alerts = monitor.get_active_alerts()
        assert any(a.metric_name == "error_rate_percent" for a in alerts)
    
    @pytest.mark.asyncio
    async def test_track_request_context(self, monitor):
        """Test track_request context manager"""
        async with monitor.track_request("/api/test", "GET") as tracker:
            await asyncio.sleep(0.01)
            tracker.set_status(200)
        
        summary = monitor.get_summary()
        assert summary["total_requests"] == 1
    
    def test_resource_usage(self, monitor):
        """Test resource usage monitoring"""
        usage = monitor.get_resource_usage()
        
        assert "memory_percent" in usage
        assert "cpu_percent" in usage
        assert "threads" in usage
    
    def test_health_score(self, monitor):
        """Test health score calculation"""
        score = monitor.calculate_health_score()
        
        assert isinstance(score, HealthScore)
        assert 0 <= score.overall <= 100
        assert score.api_latency >= 0
        assert score.memory_usage >= 0
    
    def test_endpoint_metrics(self, monitor):
        """Test per-endpoint metrics"""
        async def record():
            for endpoint in ["/api/threads", "/api/spheres"]:
                for _ in range(5):
                    await monitor.record_request(endpoint, "GET", 50.0, 200)
        
        asyncio.get_event_loop().run_until_complete(record())
        
        metrics = monitor.get_endpoint_metrics()
        assert "GET:/api/threads" in metrics
        assert "GET:/api/spheres" in metrics
    
    def test_status_distribution(self, monitor):
        """Test status code distribution"""
        async def record():
            await monitor.record_request("/api/test", "GET", 50.0, 200)
            await monitor.record_request("/api/test", "GET", 50.0, 200)
            await monitor.record_request("/api/test", "GET", 50.0, 404)
            await monitor.record_request("/api/test", "GET", 50.0, 500)
        
        asyncio.get_event_loop().run_until_complete(record())
        
        distribution = monitor.get_status_distribution()
        assert distribution[200] == 2
        assert distribution[404] == 1
        assert distribution[500] == 1


# ═══════════════════════════════════════════════════════════════════════════════
# TEST QUERY OPTIMIZER
# ═══════════════════════════════════════════════════════════════════════════════

class TestQueryOptimizer:
    """Test query optimizer"""
    
    @pytest.fixture
    def optimizer(self):
        return QueryOptimizer(
            slow_query_threshold_ms=100.0,
            enable_n_plus_one_detection=True
        )
    
    def test_initialization(self, optimizer):
        """Test optimizer initialization"""
        assert optimizer.slow_query_threshold_ms == 100.0
        assert optimizer._n_plus_one_detector is not None
    
    def test_query_metrics(self, optimizer):
        """Test query metrics tracking"""
        metrics = QueryMetrics(
            query_hash="abc123",
            query_text="SELECT * FROM threads"
        )
        
        metrics.record_execution(50.0, 10, {"id": 1})
        
        assert metrics.execution_count == 1
        assert metrics.avg_time_ms == 50.0
        assert not metrics.is_slow
    
    def test_slow_query_detection(self, optimizer):
        """Test slow query detection"""
        metrics = QueryMetrics(
            query_hash="abc123",
            query_text="SELECT * FROM threads"
        )
        
        metrics.record_execution(150.0, 10, {})  # Slow!
        
        assert metrics.is_slow is True
    
    def test_stats(self, optimizer):
        """Test optimizer statistics"""
        stats = optimizer.get_stats()
        
        assert "total_queries" in stats
        assert "slow_queries" in stats
        assert "prepared_cache" in stats


# ═══════════════════════════════════════════════════════════════════════════════
# TEST N+1 DETECTOR
# ═══════════════════════════════════════════════════════════════════════════════

class TestNPlusOneDetector:
    """Test N+1 query detection"""
    
    @pytest.fixture
    def detector(self):
        return NPlusOneDetector(threshold=3)
    
    def test_record_query(self, detector):
        """Test query recording"""
        now = time.time()
        detector.record_query("query1", now)
        detector.record_query("query1", now + 0.1)
        
        # Not enough to trigger
        assert len(detector.get_warnings()) == 0
    
    def test_n_plus_one_detection(self, detector):
        """Test N+1 detection"""
        now = time.time()
        
        # Record same query 5 times in quick succession
        for i in range(5):
            detector.record_query("query1", now + i * 0.1)
        
        # Force window check
        detector.record_query("other", now + 2)  # After window
        
        warnings = detector.get_warnings()
        assert len(warnings) > 0
        assert warnings[0]["query_hash"] == "query1"
    
    def test_clear_warnings(self, detector):
        """Test clearing warnings"""
        detector._warnings = [{"test": "warning"}]
        detector.clear_warnings()
        
        assert len(detector.get_warnings()) == 0


# ═══════════════════════════════════════════════════════════════════════════════
# TEST PREPARED STATEMENT CACHE
# ═══════════════════════════════════════════════════════════════════════════════

class TestPreparedStatementCache:
    """Test prepared statement caching"""
    
    @pytest.fixture
    def cache(self):
        return PreparedStatementCache(max_size=10)
    
    @pytest.mark.asyncio
    async def test_get_or_prepare(self, cache):
        """Test statement caching"""
        mock_session = AsyncMock()
        
        query = "SELECT * FROM threads WHERE id = :id"
        
        # First call - prepare
        stmt1 = await cache.get_or_prepare(mock_session, query)
        
        # Second call - cached
        stmt2 = await cache.get_or_prepare(mock_session, query)
        
        assert stmt1 == stmt2
    
    @pytest.mark.asyncio
    async def test_lfu_eviction(self, cache):
        """Test LFU eviction"""
        mock_session = AsyncMock()
        
        # Fill cache
        for i in range(10):
            await cache.get_or_prepare(mock_session, f"SELECT {i}")
        
        # Access first query multiple times
        await cache.get_or_prepare(mock_session, "SELECT 0")
        await cache.get_or_prepare(mock_session, "SELECT 0")
        
        # Add new query (should evict least frequently used)
        await cache.get_or_prepare(mock_session, "SELECT 10")
        
        stats = cache.get_stats()
        assert stats["size"] == 10
    
    def test_stats(self, cache):
        """Test cache statistics"""
        stats = cache.get_stats()
        
        assert "size" in stats
        assert "max_size" in stats
        assert "total_executions" in stats


# ═══════════════════════════════════════════════════════════════════════════════
# TEST EAGER LOADING OPTIMIZER
# ═══════════════════════════════════════════════════════════════════════════════

class TestEagerLoadingOptimizer:
    """Test eager loading optimization"""
    
    def test_get_eager_options_thread(self):
        """Test getting eager options for Thread"""
        options = EagerLoadingOptimizer.get_eager_options("Thread")
        assert len(options) > 0
    
    def test_get_eager_options_unknown(self):
        """Test getting options for unknown model"""
        options = EagerLoadingOptimizer.get_eager_options("UnknownModel")
        assert len(options) == 0
    
    def test_eager_load_map(self):
        """Test eager load map contains expected models"""
        assert "Thread" in EagerLoadingOptimizer.EAGER_LOAD_MAP
        assert "Sphere" in EagerLoadingOptimizer.EAGER_LOAD_MAP
        assert "User" in EagerLoadingOptimizer.EAGER_LOAD_MAP


# ═══════════════════════════════════════════════════════════════════════════════
# TEST R&D COMPLIANCE
# ═══════════════════════════════════════════════════════════════════════════════

@pytest.mark.traceability
class TestRDComplianceRule6:
    """Test R&D Rule #6: Traceability"""
    
    def test_cache_metrics_tracked(self):
        """Test cache tracks hits/misses"""
        cache = CacheService()
        stats = cache.get_stats()
        
        assert "l1" in stats
        assert "total_writes" in stats
        assert "total_invalidations" in stats
    
    def test_query_metrics_tracked(self):
        """Test query metrics are tracked"""
        metrics = QueryMetrics(
            query_hash="test",
            query_text="SELECT 1"
        )
        
        metrics.record_execution(50.0, 10, {"id": 1})
        
        assert metrics.execution_count == 1
        assert metrics.last_executed is not None
    
    def test_performance_monitor_tracks_requests(self):
        """Test performance monitor tracks requests"""
        monitor = PerformanceMonitor()
        summary = monitor.get_summary()
        
        assert "total_requests" in summary
        assert "total_errors" in summary
        assert "timing" in summary


@pytest.mark.governance
class TestGovernance:
    """Test governance responses are never cached"""
    
    def test_423_never_cached(self):
        """Test HTTP 423 (checkpoint) is never cached"""
        assert 423 in NEVER_CACHE_STATUSES
    
    def test_403_never_cached(self):
        """Test HTTP 403 (forbidden) is never cached"""
        assert 403 in NEVER_CACHE_STATUSES
    
    def test_401_never_cached(self):
        """Test HTTP 401 (unauthorized) is never cached"""
        assert 401 in NEVER_CACHE_STATUSES


# ═══════════════════════════════════════════════════════════════════════════════
# TEST EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestExports:
    """Test module exports"""
    
    def test_cache_service_exports(self):
        """Test cache service exports"""
        from services.cache.cache_service import (
            CacheService,
            CacheConfig,
            CacheTier,
            cached,
            cache_invalidate,
        )
        
        assert CacheService is not None
        assert CacheConfig is not None
    
    def test_performance_exports(self):
        """Test performance module exports"""
        from services.performance import (
            QueryOptimizer,
            PerformanceMonitor,
            Histogram,
            Alert,
        )
        
        assert QueryOptimizer is not None
        assert PerformanceMonitor is not None
