"""
CHE·NU™ Email & Verification Service V72

Email verification and password reset functionality:
- Email verification tokens
- Password reset tokens
- Email templates
- Rate limiting

@version V72.0
@phase Phase 2 - Authentication
"""

import os
import secrets
import hashlib
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, Tuple, List
from dataclasses import dataclass, field
from enum import Enum
from uuid import uuid4
import json


# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════

class EmailConfig:
    """Email service configuration."""
    
    # SMTP Settings (use environment variables in production)
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.example.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "noreply@che-nu.com")
    SMTP_FROM_NAME: str = os.getenv("SMTP_FROM_NAME", "CHE·NU")
    SMTP_USE_TLS: bool = os.getenv("SMTP_USE_TLS", "true").lower() == "true"
    
    # Token Settings
    VERIFICATION_TOKEN_EXPIRY_HOURS: int = 24
    RESET_TOKEN_EXPIRY_HOURS: int = 1
    
    # Rate Limiting
    MAX_EMAILS_PER_HOUR: int = 5
    MAX_RESET_REQUESTS_PER_HOUR: int = 3
    
    # URLs
    BASE_URL: str = os.getenv("BASE_URL", "http://localhost:3000")
    VERIFICATION_URL: str = f"{BASE_URL}/verify-email"
    RESET_URL: str = f"{BASE_URL}/reset-password"


# ═══════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════

class TokenType(Enum):
    EMAIL_VERIFICATION = "email_verification"
    PASSWORD_RESET = "password_reset"
    MAGIC_LINK = "magic_link"


class EmailType(Enum):
    VERIFICATION = "verification"
    PASSWORD_RESET = "password_reset"
    PASSWORD_CHANGED = "password_changed"
    LOGIN_ALERT = "login_alert"
    TWO_FACTOR_ENABLED = "2fa_enabled"
    TWO_FACTOR_DISABLED = "2fa_disabled"
    ACCOUNT_LOCKED = "account_locked"
    WELCOME = "welcome"


# ═══════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════

@dataclass
class VerificationToken:
    """Email verification or reset token."""
    id: str
    user_id: str
    token_hash: str
    token_type: TokenType
    email: str
    created_at: datetime
    expires_at: datetime
    used_at: Optional[datetime] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class EmailRecord:
    """Record of sent email."""
    id: str
    user_id: str
    email_type: EmailType
    recipient: str
    sent_at: datetime
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class RateLimitEntry:
    """Rate limit tracking entry."""
    key: str
    count: int
    window_start: datetime


# ═══════════════════════════════════════════════════════════════════════════
# EMAIL TEMPLATES
# ═══════════════════════════════════════════════════════════════════════════

class EmailTemplates:
    """Email HTML templates."""
    
    BASE_TEMPLATE = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{title}</title>
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
            }}
            .container {{
                background: #fff;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }}
            .logo {{
                text-align: center;
                margin-bottom: 30px;
            }}
            .logo-text {{
                font-size: 28px;
                font-weight: 700;
                color: #3b82f6;
            }}
            h1 {{
                color: #1a1a1a;
                font-size: 24px;
                margin-bottom: 20px;
            }}
            p {{
                margin-bottom: 16px;
                color: #555;
            }}
            .button {{
                display: inline-block;
                padding: 14px 32px;
                background: #3b82f6;
                color: #fff !important;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
            }}
            .button:hover {{
                background: #2563eb;
            }}
            .footer {{
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #888;
                text-align: center;
            }}
            .code {{
                font-family: monospace;
                background: #f5f5f5;
                padding: 12px 20px;
                border-radius: 8px;
                font-size: 24px;
                letter-spacing: 4px;
                text-align: center;
                margin: 20px 0;
            }}
            .warning {{
                background: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 8px;
                padding: 12px 16px;
                color: #92400e;
                font-size: 14px;
                margin: 16px 0;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                <span class="logo-text">CHE·NU</span>
            </div>
            {content}
            <div class="footer">
                <p>© {year} CHE·NU™. All rights reserved.</p>
                <p>This is an automated message. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    @classmethod
    def verification_email(cls, name: str, verification_url: str) -> Tuple[str, str]:
        """Generate email verification email."""
        subject = "Verify your CHE·NU email address"
        
        content = f"""
        <h1>Welcome to CHE·NU!</h1>
        <p>Hi{' ' + name if name else ''},</p>
        <p>Thanks for signing up! Please verify your email address by clicking the button below:</p>
        <p style="text-align: center;">
            <a href="{verification_url}" class="button">Verify Email Address</a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #3b82f6;">{verification_url}</p>
        <p>This link will expire in 24 hours.</p>
        <p class="warning">If you didn't create an account with CHE·NU, please ignore this email.</p>
        """
        
        html = cls.BASE_TEMPLATE.format(
            title=subject,
            content=content,
            year=datetime.now().year
        )
        
        return subject, html
    
    @classmethod
    def password_reset_email(cls, name: str, reset_url: str) -> Tuple[str, str]:
        """Generate password reset email."""
        subject = "Reset your CHE·NU password"
        
        content = f"""
        <h1>Password Reset Request</h1>
        <p>Hi{' ' + name if name else ''},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <p style="text-align: center;">
            <a href="{reset_url}" class="button">Reset Password</a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #3b82f6;">{reset_url}</p>
        <p>This link will expire in 1 hour.</p>
        <p class="warning">If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
        """
        
        html = cls.BASE_TEMPLATE.format(
            title=subject,
            content=content,
            year=datetime.now().year
        )
        
        return subject, html
    
    @classmethod
    def password_changed_email(cls, name: str) -> Tuple[str, str]:
        """Generate password changed notification email."""
        subject = "Your CHE·NU password has been changed"
        
        content = f"""
        <h1>Password Changed</h1>
        <p>Hi{' ' + name if name else ''},</p>
        <p>Your CHE·NU password was successfully changed.</p>
        <p>If you made this change, you can safely ignore this email.</p>
        <p class="warning">If you did NOT change your password, please reset it immediately and contact our support team.</p>
        <p style="text-align: center;">
            <a href="{EmailConfig.RESET_URL}" class="button">Reset Password</a>
        </p>
        """
        
        html = cls.BASE_TEMPLATE.format(
            title=subject,
            content=content,
            year=datetime.now().year
        )
        
        return subject, html
    
    @classmethod
    def login_alert_email(cls, name: str, device: str, location: str, time: str) -> Tuple[str, str]:
        """Generate new login alert email."""
        subject = "New login to your CHE·NU account"
        
        content = f"""
        <h1>New Login Detected</h1>
        <p>Hi{' ' + name if name else ''},</p>
        <p>We detected a new login to your CHE·NU account:</p>
        <ul>
            <li><strong>Device:</strong> {device}</li>
            <li><strong>Location:</strong> {location}</li>
            <li><strong>Time:</strong> {time}</li>
        </ul>
        <p>If this was you, you can safely ignore this email.</p>
        <p class="warning">If you don't recognize this login, please change your password immediately and review your account security.</p>
        """
        
        html = cls.BASE_TEMPLATE.format(
            title=subject,
            content=content,
            year=datetime.now().year
        )
        
        return subject, html
    
    @classmethod
    def two_factor_enabled_email(cls, name: str) -> Tuple[str, str]:
        """Generate 2FA enabled notification email."""
        subject = "Two-factor authentication enabled on your CHE·NU account"
        
        content = f"""
        <h1>2FA Enabled</h1>
        <p>Hi{' ' + name if name else ''},</p>
        <p>Two-factor authentication has been successfully enabled on your CHE·NU account.</p>
        <p>From now on, you'll need to enter a verification code from your authenticator app when signing in.</p>
        <p><strong>Important:</strong> Make sure to save your backup codes in a secure place. You'll need them if you lose access to your authenticator app.</p>
        <p class="warning">If you did NOT enable 2FA, please contact our support team immediately.</p>
        """
        
        html = cls.BASE_TEMPLATE.format(
            title=subject,
            content=content,
            year=datetime.now().year
        )
        
        return subject, html
    
    @classmethod
    def welcome_email(cls, name: str) -> Tuple[str, str]:
        """Generate welcome email."""
        subject = "Welcome to CHE·NU!"
        
        content = f"""
        <h1>Welcome to CHE·NU!</h1>
        <p>Hi{' ' + name if name else ''},</p>
        <p>Thanks for joining CHE·NU — your governed intelligence operating system.</p>
        <p>Here's what you can do next:</p>
        <ul>
            <li>🎯 <strong>Set up your profile</strong> — Add your details and preferences</li>
            <li>🔐 <strong>Enable 2FA</strong> — Add an extra layer of security</li>
            <li>🌟 <strong>Explore features</strong> — Discover what CHE·NU can do for you</li>
        </ul>
        <p style="text-align: center;">
            <a href="{EmailConfig.BASE_URL}/dashboard" class="button">Get Started</a>
        </p>
        <p>If you have any questions, our support team is here to help.</p>
        """
        
        html = cls.BASE_TEMPLATE.format(
            title=subject,
            content=content,
            year=datetime.now().year
        )
        
        return subject, html


# ═══════════════════════════════════════════════════════════════════════════
# RATE LIMITER
# ═══════════════════════════════════════════════════════════════════════════

class RateLimiter:
    """Simple in-memory rate limiter."""
    
    def __init__(self):
        self._entries: Dict[str, RateLimitEntry] = {}
    
    def check_limit(self, key: str, limit: int, window_seconds: int = 3600) -> Tuple[bool, int]:
        """
        Check if action is within rate limit.
        Returns (is_allowed, remaining_count).
        """
        now = datetime.utcnow()
        entry = self._entries.get(key)
        
        if entry:
            # Check if window has expired
            window_end = entry.window_start + timedelta(seconds=window_seconds)
            
            if now > window_end:
                # Reset window
                entry = RateLimitEntry(key=key, count=0, window_start=now)
                self._entries[key] = entry
            
            if entry.count >= limit:
                return False, 0
            
            entry.count += 1
            remaining = limit - entry.count
            return True, remaining
        
        # First request
        self._entries[key] = RateLimitEntry(key=key, count=1, window_start=now)
        return True, limit - 1
    
    def get_remaining(self, key: str, limit: int, window_seconds: int = 3600) -> int:
        """Get remaining requests in window."""
        now = datetime.utcnow()
        entry = self._entries.get(key)
        
        if not entry:
            return limit
        
        window_end = entry.window_start + timedelta(seconds=window_seconds)
        
        if now > window_end:
            return limit
        
        return max(0, limit - entry.count)
    
    def reset(self, key: str):
        """Reset rate limit for key."""
        self._entries.pop(key, None)


# ═══════════════════════════════════════════════════════════════════════════
# TOKEN SERVICE
# ═══════════════════════════════════════════════════════════════════════════

class TokenService:
    """Service for managing verification and reset tokens."""
    
    def __init__(self):
        self._tokens: Dict[str, VerificationToken] = {}
    
    def _hash_token(self, token: str) -> str:
        """Hash token for storage."""
        return hashlib.sha256(token.encode()).hexdigest()
    
    def create_token(
        self,
        user_id: str,
        email: str,
        token_type: TokenType,
        expiry_hours: Optional[int] = None
    ) -> Tuple[str, VerificationToken]:
        """
        Create new verification token.
        Returns (raw_token, token_record).
        """
        # Invalidate existing tokens of same type
        self._invalidate_user_tokens(user_id, token_type)
        
        # Generate token
        raw_token = secrets.token_urlsafe(32)
        token_hash = self._hash_token(raw_token)
        
        # Determine expiry
        if expiry_hours is None:
            if token_type == TokenType.PASSWORD_RESET:
                expiry_hours = EmailConfig.RESET_TOKEN_EXPIRY_HOURS
            else:
                expiry_hours = EmailConfig.VERIFICATION_TOKEN_EXPIRY_HOURS
        
        now = datetime.utcnow()
        
        token_record = VerificationToken(
            id=str(uuid4()),
            user_id=user_id,
            token_hash=token_hash,
            token_type=token_type,
            email=email,
            created_at=now,
            expires_at=now + timedelta(hours=expiry_hours)
        )
        
        self._tokens[token_record.id] = token_record
        
        return raw_token, token_record
    
    def verify_token(
        self,
        raw_token: str,
        token_type: TokenType
    ) -> Optional[VerificationToken]:
        """
        Verify token and return token record if valid.
        Does NOT consume the token.
        """
        token_hash = self._hash_token(raw_token)
        now = datetime.utcnow()
        
        for token in self._tokens.values():
            if (token.token_hash == token_hash and
                token.token_type == token_type and
                token.expires_at > now and
                token.used_at is None):
                return token
        
        return None
    
    def consume_token(self, token_id: str) -> bool:
        """Mark token as used."""
        token = self._tokens.get(token_id)
        
        if token and token.used_at is None:
            token.used_at = datetime.utcnow()
            return True
        
        return False
    
    def _invalidate_user_tokens(self, user_id: str, token_type: TokenType):
        """Invalidate all tokens of type for user."""
        now = datetime.utcnow()
        
        for token in self._tokens.values():
            if token.user_id == user_id and token.token_type == token_type:
                token.used_at = now


# ═══════════════════════════════════════════════════════════════════════════
# EMAIL SERVICE
# ═══════════════════════════════════════════════════════════════════════════

class EmailService:
    """Service for sending emails."""
    
    def __init__(self):
        self._records: List[EmailRecord] = []
        self._rate_limiter = RateLimiter()
        self._token_service = TokenService()
    
    def _send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str
    ) -> bool:
        """
        Send email via SMTP.
        In production, implement actual SMTP sending.
        """
        # Mock implementation - replace with actual SMTP in production
        print(f"[EMAIL] Sending to: {to_email}")
        print(f"[EMAIL] Subject: {subject}")
        print(f"[EMAIL] Content length: {len(html_content)} chars")
        
        # In production:
        # import smtplib
        # from email.mime.text import MIMEText
        # from email.mime.multipart import MIMEMultipart
        # 
        # msg = MIMEMultipart('alternative')
        # msg['Subject'] = subject
        # msg['From'] = f"{EmailConfig.SMTP_FROM_NAME} <{EmailConfig.SMTP_FROM_EMAIL}>"
        # msg['To'] = to_email
        # msg.attach(MIMEText(html_content, 'html'))
        # 
        # with smtplib.SMTP(EmailConfig.SMTP_HOST, EmailConfig.SMTP_PORT) as server:
        #     if EmailConfig.SMTP_USE_TLS:
        #         server.starttls()
        #     server.login(EmailConfig.SMTP_USER, EmailConfig.SMTP_PASSWORD)
        #     server.sendmail(EmailConfig.SMTP_FROM_EMAIL, to_email, msg.as_string())
        
        return True
    
    def _record_email(
        self,
        user_id: str,
        email_type: EmailType,
        recipient: str,
        metadata: Optional[Dict[str, Any]] = None
    ):
        """Record sent email."""
        record = EmailRecord(
            id=str(uuid4()),
            user_id=user_id,
            email_type=email_type,
            recipient=recipient,
            sent_at=datetime.utcnow(),
            metadata=metadata or {}
        )
        self._records.append(record)
    
    # ─────────────────────────────────────────────────────────────────────────
    # Public Methods
    # ─────────────────────────────────────────────────────────────────────────
    
    def send_verification_email(
        self,
        user_id: str,
        email: str,
        name: Optional[str] = None
    ) -> Tuple[bool, Optional[str]]:
        """
        Send email verification email.
        Returns (success, error_message).
        """
        # Rate limit check
        rate_key = f"email:{user_id}"
        allowed, remaining = self._rate_limiter.check_limit(
            rate_key,
            EmailConfig.MAX_EMAILS_PER_HOUR
        )
        
        if not allowed:
            return False, "Too many emails sent. Please try again later."
        
        # Create token
        raw_token, token_record = self._token_service.create_token(
            user_id=user_id,
            email=email,
            token_type=TokenType.EMAIL_VERIFICATION
        )
        
        # Build URL
        verification_url = f"{EmailConfig.VERIFICATION_URL}?token={raw_token}"
        
        # Generate email
        subject, html = EmailTemplates.verification_email(name or "", verification_url)
        
        # Send
        success = self._send_email(email, subject, html)
        
        if success:
            self._record_email(user_id, EmailType.VERIFICATION, email)
        
        return success, None
    
    def send_password_reset_email(
        self,
        user_id: str,
        email: str,
        name: Optional[str] = None
    ) -> Tuple[bool, Optional[str]]:
        """
        Send password reset email.
        Returns (success, error_message).
        """
        # Rate limit check
        rate_key = f"reset:{user_id}"
        allowed, remaining = self._rate_limiter.check_limit(
            rate_key,
            EmailConfig.MAX_RESET_REQUESTS_PER_HOUR
        )
        
        if not allowed:
            return False, "Too many reset requests. Please try again later."
        
        # Create token
        raw_token, token_record = self._token_service.create_token(
            user_id=user_id,
            email=email,
            token_type=TokenType.PASSWORD_RESET
        )
        
        # Build URL
        reset_url = f"{EmailConfig.RESET_URL}?token={raw_token}"
        
        # Generate email
        subject, html = EmailTemplates.password_reset_email(name or "", reset_url)
        
        # Send
        success = self._send_email(email, subject, html)
        
        if success:
            self._record_email(user_id, EmailType.PASSWORD_RESET, email)
        
        return success, None
    
    def send_password_changed_email(
        self,
        user_id: str,
        email: str,
        name: Optional[str] = None
    ) -> bool:
        """Send password changed notification."""
        subject, html = EmailTemplates.password_changed_email(name or "")
        success = self._send_email(email, subject, html)
        
        if success:
            self._record_email(user_id, EmailType.PASSWORD_CHANGED, email)
        
        return success
    
    def send_login_alert_email(
        self,
        user_id: str,
        email: str,
        name: Optional[str] = None,
        device: str = "Unknown device",
        location: str = "Unknown location",
        time: Optional[str] = None
    ) -> bool:
        """Send new login alert."""
        time_str = time or datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
        subject, html = EmailTemplates.login_alert_email(name or "", device, location, time_str)
        success = self._send_email(email, subject, html)
        
        if success:
            self._record_email(user_id, EmailType.LOGIN_ALERT, email, {
                "device": device,
                "location": location
            })
        
        return success
    
    def send_2fa_enabled_email(
        self,
        user_id: str,
        email: str,
        name: Optional[str] = None
    ) -> bool:
        """Send 2FA enabled notification."""
        subject, html = EmailTemplates.two_factor_enabled_email(name or "")
        success = self._send_email(email, subject, html)
        
        if success:
            self._record_email(user_id, EmailType.TWO_FACTOR_ENABLED, email)
        
        return success
    
    def send_welcome_email(
        self,
        user_id: str,
        email: str,
        name: Optional[str] = None
    ) -> bool:
        """Send welcome email."""
        subject, html = EmailTemplates.welcome_email(name or "")
        success = self._send_email(email, subject, html)
        
        if success:
            self._record_email(user_id, EmailType.WELCOME, email)
        
        return success
    
    # ─────────────────────────────────────────────────────────────────────────
    # Token Verification
    # ─────────────────────────────────────────────────────────────────────────
    
    def verify_email_token(self, token: str) -> Optional[VerificationToken]:
        """Verify email verification token."""
        return self._token_service.verify_token(token, TokenType.EMAIL_VERIFICATION)
    
    def verify_reset_token(self, token: str) -> Optional[VerificationToken]:
        """Verify password reset token."""
        return self._token_service.verify_token(token, TokenType.PASSWORD_RESET)
    
    def consume_token(self, token_id: str) -> bool:
        """Consume (invalidate) a token."""
        return self._token_service.consume_token(token_id)
    
    # ─────────────────────────────────────────────────────────────────────────
    # Email History
    # ─────────────────────────────────────────────────────────────────────────
    
    def get_user_email_history(
        self,
        user_id: str,
        limit: int = 10
    ) -> List[EmailRecord]:
        """Get user's email history."""
        user_records = [r for r in self._records if r.user_id == user_id]
        return sorted(user_records, key=lambda r: r.sent_at, reverse=True)[:limit]


# ═══════════════════════════════════════════════════════════════════════════
# SINGLETON INSTANCE
# ═══════════════════════════════════════════════════════════════════════════

email_service = EmailService()


# ═══════════════════════════════════════════════════════════════════════════
# TEST
# ═══════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("=" * 60)
    print("CHE·NU™ Email & Verification Service V72 - Test")
    print("=" * 60)
    
    # Test verification email
    print("\n1. Send verification email...")
    success, error = email_service.send_verification_email(
        user_id="user_123",
        email="test@example.com",
        name="Test User"
    )
    print(f"   Result: {'✓ Sent' if success else f'✗ Failed: {error}'}")
    
    # Test password reset email
    print("\n2. Send password reset email...")
    success, error = email_service.send_password_reset_email(
        user_id="user_123",
        email="test@example.com",
        name="Test User"
    )
    print(f"   Result: {'✓ Sent' if success else f'✗ Failed: {error}'}")
    
    # Test welcome email
    print("\n3. Send welcome email...")
    success = email_service.send_welcome_email(
        user_id="user_123",
        email="test@example.com",
        name="Test User"
    )
    print(f"   Result: {'✓ Sent' if success else '✗ Failed'}")
    
    # Test rate limiting
    print("\n4. Test rate limiting...")
    for i in range(7):
        success, error = email_service.send_verification_email(
            user_id="user_456",
            email="test2@example.com"
        )
        print(f"   Request {i+1}: {'✓' if success else f'✗ Rate limited'}")
    
    # Test email history
    print("\n5. Get email history...")
    history = email_service.get_user_email_history("user_123")
    print(f"   Found {len(history)} emails")
    for record in history:
        print(f"   - {record.email_type.value}: {record.recipient} at {record.sent_at}")
    
    print("\n" + "=" * 60)
    print("Test complete!")
    print("=" * 60)
