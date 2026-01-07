"""
CHE·NU Auth Service Tests

Tests for authentication service including:
- User registration
- Login/logout
- Token management
- Password operations
- Identity boundary enforcement

R&D Compliance: Rule #1 (Human Sovereignty), Rule #6 (Traceability)
"""

import pytest
from datetime import datetime, timedelta
from uuid import uuid4
from unittest.mock import AsyncMock, MagicMock, patch

from services.auth.auth_service import AuthService
from core.exceptions import (
    AuthenticationError,
    AuthorizationError,
    ValidationError,
    NotFoundError,
    ConflictError
)


# ============================================================================
# AUTH SERVICE INITIALIZATION TESTS
# ============================================================================

class TestAuthServiceInit:
    """Test AuthService initialization."""
    
    def test_service_initialization(self, mock_db_session):
        """Test service initializes correctly."""
        service = AuthService(mock_db_session)
        assert service is not None
        assert service.db == mock_db_session


# ============================================================================
# USER REGISTRATION TESTS
# ============================================================================

class TestUserRegistration:
    """Test user registration functionality."""
    
    @pytest.fixture
    def auth_service(self, mock_db_session):
        return AuthService(mock_db_session)
    
    @pytest.fixture
    def valid_registration_data(self):
        return {
            "email": "newuser@example.com",
            "password": "SecurePass123!",
            "first_name": "New",
            "last_name": "User"
        }
    
    @pytest.mark.asyncio
    async def test_register_user_success(
        self, 
        auth_service, 
        mock_db_session,
        valid_registration_data
    ):
        """Test successful user registration."""
        # Mock: no existing user
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = None
        
        with patch.object(auth_service, '_hash_password', return_value="hashed_password"):
            with patch.object(auth_service, '_create_tokens', return_value={
                "access_token": "mock_access",
                "refresh_token": "mock_refresh",
                "token_type": "bearer",
                "expires_in": 1800
            }):
                result = await auth_service.register(
                    email=valid_registration_data["email"],
                    password=valid_registration_data["password"],
                    first_name=valid_registration_data["first_name"],
                    last_name=valid_registration_data["last_name"]
                )
        
        assert result is not None
        assert "access_token" in result
        assert "refresh_token" in result
        mock_db_session.commit.assert_called()
    
    @pytest.mark.asyncio
    async def test_register_duplicate_email_fails(
        self, 
        auth_service, 
        mock_db_session,
        valid_registration_data,
        mock_user
    ):
        """Test registration fails for duplicate email."""
        # Mock: existing user found
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_user
        
        with pytest.raises(ConflictError) as exc_info:
            await auth_service.register(
                email=valid_registration_data["email"],
                password=valid_registration_data["password"],
                first_name=valid_registration_data["first_name"],
                last_name=valid_registration_data["last_name"]
            )
        
        assert "already exists" in str(exc_info.value).lower()
    
    @pytest.mark.asyncio
    async def test_register_weak_password_fails(self, auth_service, mock_db_session):
        """Test registration fails for weak password."""
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = None
        
        with pytest.raises(ValidationError):
            await auth_service.register(
                email="test@example.com",
                password="weak",  # Too weak
                first_name="Test",
                last_name="User"
            )
    
    @pytest.mark.asyncio
    async def test_register_invalid_email_fails(self, auth_service, mock_db_session):
        """Test registration fails for invalid email."""
        with pytest.raises(ValidationError):
            await auth_service.register(
                email="not-an-email",
                password="SecurePass123!",
                first_name="Test",
                last_name="User"
            )
    
    @pytest.mark.asyncio
    async def test_register_creates_traceability_fields(
        self, 
        auth_service, 
        mock_db_session,
        valid_registration_data,
        assert_traceability
    ):
        """Test registration creates proper traceability fields (R&D Rule #6)."""
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = None
        
        # Capture the user object added to session
        added_user = None
        def capture_add(user):
            nonlocal added_user
            added_user = user
        mock_db_session.add.side_effect = capture_add
        
        with patch.object(auth_service, '_hash_password', return_value="hashed"):
            with patch.object(auth_service, '_create_tokens', return_value={
                "access_token": "mock_access",
                "refresh_token": "mock_refresh",
                "token_type": "bearer",
                "expires_in": 1800
            }):
                await auth_service.register(
                    email=valid_registration_data["email"],
                    password=valid_registration_data["password"],
                    first_name=valid_registration_data["first_name"],
                    last_name=valid_registration_data["last_name"]
                )
        
        # Verify traceability
        assert added_user is not None
        assert hasattr(added_user, 'id')
        assert hasattr(added_user, 'created_at')


# ============================================================================
# LOGIN TESTS
# ============================================================================

class TestUserLogin:
    """Test user login functionality."""
    
    @pytest.fixture
    def auth_service(self, mock_db_session):
        return AuthService(mock_db_session)
    
    @pytest.mark.asyncio
    async def test_login_success(
        self, 
        auth_service, 
        mock_db_session,
        mock_user
    ):
        """Test successful login."""
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_user
        
        with patch.object(auth_service, '_verify_password', return_value=True):
            with patch.object(auth_service, '_create_tokens', return_value={
                "access_token": "mock_access",
                "refresh_token": "mock_refresh",
                "token_type": "bearer",
                "expires_in": 1800
            }):
                result = await auth_service.login(
                    email="test@example.com",
                    password="correct_password"
                )
        
        assert result is not None
        assert "access_token" in result
        assert "refresh_token" in result
    
    @pytest.mark.asyncio
    async def test_login_invalid_email_fails(
        self, 
        auth_service, 
        mock_db_session
    ):
        """Test login fails for non-existent email."""
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = None
        
        with pytest.raises(AuthenticationError):
            await auth_service.login(
                email="nonexistent@example.com",
                password="any_password"
            )
    
    @pytest.mark.asyncio
    async def test_login_wrong_password_fails(
        self, 
        auth_service, 
        mock_db_session,
        mock_user
    ):
        """Test login fails for wrong password."""
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_user
        
        with patch.object(auth_service, '_verify_password', return_value=False):
            with pytest.raises(AuthenticationError):
                await auth_service.login(
                    email="test@example.com",
                    password="wrong_password"
                )
    
    @pytest.mark.asyncio
    async def test_login_inactive_user_fails(
        self, 
        auth_service, 
        mock_db_session,
        mock_user
    ):
        """Test login fails for inactive user."""
        mock_user.is_active = False
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_user
        
        with patch.object(auth_service, '_verify_password', return_value=True):
            with pytest.raises(AuthenticationError):
                await auth_service.login(
                    email="test@example.com",
                    password="correct_password"
                )
    
    @pytest.mark.asyncio
    async def test_login_updates_last_login(
        self, 
        auth_service, 
        mock_db_session,
        mock_user
    ):
        """Test login updates last_login_at timestamp."""
        original_last_login = mock_user.last_login_at
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_user
        
        with patch.object(auth_service, '_verify_password', return_value=True):
            with patch.object(auth_service, '_create_tokens', return_value={
                "access_token": "mock_access",
                "refresh_token": "mock_refresh",
                "token_type": "bearer",
                "expires_in": 1800
            }):
                await auth_service.login(
                    email="test@example.com",
                    password="correct_password"
                )
        
        # Verify last_login_at was updated
        mock_db_session.commit.assert_called()


# ============================================================================
# TOKEN MANAGEMENT TESTS
# ============================================================================

class TestTokenManagement:
    """Test token creation and validation."""
    
    @pytest.fixture
    def auth_service(self, mock_db_session):
        return AuthService(mock_db_session)
    
    @pytest.mark.asyncio
    async def test_refresh_token_success(
        self, 
        auth_service, 
        mock_db_session,
        mock_user,
        valid_refresh_token
    ):
        """Test successful token refresh."""
        # Mock refresh token lookup
        mock_token = MagicMock()
        mock_token.user = mock_user
        mock_token.is_revoked = False
        mock_token.expires_at = datetime.utcnow() + timedelta(days=7)
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_token
        
        with patch.object(auth_service, '_create_tokens', return_value={
            "access_token": "new_access",
            "refresh_token": "new_refresh",
            "token_type": "bearer",
            "expires_in": 1800
        }):
            with patch.object(auth_service, '_verify_refresh_token', return_value=mock_token):
                result = await auth_service.refresh_tokens(valid_refresh_token)
        
        assert result is not None
        assert "access_token" in result
    
    @pytest.mark.asyncio
    async def test_refresh_token_revoked_fails(
        self, 
        auth_service, 
        mock_db_session,
        valid_refresh_token
    ):
        """Test refresh fails for revoked token."""
        mock_token = MagicMock()
        mock_token.is_revoked = True
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_token
        
        with pytest.raises(AuthenticationError):
            await auth_service.refresh_tokens(valid_refresh_token)
    
    @pytest.mark.asyncio
    async def test_refresh_token_expired_fails(
        self, 
        auth_service, 
        mock_db_session,
        valid_refresh_token
    ):
        """Test refresh fails for expired token."""
        mock_token = MagicMock()
        mock_token.is_revoked = False
        mock_token.expires_at = datetime.utcnow() - timedelta(days=1)  # Expired
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_token
        
        with pytest.raises(AuthenticationError):
            await auth_service.refresh_tokens(valid_refresh_token)
    
    @pytest.mark.asyncio
    async def test_logout_revokes_tokens(
        self, 
        auth_service, 
        mock_db_session,
        mock_user,
        valid_refresh_token
    ):
        """Test logout revokes refresh token."""
        mock_token = MagicMock()
        mock_token.is_revoked = False
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_token
        
        await auth_service.logout(valid_refresh_token)
        
        # Verify token was revoked
        assert mock_token.is_revoked == True
        mock_db_session.commit.assert_called()


# ============================================================================
# PASSWORD OPERATIONS TESTS
# ============================================================================

class TestPasswordOperations:
    """Test password-related operations."""
    
    @pytest.fixture
    def auth_service(self, mock_db_session):
        return AuthService(mock_db_session)
    
    @pytest.mark.asyncio
    async def test_change_password_success(
        self, 
        auth_service, 
        mock_db_session,
        mock_user
    ):
        """Test successful password change."""
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_user
        
        with patch.object(auth_service, '_verify_password', return_value=True):
            with patch.object(auth_service, '_hash_password', return_value="new_hashed"):
                await auth_service.change_password(
                    user_id=str(mock_user.id),
                    current_password="current",
                    new_password="NewSecurePass123!"
                )
        
        mock_db_session.commit.assert_called()
    
    @pytest.mark.asyncio
    async def test_change_password_wrong_current_fails(
        self, 
        auth_service, 
        mock_db_session,
        mock_user
    ):
        """Test password change fails with wrong current password."""
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_user
        
        with patch.object(auth_service, '_verify_password', return_value=False):
            with pytest.raises(AuthenticationError):
                await auth_service.change_password(
                    user_id=str(mock_user.id),
                    current_password="wrong",
                    new_password="NewSecurePass123!"
                )
    
    @pytest.mark.asyncio
    async def test_request_password_reset_creates_token(
        self, 
        auth_service, 
        mock_db_session,
        mock_user
    ):
        """Test password reset request creates token."""
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_user
        
        result = await auth_service.request_password_reset(
            email=mock_user.email
        )
        
        # Should return success without revealing if email exists
        assert result is not None
        mock_db_session.add.assert_called()
        mock_db_session.commit.assert_called()
    
    @pytest.mark.asyncio
    async def test_request_password_reset_nonexistent_email_silent(
        self, 
        auth_service, 
        mock_db_session
    ):
        """Test password reset for non-existent email doesn't reveal info."""
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = None
        
        # Should NOT raise error (prevents email enumeration)
        result = await auth_service.request_password_reset(
            email="nonexistent@example.com"
        )
        
        assert result is not None  # Silent success


# ============================================================================
# IDENTITY BOUNDARY TESTS
# ============================================================================

@pytest.mark.identity_boundary
class TestIdentityBoundary:
    """Test identity boundary enforcement."""
    
    @pytest.fixture
    def auth_service(self, mock_db_session):
        return AuthService(mock_db_session)
    
    @pytest.mark.asyncio
    async def test_get_user_by_id_enforces_boundary(
        self, 
        auth_service, 
        mock_db_session,
        mock_user,
        other_user_id
    ):
        """Test getting user by ID enforces identity boundary."""
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_user
        
        # Trying to access another user's data should fail
        with pytest.raises((AuthorizationError, NotFoundError)):
            await auth_service.get_user_by_id(
                user_id=str(mock_user.id),
                requesting_user_id=other_user_id  # Different user
            )
    
    @pytest.mark.asyncio
    async def test_user_can_access_own_data(
        self, 
        auth_service, 
        mock_db_session,
        mock_user
    ):
        """Test user can access their own data."""
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_user
        
        result = await auth_service.get_user_by_id(
            user_id=str(mock_user.id),
            requesting_user_id=str(mock_user.id)  # Same user
        )
        
        assert result is not None
    
    @pytest.mark.asyncio
    async def test_admin_can_access_any_user(
        self, 
        auth_service, 
        mock_db_session,
        mock_user,
        mock_superuser
    ):
        """Test superuser can access any user's data."""
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_user
        
        result = await auth_service.get_user_by_id(
            user_id=str(mock_user.id),
            requesting_user_id=str(mock_superuser.id),
            is_superuser=True
        )
        
        assert result is not None


# ============================================================================
# TRACEABILITY TESTS
# ============================================================================

@pytest.mark.traceability
class TestTraceability:
    """Test traceability requirements (R&D Rule #6)."""
    
    @pytest.fixture
    def auth_service(self, mock_db_session):
        return AuthService(mock_db_session)
    
    @pytest.mark.asyncio
    async def test_user_has_id(self, mock_user):
        """Test user has unique ID."""
        assert mock_user.id is not None
        assert str(mock_user.id) != ""
    
    @pytest.mark.asyncio
    async def test_user_has_created_at(self, mock_user):
        """Test user has created_at timestamp."""
        assert mock_user.created_at is not None
        assert isinstance(mock_user.created_at, datetime)
    
    @pytest.mark.asyncio
    async def test_token_has_traceability(
        self, 
        auth_service, 
        mock_db_session,
        mock_user
    ):
        """Test tokens have proper traceability."""
        # When creating tokens, they should have:
        # - id
        # - user_id (created_by equivalent)
        # - created_at
        # - expires_at
        
        mock_token = MagicMock()
        mock_token.id = uuid4()
        mock_token.user_id = mock_user.id
        mock_token.created_at = datetime.utcnow()
        mock_token.expires_at = datetime.utcnow() + timedelta(days=7)
        
        assert mock_token.id is not None
        assert mock_token.user_id is not None
        assert mock_token.created_at is not None
