"""
CHE·NU™ Authentication API Routes V72

FastAPI routes for authentication:
- Login/Register
- 2FA
- OAuth
- Sessions
- Password management

@version V72.0
@phase Phase 2 - Authentication
"""

from fastapi import APIRouter, HTTPException, Depends, Request, Response, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Import services
from ..services.auth_service import (
    auth_service,
    AuthenticationService,
    JWTService,
    TwoFactorService,
    PasswordService,
    AuthResult,
    TokenPayload,
    TokenType,
    AuditEventType,
    User,
)
from ..services.oauth_service import oauth_service, OAuthService, AuthProvider


# ═══════════════════════════════════════════════════════════════════════════
# ROUTER SETUP
# ═══════════════════════════════════════════════════════════════════════════

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer(auto_error=False)


# ═══════════════════════════════════════════════════════════════════════════
# REQUEST/RESPONSE MODELS
# ═══════════════════════════════════════════════════════════════════════════

# Login
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    device_info: Dict[str, str] = Field(default_factory=dict)


class AuthResponse(BaseModel):
    success: bool
    user: Optional[Dict[str, Any]] = None
    tokens: Optional[Dict[str, Any]] = None
    session_id: Optional[str] = None
    requires_2fa: bool = False
    two_factor_token: Optional[str] = None
    error: Optional[str] = None
    error_code: Optional[str] = None


# Register
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    device_info: Dict[str, str] = Field(default_factory=dict)


# 2FA
class Verify2FARequest(BaseModel):
    two_factor_token: str
    code: str
    is_backup_code: bool = False
    device_info: Dict[str, str] = Field(default_factory=dict)


class Enable2FAResponse(BaseModel):
    secret: str
    qr_code_uri: str
    backup_codes: List[str]


class Confirm2FARequest(BaseModel):
    code: str


class Disable2FARequest(BaseModel):
    password: str


# OAuth
class OAuthCallbackRequest(BaseModel):
    code: str
    state: str
    device_info: Dict[str, str] = Field(default_factory=dict)


# Password
class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    password: str = Field(min_length=8)


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8)


# Session
class LogoutRequest(BaseModel):
    session_id: str


class LogoutAllRequest(BaseModel):
    except_session_id: Optional[str] = None


# Refresh
class RefreshRequest(BaseModel):
    refresh_token: str


# ═══════════════════════════════════════════════════════════════════════════
# UTILITIES
# ═══════════════════════════════════════════════════════════════════════════

def get_client_info(request: Request) -> tuple:
    """Extract client IP and user agent from request."""
    ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown")
    return ip, user_agent


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Optional[User]:
    """Get current authenticated user from token."""
    if not credentials:
        return None
    
    payload = JWTService.verify_token(credentials.credentials)
    if not payload or payload.type != TokenType.ACCESS:
        return None
    
    return auth_service.get_user(payload.sub)


async def require_auth(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    """Require authenticated user."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    payload = JWTService.verify_token(credentials.credentials)
    if not payload or payload.type != TokenType.ACCESS:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user = auth_service.get_user(payload.sub)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user


def user_to_dict(user: User) -> Dict[str, Any]:
    """Convert User to dictionary for response."""
    return {
        "id": user.id,
        "email": user.email,
        "name": user.metadata.get("name"),
        "picture": user.metadata.get("picture"),
        "is_verified": user.is_verified,
        "two_factor_enabled": user.two_factor_enabled,
        "auth_provider": user.auth_provider.value,
        "created_at": user.created_at.isoformat(),
        "last_login": user.last_login.isoformat() if user.last_login else None,
    }


def auth_result_to_response(result: AuthResult) -> AuthResponse:
    """Convert AuthResult to response."""
    response = AuthResponse(
        success=result.success,
        requires_2fa=result.requires_2fa,
        two_factor_token=result.two_factor_token,
        error=result.error,
        error_code=result.error_code,
    )
    
    if result.success and not result.requires_2fa:
        user = auth_service.get_user(result.user_id) if result.user_id else None
        
        if user:
            response.user = user_to_dict(user)
        
        if result.access_token and result.refresh_token:
            response.tokens = {
                "access_token": result.access_token,
                "refresh_token": result.refresh_token,
                "expires_in": result.expires_in or 900,
                "token_type": "Bearer",
            }
        
        response.session_id = result.session_id
    
    return response


# ═══════════════════════════════════════════════════════════════════════════
# AUTHENTICATION ROUTES
# ═══════════════════════════════════════════════════════════════════════════

@router.post("/login", response_model=AuthResponse)
async def login(request: Request, body: LoginRequest):
    """Authenticate with email and password."""
    ip, user_agent = get_client_info(request)
    
    result = auth_service.authenticate(
        email=body.email,
        password=body.password,
        device_info=body.device_info,
        ip_address=ip,
        user_agent=user_agent
    )
    
    return auth_result_to_response(result)


@router.post("/register", response_model=AuthResponse)
async def register(request: Request, body: RegisterRequest):
    """Register new user."""
    ip, user_agent = get_client_info(request)
    
    # Validate password strength
    is_valid, errors = PasswordService.validate_password_strength(body.password)
    if not is_valid:
        return AuthResponse(
            success=False,
            error="; ".join(errors),
            error_code="WEAK_PASSWORD"
        )
    
    # Create user
    user, error = auth_service.register_user(
        email=body.email,
        password=body.password,
        ip_address=ip,
        user_agent=user_agent
    )
    
    if not user:
        return AuthResponse(
            success=False,
            error=error or "Registration failed",
            error_code="REGISTRATION_FAILED"
        )
    
    # Auto-login after registration
    result = auth_service.authenticate(
        email=body.email,
        password=body.password,
        device_info=body.device_info,
        ip_address=ip,
        user_agent=user_agent
    )
    
    return auth_result_to_response(result)


@router.post("/logout")
async def logout(request: Request, body: LogoutRequest):
    """Logout current session."""
    ip, user_agent = get_client_info(request)
    
    success = auth_service.logout(
        session_id=body.session_id,
        ip_address=ip,
        user_agent=user_agent
    )
    
    return {"success": success}


@router.post("/logout-all")
async def logout_all(
    request: Request,
    body: LogoutAllRequest,
    user: User = Depends(require_auth)
):
    """Logout from all devices except current."""
    ip, user_agent = get_client_info(request)
    
    count = auth_service.logout_all_devices(
        user_id=user.id,
        current_session_id=body.except_session_id,
        ip_address=ip,
        user_agent=user_agent
    )
    
    return {"success": True, "revoked_count": count}


@router.post("/refresh", response_model=AuthResponse)
async def refresh_tokens(request: Request, body: RefreshRequest):
    """Refresh access token."""
    ip, user_agent = get_client_info(request)
    
    result = auth_service.refresh_tokens(
        refresh_token=body.refresh_token,
        ip_address=ip,
        user_agent=user_agent
    )
    
    return auth_result_to_response(result)


# ═══════════════════════════════════════════════════════════════════════════
# 2FA ROUTES
# ═══════════════════════════════════════════════════════════════════════════

@router.post("/2fa/verify", response_model=AuthResponse)
async def verify_2fa(request: Request, body: Verify2FARequest):
    """Verify 2FA code and complete login."""
    ip, user_agent = get_client_info(request)
    
    result = auth_service.verify_two_factor(
        two_factor_token=body.two_factor_token,
        code=body.code,
        device_info=body.device_info,
        ip_address=ip,
        user_agent=user_agent,
        is_backup_code=body.is_backup_code
    )
    
    return auth_result_to_response(result)


@router.post("/2fa/enable", response_model=Enable2FAResponse)
async def enable_2fa(
    request: Request,
    user: User = Depends(require_auth)
):
    """Enable 2FA for current user."""
    ip, user_agent = get_client_info(request)
    
    secret, uri, backup_codes = auth_service.enable_two_factor(
        user_id=user.id,
        ip_address=ip,
        user_agent=user_agent
    )
    
    if not secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to enable 2FA"
        )
    
    return Enable2FAResponse(
        secret=secret,
        qr_code_uri=uri,
        backup_codes=backup_codes
    )


@router.post("/2fa/confirm")
async def confirm_2fa(
    request: Request,
    body: Confirm2FARequest,
    user: User = Depends(require_auth)
):
    """Confirm 2FA setup with verification code."""
    ip, user_agent = get_client_info(request)
    
    success = auth_service.confirm_two_factor(
        user_id=user.id,
        code=body.code,
        ip_address=ip,
        user_agent=user_agent
    )
    
    return {"success": success}


@router.post("/2fa/disable")
async def disable_2fa(
    request: Request,
    body: Disable2FARequest,
    user: User = Depends(require_auth)
):
    """Disable 2FA for current user."""
    ip, user_agent = get_client_info(request)
    
    success = auth_service.disable_two_factor(
        user_id=user.id,
        password=body.password,
        ip_address=ip,
        user_agent=user_agent
    )
    
    return {"success": success}


@router.post("/2fa/backup-codes")
async def regenerate_backup_codes(
    request: Request,
    body: Disable2FARequest,  # Reuse password verification
    user: User = Depends(require_auth)
):
    """Regenerate backup codes."""
    # Verify password
    if not PasswordService.verify_password(body.password, user.password_hash, user.salt):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password"
        )
    
    # Generate new backup codes
    new_codes = PasswordService.generate_backup_codes()
    user.backup_codes = new_codes
    
    return {"backup_codes": new_codes}


# ═══════════════════════════════════════════════════════════════════════════
# OAUTH ROUTES
# ═══════════════════════════════════════════════════════════════════════════

@router.get("/oauth/{provider}/authorize")
async def oauth_authorize(provider: str):
    """Get OAuth authorization URL."""
    try:
        auth_provider = AuthProvider(provider)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported provider: {provider}"
        )
    
    url, state = oauth_service.get_authorization_url(auth_provider)
    
    return {"url": url, "state": state}


@router.post("/oauth/{provider}/callback", response_model=AuthResponse)
async def oauth_callback(
    provider: str,
    request: Request,
    body: OAuthCallbackRequest
):
    """Handle OAuth callback."""
    ip, user_agent = get_client_info(request)
    
    try:
        auth_provider = AuthProvider(provider)
    except ValueError:
        return AuthResponse(
            success=False,
            error=f"Unsupported provider: {provider}",
            error_code="UNSUPPORTED_PROVIDER"
        )
    
    result = oauth_service.handle_callback(
        provider=auth_provider,
        code=body.code,
        state=body.state,
        device_info=body.device_info,
        ip_address=ip,
        user_agent=user_agent
    )
    
    return auth_result_to_response(result)


@router.get("/oauth/{provider}/link")
async def oauth_link(
    provider: str,
    user: User = Depends(require_auth)
):
    """Get URL to link OAuth account."""
    try:
        auth_provider = AuthProvider(provider)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported provider: {provider}"
        )
    
    url, state = oauth_service.get_authorization_url(
        auth_provider,
        metadata={"action": "link", "user_id": user.id}
    )
    
    return {"url": url, "state": state}


@router.post("/oauth/{provider}/unlink")
async def oauth_unlink(
    provider: str,
    request: Request,
    user: User = Depends(require_auth)
):
    """Unlink OAuth account."""
    ip, user_agent = get_client_info(request)
    
    try:
        auth_provider = AuthProvider(provider)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported provider: {provider}"
        )
    
    success, error = oauth_service.unlink_account(
        user_id=user.id,
        provider=auth_provider,
        ip_address=ip,
        user_agent=user_agent
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error
        )
    
    return {"success": True}


@router.get("/oauth/linked")
async def get_linked_accounts(user: User = Depends(require_auth)):
    """Get all linked OAuth accounts."""
    accounts = oauth_service.get_linked_accounts(user.id)
    
    return {
        "accounts": [
            {
                "provider": provider,
                **data
            }
            for provider, data in accounts.items()
        ]
    }


# ═══════════════════════════════════════════════════════════════════════════
# SESSION ROUTES
# ═══════════════════════════════════════════════════════════════════════════

@router.get("/sessions")
async def get_sessions(user: User = Depends(require_auth)):
    """Get all active sessions."""
    sessions = auth_service.session_service.get_user_sessions(user.id)
    
    return {
        "sessions": [
            {
                "id": session.id,
                "device_id": session.device_id,
                "device_info": session.device_info,
                "ip_address": session.ip_address,
                "created_at": session.created_at.isoformat(),
                "last_activity": session.last_activity.isoformat(),
            }
            for session in sessions
        ]
    }


@router.delete("/sessions/{session_id}")
async def revoke_session(
    session_id: str,
    request: Request,
    user: User = Depends(require_auth)
):
    """Revoke specific session."""
    ip, user_agent = get_client_info(request)
    
    # Verify session belongs to user
    session = auth_service.session_service.get_session(session_id)
    if not session or session.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    success = auth_service.session_service.revoke_session(session_id)
    
    auth_service.audit_service.log_event(
        AuditEventType.SESSION_REVOKED,
        ip,
        user_agent,
        success=True,
        user_id=user.id,
        details={"revoked_session_id": session_id}
    )
    
    return {"success": success}


# ═══════════════════════════════════════════════════════════════════════════
# PASSWORD ROUTES
# ═══════════════════════════════════════════════════════════════════════════

@router.post("/password/reset-request")
async def request_password_reset(request: Request, body: PasswordResetRequest):
    """Request password reset email."""
    ip, user_agent = get_client_info(request)
    
    user = auth_service.get_user_by_email(body.email)
    
    # Always return success to prevent email enumeration
    if user:
        # In production: send reset email
        # For now, just log the request
        auth_service.audit_service.log_event(
            AuditEventType.PASSWORD_RESET_REQUEST,
            ip,
            user_agent,
            success=True,
            user_id=user.id
        )
    
    return {"success": True, "message": "If the email exists, a reset link has been sent"}


@router.post("/password/reset")
async def reset_password(request: Request, body: PasswordResetConfirm):
    """Reset password with token."""
    ip, user_agent = get_client_info(request)
    
    # In production: verify reset token
    # For now, this is a placeholder
    
    return {"success": True}


@router.post("/password/change")
async def change_password(
    request: Request,
    body: PasswordChangeRequest,
    user: User = Depends(require_auth)
):
    """Change password for authenticated user."""
    ip, user_agent = get_client_info(request)
    
    # Verify current password
    if not PasswordService.verify_password(
        body.current_password,
        user.password_hash,
        user.salt
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid current password"
        )
    
    # Validate new password
    is_valid, errors = PasswordService.validate_password_strength(body.new_password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="; ".join(errors)
        )
    
    # Update password
    new_hash, new_salt = PasswordService.hash_password(body.new_password)
    user.password_hash = new_hash
    user.salt = new_salt
    user.updated_at = datetime.utcnow()
    
    auth_service.audit_service.log_event(
        AuditEventType.PASSWORD_CHANGE,
        ip,
        user_agent,
        success=True,
        user_id=user.id
    )
    
    return {"success": True}


# ═══════════════════════════════════════════════════════════════════════════
# USER ROUTES
# ═══════════════════════════════════════════════════════════════════════════

@router.get("/me")
async def get_current_user_info(user: User = Depends(require_auth)):
    """Get current user info."""
    return {"user": user_to_dict(user)}


@router.patch("/me")
async def update_user_info(
    updates: Dict[str, Any],
    user: User = Depends(require_auth)
):
    """Update current user info."""
    allowed_fields = {"name", "picture"}
    
    for field, value in updates.items():
        if field in allowed_fields:
            user.metadata[field] = value
    
    user.updated_at = datetime.utcnow()
    
    return {"user": user_to_dict(user)}


# ═══════════════════════════════════════════════════════════════════════════
# HEALTH CHECK
# ═══════════════════════════════════════════════════════════════════════════

@router.get("/health")
async def health_check():
    """Auth service health check."""
    return {
        "status": "healthy",
        "service": "auth",
        "timestamp": datetime.utcnow().isoformat()
    }
