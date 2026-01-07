"""
WEBSOCKET TESTS
===============

Comprehensive tests for CHE·NU WebSocket real-time system.

Tests:
- Connection lifecycle
- Authentication
- Subscriptions
- Broadcasting
- Presence
- Event types
- R&D compliance

VERSION: 1.0.0
"""

import pytest
import asyncio
from uuid import uuid4
from datetime import datetime
from unittest.mock import AsyncMock, MagicMock, patch

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.websocket.connection_manager import (
    ConnectionManager,
    WebSocketConnection,
    WebSocketMessage,
    ConnectionState,
    SubscriptionType,
    EventType
)
from api.websocket.event_broadcaster import EventBroadcaster


# =============================================================================
# FIXTURES
# =============================================================================

@pytest.fixture
def connection_manager():
    """Fresh connection manager for each test"""
    return ConnectionManager()


@pytest.fixture
def event_broadcaster(connection_manager):
    """Event broadcaster with test connection manager"""
    return EventBroadcaster(connection_manager)


@pytest.fixture
def mock_websocket():
    """Mock WebSocket for testing"""
    ws = AsyncMock()
    ws.accept = AsyncMock()
    ws.send_json = AsyncMock()
    ws.receive_json = AsyncMock()
    return ws


@pytest.fixture
def identity_id():
    return str(uuid4())


@pytest.fixture
def thread_id():
    return str(uuid4())


@pytest.fixture
def sphere_id():
    return str(uuid4())


# =============================================================================
# CONNECTION LIFECYCLE TESTS
# =============================================================================

class TestConnectionLifecycle:
    """Test WebSocket connection lifecycle"""
    
    @pytest.mark.asyncio
    async def test_connect_creates_connection(self, connection_manager, mock_websocket):
        """Test that connecting creates a connection"""
        connection_id = await connection_manager.connect(mock_websocket)
        
        assert connection_id is not None
        assert len(connection_id) == 36  # UUID format
        
        connection = connection_manager.get_connection(connection_id)
        assert connection is not None
        assert connection.state == ConnectionState.CONNECTED
    
    @pytest.mark.asyncio
    async def test_connect_accepts_websocket(self, connection_manager, mock_websocket):
        """Test that connect accepts the WebSocket"""
        await connection_manager.connect(mock_websocket)
        
        mock_websocket.accept.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_connect_sends_confirmation(self, connection_manager, mock_websocket):
        """Test that connect sends confirmation message"""
        await connection_manager.connect(mock_websocket)
        
        mock_websocket.send_json.assert_called_once()
        call_args = mock_websocket.send_json.call_args[0][0]
        assert call_args["event"] == EventType.CONNECTED.value
    
    @pytest.mark.asyncio
    async def test_disconnect_removes_connection(self, connection_manager, mock_websocket):
        """Test that disconnect removes the connection"""
        connection_id = await connection_manager.connect(mock_websocket)
        
        assert connection_manager.get_connection(connection_id) is not None
        
        await connection_manager.disconnect(connection_id)
        
        assert connection_manager.get_connection(connection_id) is None
    
    @pytest.mark.asyncio
    async def test_connection_count(self, connection_manager, mock_websocket):
        """Test connection count tracking"""
        assert connection_manager.get_connection_count() == 0
        
        conn1 = await connection_manager.connect(mock_websocket)
        assert connection_manager.get_connection_count() == 1
        
        mock_websocket2 = AsyncMock()
        mock_websocket2.accept = AsyncMock()
        mock_websocket2.send_json = AsyncMock()
        conn2 = await connection_manager.connect(mock_websocket2)
        assert connection_manager.get_connection_count() == 2
        
        await connection_manager.disconnect(conn1)
        assert connection_manager.get_connection_count() == 1


# =============================================================================
# AUTHENTICATION TESTS
# =============================================================================

class TestAuthentication:
    """Test WebSocket authentication"""
    
    @pytest.mark.asyncio
    async def test_authenticate_updates_connection(
        self, connection_manager, mock_websocket, identity_id
    ):
        """Test that authentication updates connection state"""
        connection_id = await connection_manager.connect(mock_websocket)
        
        success = await connection_manager.authenticate(connection_id, identity_id)
        
        assert success is True
        
        connection = connection_manager.get_connection(connection_id)
        assert connection.state == ConnectionState.AUTHENTICATED
        assert connection.identity_id == identity_id
    
    @pytest.mark.asyncio
    async def test_authenticate_sends_confirmation(
        self, connection_manager, mock_websocket, identity_id
    ):
        """Test that authentication sends confirmation"""
        connection_id = await connection_manager.connect(mock_websocket)
        mock_websocket.send_json.reset_mock()
        
        await connection_manager.authenticate(connection_id, identity_id)
        
        mock_websocket.send_json.assert_called_once()
        call_args = mock_websocket.send_json.call_args[0][0]
        assert call_args["event"] == EventType.AUTHENTICATED.value
        assert call_args["data"]["identity_id"] == identity_id
    
    @pytest.mark.asyncio
    async def test_authenticate_nonexistent_connection_fails(
        self, connection_manager, identity_id
    ):
        """Test that authenticating nonexistent connection fails"""
        success = await connection_manager.authenticate("fake-id", identity_id)
        
        assert success is False
    
    @pytest.mark.asyncio
    async def test_authenticate_tracks_identity_connections(
        self, connection_manager, mock_websocket, identity_id
    ):
        """Test that authentication tracks connections by identity"""
        connection_id = await connection_manager.connect(mock_websocket)
        
        await connection_manager.authenticate(connection_id, identity_id)
        
        # Identity should have this connection
        assert identity_id in connection_manager._identity_connections
        assert connection_id in connection_manager._identity_connections[identity_id]


# =============================================================================
# SUBSCRIPTION TESTS
# =============================================================================

class TestSubscriptions:
    """Test subscription management"""
    
    @pytest.mark.asyncio
    async def test_subscribe_requires_authentication(
        self, connection_manager, mock_websocket, thread_id
    ):
        """Test that subscribing requires authentication"""
        connection_id = await connection_manager.connect(mock_websocket)
        
        # Try to subscribe without authentication
        subscription_id = await connection_manager.subscribe(
            connection_id, 
            SubscriptionType.THREAD, 
            thread_id
        )
        
        assert subscription_id is None
    
    @pytest.mark.asyncio
    async def test_subscribe_after_authentication(
        self, connection_manager, mock_websocket, identity_id, thread_id
    ):
        """Test successful subscription after authentication"""
        connection_id = await connection_manager.connect(mock_websocket)
        await connection_manager.authenticate(connection_id, identity_id)
        
        subscription_id = await connection_manager.subscribe(
            connection_id,
            SubscriptionType.THREAD,
            thread_id
        )
        
        assert subscription_id is not None
        
        # Connection should have subscription
        connection = connection_manager.get_connection(connection_id)
        sub_key = f"{SubscriptionType.THREAD.value}:{thread_id}"
        assert sub_key in connection.subscriptions
    
    @pytest.mark.asyncio
    async def test_unsubscribe(
        self, connection_manager, mock_websocket, identity_id, thread_id
    ):
        """Test unsubscription"""
        connection_id = await connection_manager.connect(mock_websocket)
        await connection_manager.authenticate(connection_id, identity_id)
        await connection_manager.subscribe(connection_id, SubscriptionType.THREAD, thread_id)
        
        result = await connection_manager.unsubscribe(
            connection_id,
            SubscriptionType.THREAD,
            thread_id
        )
        
        assert result is True
        
        connection = connection_manager.get_connection(connection_id)
        sub_key = f"{SubscriptionType.THREAD.value}:{thread_id}"
        assert sub_key not in connection.subscriptions
    
    @pytest.mark.asyncio
    async def test_multiple_subscriptions(
        self, connection_manager, mock_websocket, identity_id
    ):
        """Test multiple subscriptions from one connection"""
        connection_id = await connection_manager.connect(mock_websocket)
        await connection_manager.authenticate(connection_id, identity_id)
        
        thread1 = str(uuid4())
        thread2 = str(uuid4())
        sphere1 = str(uuid4())
        
        await connection_manager.subscribe(connection_id, SubscriptionType.THREAD, thread1)
        await connection_manager.subscribe(connection_id, SubscriptionType.THREAD, thread2)
        await connection_manager.subscribe(connection_id, SubscriptionType.SPHERE, sphere1)
        
        connection = connection_manager.get_connection(connection_id)
        assert len(connection.subscriptions) == 3


# =============================================================================
# BROADCASTING TESTS
# =============================================================================

class TestBroadcasting:
    """Test event broadcasting"""
    
    @pytest.mark.asyncio
    async def test_broadcast_to_subscription(
        self, connection_manager, mock_websocket, identity_id, thread_id
    ):
        """Test broadcasting to subscribers"""
        connection_id = await connection_manager.connect(mock_websocket)
        await connection_manager.authenticate(connection_id, identity_id)
        await connection_manager.subscribe(connection_id, SubscriptionType.THREAD, thread_id)
        
        mock_websocket.send_json.reset_mock()
        
        await connection_manager.broadcast_to_subscription(
            SubscriptionType.THREAD,
            thread_id,
            EventType.THREAD_UPDATED,
            {"test": "data"}
        )
        
        mock_websocket.send_json.assert_called_once()
        call_args = mock_websocket.send_json.call_args[0][0]
        assert call_args["event"] == EventType.THREAD_UPDATED.value
        assert call_args["data"]["test"] == "data"
    
    @pytest.mark.asyncio
    async def test_broadcast_excludes_specified_connection(
        self, connection_manager, identity_id, thread_id
    ):
        """Test that broadcast can exclude a connection"""
        # Create two connections
        ws1 = AsyncMock()
        ws1.accept = AsyncMock()
        ws1.send_json = AsyncMock()
        
        ws2 = AsyncMock()
        ws2.accept = AsyncMock()
        ws2.send_json = AsyncMock()
        
        conn1 = await connection_manager.connect(ws1)
        await connection_manager.authenticate(conn1, identity_id)
        await connection_manager.subscribe(conn1, SubscriptionType.THREAD, thread_id)
        
        identity_id2 = str(uuid4())
        conn2 = await connection_manager.connect(ws2)
        await connection_manager.authenticate(conn2, identity_id2)
        await connection_manager.subscribe(conn2, SubscriptionType.THREAD, thread_id)
        
        ws1.send_json.reset_mock()
        ws2.send_json.reset_mock()
        
        # Broadcast excluding conn1
        await connection_manager.broadcast_to_subscription(
            SubscriptionType.THREAD,
            thread_id,
            EventType.THREAD_UPDATED,
            {"test": "data"},
            exclude_connection=conn1
        )
        
        # ws1 should NOT receive, ws2 should
        ws1.send_json.assert_not_called()
        ws2.send_json.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_broadcast_to_identity(
        self, connection_manager, mock_websocket, identity_id
    ):
        """Test broadcasting to all connections of an identity"""
        connection_id = await connection_manager.connect(mock_websocket)
        await connection_manager.authenticate(connection_id, identity_id)
        
        mock_websocket.send_json.reset_mock()
        
        await connection_manager.broadcast_to_identity(
            identity_id,
            EventType.CHECKPOINT_CREATED,
            {"checkpoint_id": "test-123"}
        )
        
        mock_websocket.send_json.assert_called_once()
        call_args = mock_websocket.send_json.call_args[0][0]
        assert call_args["event"] == EventType.CHECKPOINT_CREATED.value
    
    @pytest.mark.asyncio
    async def test_broadcast_to_nonexistent_subscription_ok(self, connection_manager):
        """Test that broadcasting to nonexistent subscription doesn't error"""
        # Should not raise
        await connection_manager.broadcast_to_subscription(
            SubscriptionType.THREAD,
            "nonexistent-thread",
            EventType.THREAD_UPDATED,
            {"test": "data"}
        )


# =============================================================================
# PRESENCE TESTS
# =============================================================================

class TestPresence:
    """Test presence tracking"""
    
    @pytest.mark.asyncio
    async def test_join_presence(
        self, connection_manager, mock_websocket, identity_id, thread_id
    ):
        """Test joining a presence room"""
        connection_id = await connection_manager.connect(mock_websocket)
        await connection_manager.authenticate(connection_id, identity_id)
        
        await connection_manager.join_presence(connection_id, thread_id)
        
        presence = await connection_manager.get_presence(thread_id)
        assert identity_id in presence
    
    @pytest.mark.asyncio
    async def test_leave_presence(
        self, connection_manager, mock_websocket, identity_id, thread_id
    ):
        """Test leaving a presence room"""
        connection_id = await connection_manager.connect(mock_websocket)
        await connection_manager.authenticate(connection_id, identity_id)
        await connection_manager.join_presence(connection_id, thread_id)
        
        await connection_manager.leave_presence(connection_id, thread_id)
        
        presence = await connection_manager.get_presence(thread_id)
        assert identity_id not in presence
    
    @pytest.mark.asyncio
    async def test_disconnect_clears_presence(
        self, connection_manager, mock_websocket, identity_id, thread_id
    ):
        """Test that disconnecting clears presence"""
        connection_id = await connection_manager.connect(mock_websocket)
        await connection_manager.authenticate(connection_id, identity_id)
        await connection_manager.join_presence(connection_id, thread_id)
        
        await connection_manager.disconnect(connection_id)
        
        # Presence should be empty
        assert connection_id not in connection_manager._presence.get(thread_id, set())


# =============================================================================
# EVENT BROADCASTER TESTS
# =============================================================================

class TestEventBroadcaster:
    """Test EventBroadcaster functionality"""
    
    @pytest.mark.asyncio
    async def test_broadcast_thread_created(
        self, connection_manager, event_broadcaster, mock_websocket, identity_id, thread_id, sphere_id
    ):
        """Test broadcasting thread creation"""
        connection_id = await connection_manager.connect(mock_websocket)
        await connection_manager.authenticate(connection_id, identity_id)
        
        mock_websocket.send_json.reset_mock()
        
        await event_broadcaster.broadcast_thread_created(
            identity_id=identity_id,
            thread_id=thread_id,
            sphere_id=sphere_id,
            thread_data={"founding_intent": "Test thread"}
        )
        
        # Should receive broadcast
        assert mock_websocket.send_json.called
    
    @pytest.mark.asyncio
    @pytest.mark.human_sovereignty
    async def test_checkpoint_broadcast_includes_requires_action(
        self, connection_manager, event_broadcaster, mock_websocket, identity_id
    ):
        """
        Rule #1: Checkpoint broadcasts must indicate action required.
        
        The broadcast notifies but does NOT auto-execute.
        """
        connection_id = await connection_manager.connect(mock_websocket)
        await connection_manager.authenticate(connection_id, identity_id)
        
        mock_websocket.send_json.reset_mock()
        
        await event_broadcaster.broadcast_checkpoint_created(
            identity_id=identity_id,
            checkpoint_id=str(uuid4()),
            checkpoint_type="sensitive_action",
            thread_id=str(uuid4()),
            reason="Action requires approval",
            options=["approve", "reject"],
            preview={"action": "send_email"}
        )
        
        # Find the checkpoint event
        calls = mock_websocket.send_json.call_args_list
        checkpoint_event = None
        for call in calls:
            msg = call[0][0]
            if msg.get("event") == EventType.CHECKPOINT_CREATED.value:
                checkpoint_event = msg
                break
        
        assert checkpoint_event is not None
        assert checkpoint_event["data"]["requires_action"] is True
        assert checkpoint_event["data"]["status"] == "pending"
        assert "approve" in checkpoint_event["data"]["options"]
        assert "reject" in checkpoint_event["data"]["options"]
    
    @pytest.mark.asyncio
    async def test_agent_draft_ready_requires_approval(
        self, connection_manager, event_broadcaster, mock_websocket, identity_id
    ):
        """Test agent draft ready broadcast includes approval flag"""
        connection_id = await connection_manager.connect(mock_websocket)
        await connection_manager.authenticate(connection_id, identity_id)
        
        mock_websocket.send_json.reset_mock()
        
        await event_broadcaster.broadcast_agent_draft_ready(
            identity_id=identity_id,
            execution_id=str(uuid4()),
            agent_id=str(uuid4()),
            draft_type="email",
            draft_preview="Draft email content..."
        )
        
        calls = mock_websocket.send_json.call_args_list
        draft_event = None
        for call in calls:
            msg = call[0][0]
            if msg.get("event") == EventType.AGENT_DRAFT_READY.value:
                draft_event = msg
                break
        
        assert draft_event is not None
        assert draft_event["data"]["requires_approval"] is True
    
    @pytest.mark.asyncio
    async def test_nova_checkpoint_triggered_requires_approval(
        self, connection_manager, event_broadcaster, mock_websocket, identity_id
    ):
        """Test Nova checkpoint triggered broadcast"""
        connection_id = await connection_manager.connect(mock_websocket)
        await connection_manager.authenticate(connection_id, identity_id)
        
        mock_websocket.send_json.reset_mock()
        
        await event_broadcaster.broadcast_nova_checkpoint_triggered(
            identity_id=identity_id,
            request_id=str(uuid4()),
            checkpoint_id=str(uuid4()),
            reason="Email sending requires approval",
            action_preview="Send email to test@example.com"
        )
        
        calls = mock_websocket.send_json.call_args_list
        nova_event = None
        for call in calls:
            msg = call[0][0]
            if msg.get("event") == EventType.NOVA_CHECKPOINT_TRIGGERED.value:
                nova_event = msg
                break
        
        assert nova_event is not None
        assert nova_event["data"]["requires_approval"] is True


# =============================================================================
# R&D COMPLIANCE TESTS
# =============================================================================

class TestRDCompliance:
    """Test R&D rule compliance in WebSocket system"""
    
    @pytest.mark.asyncio
    @pytest.mark.identity_boundary
    async def test_broadcast_to_identity_only_reaches_owner(
        self, connection_manager, identity_id
    ):
        """
        Rule #3: Identity boundary - broadcasts only reach correct identity.
        """
        # Create connections for two different identities
        ws1 = AsyncMock()
        ws1.accept = AsyncMock()
        ws1.send_json = AsyncMock()
        
        ws2 = AsyncMock()
        ws2.accept = AsyncMock()
        ws2.send_json = AsyncMock()
        
        identity1 = identity_id
        identity2 = str(uuid4())
        
        conn1 = await connection_manager.connect(ws1)
        await connection_manager.authenticate(conn1, identity1)
        
        conn2 = await connection_manager.connect(ws2)
        await connection_manager.authenticate(conn2, identity2)
        
        ws1.send_json.reset_mock()
        ws2.send_json.reset_mock()
        
        # Broadcast to identity1 only
        await connection_manager.broadcast_to_identity(
            identity1,
            EventType.CHECKPOINT_CREATED,
            {"test": "data"}
        )
        
        # Only ws1 should receive
        ws1.send_json.assert_called_once()
        ws2.send_json.assert_not_called()
    
    @pytest.mark.asyncio
    @pytest.mark.traceability
    async def test_connection_timestamps_tracked(
        self, connection_manager, mock_websocket, identity_id
    ):
        """
        Rule #6: Traceability - connection timestamps are tracked.
        """
        connection_id = await connection_manager.connect(mock_websocket)
        await connection_manager.authenticate(connection_id, identity_id)
        
        connection = connection_manager.get_connection(connection_id)
        
        assert connection.connected_at is not None
        assert connection.last_activity is not None
        assert isinstance(connection.connected_at, datetime)
    
    @pytest.mark.asyncio
    @pytest.mark.traceability
    async def test_stats_tracked(self, connection_manager, mock_websocket, identity_id):
        """
        Rule #6: Connection and message stats are tracked.
        """
        connection_id = await connection_manager.connect(mock_websocket)
        await connection_manager.authenticate(connection_id, identity_id)
        
        stats = connection_manager.get_stats()
        
        assert "total_connections" in stats
        assert "total_messages_sent" in stats
        assert "active_connections" in stats
        assert stats["total_connections"] >= 1


# =============================================================================
# MESSAGE HANDLING TESTS
# =============================================================================

class TestMessageHandling:
    """Test WebSocket message handling"""
    
    @pytest.mark.asyncio
    async def test_handle_ping(self, connection_manager, mock_websocket, identity_id):
        """Test ping/pong handling"""
        connection_id = await connection_manager.connect(mock_websocket)
        await connection_manager.authenticate(connection_id, identity_id)
        
        response = await connection_manager.handle_message(
            connection_id,
            {"action": "ping"}
        )
        
        assert response is not None
        assert response["action"] == "pong"
    
    @pytest.mark.asyncio
    async def test_handle_subscribe(self, connection_manager, mock_websocket, identity_id, thread_id):
        """Test subscribe message handling"""
        connection_id = await connection_manager.connect(mock_websocket)
        await connection_manager.authenticate(connection_id, identity_id)
        
        response = await connection_manager.handle_message(
            connection_id,
            {
                "action": "subscribe",
                "payload": {
                    "type": "thread",
                    "target_id": thread_id
                }
            }
        )
        
        assert response is not None
        assert response["action"] == "subscribed"
        assert response["subscription_id"] is not None
    
    @pytest.mark.asyncio
    async def test_handle_unknown_action(self, connection_manager, mock_websocket, identity_id):
        """Test handling of unknown action"""
        connection_id = await connection_manager.connect(mock_websocket)
        await connection_manager.authenticate(connection_id, identity_id)
        
        response = await connection_manager.handle_message(
            connection_id,
            {"action": "unknown_action"}
        )
        
        # Should return None (no response for unknown)
        assert response is None


# =============================================================================
# EVENT TYPE TESTS
# =============================================================================

class TestEventTypes:
    """Test event type definitions"""
    
    def test_all_checkpoint_events_defined(self):
        """Test that all checkpoint event types exist"""
        assert EventType.CHECKPOINT_CREATED is not None
        assert EventType.CHECKPOINT_PENDING is not None
        assert EventType.CHECKPOINT_APPROVED is not None
        assert EventType.CHECKPOINT_REJECTED is not None
    
    def test_all_thread_events_defined(self):
        """Test that all Thread event types exist"""
        assert EventType.THREAD_CREATED is not None
        assert EventType.THREAD_UPDATED is not None
        assert EventType.THREAD_ARCHIVED is not None
        assert EventType.THREAD_EVENT_ADDED is not None
    
    def test_all_nova_events_defined(self):
        """Test that all Nova pipeline event types exist"""
        assert EventType.NOVA_PIPELINE_STARTED is not None
        assert EventType.NOVA_LANE_COMPLETED is not None
        assert EventType.NOVA_CHECKPOINT_TRIGGERED is not None
        assert EventType.NOVA_PIPELINE_COMPLETED is not None


# =============================================================================
# SUBSCRIPTION TYPE TESTS
# =============================================================================

class TestSubscriptionTypes:
    """Test subscription type definitions"""
    
    def test_all_subscription_types_defined(self):
        """Test that all subscription types exist"""
        assert SubscriptionType.THREAD is not None
        assert SubscriptionType.SPHERE is not None
        assert SubscriptionType.IDENTITY is not None
        assert SubscriptionType.CHECKPOINT is not None
        assert SubscriptionType.AGENT is not None
        assert SubscriptionType.NOVA is not None
        assert SubscriptionType.SYSTEM is not None
    
    def test_subscription_types_are_strings(self):
        """Test that subscription types are strings"""
        assert SubscriptionType.THREAD.value == "thread"
        assert SubscriptionType.SPHERE.value == "sphere"


# =============================================================================
# INTEGRATION TESTS
# =============================================================================

class TestWebSocketIntegration:
    """Integration tests for WebSocket system"""
    
    @pytest.mark.asyncio
    async def test_full_flow_connect_auth_subscribe_receive(
        self, connection_manager, event_broadcaster, identity_id, thread_id
    ):
        """Test full WebSocket flow from connect to receiving events"""
        # Create mock WebSocket
        ws = AsyncMock()
        ws.accept = AsyncMock()
        ws.send_json = AsyncMock()
        
        # 1. Connect
        connection_id = await connection_manager.connect(ws)
        assert connection_id is not None
        
        # 2. Authenticate
        success = await connection_manager.authenticate(connection_id, identity_id)
        assert success is True
        
        # 3. Subscribe to Thread
        sub_id = await connection_manager.subscribe(
            connection_id, 
            SubscriptionType.THREAD, 
            thread_id
        )
        assert sub_id is not None
        
        # 4. Reset mock to track only broadcast
        ws.send_json.reset_mock()
        
        # 5. Broadcast event
        await event_broadcaster.broadcast_thread_event_added(
            thread_id=thread_id,
            identity_id=identity_id,
            event={"event_type": "note.added", "data": {"content": "Test note"}}
        )
        
        # 6. Verify received
        ws.send_json.assert_called_once()
        call_args = ws.send_json.call_args[0][0]
        assert call_args["event"] == EventType.THREAD_EVENT_ADDED.value
    
    @pytest.mark.asyncio
    async def test_multiple_clients_same_thread(
        self, connection_manager, event_broadcaster, thread_id
    ):
        """Test multiple clients subscribed to same Thread"""
        clients = []
        identity_ids = []
        
        # Create 5 clients subscribed to same Thread
        for i in range(5):
            ws = AsyncMock()
            ws.accept = AsyncMock()
            ws.send_json = AsyncMock()
            
            conn_id = await connection_manager.connect(ws)
            identity_id = str(uuid4())
            await connection_manager.authenticate(conn_id, identity_id)
            await connection_manager.subscribe(conn_id, SubscriptionType.THREAD, thread_id)
            
            clients.append((conn_id, ws))
            identity_ids.append(identity_id)
        
        # Reset all mocks
        for _, ws in clients:
            ws.send_json.reset_mock()
        
        # Broadcast event
        await connection_manager.broadcast_to_subscription(
            SubscriptionType.THREAD,
            thread_id,
            EventType.THREAD_UPDATED,
            {"test": "data"}
        )
        
        # All clients should receive
        for _, ws in clients:
            ws.send_json.assert_called_once()


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
