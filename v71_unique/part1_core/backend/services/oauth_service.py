"""
CHE·NU™ OAuth Service V72

OAuth 2.0 integration for:
- Google Authentication
- Microsoft Authentication
- GitHub Authentication (future)

@version V72.0
@phase Phase 2 - Authentication
"""

import os
import secrets
import hashlib
import json
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, Tuple
from dataclasses import dataclass
from enum import Enum
from uuid import uuid4
import urllib.parse
import base64

from .auth_service import (
    AuthenticationService,
    AuthProvider,
    User,
    AuthResult,
    AuditEventType,
    auth_service
)


# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════

class OAuthConfig:
    """OAuth configuration."""
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    GOOGLE_REDIRECT_URI: str = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3000/auth/google/callback")
    GOOGLE_AUTH_URL: str = "https://accounts.google.com/o/oauth2/v2/auth"
    GOOGLE_TOKEN_URL: str = "https://oauth2.googleapis.com/token"
    GOOGLE_USERINFO_URL: str = "https://www.googleapis.com/oauth2/v2/userinfo"
    GOOGLE_SCOPES: list = ["openid", "email", "profile"]
    
    # Microsoft OAuth
    MICROSOFT_CLIENT_ID: str = os.getenv("MICROSOFT_CLIENT_ID", "")
    MICROSOFT_CLIENT_SECRET: str = os.getenv("MICROSOFT_CLIENT_SECRET", "")
    MICROSOFT_REDIRECT_URI: str = os.getenv("MICROSOFT_REDIRECT_URI", "http://localhost:3000/auth/microsoft/callback")
    MICROSOFT_TENANT: str = os.getenv("MICROSOFT_TENANT", "common")
    MICROSOFT_AUTH_URL: str = f"https://login.microsoftonline.com/{os.getenv('MICROSOFT_TENANT', 'common')}/oauth2/v2.0/authorize"
    MICROSOFT_TOKEN_URL: str = f"https://login.microsoftonline.com/{os.getenv('MICROSOFT_TENANT', 'common')}/oauth2/v2.0/token"
    MICROSOFT_USERINFO_URL: str = "https://graph.microsoft.com/v1.0/me"
    MICROSOFT_SCOPES: list = ["openid", "email", "profile", "User.Read"]
    
    # GitHub OAuth (future)
    GITHUB_CLIENT_ID: str = os.getenv("GITHUB_CLIENT_ID", "")
    GITHUB_CLIENT_SECRET: str = os.getenv("GITHUB_CLIENT_SECRET", "")
    GITHUB_REDIRECT_URI: str = os.getenv("GITHUB_REDIRECT_URI", "http://localhost:3000/auth/github/callback")
    GITHUB_AUTH_URL: str = "https://github.com/login/oauth/authorize"
    GITHUB_TOKEN_URL: str = "https://github.com/login/oauth/access_token"
    GITHUB_USERINFO_URL: str = "https://api.github.com/user"
    GITHUB_SCOPES: list = ["read:user", "user:email"]
    
    # Security
    STATE_EXPIRY_MINUTES: int = 10
    PKCE_ENABLED: bool = True


# ═══════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════

@dataclass
class OAuthState:
    """OAuth state for CSRF protection."""
    state: str
    provider: AuthProvider
    code_verifier: Optional[str]  # For PKCE
    redirect_uri: str
    created_at: datetime
    metadata: Dict[str, Any]


@dataclass
class OAuthUserInfo:
    """User info from OAuth provider."""
    provider: AuthProvider
    provider_user_id: str
    email: str
    name: Optional[str]
    picture: Optional[str]
    verified: bool
    raw_data: Dict[str, Any]


@dataclass
class OAuthTokens:
    """OAuth tokens from provider."""
    access_token: str
    token_type: str
    expires_in: Optional[int]
    refresh_token: Optional[str]
    scope: Optional[str]
    id_token: Optional[str]


# ═══════════════════════════════════════════════════════════════════════════
# PKCE UTILITIES
# ═══════════════════════════════════════════════════════════════════════════

class PKCEService:
    """PKCE (Proof Key for Code Exchange) utilities."""
    
    @staticmethod
    def generate_code_verifier() -> str:
        """Generate random code verifier."""
        return secrets.token_urlsafe(64)
    
    @staticmethod
    def generate_code_challenge(verifier: str) -> str:
        """Generate code challenge from verifier (S256 method)."""
        digest = hashlib.sha256(verifier.encode()).digest()
        return base64.urlsafe_b64encode(digest).rstrip(b'=').decode()


# ═══════════════════════════════════════════════════════════════════════════
# HTTP CLIENT (Simplified - use httpx/aiohttp in production)
# ═══════════════════════════════════════════════════════════════════════════

class SimpleHTTPClient:
    """
    Simplified HTTP client for OAuth requests.
    In production, use httpx or aiohttp for async support.
    """
    
    @staticmethod
    def post(url: str, data: Dict[str, Any], headers: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        POST request (mock implementation).
        Replace with actual HTTP client in production.
        """
        # This is a placeholder - in production, use:
        # import httpx
        # response = httpx.post(url, data=data, headers=headers)
        # return response.json()
        
        print(f"[HTTP] POST {url}")
        print(f"[HTTP] Data: {data}")
        
        # Mock response for testing
        return {
            "access_token": f"mock_access_token_{secrets.token_hex(16)}",
            "token_type": "Bearer",
            "expires_in": 3600,
            "refresh_token": f"mock_refresh_token_{secrets.token_hex(16)}",
            "scope": "openid email profile",
            "id_token": "mock_id_token"
        }
    
    @staticmethod
    def get(url: str, headers: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        GET request (mock implementation).
        Replace with actual HTTP client in production.
        """
        print(f"[HTTP] GET {url}")
        
        # Mock response for testing
        if "google" in url:
            return {
                "id": "google_12345",
                "email": "user@gmail.com",
                "verified_email": True,
                "name": "Test User",
                "picture": "https://example.com/photo.jpg"
            }
        elif "microsoft" in url or "graph.microsoft" in url:
            return {
                "id": "microsoft_12345",
                "mail": "user@outlook.com",
                "displayName": "Test User",
                "userPrincipalName": "user@outlook.com"
            }
        elif "github" in url:
            return {
                "id": 12345,
                "email": "user@github.com",
                "name": "Test User",
                "avatar_url": "https://github.com/avatar.jpg"
            }
        
        return {}


http_client = SimpleHTTPClient()


# ═══════════════════════════════════════════════════════════════════════════
# OAUTH SERVICE
# ═══════════════════════════════════════════════════════════════════════════

class OAuthService:
    """OAuth authentication service."""
    
    def __init__(self, auth_service: AuthenticationService):
        self.auth_service = auth_service
        self._states: Dict[str, OAuthState] = {}  # In production: use Redis
    
    # ─────────────────────────────────────────────────────────────────────────
    # State Management
    # ─────────────────────────────────────────────────────────────────────────
    
    def _create_state(
        self,
        provider: AuthProvider,
        redirect_uri: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> OAuthState:
        """Create OAuth state for CSRF protection."""
        state = secrets.token_urlsafe(32)
        code_verifier = PKCEService.generate_code_verifier() if OAuthConfig.PKCE_ENABLED else None
        
        oauth_state = OAuthState(
            state=state,
            provider=provider,
            code_verifier=code_verifier,
            redirect_uri=redirect_uri,
            created_at=datetime.utcnow(),
            metadata=metadata or {}
        )
        
        self._states[state] = oauth_state
        return oauth_state
    
    def _verify_state(self, state: str) -> Optional[OAuthState]:
        """Verify and consume OAuth state."""
        oauth_state = self._states.pop(state, None)
        
        if not oauth_state:
            return None
        
        # Check expiry
        expiry = oauth_state.created_at + timedelta(minutes=OAuthConfig.STATE_EXPIRY_MINUTES)
        if datetime.utcnow() > expiry:
            return None
        
        return oauth_state
    
    # ─────────────────────────────────────────────────────────────────────────
    # Authorization URL Generation
    # ─────────────────────────────────────────────────────────────────────────
    
    def get_authorization_url(
        self,
        provider: AuthProvider,
        redirect_uri: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Tuple[str, str]:
        """
        Get OAuth authorization URL.
        Returns (url, state).
        """
        if provider == AuthProvider.GOOGLE:
            return self._get_google_auth_url(redirect_uri, metadata)
        elif provider == AuthProvider.MICROSOFT:
            return self._get_microsoft_auth_url(redirect_uri, metadata)
        elif provider == AuthProvider.GITHUB:
            return self._get_github_auth_url(redirect_uri, metadata)
        else:
            raise ValueError(f"Unsupported OAuth provider: {provider}")
    
    def _get_google_auth_url(
        self,
        redirect_uri: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Tuple[str, str]:
        """Get Google OAuth authorization URL."""
        redirect = redirect_uri or OAuthConfig.GOOGLE_REDIRECT_URI
        state = self._create_state(AuthProvider.GOOGLE, redirect, metadata)
        
        params = {
            "client_id": OAuthConfig.GOOGLE_CLIENT_ID,
            "redirect_uri": redirect,
            "response_type": "code",
            "scope": " ".join(OAuthConfig.GOOGLE_SCOPES),
            "state": state.state,
            "access_type": "offline",  # Request refresh token
            "prompt": "consent"
        }
        
        if state.code_verifier:
            params["code_challenge"] = PKCEService.generate_code_challenge(state.code_verifier)
            params["code_challenge_method"] = "S256"
        
        url = f"{OAuthConfig.GOOGLE_AUTH_URL}?{urllib.parse.urlencode(params)}"
        return url, state.state
    
    def _get_microsoft_auth_url(
        self,
        redirect_uri: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Tuple[str, str]:
        """Get Microsoft OAuth authorization URL."""
        redirect = redirect_uri or OAuthConfig.MICROSOFT_REDIRECT_URI
        state = self._create_state(AuthProvider.MICROSOFT, redirect, metadata)
        
        params = {
            "client_id": OAuthConfig.MICROSOFT_CLIENT_ID,
            "redirect_uri": redirect,
            "response_type": "code",
            "scope": " ".join(OAuthConfig.MICROSOFT_SCOPES),
            "state": state.state,
            "response_mode": "query"
        }
        
        if state.code_verifier:
            params["code_challenge"] = PKCEService.generate_code_challenge(state.code_verifier)
            params["code_challenge_method"] = "S256"
        
        url = f"{OAuthConfig.MICROSOFT_AUTH_URL}?{urllib.parse.urlencode(params)}"
        return url, state.state
    
    def _get_github_auth_url(
        self,
        redirect_uri: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Tuple[str, str]:
        """Get GitHub OAuth authorization URL."""
        redirect = redirect_uri or OAuthConfig.GITHUB_REDIRECT_URI
        state = self._create_state(AuthProvider.GITHUB, redirect, metadata)
        
        params = {
            "client_id": OAuthConfig.GITHUB_CLIENT_ID,
            "redirect_uri": redirect,
            "scope": " ".join(OAuthConfig.GITHUB_SCOPES),
            "state": state.state
        }
        
        url = f"{OAuthConfig.GITHUB_AUTH_URL}?{urllib.parse.urlencode(params)}"
        return url, state.state
    
    # ─────────────────────────────────────────────────────────────────────────
    # Callback Handling
    # ─────────────────────────────────────────────────────────────────────────
    
    def handle_callback(
        self,
        provider: AuthProvider,
        code: str,
        state: str,
        device_info: Dict[str, str],
        ip_address: str,
        user_agent: str
    ) -> AuthResult:
        """
        Handle OAuth callback.
        Exchange code for tokens, get user info, create/login user.
        """
        # Verify state
        oauth_state = self._verify_state(state)
        if not oauth_state:
            return AuthResult(
                success=False,
                error="Invalid or expired state",
                error_code="INVALID_STATE"
            )
        
        if oauth_state.provider != provider:
            return AuthResult(
                success=False,
                error="Provider mismatch",
                error_code="PROVIDER_MISMATCH"
            )
        
        try:
            # Exchange code for tokens
            tokens = self._exchange_code(provider, code, oauth_state)
            
            # Get user info
            user_info = self._get_user_info(provider, tokens)
            
            # Find or create user
            user = self._find_or_create_user(user_info, ip_address, user_agent)
            
            # Complete authentication
            return self.auth_service._complete_authentication(
                user, device_info, ip_address, user_agent
            )
            
        except Exception as e:
            self.auth_service.audit_service.log_event(
                AuditEventType.LOGIN_FAILED,
                ip_address,
                user_agent,
                success=False,
                details={"provider": provider.value, "error": str(e)}
            )
            return AuthResult(
                success=False,
                error=f"OAuth authentication failed: {str(e)}",
                error_code="OAUTH_ERROR"
            )
    
    def _exchange_code(
        self,
        provider: AuthProvider,
        code: str,
        state: OAuthState
    ) -> OAuthTokens:
        """Exchange authorization code for tokens."""
        if provider == AuthProvider.GOOGLE:
            return self._exchange_google_code(code, state)
        elif provider == AuthProvider.MICROSOFT:
            return self._exchange_microsoft_code(code, state)
        elif provider == AuthProvider.GITHUB:
            return self._exchange_github_code(code, state)
        else:
            raise ValueError(f"Unsupported provider: {provider}")
    
    def _exchange_google_code(self, code: str, state: OAuthState) -> OAuthTokens:
        """Exchange Google authorization code for tokens."""
        data = {
            "client_id": OAuthConfig.GOOGLE_CLIENT_ID,
            "client_secret": OAuthConfig.GOOGLE_CLIENT_SECRET,
            "code": code,
            "redirect_uri": state.redirect_uri,
            "grant_type": "authorization_code"
        }
        
        if state.code_verifier:
            data["code_verifier"] = state.code_verifier
        
        response = http_client.post(OAuthConfig.GOOGLE_TOKEN_URL, data)
        
        return OAuthTokens(
            access_token=response["access_token"],
            token_type=response.get("token_type", "Bearer"),
            expires_in=response.get("expires_in"),
            refresh_token=response.get("refresh_token"),
            scope=response.get("scope"),
            id_token=response.get("id_token")
        )
    
    def _exchange_microsoft_code(self, code: str, state: OAuthState) -> OAuthTokens:
        """Exchange Microsoft authorization code for tokens."""
        data = {
            "client_id": OAuthConfig.MICROSOFT_CLIENT_ID,
            "client_secret": OAuthConfig.MICROSOFT_CLIENT_SECRET,
            "code": code,
            "redirect_uri": state.redirect_uri,
            "grant_type": "authorization_code",
            "scope": " ".join(OAuthConfig.MICROSOFT_SCOPES)
        }
        
        if state.code_verifier:
            data["code_verifier"] = state.code_verifier
        
        response = http_client.post(OAuthConfig.MICROSOFT_TOKEN_URL, data)
        
        return OAuthTokens(
            access_token=response["access_token"],
            token_type=response.get("token_type", "Bearer"),
            expires_in=response.get("expires_in"),
            refresh_token=response.get("refresh_token"),
            scope=response.get("scope"),
            id_token=response.get("id_token")
        )
    
    def _exchange_github_code(self, code: str, state: OAuthState) -> OAuthTokens:
        """Exchange GitHub authorization code for tokens."""
        data = {
            "client_id": OAuthConfig.GITHUB_CLIENT_ID,
            "client_secret": OAuthConfig.GITHUB_CLIENT_SECRET,
            "code": code,
            "redirect_uri": state.redirect_uri
        }
        
        headers = {"Accept": "application/json"}
        response = http_client.post(OAuthConfig.GITHUB_TOKEN_URL, data, headers)
        
        return OAuthTokens(
            access_token=response["access_token"],
            token_type=response.get("token_type", "Bearer"),
            expires_in=response.get("expires_in"),
            refresh_token=response.get("refresh_token"),
            scope=response.get("scope"),
            id_token=None
        )
    
    def _get_user_info(self, provider: AuthProvider, tokens: OAuthTokens) -> OAuthUserInfo:
        """Get user info from OAuth provider."""
        if provider == AuthProvider.GOOGLE:
            return self._get_google_user_info(tokens)
        elif provider == AuthProvider.MICROSOFT:
            return self._get_microsoft_user_info(tokens)
        elif provider == AuthProvider.GITHUB:
            return self._get_github_user_info(tokens)
        else:
            raise ValueError(f"Unsupported provider: {provider}")
    
    def _get_google_user_info(self, tokens: OAuthTokens) -> OAuthUserInfo:
        """Get user info from Google."""
        headers = {"Authorization": f"Bearer {tokens.access_token}"}
        response = http_client.get(OAuthConfig.GOOGLE_USERINFO_URL, headers)
        
        return OAuthUserInfo(
            provider=AuthProvider.GOOGLE,
            provider_user_id=response["id"],
            email=response["email"],
            name=response.get("name"),
            picture=response.get("picture"),
            verified=response.get("verified_email", False),
            raw_data=response
        )
    
    def _get_microsoft_user_info(self, tokens: OAuthTokens) -> OAuthUserInfo:
        """Get user info from Microsoft."""
        headers = {"Authorization": f"Bearer {tokens.access_token}"}
        response = http_client.get(OAuthConfig.MICROSOFT_USERINFO_URL, headers)
        
        email = response.get("mail") or response.get("userPrincipalName", "")
        
        return OAuthUserInfo(
            provider=AuthProvider.MICROSOFT,
            provider_user_id=response["id"],
            email=email,
            name=response.get("displayName"),
            picture=None,  # Microsoft Graph requires separate call for photo
            verified=True,  # Microsoft accounts are verified
            raw_data=response
        )
    
    def _get_github_user_info(self, tokens: OAuthTokens) -> OAuthUserInfo:
        """Get user info from GitHub."""
        headers = {"Authorization": f"Bearer {tokens.access_token}"}
        response = http_client.get(OAuthConfig.GITHUB_USERINFO_URL, headers)
        
        return OAuthUserInfo(
            provider=AuthProvider.GITHUB,
            provider_user_id=str(response["id"]),
            email=response.get("email", ""),
            name=response.get("name"),
            picture=response.get("avatar_url"),
            verified=True,  # GitHub accounts are verified
            raw_data=response
        )
    
    def _find_or_create_user(
        self,
        user_info: OAuthUserInfo,
        ip_address: str,
        user_agent: str
    ) -> User:
        """Find existing user or create new one from OAuth info."""
        # First, try to find by provider user ID
        for user in self.auth_service._users.values():
            if (user.auth_provider == user_info.provider and 
                user.provider_user_id == user_info.provider_user_id):
                return user
        
        # Try to find by email
        existing_user = self.auth_service.get_user_by_email(user_info.email)
        
        if existing_user:
            # Link OAuth to existing account
            if existing_user.auth_provider == AuthProvider.LOCAL:
                # User exists with password, link OAuth
                existing_user.provider_user_id = user_info.provider_user_id
                existing_user.metadata["oauth_linked"] = {
                    user_info.provider.value: {
                        "linked_at": datetime.utcnow().isoformat(),
                        "provider_user_id": user_info.provider_user_id
                    }
                }
                return existing_user
            else:
                # User exists with different OAuth provider
                raise ValueError(
                    f"Email already registered with {existing_user.auth_provider.value}"
                )
        
        # Create new user
        now = datetime.utcnow()
        user = User(
            id=str(uuid4()),
            email=user_info.email,
            password_hash="",  # No password for OAuth users
            salt="",
            created_at=now,
            updated_at=now,
            is_active=True,
            is_verified=user_info.verified,
            auth_provider=user_info.provider,
            provider_user_id=user_info.provider_user_id,
            metadata={
                "name": user_info.name,
                "picture": user_info.picture,
                "oauth_data": user_info.raw_data
            }
        )
        
        self.auth_service._users[user.id] = user
        
        self.auth_service.audit_service.log_event(
            AuditEventType.LOGIN_SUCCESS,
            ip_address,
            user_agent,
            success=True,
            user_id=user.id,
            details={"provider": user_info.provider.value, "new_user": True}
        )
        
        return user
    
    # ─────────────────────────────────────────────────────────────────────────
    # Account Linking
    # ─────────────────────────────────────────────────────────────────────────
    
    def link_account(
        self,
        user_id: str,
        provider: AuthProvider,
        code: str,
        state: str,
        ip_address: str,
        user_agent: str
    ) -> Tuple[bool, Optional[str]]:
        """
        Link OAuth account to existing user.
        Returns (success, error_message).
        """
        # Verify state
        oauth_state = self._verify_state(state)
        if not oauth_state:
            return False, "Invalid or expired state"
        
        if oauth_state.provider != provider:
            return False, "Provider mismatch"
        
        user = self.auth_service.get_user(user_id)
        if not user:
            return False, "User not found"
        
        try:
            # Exchange code for tokens
            tokens = self._exchange_code(provider, code, oauth_state)
            
            # Get user info
            user_info = self._get_user_info(provider, tokens)
            
            # Check if OAuth account is already linked to another user
            for existing_user in self.auth_service._users.values():
                if (existing_user.id != user_id and
                    existing_user.auth_provider == provider and
                    existing_user.provider_user_id == user_info.provider_user_id):
                    return False, "This account is already linked to another user"
            
            # Link account
            if "oauth_linked" not in user.metadata:
                user.metadata["oauth_linked"] = {}
            
            user.metadata["oauth_linked"][provider.value] = {
                "linked_at": datetime.utcnow().isoformat(),
                "provider_user_id": user_info.provider_user_id,
                "email": user_info.email
            }
            
            self.auth_service.audit_service.log_event(
                AuditEventType.LOGIN_SUCCESS,
                ip_address,
                user_agent,
                success=True,
                user_id=user_id,
                details={"action": "link_account", "provider": provider.value}
            )
            
            return True, None
            
        except Exception as e:
            return False, str(e)
    
    def unlink_account(
        self,
        user_id: str,
        provider: AuthProvider,
        ip_address: str,
        user_agent: str
    ) -> Tuple[bool, Optional[str]]:
        """
        Unlink OAuth account from user.
        Returns (success, error_message).
        """
        user = self.auth_service.get_user(user_id)
        if not user:
            return False, "User not found"
        
        # Cannot unlink primary OAuth provider without password
        if user.auth_provider == provider and not user.password_hash:
            return False, "Cannot unlink primary authentication method without password"
        
        # Remove from linked accounts
        if "oauth_linked" in user.metadata and provider.value in user.metadata["oauth_linked"]:
            del user.metadata["oauth_linked"][provider.value]
        
        # If unlinking primary provider, update auth_provider
        if user.auth_provider == provider:
            user.auth_provider = AuthProvider.LOCAL
            user.provider_user_id = None
        
        self.auth_service.audit_service.log_event(
            AuditEventType.LOGOUT,
            ip_address,
            user_agent,
            success=True,
            user_id=user_id,
            details={"action": "unlink_account", "provider": provider.value}
        )
        
        return True, None
    
    def get_linked_accounts(self, user_id: str) -> Dict[str, Dict[str, Any]]:
        """Get all linked OAuth accounts for user."""
        user = self.auth_service.get_user(user_id)
        if not user:
            return {}
        
        linked = {}
        
        # Primary provider
        if user.auth_provider != AuthProvider.LOCAL:
            linked[user.auth_provider.value] = {
                "provider_user_id": user.provider_user_id,
                "is_primary": True
            }
        
        # Linked providers
        if "oauth_linked" in user.metadata:
            for provider, data in user.metadata["oauth_linked"].items():
                if provider not in linked:
                    linked[provider] = {
                        **data,
                        "is_primary": False
                    }
        
        return linked


# ═══════════════════════════════════════════════════════════════════════════
# SINGLETON INSTANCE
# ═══════════════════════════════════════════════════════════════════════════

oauth_service = OAuthService(auth_service)


# ═══════════════════════════════════════════════════════════════════════════
# TEST
# ═══════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("=" * 60)
    print("CHE·NU™ OAuth Service V72 - Test")
    print("=" * 60)
    
    # Test Google OAuth URL generation
    print("\n1. Generate Google OAuth URL...")
    google_url, google_state = oauth_service.get_authorization_url(
        AuthProvider.GOOGLE,
        metadata={"source": "test"}
    )
    print(f"   URL: {google_url[:80]}...")
    print(f"   State: {google_state}")
    
    # Test Microsoft OAuth URL generation
    print("\n2. Generate Microsoft OAuth URL...")
    microsoft_url, microsoft_state = oauth_service.get_authorization_url(
        AuthProvider.MICROSOFT
    )
    print(f"   URL: {microsoft_url[:80]}...")
    print(f"   State: {microsoft_state}")
    
    # Test GitHub OAuth URL generation
    print("\n3. Generate GitHub OAuth URL...")
    github_url, github_state = oauth_service.get_authorization_url(
        AuthProvider.GITHUB
    )
    print(f"   URL: {github_url[:80]}...")
    print(f"   State: {github_state}")
    
    # Test callback handling (mock)
    print("\n4. Handle Google OAuth callback...")
    result = oauth_service.handle_callback(
        provider=AuthProvider.GOOGLE,
        code="mock_authorization_code",
        state=google_state,
        device_info={"device_id": "test-device", "name": "Test Device"},
        ip_address="192.168.1.1",
        user_agent="Test/1.0"
    )
    
    if result.success:
        print(f"   ✓ OAuth login successful")
        print(f"   - User ID: {result.user_id}")
        print(f"   - Session ID: {result.session_id}")
    else:
        print(f"   ✗ OAuth login failed: {result.error}")
    
    # Test get linked accounts
    if result.success:
        print("\n5. Get linked accounts...")
        linked = oauth_service.get_linked_accounts(result.user_id)
        print(f"   Linked accounts: {list(linked.keys())}")
    
    print("\n" + "=" * 60)
    print("Test complete!")
    print("=" * 60)
