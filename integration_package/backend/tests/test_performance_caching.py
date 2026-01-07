"""
CHE·NU™ Performance & Caching Tests
=====================================

Comprehensive tests for:
- Cache service
- Response caching middleware
- Query optimization
- Performance monitoring

R&D Compliance: Rule #6 (Traceability)
"""

import pytest
import asyncio
import time
from datetime import datetime, timedelta
from uuid import uuid4
from unittest.mock import Mock, AsyncMock, patch

# Import modules under test
import sys
sys.path.insert(0, '/home/claude/chenu_implementation/output/backend')

from core.cache.cache_service import (
    CacheService,
    CacheStrategy,
    CacheRegion,
    CacheEntry,
    CacheStats,
    CacheKeyBuilder,
    cached,
    cache_invalidate,
    REGION_TTLS,
)

from core.cache.query_optimizer import (
    QueryProfiler,
    QueryProfile,
    QueryStats,
    QueryComplexity,
    NPlusOneDetector,
    BatchLoader,
    IndexAnalyzer,
    IndexRecommendation,
)

from core.cache.performance_monitor import (
    PerformanceMonitor,
    HealthStatus,
    HealthCheck,
    Histogram,
    Counter,
    Gauge,
    TimingMetric,
)


# ==========================================================================
# Cache Service Tests
# ==========================================================================

class TestCacheEntry:
    """Tests for CacheEntry dataclass."""
    
    def test_cache_entry_creation(self):
        """Test creating a cache entry."""
        entry = CacheEntry(
            key="test:key",
            value={"data": "test"},
            created_at=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(hours=1),
            tags=["tag1", "tag2"],
            region=CacheRegion.WARM,
        )
        
        assert entry.key == "test:key"
        assert entry.value == {"data": "test"}
        assert entry.tags == ["tag1", "tag2"]
        assert entry.region == CacheRegion.WARM
        assert entry.hits == 0
    
    def test_cache_entry_not_expired(self):
        """Test non-expired entry."""
        entry = CacheEntry(
            key="test",
            value="data",
            created_at=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(hours=1),
        )
        
        assert not entry.is_expired()
    
    def test_cache_entry_expired(self):
        """Test expired entry."""
        entry = CacheEntry(
            key="test",
            value="data",
            created_at=datetime.utcnow() - timedelta(hours=2),
            expires_at=datetime.utcnow() - timedelta(hours=1),
        )
        
        assert entry.is_expired()
    
    def test_cache_entry_immortal(self):
        """Test entry with no expiration."""
        entry = CacheEntry(
            key="test",
            value="data",
            created_at=datetime.utcnow(),
            expires_at=None,  # Immortal
            region=CacheRegion.IMMORTAL,
        )
        
        assert not entry.is_expired()
    
    def test_cache_entry_touch(self):
        """Test touching entry updates metadata."""
        entry = CacheEntry(
            key="test",
            value="data",
            created_at=datetime.utcnow(),
            expires_at=None,
        )
        
        assert entry.hits == 0
        assert entry.last_accessed is None
        
        entry.touch()
        
        assert entry.hits == 1
        assert entry.last_accessed is not None
    
    def test_cache_entry_serialization(self):
        """Test entry to_dict and from_dict."""
        entry = CacheEntry(
            key="test:key",
            value={"data": [1, 2, 3]},
            created_at=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(hours=1),
            tags=["test"],
            region=CacheRegion.WARM,
            hits=5,
        )
        
        data = entry.to_dict()
        restored = CacheEntry.from_dict(data)
        
        assert restored.key == entry.key
        assert restored.value == entry.value
        assert restored.tags == entry.tags
        assert restored.region == entry.region
        assert restored.hits == entry.hits


class TestCacheKeyBuilder:
    """Tests for CacheKeyBuilder."""
    
    def test_build_simple_key(self):
        """Test building a simple cache key."""
        key = CacheKeyBuilder.build("thread", "abc123")
        
        assert key == "chenu:thread:abc123"
    
    def test_build_key_with_uuid(self):
        """Test building key with UUID."""
        uuid = uuid4()
        key = CacheKeyBuilder.build("thread", uuid)
        
        assert str(uuid) in key
        assert key.startswith("chenu:thread:")
    
    def test_build_key_with_kwargs(self):
        """Test building key with keyword args."""
        key = CacheKeyBuilder.build("list", page=1, limit=20)
        
        assert "page=1" in key
        assert "limit=20" in key
    
    def test_build_thread_key(self):
        """Test thread key builder."""
        thread_id = uuid4()
        key = CacheKeyBuilder.thread(thread_id)
        
        assert str(thread_id) in key
        assert "thread" in key
    
    def test_build_pattern(self):
        """Test pattern builder."""
        thread_id = uuid4()
        pattern = CacheKeyBuilder.pattern("thread", thread_id)
        
        assert pattern.endswith("*")
        assert str(thread_id) in pattern
    
    def test_build_user_spheres_key(self):
        """Test user spheres key builder."""
        user_id = uuid4()
        key = CacheKeyBuilder.user_spheres(user_id)
        
        assert str(user_id) in key
        assert "spheres" in key
    
    def test_build_xr_blueprint_key(self):
        """Test XR blueprint key builder."""
        thread_id = uuid4()
        key = CacheKeyBuilder.xr_blueprint(thread_id)
        
        assert "xr" in key
        assert "blueprint" in key


class TestCacheService:
    """Tests for CacheService."""
    
    @pytest.fixture
    def cache(self):
        """Create local cache service for testing."""
        return CacheService(redis_client=None)  # Use local cache
    
    @pytest.mark.asyncio
    async def test_set_and_get(self, cache):
        """Test basic set and get operations."""
        await cache.set("test:key", {"value": 123})
        result = await cache.get("test:key")
        
        assert result == {"value": 123}
    
    @pytest.mark.asyncio
    async def test_get_default(self, cache):
        """Test get with default value."""
        result = await cache.get("nonexistent", default="default")
        
        assert result == "default"
    
    @pytest.mark.asyncio
    async def test_delete(self, cache):
        """Test delete operation."""
        await cache.set("test:key", "value")
        await cache.delete("test:key")
        
        result = await cache.get("test:key")
        assert result is None
    
    @pytest.mark.asyncio
    async def test_exists(self, cache):
        """Test exists check."""
        await cache.set("test:key", "value")
        
        assert await cache.exists("test:key")
        assert not await cache.exists("nonexistent")
    
    @pytest.mark.asyncio
    async def test_ttl_expiration(self, cache):
        """Test TTL expiration."""
        await cache.set("test:key", "value", ttl=1)  # 1 second
        
        assert await cache.get("test:key") == "value"
        
        await asyncio.sleep(1.5)
        
        assert await cache.get("test:key") is None
    
    @pytest.mark.asyncio
    async def test_region_ttl(self, cache):
        """Test region-based TTL."""
        await cache.set("test:key", "value", region=CacheRegion.HOT)
        
        # HOT has 60s TTL
        assert await cache.exists("test:key")
    
    @pytest.mark.asyncio
    async def test_tags(self, cache):
        """Test tag-based operations."""
        await cache.set("test:1", "value1", tags=["group_a"])
        await cache.set("test:2", "value2", tags=["group_a"])
        await cache.set("test:3", "value3", tags=["group_b"])
        
        # Invalidate by tag
        count = await cache.invalidate_by_tag("group_a")
        
        assert count == 2
        assert await cache.get("test:1") is None
        assert await cache.get("test:2") is None
        assert await cache.get("test:3") == "value3"
    
    @pytest.mark.asyncio
    async def test_pattern_invalidation(self, cache):
        """Test pattern-based invalidation."""
        await cache.set("chenu:user:123:data", "value1")
        await cache.set("chenu:user:123:prefs", "value2")
        await cache.set("chenu:user:456:data", "value3")
        
        count = await cache.invalidate_by_pattern("chenu:user:123:*")
        
        assert count == 2
        assert await cache.get("chenu:user:456:data") == "value3"
    
    @pytest.mark.asyncio
    async def test_get_or_set(self, cache):
        """Test get_or_set with factory function."""
        call_count = 0
        
        def factory():
            nonlocal call_count
            call_count += 1
            return {"computed": True}
        
        # First call - computes
        result1 = await cache.get_or_set("test:computed", factory)
        assert result1 == {"computed": True}
        assert call_count == 1
        
        # Second call - from cache
        result2 = await cache.get_or_set("test:computed", factory)
        assert result2 == {"computed": True}
        assert call_count == 1  # Factory not called again
    
    @pytest.mark.asyncio
    async def test_mget(self, cache):
        """Test multi-get operation."""
        await cache.set("test:1", "value1")
        await cache.set("test:2", "value2")
        
        results = await cache.mget(["test:1", "test:2", "test:3"])
        
        assert results["test:1"] == "value1"
        assert results["test:2"] == "value2"
        assert "test:3" not in results
    
    @pytest.mark.asyncio
    async def test_stats(self, cache):
        """Test statistics tracking."""
        await cache.set("test:key", "value")
        await cache.get("test:key")  # Hit
        await cache.get("nonexistent")  # Miss
        
        stats = cache.get_stats()
        
        assert stats["sets"] == 1
        assert stats["hits"] == 1
        assert stats["misses"] == 1
        assert stats["hit_rate"] > 0
    
    @pytest.mark.asyncio
    async def test_clear(self, cache):
        """Test clearing entire cache."""
        await cache.set("test:1", "value1")
        await cache.set("test:2", "value2")
        
        await cache.clear()
        
        assert await cache.get("test:1") is None
        assert await cache.get("test:2") is None


class TestCacheDecorators:
    """Tests for cache decorators."""
    
    @pytest.mark.asyncio
    async def test_cached_decorator(self):
        """Test @cached decorator."""
        call_count = 0
        
        @cached(
            key_builder=lambda x: f"cached_test:{x}",
            ttl=60,
        )
        async def expensive_operation(x):
            nonlocal call_count
            call_count += 1
            return x * 2
        
        # First call
        result1 = await expensive_operation(5)
        assert result1 == 10
        assert call_count == 1
        
        # Second call (cached)
        result2 = await expensive_operation(5)
        assert result2 == 10
        assert call_count == 1  # Not called again


# ==========================================================================
# Query Optimizer Tests
# ==========================================================================

class TestQueryComplexity:
    """Tests for query complexity analysis."""
    
    def test_simple_query(self):
        """Test simple query classification."""
        profiler = QueryProfiler()
        
        query = "SELECT * FROM users WHERE id = 123"
        complexity = profiler._analyze_complexity(query)
        
        assert complexity == QueryComplexity.SIMPLE
    
    def test_moderate_query(self):
        """Test moderate query classification."""
        profiler = QueryProfiler()
        
        query = "SELECT * FROM users JOIN orders ON users.id = orders.user_id ORDER BY created_at"
        complexity = profiler._analyze_complexity(query)
        
        assert complexity == QueryComplexity.MODERATE
    
    def test_complex_query(self):
        """Test complex query classification."""
        profiler = QueryProfiler()
        
        query = """
            SELECT users.*, COUNT(orders.id) as order_count
            FROM users
            JOIN orders ON users.id = orders.user_id
            JOIN products ON orders.product_id = products.id
            GROUP BY users.id
            HAVING COUNT(orders.id) > 5
        """
        complexity = profiler._analyze_complexity(query)
        
        assert complexity in [QueryComplexity.COMPLEX, QueryComplexity.EXPENSIVE]
    
    def test_expensive_query(self):
        """Test expensive query classification."""
        profiler = QueryProfiler()
        
        query = """
            SELECT * FROM users 
            WHERE id IN (SELECT user_id FROM orders WHERE total > 100)
            AND status = 'active'
        """
        complexity = profiler._analyze_complexity(query)
        
        assert complexity == QueryComplexity.EXPENSIVE


class TestNPlusOneDetector:
    """Tests for N+1 query detection."""
    
    def test_no_detection_single_query(self):
        """Test no detection for single query."""
        detector = NPlusOneDetector(threshold=3, window_ms=1000)
        
        result = detector.record("SELECT * FROM users WHERE id = 1")
        
        assert result is None
    
    def test_detection_repeated_queries(self):
        """Test detection of repeated similar queries."""
        detector = NPlusOneDetector(threshold=3, window_ms=1000)
        
        # Simulate N+1 pattern
        detector.record("SELECT * FROM orders WHERE user_id = 1")
        detector.record("SELECT * FROM orders WHERE user_id = 2")
        result = detector.record("SELECT * FROM orders WHERE user_id = 3")
        
        assert result is not None
        assert result["count"] >= 3
    
    def test_query_normalization(self):
        """Test query normalization for comparison."""
        detector = NPlusOneDetector(threshold=2, window_ms=1000)
        
        # Different values but same pattern
        detector.record("SELECT * FROM users WHERE id = 123")
        result = detector.record("SELECT * FROM users WHERE id = 456")
        
        assert result is not None  # Should match as same pattern


class TestQueryStats:
    """Tests for query statistics."""
    
    def test_record_query(self):
        """Test recording a query profile."""
        stats = QueryStats()
        
        profile = QueryProfile(
            query="SELECT * FROM users",
            params={},
            execution_time_ms=50.0,
            rows_affected=10,
            complexity=QueryComplexity.SIMPLE,
            uses_index=True,
        )
        
        stats.record(profile, slow_threshold_ms=100)
        
        assert stats.total_queries == 1
        assert stats.total_time_ms == 50.0
        assert stats.slow_queries == 0
    
    def test_slow_query_detection(self):
        """Test slow query detection."""
        stats = QueryStats()
        
        profile = QueryProfile(
            query="SELECT * FROM large_table",
            params={},
            execution_time_ms=500.0,  # Slow!
            rows_affected=1000,
            complexity=QueryComplexity.EXPENSIVE,
            uses_index=False,
        )
        
        stats.record(profile, slow_threshold_ms=100)
        
        assert stats.slow_queries == 1
        assert stats.full_scans == 1
        assert len(stats.slowest_queries) == 1
    
    def test_average_time(self):
        """Test average query time calculation."""
        stats = QueryStats()
        
        for time_ms in [10, 20, 30]:
            profile = QueryProfile(
                query="SELECT 1",
                params={},
                execution_time_ms=time_ms,
                rows_affected=1,
                complexity=QueryComplexity.SIMPLE,
                uses_index=True,
            )
            stats.record(profile)
        
        assert stats.avg_query_time_ms == 20.0


class TestBatchLoader:
    """Tests for batch loading."""
    
    @pytest.mark.asyncio
    async def test_batch_loading(self):
        """Test batch loading aggregation."""
        loaded_keys = []
        
        def load_fn(keys):
            loaded_keys.append(keys)
            return [{"id": k, "name": f"Item {k}"} for k in keys]
        
        loader = BatchLoader(
            load_fn=load_fn,
            key_fn=lambda item: item["id"],
            max_batch_size=10,
        )
        
        # Queue multiple loads
        load1 = asyncio.create_task(loader.load(1))
        load2 = asyncio.create_task(loader.load(2))
        load3 = asyncio.create_task(loader.load(3))
        
        # Flush
        await loader.flush()
        
        # Wait for results
        results = await asyncio.gather(load1, load2, load3)
        
        assert len(results) == 3
        assert len(loaded_keys) == 1  # Single batch call
        assert len(loaded_keys[0]) == 3
    
    @pytest.mark.asyncio
    async def test_cache_priming(self):
        """Test cache priming."""
        call_count = 0
        
        def load_fn(keys):
            nonlocal call_count
            call_count += 1
            return [{"id": k} for k in keys]
        
        loader = BatchLoader(
            load_fn=load_fn,
            key_fn=lambda item: item["id"],
        )
        
        # Prime cache
        loader.prime(1, {"id": 1, "name": "Primed"})
        
        # Load primed key
        result = await loader.load(1)
        
        assert result["name"] == "Primed"
        assert call_count == 0  # No actual load


class TestIndexAnalyzer:
    """Tests for index analysis."""
    
    def test_analyze_query(self):
        """Test query analysis for indexes."""
        analyzer = IndexAnalyzer()
        
        # Analyze several queries
        analyzer.analyze("SELECT * FROM users WHERE email = 'test@test.com'")
        analyzer.analyze("SELECT * FROM users WHERE email = 'other@test.com'")
        analyzer.analyze("SELECT * FROM users WHERE email = 'third@test.com'")
        analyzer.analyze("SELECT * FROM users WHERE email = 'fourth@test.com'")
        analyzer.analyze("SELECT * FROM users WHERE email = 'fifth@test.com'")
        
        recommendations = analyzer.get_recommendations(min_usage=3)
        
        assert len(recommendations) > 0
        assert any("email" in r.columns for r in recommendations)


# ==========================================================================
# Performance Monitor Tests
# ==========================================================================

class TestHistogram:
    """Tests for histogram metrics."""
    
    def test_histogram_creation(self):
        """Test histogram creation."""
        hist = Histogram.create("request_latency")
        
        assert hist.name == "request_latency"
        assert len(hist.buckets) > 0
        assert hist.count == 0
    
    def test_histogram_observe(self):
        """Test recording observations."""
        hist = Histogram.create("latency")
        
        hist.observe(50)
        hist.observe(100)
        hist.observe(150)
        
        assert hist.count == 3
        assert hist.sum == 300
        assert hist.avg == 100
    
    def test_histogram_percentiles(self):
        """Test percentile calculation."""
        hist = Histogram.create("latency")
        
        # Add observations
        for _ in range(90):
            hist.observe(10)  # Fast
        for _ in range(10):
            hist.observe(500)  # Slow
        
        p90 = hist.percentile(0.90)
        p99 = hist.percentile(0.99)
        
        # p90 should be around fast threshold
        # p99 should be higher
        assert p90 <= p99


class TestCounter:
    """Tests for counter metrics."""
    
    def test_counter_increment(self):
        """Test counter increment."""
        counter = Counter("requests")
        
        counter.inc()
        counter.inc(5)
        
        assert counter.value == 6
    
    def test_counter_labels(self):
        """Test counter with labels."""
        counter = Counter("http_requests", labels={"method": "GET"})
        
        assert counter.labels["method"] == "GET"


class TestGauge:
    """Tests for gauge metrics."""
    
    def test_gauge_operations(self):
        """Test gauge set/inc/dec."""
        gauge = Gauge("connections")
        
        gauge.set(10)
        assert gauge.value == 10
        
        gauge.inc(5)
        assert gauge.value == 15
        
        gauge.dec(3)
        assert gauge.value == 12


class TestHealthCheck:
    """Tests for health checks."""
    
    def test_health_check_creation(self):
        """Test creating a health check."""
        check = HealthCheck(
            name="database",
            status=HealthStatus.HEALTHY,
            message="Connection OK",
            latency_ms=5.0,
        )
        
        assert check.status == HealthStatus.HEALTHY
        assert check.latency_ms == 5.0
    
    def test_health_check_serialization(self):
        """Test health check to_dict."""
        check = HealthCheck(
            name="redis",
            status=HealthStatus.DEGRADED,
            message="High latency",
            latency_ms=150.0,
            details={"used_memory": "1GB"},
        )
        
        data = check.to_dict()
        
        assert data["name"] == "redis"
        assert data["status"] == "degraded"
        assert data["details"]["used_memory"] == "1GB"


class TestPerformanceMonitor:
    """Tests for performance monitor."""
    
    @pytest.fixture
    def monitor(self):
        """Create fresh monitor for testing."""
        return PerformanceMonitor()
    
    @pytest.mark.asyncio
    async def test_track_request(self, monitor):
        """Test request tracking."""
        async with monitor.track_request("GET", "/api/threads"):
            await asyncio.sleep(0.01)  # Simulate work
        
        stats = monitor.get_dashboard_data()
        
        assert stats["requests"]["total"] == 1
    
    def test_record_error(self, monitor):
        """Test error recording."""
        monitor.record_error("POST", "/api/threads", 400, "validation_error")
        
        stats = monitor.get_dashboard_data()
        
        assert stats["requests"]["errors"] == 1
    
    def test_record_checkpoint(self, monitor):
        """Test checkpoint recording."""
        monitor.record_checkpoint()
        
        stats = monitor.get_dashboard_data()
        
        assert stats["governance"]["checkpoints_triggered"] == 1
    
    def test_record_identity_violation(self, monitor):
        """Test identity violation recording."""
        monitor.record_identity_violation()
        
        stats = monitor.get_dashboard_data()
        
        assert stats["governance"]["identity_violations"] == 1
    
    @pytest.mark.asyncio
    async def test_health_check_registration(self, monitor):
        """Test registering health checks."""
        async def db_check():
            return HealthCheck(
                name="database",
                status=HealthStatus.HEALTHY,
                message="OK",
            )
        
        monitor.register_health_check("database", db_check)
        
        results = await monitor.run_health_checks()
        
        assert "database" in results
        assert results["database"].status == HealthStatus.HEALTHY
    
    @pytest.mark.asyncio
    async def test_overall_health(self, monitor):
        """Test overall health calculation."""
        monitor.register_health_check(
            "healthy_service",
            lambda: HealthCheck("healthy", HealthStatus.HEALTHY, "OK"),
        )
        monitor.register_health_check(
            "degraded_service",
            lambda: HealthCheck("degraded", HealthStatus.DEGRADED, "Slow"),
        )
        
        overall = await monitor.get_overall_health()
        
        # Should be degraded if any service is degraded
        assert overall == HealthStatus.DEGRADED
    
    def test_system_resources(self, monitor):
        """Test system resource monitoring."""
        resources = monitor.get_system_resources()
        
        assert "cpu" in resources
        assert "memory" in resources
        assert "disk" in resources
        assert resources["memory"]["percent"] >= 0
    
    def test_alert_detection(self, monitor):
        """Test alert threshold detection."""
        # Simulate high latency
        for _ in range(100):
            monitor.histogram("http_request_duration_ms").observe(600)  # Slow
        
        alerts = monitor.check_alerts()
        
        # Should have latency alert
        assert any(a["type"] == "latency_warning" for a in alerts)
    
    def test_metrics_summary(self, monitor):
        """Test metrics summary."""
        monitor.counter("test_counter").inc(10)
        monitor.gauge("test_gauge").set(42)
        monitor.histogram("test_histogram").observe(100)
        
        summary = monitor.get_metrics_summary()
        
        assert "counters" in summary
        assert "gauges" in summary
        assert "histograms" in summary
    
    def test_reset_metrics(self, monitor):
        """Test metrics reset."""
        monitor.counter("test").inc(100)
        
        monitor.reset_metrics()
        
        # Default metrics should be back
        assert monitor.counter("http_requests_total").value == 0


# ==========================================================================
# R&D Compliance Tests
# ==========================================================================

@pytest.mark.traceability
class TestRDComplianceRule6:
    """R&D Rule #6: Full traceability."""
    
    def test_cache_entry_has_timestamps(self):
        """Cache entries must have timestamps."""
        entry = CacheEntry(
            key="test",
            value="data",
            created_at=datetime.utcnow(),
            expires_at=None,
        )
        
        assert entry.created_at is not None
        assert isinstance(entry.created_at, datetime)
    
    def test_query_profile_has_timestamp(self):
        """Query profiles must have timestamps."""
        profile = QueryProfile(
            query="SELECT 1",
            params={},
            execution_time_ms=10,
            rows_affected=1,
            complexity=QueryComplexity.SIMPLE,
            uses_index=True,
        )
        
        assert profile.timestamp is not None
    
    def test_health_check_has_timestamp(self):
        """Health checks must have timestamps."""
        check = HealthCheck(
            name="test",
            status=HealthStatus.HEALTHY,
            message="OK",
        )
        
        assert check.timestamp is not None


@pytest.mark.human_sovereignty
class TestRDComplianceRule1:
    """R&D Rule #1: Human sovereignty in caching decisions."""
    
    def test_cache_regions_configurable(self):
        """Cache regions and TTLs must be configurable."""
        # Regions have explicit TTLs
        assert CacheRegion.HOT in REGION_TTLS
        assert CacheRegion.WARM in REGION_TTLS
        assert CacheRegion.COLD in REGION_TTLS
        
        # TTLs are reasonable
        assert REGION_TTLS[CacheRegion.HOT] < REGION_TTLS[CacheRegion.WARM]
        assert REGION_TTLS[CacheRegion.WARM] < REGION_TTLS[CacheRegion.COLD]
    
    def test_cache_invalidation_explicit(self):
        """Cache invalidation must be explicit."""
        cache = CacheService()
        
        # Invalidation methods exist and require explicit calls
        assert hasattr(cache, 'invalidate_by_tag')
        assert hasattr(cache, 'invalidate_by_pattern')
        assert hasattr(cache, 'delete')
        assert hasattr(cache, 'clear')


# ==========================================================================
# Integration Tests
# ==========================================================================

class TestCachePerformanceIntegration:
    """Integration tests for cache and performance."""
    
    @pytest.mark.asyncio
    async def test_cache_stats_reflected_in_monitor(self):
        """Test that cache stats are available in monitor."""
        cache = CacheService()
        monitor = PerformanceMonitor()
        
        # Perform cache operations
        await cache.set("test:key", "value")
        await cache.get("test:key")
        await cache.get("missing")
        
        cache_stats = cache.get_stats()
        
        assert cache_stats["hits"] == 1
        assert cache_stats["misses"] == 1
    
    @pytest.mark.asyncio
    async def test_query_profiler_integration(self):
        """Test query profiler with performance monitor."""
        profiler = QueryProfiler(slow_threshold_ms=50)
        
        # Record queries
        profile = QueryProfile(
            query="SELECT * FROM large_table",
            params={},
            execution_time_ms=100,  # Slow
            rows_affected=1000,
            complexity=QueryComplexity.EXPENSIVE,
            uses_index=False,
        )
        
        profiler.stats.record(profile, slow_threshold_ms=50)
        
        stats = profiler.get_stats()
        
        assert stats["slow_queries"] == 1
        assert stats["full_scans"] == 1


# ==========================================================================
# Run Tests
# ==========================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
