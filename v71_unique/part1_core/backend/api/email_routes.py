"""
CHE·NU™ Email & Verification Routes V72

FastAPI routes for email verification and password reset:
- Email verification
- Password reset flow
- Email preferences

@version V72.0
@phase Phase 2 - Authentication
"""

from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
from datetime import datetime


# ═══════════════════════════════════════════════════════════════════════════
# ROUTER
# ═══════════════════════════════════════════════════════════════════════════

router = APIRouter(prefix="/email", tags=["Email & Verification"])


# ═══════════════════════════════════════════════════════════════════════════
# REQUEST/RESPONSE MODELS
# ═══════════════════════════════════════════════════════════════════════════

class SendVerificationRequest(BaseModel):
    """Request to send verification email."""
    email: EmailStr


class VerifyEmailRequest(BaseModel):
    """Request to verify email with token."""
    token: str = Field(..., min_length=20)


class RequestPasswordResetRequest(BaseModel):
    """Request to send password reset email."""
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    """Request to reset password with token."""
    token: str = Field(..., min_length=20)
    new_password: str = Field(..., min_length=8)


class EmailResponse(BaseModel):
    """Standard email response."""
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None


class EmailHistoryItem(BaseModel):
    """Email history item."""
    id: str
    type: str
    recipient: str
    sent_at: datetime


class EmailHistoryResponse(BaseModel):
    """Email history response."""
    success: bool
    emails: list[EmailHistoryItem]
    total: int


# ═══════════════════════════════════════════════════════════════════════════
# MOCK DATA (Replace with real database in production)
# ═══════════════════════════════════════════════════════════════════════════

# Mock user database
_mock_users: Dict[str, Dict[str, Any]] = {
    "user_123": {
        "id": "user_123",
        "email": "test@example.com",
        "name": "Test User",
        "email_verified": False,
        "password_hash": "hashed_password"
    }
}

def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    """Get user by email (mock)."""
    for user in _mock_users.values():
        if user["email"].lower() == email.lower():
            return user
    return None

def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    """Get user by ID (mock)."""
    return _mock_users.get(user_id)

def update_user(user_id: str, updates: Dict[str, Any]):
    """Update user (mock)."""
    if user_id in _mock_users:
        _mock_users[user_id].update(updates)


# ═══════════════════════════════════════════════════════════════════════════
# DEPENDENCIES
# ═══════════════════════════════════════════════════════════════════════════

async def get_current_user_id(request: Request) -> str:
    """
    Get current user ID from request.
    In production, extract from JWT token.
    """
    # Mock - replace with real auth
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        # In production, decode JWT and extract user_id
        return "user_123"
    raise HTTPException(status_code=401, detail="Not authenticated")


# ═══════════════════════════════════════════════════════════════════════════
# IMPORT EMAIL SERVICE
# ═══════════════════════════════════════════════════════════════════════════

# Import the email service
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from services.email_service import email_service, TokenType
except ImportError:
    # Fallback for standalone testing
    email_service = None
    TokenType = None


# ═══════════════════════════════════════════════════════════════════════════
# ROUTES - EMAIL VERIFICATION
# ═══════════════════════════════════════════════════════════════════════════

@router.post("/verification/send", response_model=EmailResponse)
async def send_verification_email(
    request: SendVerificationRequest,
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Send email verification email.
    
    Requires authentication.
    Rate limited to 5 emails per hour.
    """
    if not email_service:
        raise HTTPException(status_code=500, detail="Email service not available")
    
    # Get user
    user = get_user_by_id(current_user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if email matches user's email
    if user["email"].lower() != request.email.lower():
        raise HTTPException(status_code=400, detail="Email does not match account")
    
    # Check if already verified
    if user.get("email_verified", False):
        return EmailResponse(
            success=True,
            message="Email is already verified"
        )
    
    # Send verification email
    success, error = email_service.send_verification_email(
        user_id=current_user_id,
        email=request.email,
        name=user.get("name")
    )
    
    if not success:
        raise HTTPException(status_code=429, detail=error or "Failed to send email")
    
    return EmailResponse(
        success=True,
        message="Verification email sent. Please check your inbox."
    )


@router.post("/verification/verify", response_model=EmailResponse)
async def verify_email(request: VerifyEmailRequest):
    """
    Verify email with token.
    
    Token is valid for 24 hours.
    """
    if not email_service:
        raise HTTPException(status_code=500, detail="Email service not available")
    
    # Verify token
    token_record = email_service.verify_email_token(request.token)
    
    if not token_record:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired verification token"
        )
    
    # Get user
    user = get_user_by_id(token_record.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if email still matches
    if user["email"].lower() != token_record.email.lower():
        raise HTTPException(
            status_code=400,
            detail="Email has been changed since verification was requested"
        )
    
    # Consume token
    email_service.consume_token(token_record.id)
    
    # Mark email as verified
    update_user(token_record.user_id, {"email_verified": True})
    
    return EmailResponse(
        success=True,
        message="Email verified successfully!"
    )


@router.get("/verification/status", response_model=EmailResponse)
async def get_verification_status(
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Get email verification status.
    """
    user = get_user_by_id(current_user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return EmailResponse(
        success=True,
        message="Verification status retrieved",
        data={
            "email": user["email"],
            "verified": user.get("email_verified", False)
        }
    )


# ═══════════════════════════════════════════════════════════════════════════
# ROUTES - PASSWORD RESET
# ═══════════════════════════════════════════════════════════════════════════

@router.post("/password-reset/request", response_model=EmailResponse)
async def request_password_reset(request: RequestPasswordResetRequest):
    """
    Request password reset email.
    
    Rate limited to 3 requests per hour.
    Always returns success to prevent email enumeration.
    """
    if not email_service:
        raise HTTPException(status_code=500, detail="Email service not available")
    
    # Get user by email
    user = get_user_by_email(request.email)
    
    # Always return success to prevent email enumeration
    if not user:
        return EmailResponse(
            success=True,
            message="If an account exists with this email, a password reset link has been sent."
        )
    
    # Send reset email
    success, error = email_service.send_password_reset_email(
        user_id=user["id"],
        email=user["email"],
        name=user.get("name")
    )
    
    # Always return success message
    return EmailResponse(
        success=True,
        message="If an account exists with this email, a password reset link has been sent."
    )


@router.post("/password-reset/verify", response_model=EmailResponse)
async def verify_reset_token(request: VerifyEmailRequest):
    """
    Verify password reset token is valid.
    
    Use before showing password reset form.
    """
    if not email_service:
        raise HTTPException(status_code=500, detail="Email service not available")
    
    token_record = email_service.verify_reset_token(request.token)
    
    if not token_record:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset token"
        )
    
    return EmailResponse(
        success=True,
        message="Token is valid",
        data={
            "email": token_record.email,
            "expires_at": token_record.expires_at.isoformat()
        }
    )


@router.post("/password-reset/reset", response_model=EmailResponse)
async def reset_password(request: ResetPasswordRequest):
    """
    Reset password with token.
    
    Token is valid for 1 hour.
    """
    if not email_service:
        raise HTTPException(status_code=500, detail="Email service not available")
    
    # Verify token
    token_record = email_service.verify_reset_token(request.token)
    
    if not token_record:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset token"
        )
    
    # Get user
    user = get_user_by_id(token_record.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Validate password strength
    if len(request.new_password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters"
        )
    
    # Consume token
    email_service.consume_token(token_record.id)
    
    # Update password (in production, hash the password)
    update_user(token_record.user_id, {
        "password_hash": f"hashed_{request.new_password}"  # Mock - use proper hashing
    })
    
    # Send confirmation email
    email_service.send_password_changed_email(
        user_id=token_record.user_id,
        email=user["email"],
        name=user.get("name")
    )
    
    return EmailResponse(
        success=True,
        message="Password reset successfully. You can now log in with your new password."
    )


# ═══════════════════════════════════════════════════════════════════════════
# ROUTES - EMAIL HISTORY
# ═══════════════════════════════════════════════════════════════════════════

@router.get("/history", response_model=EmailHistoryResponse)
async def get_email_history(
    limit: int = 10,
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Get user's email history.
    
    Returns recent emails sent to the user.
    """
    if not email_service:
        raise HTTPException(status_code=500, detail="Email service not available")
    
    history = email_service.get_user_email_history(current_user_id, limit=limit)
    
    return EmailHistoryResponse(
        success=True,
        emails=[
            EmailHistoryItem(
                id=record.id,
                type=record.email_type.value,
                recipient=record.recipient,
                sent_at=record.sent_at
            )
            for record in history
        ],
        total=len(history)
    )


# ═══════════════════════════════════════════════════════════════════════════
# ROUTES - EMAIL PREFERENCES
# ═══════════════════════════════════════════════════════════════════════════

class EmailPreferences(BaseModel):
    """User email preferences."""
    marketing: bool = True
    product_updates: bool = True
    security_alerts: bool = True  # Cannot be disabled
    login_alerts: bool = True


class EmailPreferencesResponse(BaseModel):
    """Email preferences response."""
    success: bool
    preferences: EmailPreferences


# Mock preferences storage
_email_preferences: Dict[str, EmailPreferences] = {}


@router.get("/preferences", response_model=EmailPreferencesResponse)
async def get_email_preferences(
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Get user's email preferences.
    """
    prefs = _email_preferences.get(
        current_user_id,
        EmailPreferences()  # Default preferences
    )
    
    return EmailPreferencesResponse(
        success=True,
        preferences=prefs
    )


@router.put("/preferences", response_model=EmailPreferencesResponse)
async def update_email_preferences(
    preferences: EmailPreferences,
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Update user's email preferences.
    
    Note: Security alerts cannot be disabled.
    """
    # Security alerts cannot be disabled
    preferences.security_alerts = True
    
    _email_preferences[current_user_id] = preferences
    
    return EmailPreferencesResponse(
        success=True,
        preferences=preferences
    )


# ═══════════════════════════════════════════════════════════════════════════
# HEALTH CHECK
# ═══════════════════════════════════════════════════════════════════════════

@router.get("/health")
async def email_health_check():
    """
    Email service health check.
    """
    return {
        "status": "healthy",
        "service": "email",
        "smtp_configured": bool(os.getenv("SMTP_HOST")),
        "timestamp": datetime.utcnow().isoformat()
    }


# ═══════════════════════════════════════════════════════════════════════════
# TEST
# ═══════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn
    from fastapi import FastAPI
    
    app = FastAPI(title="CHE·NU Email API Test")
    app.include_router(router)
    
    print("Starting Email API test server...")
    print("Endpoints:")
    print("  POST /email/verification/send")
    print("  POST /email/verification/verify")
    print("  GET  /email/verification/status")
    print("  POST /email/password-reset/request")
    print("  POST /email/password-reset/verify")
    print("  POST /email/password-reset/reset")
    print("  GET  /email/history")
    print("  GET  /email/preferences")
    print("  PUT  /email/preferences")
    print("  GET  /email/health")
    
    uvicorn.run(app, host="0.0.0.0", port=8002)
