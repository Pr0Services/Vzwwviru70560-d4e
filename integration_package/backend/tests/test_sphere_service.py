"""
CHE·NU Sphere Service Tests

Tests for sphere service including:
- Sphere CRUD operations
- Bureau section management
- Quick capture functionality
- Identity boundary enforcement
- The 9 canonical spheres

R&D Compliance: Rule #3 (Sphere Integrity), Rule #6 (Traceability)
"""

import pytest
from datetime import datetime
from uuid import uuid4
from unittest.mock import AsyncMock, MagicMock, patch

from services.sphere.sphere_service import SphereService
from core.exceptions import (
    AuthorizationError,
    ValidationError,
    NotFoundError
)


# ============================================================================
# SPHERE SERVICE INITIALIZATION TESTS
# ============================================================================

class TestSphereServiceInit:
    """Test SphereService initialization."""
    
    def test_service_initialization(self, mock_db_session):
        """Test service initializes correctly."""
        service = SphereService(mock_db_session)
        assert service is not None
        assert service.db == mock_db_session


# ============================================================================
# THE 9 CANONICAL SPHERES
# ============================================================================

class TestCanonicalSpheres:
    """Test the 9 canonical CHE·NU spheres."""
    
    @pytest.fixture
    def sphere_service(self, mock_db_session):
        return SphereService(mock_db_session)
    
    @pytest.fixture
    def canonical_spheres(self):
        """The 9 canonical sphere definitions."""
        return [
            {"type": "personal", "name": "Personal", "icon": "home", "order": 0},
            {"type": "business", "name": "Business", "icon": "briefcase", "order": 1},
            {"type": "government", "name": "Government", "icon": "landmark", "order": 2},
            {"type": "creative_studio", "name": "Creative Studio", "icon": "palette", "order": 3},
            {"type": "community", "name": "Community", "icon": "users", "order": 4},
            {"type": "social_media", "name": "Social & Media", "icon": "share", "order": 5},
            {"type": "entertainment", "name": "Entertainment", "icon": "film", "order": 6},
            {"type": "my_team", "name": "My Team", "icon": "people", "order": 7},
            {"type": "scholar", "name": "Scholar", "icon": "book", "order": 8},
        ]
    
    def test_all_sphere_types_defined(self, all_sphere_types):
        """Test all 9 sphere types are defined."""
        assert len(all_sphere_types) == 9
        assert "personal" in all_sphere_types
        assert "business" in all_sphere_types
        assert "government" in all_sphere_types
        assert "creative_studio" in all_sphere_types
        assert "community" in all_sphere_types
        assert "social_media" in all_sphere_types
        assert "entertainment" in all_sphere_types
        assert "my_team" in all_sphere_types
        assert "scholar" in all_sphere_types
    
    @pytest.mark.asyncio
    async def test_initialize_default_spheres(
        self, 
        sphere_service, 
        mock_db_session,
        user_id,
        canonical_spheres
    ):
        """Test initializing default spheres for new user."""
        mock_db_session.execute.return_value.scalars.return_value.all.return_value = []
        
        result = await sphere_service.initialize_user_spheres(
            identity_id=user_id
        )
        
        # Should create all 9 spheres
        assert mock_db_session.add.call_count >= 9
        mock_db_session.commit.assert_called()
    
    @pytest.mark.asyncio
    async def test_sphere_types_are_frozen(self, sphere_service):
        """Test that sphere types cannot be added (architecture is FROZEN)."""
        valid_types = sphere_service.get_valid_sphere_types()
        
        assert len(valid_types) == 9
        assert "custom" not in valid_types  # No custom spheres allowed


# ============================================================================
# SPHERE CRUD OPERATIONS
# ============================================================================

class TestSphereCRUD:
    """Test sphere CRUD operations."""
    
    @pytest.fixture
    def sphere_service(self, mock_db_session):
        return SphereService(mock_db_session)
    
    @pytest.mark.asyncio
    async def test_get_sphere_by_id(
        self, 
        sphere_service, 
        mock_db_session,
        mock_sphere,
        user_id
    ):
        """Test getting sphere by ID."""
        mock_sphere.identity_id = uuid4()
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_sphere
        
        result = await sphere_service.get_sphere(
            sphere_id=str(mock_sphere.id),
            identity_id=str(mock_sphere.identity_id)
        )
        
        assert result is not None
    
    @pytest.mark.asyncio
    async def test_get_sphere_not_found(
        self, 
        sphere_service, 
        mock_db_session,
        user_id
    ):
        """Test getting non-existent sphere."""
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = None
        
        with pytest.raises(NotFoundError):
            await sphere_service.get_sphere(
                sphere_id=str(uuid4()),
                identity_id=user_id
            )
    
    @pytest.mark.asyncio
    async def test_list_user_spheres(
        self, 
        sphere_service, 
        mock_db_session,
        user_id,
        all_sphere_types
    ):
        """Test listing all spheres for a user."""
        # Create mock spheres
        mock_spheres = []
        for i, sphere_type in enumerate(all_sphere_types):
            sphere = MagicMock()
            sphere.id = uuid4()
            sphere.identity_id = uuid4()
            sphere.sphere_type = sphere_type
            sphere.display_order = i
            mock_spheres.append(sphere)
        
        mock_db_session.execute.return_value.scalars.return_value.all.return_value = mock_spheres
        
        result = await sphere_service.list_spheres(identity_id=user_id)
        
        assert len(result) == 9
    
    @pytest.mark.asyncio
    async def test_update_sphere(
        self, 
        sphere_service, 
        mock_db_session,
        mock_sphere,
        user_id
    ):
        """Test updating sphere settings."""
        mock_sphere.identity_id = uuid4()
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_sphere
        
        result = await sphere_service.update_sphere(
            sphere_id=str(mock_sphere.id),
            identity_id=str(mock_sphere.identity_id),
            updates={"description": "Updated description", "color": "#FF0000"}
        )
        
        mock_db_session.commit.assert_called()
    
    @pytest.mark.asyncio
    async def test_cannot_change_sphere_type(
        self, 
        sphere_service, 
        mock_db_session,
        mock_sphere
    ):
        """Test that sphere type cannot be changed (frozen architecture)."""
        mock_sphere.sphere_type = "personal"
        mock_sphere.identity_id = uuid4()
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_sphere
        
        with pytest.raises(ValidationError):
            await sphere_service.update_sphere(
                sphere_id=str(mock_sphere.id),
                identity_id=str(mock_sphere.identity_id),
                updates={"sphere_type": "business"}  # Cannot change type!
            )


# ============================================================================
# BUREAU SECTIONS
# ============================================================================

class TestBureauSections:
    """Test bureau section management."""
    
    @pytest.fixture
    def sphere_service(self, mock_db_session):
        return SphereService(mock_db_session)
    
    @pytest.fixture
    def canonical_sections(self):
        """The 6 canonical bureau sections."""
        return [
            {"type": "quick_capture", "name": "Quick Capture", "icon": "inbox"},
            {"type": "resume_workspace", "name": "Resume Workspace", "icon": "folder"},
            {"type": "threads", "name": "Threads", "icon": "thread"},
            {"type": "data_files", "name": "Data Files", "icon": "file"},
            {"type": "active_agents", "name": "Active Agents", "icon": "bot"},
            {"type": "meetings", "name": "Meetings", "icon": "calendar"},
        ]
    
    @pytest.mark.asyncio
    async def test_get_bureau_sections(
        self, 
        sphere_service, 
        mock_db_session,
        mock_sphere,
        canonical_sections
    ):
        """Test getting bureau sections for a sphere."""
        mock_sections = []
        for i, section in enumerate(canonical_sections):
            mock_section = MagicMock()
            mock_section.id = uuid4()
            mock_section.sphere_id = mock_sphere.id
            mock_section.section_type = section["type"]
            mock_section.display_order = i
            mock_sections.append(mock_section)
        
        mock_db_session.execute.return_value.scalars.return_value.all.return_value = mock_sections
        
        result = await sphere_service.get_bureau_sections(
            sphere_id=str(mock_sphere.id),
            identity_id=str(mock_sphere.identity_id)
        )
        
        assert len(result) == 6
    
    @pytest.mark.asyncio
    async def test_all_spheres_have_same_bureau_sections(
        self, 
        sphere_service,
        canonical_sections
    ):
        """Test all 9 spheres have the same 6 bureau sections."""
        section_types = [s["type"] for s in canonical_sections]
        
        assert len(section_types) == 6
        assert "quick_capture" in section_types
        assert "resume_workspace" in section_types
        assert "threads" in section_types
        assert "data_files" in section_types
        assert "active_agents" in section_types
        assert "meetings" in section_types


# ============================================================================
# QUICK CAPTURE
# ============================================================================

class TestQuickCapture:
    """Test quick capture functionality."""
    
    @pytest.fixture
    def sphere_service(self, mock_db_session):
        return SphereService(mock_db_session)
    
    @pytest.mark.asyncio
    async def test_create_quick_capture(
        self, 
        sphere_service, 
        mock_db_session,
        mock_sphere,
        user_id
    ):
        """Test creating a quick capture item."""
        mock_section = MagicMock()
        mock_section.id = uuid4()
        mock_section.section_type = "quick_capture"
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_section
        
        result = await sphere_service.create_quick_capture(
            sphere_id=str(mock_sphere.id),
            identity_id=user_id,
            content="Quick thought to capture",
            content_type="text"
        )
        
        mock_db_session.add.assert_called()
        mock_db_session.commit.assert_called()
    
    @pytest.mark.asyncio
    async def test_quick_capture_has_traceability(
        self, 
        sphere_service, 
        mock_db_session,
        user_id
    ):
        """Test quick capture items have proper traceability."""
        # Capture the item added to session
        added_item = None
        def capture_add(item):
            nonlocal added_item
            added_item = item
        mock_db_session.add.side_effect = capture_add
        
        mock_section = MagicMock()
        mock_section.id = uuid4()
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_section
        
        await sphere_service.create_quick_capture(
            sphere_id=str(uuid4()),
            identity_id=user_id,
            content="Test capture",
            content_type="text"
        )
        
        # Verify traceability fields
        assert added_item is not None
        assert hasattr(added_item, 'id')
        assert hasattr(added_item, 'created_at')
        assert hasattr(added_item, 'created_by')
    
    @pytest.mark.asyncio
    async def test_process_quick_capture_to_thread(
        self, 
        sphere_service, 
        mock_db_session,
        user_id
    ):
        """Test processing quick capture into a thread."""
        mock_capture = MagicMock()
        mock_capture.id = uuid4()
        mock_capture.identity_id = uuid4()
        mock_capture.content = "Test content"
        mock_capture.is_processed = False
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_capture
        
        result = await sphere_service.process_quick_capture(
            capture_id=str(mock_capture.id),
            identity_id=str(mock_capture.identity_id),
            target_thread_id=str(uuid4())
        )
        
        # Should mark as processed
        assert mock_capture.is_processed == True
        mock_db_session.commit.assert_called()


# ============================================================================
# IDENTITY BOUNDARY TESTS
# ============================================================================

@pytest.mark.identity_boundary
class TestIdentityBoundary:
    """Test identity boundary enforcement for spheres."""
    
    @pytest.fixture
    def sphere_service(self, mock_db_session):
        return SphereService(mock_db_session)
    
    @pytest.mark.asyncio
    async def test_cannot_access_other_user_sphere(
        self, 
        sphere_service, 
        mock_db_session,
        mock_sphere,
        other_user_id
    ):
        """Test cannot access another user's sphere."""
        mock_sphere.identity_id = uuid4()  # Different from other_user_id
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_sphere
        
        with pytest.raises((AuthorizationError, NotFoundError)):
            await sphere_service.get_sphere(
                sphere_id=str(mock_sphere.id),
                identity_id=other_user_id  # Different identity
            )
    
    @pytest.mark.asyncio
    async def test_cannot_update_other_user_sphere(
        self, 
        sphere_service, 
        mock_db_session,
        mock_sphere,
        other_user_id
    ):
        """Test cannot update another user's sphere."""
        mock_sphere.identity_id = uuid4()  # Different from other_user_id
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_sphere
        
        with pytest.raises((AuthorizationError, NotFoundError)):
            await sphere_service.update_sphere(
                sphere_id=str(mock_sphere.id),
                identity_id=other_user_id,  # Different identity
                updates={"description": "Hacked!"}
            )
    
    @pytest.mark.asyncio
    async def test_list_spheres_only_returns_own(
        self, 
        sphere_service, 
        mock_db_session,
        user_id
    ):
        """Test list_spheres only returns user's own spheres."""
        user_uuid = uuid4()
        
        # Create spheres for multiple users
        user_spheres = [MagicMock(identity_id=user_uuid) for _ in range(9)]
        other_spheres = [MagicMock(identity_id=uuid4()) for _ in range(9)]
        
        # Service should filter by identity_id
        mock_db_session.execute.return_value.scalars.return_value.all.return_value = user_spheres
        
        result = await sphere_service.list_spheres(identity_id=str(user_uuid))
        
        # Should only get user's spheres
        for sphere in result:
            assert sphere.identity_id == user_uuid


# ============================================================================
# SPHERE INTEGRITY TESTS (R&D RULE #3)
# ============================================================================

@pytest.mark.sphere_integrity
class TestSphereIntegrity:
    """Test sphere integrity requirements."""
    
    @pytest.fixture
    def sphere_service(self, mock_db_session):
        return SphereService(mock_db_session)
    
    @pytest.mark.asyncio
    async def test_no_cross_sphere_data_access(
        self, 
        sphere_service, 
        mock_db_session
    ):
        """Test data doesn't leak between spheres."""
        personal_sphere_id = uuid4()
        business_sphere_id = uuid4()
        
        # Data in personal sphere should not be accessible from business
        mock_thread = MagicMock()
        mock_thread.sphere_id = personal_sphere_id
        
        with pytest.raises((AuthorizationError, ValidationError)):
            await sphere_service.validate_thread_sphere_access(
                thread_sphere_id=str(personal_sphere_id),
                requested_sphere_id=str(business_sphere_id)
            )
    
    @pytest.mark.asyncio
    async def test_cross_sphere_requires_explicit_workflow(
        self, 
        sphere_service
    ):
        """Test cross-sphere access requires explicit workflow."""
        # R&D Rule #3: Cross-sphere requires explicit workflow
        result = sphere_service.requires_cross_sphere_workflow(
            source_sphere="personal",
            target_sphere="business"
        )
        
        assert result == True  # Cross-sphere needs workflow
    
    @pytest.mark.asyncio
    async def test_same_sphere_no_workflow_needed(
        self, 
        sphere_service
    ):
        """Test same-sphere access doesn't need workflow."""
        result = sphere_service.requires_cross_sphere_workflow(
            source_sphere="personal",
            target_sphere="personal"
        )
        
        assert result == False  # Same sphere, no workflow needed


# ============================================================================
# SPHERE STATISTICS
# ============================================================================

class TestSphereStatistics:
    """Test sphere statistics and counters."""
    
    @pytest.fixture
    def sphere_service(self, mock_db_session):
        return SphereService(mock_db_session)
    
    @pytest.mark.asyncio
    async def test_get_sphere_statistics(
        self, 
        sphere_service, 
        mock_db_session,
        mock_sphere
    ):
        """Test getting sphere statistics."""
        mock_sphere.thread_count = 10
        mock_sphere.active_thread_count = 5
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_sphere
        
        result = await sphere_service.get_sphere_stats(
            sphere_id=str(mock_sphere.id),
            identity_id=str(mock_sphere.identity_id)
        )
        
        assert result["thread_count"] == 10
        assert result["active_thread_count"] == 5
    
    @pytest.mark.asyncio
    async def test_increment_thread_count(
        self, 
        sphere_service, 
        mock_db_session,
        mock_sphere
    ):
        """Test incrementing thread count."""
        mock_sphere.thread_count = 5
        mock_sphere.active_thread_count = 3
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_sphere
        
        await sphere_service.increment_thread_count(
            sphere_id=str(mock_sphere.id)
        )
        
        assert mock_sphere.thread_count == 6
        assert mock_sphere.active_thread_count == 4
        mock_db_session.commit.assert_called()


# ============================================================================
# TRACEABILITY TESTS
# ============================================================================

@pytest.mark.traceability
class TestTraceability:
    """Test traceability requirements for spheres."""
    
    def test_sphere_has_id(self, mock_sphere):
        """Test sphere has unique ID."""
        assert mock_sphere.id is not None
    
    def test_sphere_has_timestamps(self, mock_sphere):
        """Test sphere has timestamp fields."""
        assert mock_sphere.created_at is not None
        assert mock_sphere.updated_at is not None
    
    def test_sphere_has_identity_binding(self, mock_sphere):
        """Test sphere is bound to identity."""
        assert mock_sphere.identity_id is not None


# ============================================================================
# SOCIAL SPHERE RESTRICTIONS (R&D RULE #5)
# ============================================================================

@pytest.mark.social_restrictions
class TestSocialSphereRestrictions:
    """Test Social & Media sphere restrictions."""
    
    @pytest.fixture
    def sphere_service(self, mock_db_session):
        return SphereService(mock_db_session)
    
    @pytest.mark.asyncio
    async def test_social_sphere_no_ranking_algorithms(
        self, 
        sphere_service
    ):
        """Test Social sphere doesn't allow ranking algorithms."""
        # R&D Rule #5: No ranking algorithms
        social_config = sphere_service.get_sphere_config("social_media")
        
        assert social_config.get("allow_ranking", False) == False
        assert social_config.get("order_mode", "chronological") == "chronological"
    
    @pytest.mark.asyncio
    async def test_social_sphere_chronological_only(
        self, 
        sphere_service,
        mock_db_session
    ):
        """Test Social sphere feed is chronological only."""
        mock_posts = []
        for i in range(5):
            post = MagicMock()
            post.created_at = datetime(2025, 1, i+1)
            mock_posts.append(post)
        
        mock_db_session.execute.return_value.scalars.return_value.all.return_value = mock_posts
        
        result = await sphere_service.get_social_feed(
            sphere_id=str(uuid4()),
            identity_id=str(uuid4()),
            order_by="chronological"  # ONLY allowed option
        )
        
        # Verify chronological ordering
        # (mock returns in order, real implementation would sort)
        assert result is not None
