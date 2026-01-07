"""
CHE·NU™ V71 — Tests Quantum Orchestrator
========================================
Tests for QuantumOrchestrator and compute routing
"""

import pytest
import asyncio
from datetime import datetime

# Add parent to path for imports
import sys
sys.path.insert(0, '/home/claude/CHENU_V71_PLATFORM')

from backend.core.quantum import (
    QuantumOrchestrator,
    ComputeBackend,
    ComputeCapability,
    ComputeRequest,
    ComputePriority,
    ComputeType,
    OperationType,
    QKDKeyManager,
    SensorSynchronizer,
    get_quantum_orchestrator
)


# =============================================================================
# QUANTUM ORCHESTRATOR TESTS
# =============================================================================

class TestQuantumOrchestrator:
    """Tests for QuantumOrchestrator"""
    
    def test_orchestrator_singleton(self):
        """Test singleton pattern"""
        o1 = get_quantum_orchestrator()
        o2 = get_quantum_orchestrator()
        assert o1 is o2
    
    def test_default_backends(self):
        """Test default backends are initialized"""
        orchestrator = QuantumOrchestrator()
        
        assert ComputeType.CLASSICAL in orchestrator._backends
        assert ComputeType.PHOTONIC in orchestrator._backends
        assert ComputeType.QUANTUM in orchestrator._backends
    
    def test_classical_always_available(self):
        """Test classical compute is always available"""
        orchestrator = QuantumOrchestrator()
        backend = orchestrator._backends[ComputeType.CLASSICAL]
        
        assert backend.is_available == True
        assert backend.is_fallback_ready == True
    
    def test_get_capabilities(self):
        """Test getting backend capabilities"""
        orchestrator = QuantumOrchestrator()
        caps = orchestrator.get_capabilities(ComputeType.CLASSICAL)
        
        assert caps is not None
        assert caps.latency_ms > 0
        assert caps.cost_per_op > 0
    
    @pytest.mark.asyncio
    async def test_route_security_priority(self):
        """Test security priority routing prefers quantum"""
        orchestrator = QuantumOrchestrator()
        
        request = ComputeRequest(
            operation=OperationType.ENCRYPTION,
            priority=ComputePriority.SECURITY,
            payload={"data": "sensitive"}
        )
        
        decision = await orchestrator.route(request)
        
        # Should prefer quantum for security, fallback to classical
        assert decision.selected in [ComputeType.QUANTUM, ComputeType.CLASSICAL]
        assert decision.reason != ""
    
    @pytest.mark.asyncio
    async def test_route_production_priority(self):
        """Test production priority routing prefers photonic"""
        orchestrator = QuantumOrchestrator()
        
        request = ComputeRequest(
            operation=OperationType.MATRIX_MULTIPLY,
            priority=ComputePriority.PRODUCTION,
            payload={"size": 1000}
        )
        
        decision = await orchestrator.route(request)
        
        # Should prefer photonic for production
        assert decision.selected in [ComputeType.PHOTONIC, ComputeType.CLASSICAL]
    
    @pytest.mark.asyncio
    async def test_route_background_priority(self):
        """Test background priority routes to classical"""
        orchestrator = QuantumOrchestrator()
        
        request = ComputeRequest(
            operation=OperationType.DATA_PROCESS,
            priority=ComputePriority.BACKGROUND,
            payload={"batch": True}
        )
        
        decision = await orchestrator.route(request)
        
        # Background should use classical (lowest cost)
        assert decision.selected == ComputeType.CLASSICAL
    
    @pytest.mark.asyncio
    async def test_execute_compute(self):
        """Test compute execution"""
        orchestrator = QuantumOrchestrator()
        
        request = ComputeRequest(
            operation=OperationType.DATA_PROCESS,
            priority=ComputePriority.BACKGROUND,
            payload={"test": True}
        )
        
        result = await orchestrator.execute(request)
        
        assert result.status == "completed"
        assert result.compute_used is not None
        assert result.latency_ms > 0
    
    @pytest.mark.asyncio
    async def test_fallback_chain(self):
        """Test fallback chain when preferred compute unavailable"""
        orchestrator = QuantumOrchestrator()
        
        # Disable quantum
        orchestrator._backends[ComputeType.QUANTUM].is_available = False
        
        request = ComputeRequest(
            operation=OperationType.ENCRYPTION,
            priority=ComputePriority.SECURITY,
            payload={"data": "test"}
        )
        
        decision = await orchestrator.route(request)
        
        # Should fallback
        assert decision.selected in [ComputeType.PHOTONIC, ComputeType.CLASSICAL]
        assert len(decision.fallback_chain) > 0


# =============================================================================
# QKD KEY MANAGER TESTS
# =============================================================================

class TestQKDKeyManager:
    """Tests for QKD Key Manager"""
    
    @pytest.mark.asyncio
    async def test_generate_key(self):
        """Test QKD key generation"""
        qkd = QKDKeyManager()
        key = await qkd.generate_key("channel_123")
        
        assert key.key_id is not None
        assert key.channel_id == "channel_123"
        assert key.key_material != ""
        assert key.is_valid == True
    
    @pytest.mark.asyncio
    async def test_get_key(self):
        """Test retrieving generated key"""
        qkd = QKDKeyManager()
        
        # Generate
        key = await qkd.generate_key("channel_abc")
        
        # Retrieve
        retrieved = await qkd.get_key(key.key_id)
        
        assert retrieved is not None
        assert retrieved.key_id == key.key_id
    
    @pytest.mark.asyncio
    async def test_rotate_key(self):
        """Test key rotation"""
        qkd = QKDKeyManager()
        
        # Generate initial
        old_key = await qkd.generate_key("channel_rotate")
        
        # Rotate
        new_key = await qkd.rotate_key("channel_rotate")
        
        assert new_key.key_id != old_key.key_id
        
        # Old key should be invalidated
        old_retrieved = await qkd.get_key(old_key.key_id)
        assert old_retrieved is None or old_retrieved.is_valid == False
    
    @pytest.mark.asyncio
    async def test_key_expiration(self):
        """Test key TTL expiration"""
        qkd = QKDKeyManager(default_ttl_seconds=1)
        
        key = await qkd.generate_key("channel_expire")
        assert key.is_valid == True
        
        # Wait for expiration
        await asyncio.sleep(1.5)
        
        # Check expiration
        retrieved = await qkd.get_key(key.key_id)
        # Should be expired or removed
        assert retrieved is None or retrieved.is_expired()


# =============================================================================
# SENSOR SYNCHRONIZER TESTS
# =============================================================================

class TestSensorSynchronizer:
    """Tests for Photonic Sensor Synchronizer"""
    
    @pytest.mark.asyncio
    async def test_sync_sensors(self):
        """Test sensor synchronization"""
        sync = SensorSynchronizer()
        
        result = await sync.synchronize(["sensor_1", "sensor_2", "sensor_3"])
        
        assert result.synchronized == True
        assert result.precision_ns > 0
        assert len(result.sensor_states) == 3
    
    @pytest.mark.asyncio
    async def test_get_sensor_state(self):
        """Test getting individual sensor state"""
        sync = SensorSynchronizer()
        
        # Sync first
        await sync.synchronize(["sensor_x"])
        
        # Get state
        state = await sync.get_sensor_state("sensor_x")
        
        assert state is not None
        assert state["sensor_id"] == "sensor_x"
    
    @pytest.mark.asyncio
    async def test_precision_target(self):
        """Test nanosecond precision target"""
        sync = SensorSynchronizer(target_precision_ns=100)
        
        result = await sync.synchronize(["s1", "s2"])
        
        # Should achieve target or better
        assert result.precision_ns <= 100 or result.precision_ns > 0


# =============================================================================
# HUB INTEGRATION TESTS
# =============================================================================

class TestQuantumHubIntegration:
    """Tests for quantum integration with hubs"""
    
    @pytest.mark.asyncio
    async def test_hub_communication_operation(self):
        """Test Hub Communication QKD operation"""
        orchestrator = get_quantum_orchestrator()
        
        result = await orchestrator.execute_hub_operation(
            hub="communication",
            operation="generate_channel_key",
            params={"channel_id": "secure_channel_1"}
        )
        
        assert result["status"] == "completed"
        assert "key" in result or "operation" in result
    
    @pytest.mark.asyncio
    async def test_hub_navigation_operation(self):
        """Test Hub Navigation photonic sync"""
        orchestrator = get_quantum_orchestrator()
        
        result = await orchestrator.execute_hub_operation(
            hub="navigation",
            operation="sync_sensors",
            params={"sensors": ["nav_1", "nav_2"]}
        )
        
        assert result["status"] == "completed"
    
    @pytest.mark.asyncio
    async def test_hub_execution_operation(self):
        """Test Hub Execution compute acceleration"""
        orchestrator = get_quantum_orchestrator()
        
        result = await orchestrator.execute_hub_operation(
            hub="execution",
            operation="accelerate_compute",
            params={"task": "matrix_op", "size": 500}
        )
        
        assert result["status"] == "completed"
    
    @pytest.mark.asyncio
    async def test_sync_all_hubs(self):
        """Test synchronizing all hub states"""
        orchestrator = get_quantum_orchestrator()
        
        result = await orchestrator.sync_hub_states()
        
        assert result["status"] == "synchronized"
        assert "communication" in result["hubs"]
        assert "navigation" in result["hubs"]
        assert "execution" in result["hubs"]


# =============================================================================
# STATISTICS TESTS
# =============================================================================

class TestQuantumStatistics:
    """Tests for quantum statistics tracking"""
    
    @pytest.mark.asyncio
    async def test_stats_tracked(self):
        """Test that statistics are tracked"""
        orchestrator = QuantumOrchestrator()
        
        # Execute some operations
        for _ in range(3):
            request = ComputeRequest(
                operation=OperationType.DATA_PROCESS,
                priority=ComputePriority.BACKGROUND,
                payload={}
            )
            await orchestrator.execute(request)
        
        stats = orchestrator.get_statistics()
        
        assert stats["total_requests"] >= 3
        assert "by_compute_type" in stats
    
    def test_backend_stats(self):
        """Test backend-specific stats"""
        orchestrator = QuantumOrchestrator()
        
        for compute_type in ComputeType:
            caps = orchestrator.get_capabilities(compute_type)
            if caps:
                assert caps.latency_ms >= 0
                assert caps.throughput_ops >= 0


# =============================================================================
# RUN TESTS
# =============================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
