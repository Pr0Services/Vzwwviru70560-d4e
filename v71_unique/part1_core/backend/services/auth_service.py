"""
CHE·NU™ Authentication Service V72

Comprehensive authentication system with:
- JWT access & refresh tokens
- Session management
- Device tracking
- Rate limiting
- Security audit logging

@version V72.0
@phase Phase 2 - Authentication
"""

import os
import hmac
import hashlib
import secrets
import json
from datetime import datetime, timedelta
from typing import Optional, Dict, List, Any, Tuple
from dataclasses import dataclass, field
from enum import Enum
from uuid import uuid4
import base64

# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════

class AuthConfig:
    """Authentication configuration."""
    
    # JWT Settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", secrets.token_hex(32))
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Session Settings
    MAX_SESSIONS_PER_USER: int = 5
    SESSION_IDLE_TIMEOUT_MINUTES: int = 30
    
    # Security Settings
    PASSWORD_MIN_LENGTH: int = 8
    MAX_LOGIN_ATTEMPTS: int = 5
    LOCKOUT_DURATION_MINUTES: int = 15
    
    # 2FA Settings
    TOTP_ISSUER: str = "CHE·NU"
    TOTP_DIGITS: int = 6
    TOTP_INTERVAL: int = 30
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW_SECONDS: int = 60


# ═══════════════════════════════════════════════════════════════════════════
# ENUMS & TYPES
# ═══════════════════════════════════════════════════════════════════════════

class AuthProvider(Enum):
    """Authentication providers."""
    LOCAL = "local"
    GOOGLE = "google"
    MICROSOFT = "microsoft"
    GITHUB = "github"


class TokenType(Enum):
    """Token types."""
    ACCESS = "access"
    REFRESH = "refresh"
    RESET_PASSWORD = "reset_password"
    EMAIL_VERIFICATION = "email_verification"
    TWO_FACTOR = "two_factor"


class SessionStatus(Enum):
    """Session status."""
    ACTIVE = "active"
    EXPIRED = "expired"
    REVOKED = "revoked"
    PENDING_2FA = "pending_2fa"


class AuditEventType(Enum):
    """Security audit event types."""
    LOGIN_SUCCESS = "login_success"
    LOGIN_FAILED = "login_failed"
    LOGOUT = "logout"
    TOKEN_REFRESH = "token_refresh"
    PASSWORD_CHANGE = "password_change"
    PASSWORD_RESET_REQUEST = "password_reset_request"
    PASSWORD_RESET_COMPLETE = "password_reset_complete"
    TWO_FACTOR_ENABLED = "2fa_enabled"
    TWO_FACTOR_DISABLED = "2fa_disabled"
    TWO_FACTOR_SUCCESS = "2fa_success"
    TWO_FACTOR_FAILED = "2fa_failed"
    SESSION_REVOKED = "session_revoked"
    ACCOUNT_LOCKED = "account_locked"
    ACCOUNT_UNLOCKED = "account_unlocked"
    SUSPICIOUS_ACTIVITY = "suspicious_activity"


# ═══════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════

@dataclass
class User:
    """User model."""
    id: str
    email: str
    password_hash: str
    salt: str
    created_at: datetime
    updated_at: datetime
    is_active: bool = True
    is_verified: bool = False
    is_locked: bool = False
    locked_until: Optional[datetime] = None
    failed_login_attempts: int = 0
    last_login: Optional[datetime] = None
    two_factor_enabled: bool = False
    two_factor_secret: Optional[str] = None
    backup_codes: List[str] = field(default_factory=list)
    auth_provider: AuthProvider = AuthProvider.LOCAL
    provider_user_id: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class Session:
    """User session."""
    id: str
    user_id: str
    device_id: str
    device_info: Dict[str, str]
    ip_address: str
    user_agent: str
    created_at: datetime
    last_activity: datetime
    expires_at: datetime
    status: SessionStatus = SessionStatus.ACTIVE
    refresh_token_hash: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class TokenPayload:
    """JWT token payload."""
    sub: str  # User ID
    type: TokenType
    session_id: str
    iat: datetime
    exp: datetime
    jti: str  # Token ID for revocation
    device_id: Optional[str] = None
    scopes: List[str] = field(default_factory=list)


@dataclass
class AuthResult:
    """Authentication result."""
    success: bool
    user_id: Optional[str] = None
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    session_id: Optional[str] = None
    expires_in: Optional[int] = None
    requires_2fa: bool = False
    two_factor_token: Optional[str] = None
    error: Optional[str] = None
    error_code: Optional[str] = None


@dataclass
class AuditEvent:
    """Security audit event."""
    id: str
    user_id: Optional[str]
    event_type: AuditEventType
    ip_address: str
    user_agent: str
    timestamp: datetime
    success: bool
    details: Dict[str, Any] = field(default_factory=dict)


# ═══════════════════════════════════════════════════════════════════════════
# PASSWORD UTILITIES
# ═══════════════════════════════════════════════════════════════════════════

class PasswordService:
    """Password hashing and validation service."""
    
    ITERATIONS = 100000
    HASH_ALGORITHM = "sha256"
    
    @classmethod
    def hash_password(cls, password: str, salt: Optional[str] = None) -> Tuple[str, str]:
        """Hash password with salt."""
        if salt is None:
            salt = secrets.token_hex(32)
        
        password_hash = hashlib.pbkdf2_hmac(
            cls.HASH_ALGORITHM,
            password.encode('utf-8'),
            salt.encode('utf-8'),
            cls.ITERATIONS
        )
        
        return base64.b64encode(password_hash).decode('utf-8'), salt
    
    @classmethod
    def verify_password(cls, password: str, password_hash: str, salt: str) -> bool:
        """Verify password against hash."""
        computed_hash, _ = cls.hash_password(password, salt)
        return hmac.compare_digest(computed_hash, password_hash)
    
    @classmethod
    def validate_password_strength(cls, password: str) -> Tuple[bool, List[str]]:
        """Validate password meets strength requirements."""
        errors = []
        
        if len(password) < AuthConfig.PASSWORD_MIN_LENGTH:
            errors.append(f"Password must be at least {AuthConfig.PASSWORD_MIN_LENGTH} characters")
        
        if not any(c.isupper() for c in password):
            errors.append("Password must contain at least one uppercase letter")
        
        if not any(c.islower() for c in password):
            errors.append("Password must contain at least one lowercase letter")
        
        if not any(c.isdigit() for c in password):
            errors.append("Password must contain at least one digit")
        
        if not any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
            errors.append("Password must contain at least one special character")
        
        return len(errors) == 0, errors
    
    @classmethod
    def generate_backup_codes(cls, count: int = 10) -> List[str]:
        """Generate backup codes for 2FA recovery."""
        return [secrets.token_hex(4).upper() for _ in range(count)]


# ═══════════════════════════════════════════════════════════════════════════
# JWT SERVICE
# ═══════════════════════════════════════════════════════════════════════════

class JWTService:
    """JWT token generation and validation."""
    
    @classmethod
    def _encode_base64url(cls, data: bytes) -> str:
        """Base64url encode without padding."""
        return base64.urlsafe_b64encode(data).rstrip(b'=').decode('utf-8')
    
    @classmethod
    def _decode_base64url(cls, data: str) -> bytes:
        """Base64url decode with padding restoration."""
        padding = 4 - len(data) % 4
        if padding != 4:
            data += '=' * padding
        return base64.urlsafe_b64decode(data)
    
    @classmethod
    def create_token(cls, payload: TokenPayload) -> str:
        """Create JWT token."""
        header = {
            "alg": AuthConfig.JWT_ALGORITHM,
            "typ": "JWT"
        }
        
        claims = {
            "sub": payload.sub,
            "type": payload.type.value,
            "session_id": payload.session_id,
            "iat": int(payload.iat.timestamp()),
            "exp": int(payload.exp.timestamp()),
            "jti": payload.jti,
        }
        
        if payload.device_id:
            claims["device_id"] = payload.device_id
        if payload.scopes:
            claims["scopes"] = payload.scopes
        
        # Encode header and payload
        header_b64 = cls._encode_base64url(json.dumps(header).encode())
        payload_b64 = cls._encode_base64url(json.dumps(claims).encode())
        
        # Create signature
        message = f"{header_b64}.{payload_b64}"
        signature = hmac.new(
            AuthConfig.JWT_SECRET_KEY.encode(),
            message.encode(),
            hashlib.sha256
        ).digest()
        signature_b64 = cls._encode_base64url(signature)
        
        return f"{header_b64}.{payload_b64}.{signature_b64}"
    
    @classmethod
    def verify_token(cls, token: str) -> Optional[TokenPayload]:
        """Verify and decode JWT token."""
        try:
            parts = token.split('.')
            if len(parts) != 3:
                return None
            
            header_b64, payload_b64, signature_b64 = parts
            
            # Verify signature
            message = f"{header_b64}.{payload_b64}"
            expected_signature = hmac.new(
                AuthConfig.JWT_SECRET_KEY.encode(),
                message.encode(),
                hashlib.sha256
            ).digest()
            
            actual_signature = cls._decode_base64url(signature_b64)
            
            if not hmac.compare_digest(expected_signature, actual_signature):
                return None
            
            # Decode payload
            payload_json = cls._decode_base64url(payload_b64).decode()
            claims = json.loads(payload_json)
            
            # Check expiration
            exp = datetime.fromtimestamp(claims["exp"])
            if datetime.utcnow() > exp:
                return None
            
            return TokenPayload(
                sub=claims["sub"],
                type=TokenType(claims["type"]),
                session_id=claims["session_id"],
                iat=datetime.fromtimestamp(claims["iat"]),
                exp=exp,
                jti=claims["jti"],
                device_id=claims.get("device_id"),
                scopes=claims.get("scopes", [])
            )
            
        except Exception:
            return None
    
    @classmethod
    def create_access_token(
        cls,
        user_id: str,
        session_id: str,
        device_id: Optional[str] = None,
        scopes: Optional[List[str]] = None
    ) -> Tuple[str, datetime]:
        """Create access token."""
        now = datetime.utcnow()
        exp = now + timedelta(minutes=AuthConfig.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        payload = TokenPayload(
            sub=user_id,
            type=TokenType.ACCESS,
            session_id=session_id,
            iat=now,
            exp=exp,
            jti=str(uuid4()),
            device_id=device_id,
            scopes=scopes or []
        )
        
        return cls.create_token(payload), exp
    
    @classmethod
    def create_refresh_token(
        cls,
        user_id: str,
        session_id: str,
        device_id: Optional[str] = None
    ) -> Tuple[str, datetime, str]:
        """Create refresh token. Returns (token, expiry, token_hash)."""
        now = datetime.utcnow()
        exp = now + timedelta(days=AuthConfig.REFRESH_TOKEN_EXPIRE_DAYS)
        
        payload = TokenPayload(
            sub=user_id,
            type=TokenType.REFRESH,
            session_id=session_id,
            iat=now,
            exp=exp,
            jti=str(uuid4()),
            device_id=device_id
        )
        
        token = cls.create_token(payload)
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        
        return token, exp, token_hash


# ═══════════════════════════════════════════════════════════════════════════
# 2FA SERVICE
# ═══════════════════════════════════════════════════════════════════════════

class TwoFactorService:
    """Two-factor authentication service using TOTP."""
    
    @classmethod
    def generate_secret(cls) -> str:
        """Generate TOTP secret."""
        # Generate 20 random bytes and encode as base32
        random_bytes = secrets.token_bytes(20)
        # Simple base32 encoding
        alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
        result = []
        bits = 0
        value = 0
        
        for byte in random_bytes:
            value = (value << 8) | byte
            bits += 8
            while bits >= 5:
                bits -= 5
                result.append(alphabet[(value >> bits) & 31])
        
        if bits > 0:
            result.append(alphabet[(value << (5 - bits)) & 31])
        
        return ''.join(result)
    
    @classmethod
    def get_provisioning_uri(cls, secret: str, email: str) -> str:
        """Get TOTP provisioning URI for QR code."""
        from urllib.parse import quote
        return (
            f"otpauth://totp/{quote(AuthConfig.TOTP_ISSUER)}:{quote(email)}"
            f"?secret={secret}"
            f"&issuer={quote(AuthConfig.TOTP_ISSUER)}"
            f"&digits={AuthConfig.TOTP_DIGITS}"
            f"&period={AuthConfig.TOTP_INTERVAL}"
        )
    
    @classmethod
    def _compute_hotp(cls, secret: str, counter: int) -> str:
        """Compute HOTP value."""
        # Decode base32 secret
        alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
        secret_upper = secret.upper()
        bits = 0
        value = 0
        result = []
        
        for char in secret_upper:
            if char in alphabet:
                value = (value << 5) | alphabet.index(char)
                bits += 5
                while bits >= 8:
                    bits -= 8
                    result.append((value >> bits) & 255)
        
        key = bytes(result)
        
        # Convert counter to 8-byte big-endian
        counter_bytes = counter.to_bytes(8, byteorder='big')
        
        # HMAC-SHA1
        hmac_result = hmac.new(key, counter_bytes, hashlib.sha1).digest()
        
        # Dynamic truncation
        offset = hmac_result[-1] & 0x0F
        code = (
            ((hmac_result[offset] & 0x7F) << 24) |
            ((hmac_result[offset + 1] & 0xFF) << 16) |
            ((hmac_result[offset + 2] & 0xFF) << 8) |
            (hmac_result[offset + 3] & 0xFF)
        )
        
        # Get last N digits
        otp = code % (10 ** AuthConfig.TOTP_DIGITS)
        return str(otp).zfill(AuthConfig.TOTP_DIGITS)
    
    @classmethod
    def generate_totp(cls, secret: str, timestamp: Optional[int] = None) -> str:
        """Generate TOTP code."""
        if timestamp is None:
            timestamp = int(datetime.utcnow().timestamp())
        
        counter = timestamp // AuthConfig.TOTP_INTERVAL
        return cls._compute_hotp(secret, counter)
    
    @classmethod
    def verify_totp(cls, secret: str, code: str, window: int = 1) -> bool:
        """Verify TOTP code with time window tolerance."""
        timestamp = int(datetime.utcnow().timestamp())
        
        for offset in range(-window, window + 1):
            check_timestamp = timestamp + (offset * AuthConfig.TOTP_INTERVAL)
            if cls.generate_totp(secret, check_timestamp) == code:
                return True
        
        return False
    
    @classmethod
    def verify_backup_code(cls, backup_codes: List[str], code: str) -> Tuple[bool, List[str]]:
        """Verify backup code and return updated list."""
        code_upper = code.upper().replace('-', '').replace(' ', '')
        
        for i, backup_code in enumerate(backup_codes):
            if hmac.compare_digest(backup_code, code_upper):
                # Remove used code
                remaining_codes = backup_codes[:i] + backup_codes[i+1:]
                return True, remaining_codes
        
        return False, backup_codes


# ═══════════════════════════════════════════════════════════════════════════
# SESSION SERVICE
# ═══════════════════════════════════════════════════════════════════════════

class SessionService:
    """Session management service."""
    
    def __init__(self):
        self._sessions: Dict[str, Session] = {}  # In production: use Redis/DB
        self._user_sessions: Dict[str, List[str]] = {}  # user_id -> session_ids
    
    def create_session(
        self,
        user_id: str,
        device_info: Dict[str, str],
        ip_address: str,
        user_agent: str,
        refresh_token_hash: str
    ) -> Session:
        """Create new session."""
        now = datetime.utcnow()
        
        session = Session(
            id=str(uuid4()),
            user_id=user_id,
            device_id=device_info.get("device_id", str(uuid4())),
            device_info=device_info,
            ip_address=ip_address,
            user_agent=user_agent,
            created_at=now,
            last_activity=now,
            expires_at=now + timedelta(days=AuthConfig.REFRESH_TOKEN_EXPIRE_DAYS),
            refresh_token_hash=refresh_token_hash
        )
        
        # Enforce max sessions limit
        self._enforce_session_limit(user_id)
        
        # Store session
        self._sessions[session.id] = session
        
        if user_id not in self._user_sessions:
            self._user_sessions[user_id] = []
        self._user_sessions[user_id].append(session.id)
        
        return session
    
    def get_session(self, session_id: str) -> Optional[Session]:
        """Get session by ID."""
        session = self._sessions.get(session_id)
        
        if session and session.status == SessionStatus.ACTIVE:
            # Check expiration
            if datetime.utcnow() > session.expires_at:
                session.status = SessionStatus.EXPIRED
                return None
            
            # Check idle timeout
            idle_limit = session.last_activity + timedelta(
                minutes=AuthConfig.SESSION_IDLE_TIMEOUT_MINUTES
            )
            if datetime.utcnow() > idle_limit:
                session.status = SessionStatus.EXPIRED
                return None
        
        return session
    
    def update_activity(self, session_id: str) -> bool:
        """Update session last activity."""
        session = self._sessions.get(session_id)
        if session and session.status == SessionStatus.ACTIVE:
            session.last_activity = datetime.utcnow()
            return True
        return False
    
    def revoke_session(self, session_id: str) -> bool:
        """Revoke session."""
        session = self._sessions.get(session_id)
        if session:
            session.status = SessionStatus.REVOKED
            return True
        return False
    
    def revoke_all_sessions(self, user_id: str, except_session_id: Optional[str] = None) -> int:
        """Revoke all sessions for user."""
        count = 0
        session_ids = self._user_sessions.get(user_id, [])
        
        for session_id in session_ids:
            if session_id != except_session_id:
                if self.revoke_session(session_id):
                    count += 1
        
        return count
    
    def get_user_sessions(self, user_id: str) -> List[Session]:
        """Get all active sessions for user."""
        session_ids = self._user_sessions.get(user_id, [])
        sessions = []
        
        for session_id in session_ids:
            session = self.get_session(session_id)
            if session and session.status == SessionStatus.ACTIVE:
                sessions.append(session)
        
        return sessions
    
    def _enforce_session_limit(self, user_id: str) -> None:
        """Enforce maximum sessions per user."""
        sessions = self.get_user_sessions(user_id)
        
        if len(sessions) >= AuthConfig.MAX_SESSIONS_PER_USER:
            # Revoke oldest session
            oldest = min(sessions, key=lambda s: s.created_at)
            self.revoke_session(oldest.id)


# ═══════════════════════════════════════════════════════════════════════════
# AUDIT SERVICE
# ═══════════════════════════════════════════════════════════════════════════

class AuditService:
    """Security audit logging service."""
    
    def __init__(self):
        self._events: List[AuditEvent] = []  # In production: use persistent storage
    
    def log_event(
        self,
        event_type: AuditEventType,
        ip_address: str,
        user_agent: str,
        success: bool,
        user_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ) -> AuditEvent:
        """Log security audit event."""
        event = AuditEvent(
            id=str(uuid4()),
            user_id=user_id,
            event_type=event_type,
            ip_address=ip_address,
            user_agent=user_agent,
            timestamp=datetime.utcnow(),
            success=success,
            details=details or {}
        )
        
        self._events.append(event)
        
        # Log to console in development
        status = "✓" if success else "✗"
        print(f"[AUDIT] {status} {event_type.value} | User: {user_id} | IP: {ip_address}")
        
        return event
    
    def get_user_events(
        self,
        user_id: str,
        limit: int = 100,
        event_types: Optional[List[AuditEventType]] = None
    ) -> List[AuditEvent]:
        """Get audit events for user."""
        events = [e for e in self._events if e.user_id == user_id]
        
        if event_types:
            events = [e for e in events if e.event_type in event_types]
        
        return sorted(events, key=lambda e: e.timestamp, reverse=True)[:limit]
    
    def get_failed_logins(self, user_id: str, since: datetime) -> int:
        """Count failed login attempts since timestamp."""
        return sum(
            1 for e in self._events
            if e.user_id == user_id
            and e.event_type == AuditEventType.LOGIN_FAILED
            and e.timestamp > since
        )


# ═══════════════════════════════════════════════════════════════════════════
# MAIN AUTHENTICATION SERVICE
# ═══════════════════════════════════════════════════════════════════════════

class AuthenticationService:
    """Main authentication service."""
    
    def __init__(self):
        self._users: Dict[str, User] = {}  # In production: use database
        self.session_service = SessionService()
        self.audit_service = AuditService()
    
    # ─────────────────────────────────────────────────────────────────────────
    # User Management
    # ─────────────────────────────────────────────────────────────────────────
    
    def register_user(
        self,
        email: str,
        password: str,
        ip_address: str = "unknown",
        user_agent: str = "unknown"
    ) -> Tuple[Optional[User], Optional[str]]:
        """Register new user."""
        # Validate email uniqueness
        if any(u.email == email for u in self._users.values()):
            return None, "Email already registered"
        
        # Validate password strength
        is_valid, errors = PasswordService.validate_password_strength(password)
        if not is_valid:
            return None, "; ".join(errors)
        
        # Hash password
        password_hash, salt = PasswordService.hash_password(password)
        
        # Create user
        now = datetime.utcnow()
        user = User(
            id=str(uuid4()),
            email=email,
            password_hash=password_hash,
            salt=salt,
            created_at=now,
            updated_at=now
        )
        
        self._users[user.id] = user
        
        return user, None
    
    def get_user(self, user_id: str) -> Optional[User]:
        """Get user by ID."""
        return self._users.get(user_id)
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        for user in self._users.values():
            if user.email == email:
                return user
        return None
    
    # ─────────────────────────────────────────────────────────────────────────
    # Authentication
    # ─────────────────────────────────────────────────────────────────────────
    
    def authenticate(
        self,
        email: str,
        password: str,
        device_info: Dict[str, str],
        ip_address: str,
        user_agent: str
    ) -> AuthResult:
        """Authenticate user with email and password."""
        user = self.get_user_by_email(email)
        
        # Check if user exists
        if not user:
            self.audit_service.log_event(
                AuditEventType.LOGIN_FAILED,
                ip_address,
                user_agent,
                success=False,
                details={"reason": "user_not_found", "email": email}
            )
            return AuthResult(success=False, error="Invalid credentials", error_code="INVALID_CREDENTIALS")
        
        # Check if account is locked
        if user.is_locked and user.locked_until and datetime.utcnow() < user.locked_until:
            remaining = int((user.locked_until - datetime.utcnow()).total_seconds() / 60)
            return AuthResult(
                success=False,
                error=f"Account locked. Try again in {remaining} minutes",
                error_code="ACCOUNT_LOCKED"
            )
        
        # Verify password
        if not PasswordService.verify_password(password, user.password_hash, user.salt):
            user.failed_login_attempts += 1
            
            # Lock account if too many failed attempts
            if user.failed_login_attempts >= AuthConfig.MAX_LOGIN_ATTEMPTS:
                user.is_locked = True
                user.locked_until = datetime.utcnow() + timedelta(
                    minutes=AuthConfig.LOCKOUT_DURATION_MINUTES
                )
                self.audit_service.log_event(
                    AuditEventType.ACCOUNT_LOCKED,
                    ip_address,
                    user_agent,
                    success=True,
                    user_id=user.id
                )
            
            self.audit_service.log_event(
                AuditEventType.LOGIN_FAILED,
                ip_address,
                user_agent,
                success=False,
                user_id=user.id,
                details={"reason": "invalid_password", "attempts": user.failed_login_attempts}
            )
            
            return AuthResult(success=False, error="Invalid credentials", error_code="INVALID_CREDENTIALS")
        
        # Check if 2FA is required
        if user.two_factor_enabled:
            # Create temporary 2FA token
            two_fa_payload = TokenPayload(
                sub=user.id,
                type=TokenType.TWO_FACTOR,
                session_id="pending",
                iat=datetime.utcnow(),
                exp=datetime.utcnow() + timedelta(minutes=5),
                jti=str(uuid4())
            )
            two_fa_token = JWTService.create_token(two_fa_payload)
            
            return AuthResult(
                success=True,
                requires_2fa=True,
                two_factor_token=two_fa_token,
                user_id=user.id
            )
        
        # Create session and tokens
        return self._complete_authentication(user, device_info, ip_address, user_agent)
    
    def verify_two_factor(
        self,
        two_factor_token: str,
        code: str,
        device_info: Dict[str, str],
        ip_address: str,
        user_agent: str,
        is_backup_code: bool = False
    ) -> AuthResult:
        """Verify 2FA code and complete authentication."""
        # Verify 2FA token
        payload = JWTService.verify_token(two_factor_token)
        if not payload or payload.type != TokenType.TWO_FACTOR:
            return AuthResult(success=False, error="Invalid 2FA token", error_code="INVALID_TOKEN")
        
        user = self.get_user(payload.sub)
        if not user:
            return AuthResult(success=False, error="User not found", error_code="USER_NOT_FOUND")
        
        # Verify code
        if is_backup_code:
            valid, remaining_codes = TwoFactorService.verify_backup_code(user.backup_codes, code)
            if valid:
                user.backup_codes = remaining_codes
        else:
            valid = TwoFactorService.verify_totp(user.two_factor_secret, code)
        
        if not valid:
            self.audit_service.log_event(
                AuditEventType.TWO_FACTOR_FAILED,
                ip_address,
                user_agent,
                success=False,
                user_id=user.id
            )
            return AuthResult(success=False, error="Invalid 2FA code", error_code="INVALID_2FA_CODE")
        
        self.audit_service.log_event(
            AuditEventType.TWO_FACTOR_SUCCESS,
            ip_address,
            user_agent,
            success=True,
            user_id=user.id
        )
        
        return self._complete_authentication(user, device_info, ip_address, user_agent)
    
    def _complete_authentication(
        self,
        user: User,
        device_info: Dict[str, str],
        ip_address: str,
        user_agent: str
    ) -> AuthResult:
        """Complete authentication and create tokens."""
        # Reset failed attempts
        user.failed_login_attempts = 0
        user.is_locked = False
        user.locked_until = None
        user.last_login = datetime.utcnow()
        
        # Create tokens
        session_id = str(uuid4())
        device_id = device_info.get("device_id", str(uuid4()))
        
        access_token, access_exp = JWTService.create_access_token(
            user.id, session_id, device_id
        )
        
        refresh_token, refresh_exp, refresh_hash = JWTService.create_refresh_token(
            user.id, session_id, device_id
        )
        
        # Create session
        session = self.session_service.create_session(
            user_id=user.id,
            device_info=device_info,
            ip_address=ip_address,
            user_agent=user_agent,
            refresh_token_hash=refresh_hash
        )
        
        # Log success
        self.audit_service.log_event(
            AuditEventType.LOGIN_SUCCESS,
            ip_address,
            user_agent,
            success=True,
            user_id=user.id,
            details={"session_id": session.id, "device_id": device_id}
        )
        
        return AuthResult(
            success=True,
            user_id=user.id,
            access_token=access_token,
            refresh_token=refresh_token,
            session_id=session.id,
            expires_in=AuthConfig.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
    
    def refresh_tokens(
        self,
        refresh_token: str,
        ip_address: str,
        user_agent: str
    ) -> AuthResult:
        """Refresh access token using refresh token."""
        # Verify refresh token
        payload = JWTService.verify_token(refresh_token)
        if not payload or payload.type != TokenType.REFRESH:
            return AuthResult(success=False, error="Invalid refresh token", error_code="INVALID_TOKEN")
        
        # Get session
        session = self.session_service.get_session(payload.session_id)
        if not session or session.status != SessionStatus.ACTIVE:
            return AuthResult(success=False, error="Session expired", error_code="SESSION_EXPIRED")
        
        # Verify token hash
        token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
        if session.refresh_token_hash != token_hash:
            # Possible token reuse attack
            self.session_service.revoke_session(session.id)
            self.audit_service.log_event(
                AuditEventType.SUSPICIOUS_ACTIVITY,
                ip_address,
                user_agent,
                success=False,
                user_id=session.user_id,
                details={"reason": "refresh_token_reuse"}
            )
            return AuthResult(success=False, error="Token compromised", error_code="TOKEN_COMPROMISED")
        
        # Get user
        user = self.get_user(session.user_id)
        if not user or not user.is_active:
            return AuthResult(success=False, error="User not found", error_code="USER_NOT_FOUND")
        
        # Create new tokens
        new_access_token, _ = JWTService.create_access_token(
            user.id, session.id, session.device_id
        )
        
        new_refresh_token, _, new_refresh_hash = JWTService.create_refresh_token(
            user.id, session.id, session.device_id
        )
        
        # Update session
        session.refresh_token_hash = new_refresh_hash
        session.last_activity = datetime.utcnow()
        
        self.audit_service.log_event(
            AuditEventType.TOKEN_REFRESH,
            ip_address,
            user_agent,
            success=True,
            user_id=user.id
        )
        
        return AuthResult(
            success=True,
            user_id=user.id,
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            session_id=session.id,
            expires_in=AuthConfig.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
    
    def logout(
        self,
        session_id: str,
        ip_address: str,
        user_agent: str
    ) -> bool:
        """Logout and revoke session."""
        session = self.session_service.get_session(session_id)
        if not session:
            return False
        
        self.session_service.revoke_session(session_id)
        
        self.audit_service.log_event(
            AuditEventType.LOGOUT,
            ip_address,
            user_agent,
            success=True,
            user_id=session.user_id
        )
        
        return True
    
    def logout_all_devices(
        self,
        user_id: str,
        current_session_id: Optional[str],
        ip_address: str,
        user_agent: str
    ) -> int:
        """Logout from all devices except current."""
        count = self.session_service.revoke_all_sessions(user_id, current_session_id)
        
        self.audit_service.log_event(
            AuditEventType.SESSION_REVOKED,
            ip_address,
            user_agent,
            success=True,
            user_id=user_id,
            details={"revoked_count": count}
        )
        
        return count
    
    # ─────────────────────────────────────────────────────────────────────────
    # 2FA Management
    # ─────────────────────────────────────────────────────────────────────────
    
    def enable_two_factor(
        self,
        user_id: str,
        ip_address: str,
        user_agent: str
    ) -> Tuple[Optional[str], Optional[str], Optional[List[str]]]:
        """Enable 2FA for user. Returns (secret, provisioning_uri, backup_codes)."""
        user = self.get_user(user_id)
        if not user:
            return None, None, None
        
        secret = TwoFactorService.generate_secret()
        uri = TwoFactorService.get_provisioning_uri(secret, user.email)
        backup_codes = PasswordService.generate_backup_codes()
        
        # Store temporarily (user must verify before activation)
        user.metadata["pending_2fa_secret"] = secret
        user.metadata["pending_backup_codes"] = backup_codes
        
        return secret, uri, backup_codes
    
    def confirm_two_factor(
        self,
        user_id: str,
        code: str,
        ip_address: str,
        user_agent: str
    ) -> bool:
        """Confirm and activate 2FA."""
        user = self.get_user(user_id)
        if not user:
            return False
        
        pending_secret = user.metadata.get("pending_2fa_secret")
        if not pending_secret:
            return False
        
        # Verify code with pending secret
        if not TwoFactorService.verify_totp(pending_secret, code):
            return False
        
        # Activate 2FA
        user.two_factor_enabled = True
        user.two_factor_secret = pending_secret
        user.backup_codes = user.metadata.get("pending_backup_codes", [])
        
        # Clear pending
        del user.metadata["pending_2fa_secret"]
        del user.metadata["pending_backup_codes"]
        
        self.audit_service.log_event(
            AuditEventType.TWO_FACTOR_ENABLED,
            ip_address,
            user_agent,
            success=True,
            user_id=user_id
        )
        
        return True
    
    def disable_two_factor(
        self,
        user_id: str,
        password: str,
        ip_address: str,
        user_agent: str
    ) -> bool:
        """Disable 2FA for user."""
        user = self.get_user(user_id)
        if not user:
            return False
        
        # Verify password
        if not PasswordService.verify_password(password, user.password_hash, user.salt):
            return False
        
        user.two_factor_enabled = False
        user.two_factor_secret = None
        user.backup_codes = []
        
        self.audit_service.log_event(
            AuditEventType.TWO_FACTOR_DISABLED,
            ip_address,
            user_agent,
            success=True,
            user_id=user_id
        )
        
        return True


# ═══════════════════════════════════════════════════════════════════════════
# SINGLETON INSTANCE
# ═══════════════════════════════════════════════════════════════════════════

auth_service = AuthenticationService()


# ═══════════════════════════════════════════════════════════════════════════
# TEST
# ═══════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("=" * 60)
    print("CHE·NU™ Authentication Service V72 - Test")
    print("=" * 60)
    
    # Test registration
    print("\n1. Register user...")
    user, error = auth_service.register_user(
        email="test@chenu.com",
        password="SecurePass123!",
        ip_address="192.168.1.1",
        user_agent="Test/1.0"
    )
    
    if user:
        print(f"   ✓ User registered: {user.id}")
    else:
        print(f"   ✗ Registration failed: {error}")
    
    # Test authentication
    print("\n2. Authenticate user...")
    result = auth_service.authenticate(
        email="test@chenu.com",
        password="SecurePass123!",
        device_info={"device_id": "test-device", "name": "Test Device"},
        ip_address="192.168.1.1",
        user_agent="Test/1.0"
    )
    
    if result.success:
        print(f"   ✓ Login successful")
        print(f"   - Access Token: {result.access_token[:50]}...")
        print(f"   - Session ID: {result.session_id}")
        print(f"   - Expires in: {result.expires_in}s")
    else:
        print(f"   ✗ Login failed: {result.error}")
    
    # Test token refresh
    if result.success:
        print("\n3. Refresh tokens...")
        refresh_result = auth_service.refresh_tokens(
            result.refresh_token,
            ip_address="192.168.1.1",
            user_agent="Test/1.0"
        )
        
        if refresh_result.success:
            print(f"   ✓ Tokens refreshed")
            print(f"   - New Access Token: {refresh_result.access_token[:50]}...")
        else:
            print(f"   ✗ Refresh failed: {refresh_result.error}")
    
    # Test 2FA setup
    if user:
        print("\n4. Enable 2FA...")
        secret, uri, backup_codes = auth_service.enable_two_factor(
            user.id,
            ip_address="192.168.1.1",
            user_agent="Test/1.0"
        )
        
        if secret:
            print(f"   ✓ 2FA secret generated")
            print(f"   - Secret: {secret}")
            print(f"   - Backup codes: {backup_codes[:3]}...")
            
            # Generate TOTP and confirm
            totp_code = TwoFactorService.generate_totp(secret)
            print(f"   - Current TOTP: {totp_code}")
            
            confirmed = auth_service.confirm_two_factor(
                user.id,
                totp_code,
                ip_address="192.168.1.1",
                user_agent="Test/1.0"
            )
            
            if confirmed:
                print(f"   ✓ 2FA enabled successfully")
            else:
                print(f"   ✗ 2FA confirmation failed")
    
    # Test logout
    if result.success:
        print("\n5. Logout...")
        logged_out = auth_service.logout(
            result.session_id,
            ip_address="192.168.1.1",
            user_agent="Test/1.0"
        )
        print(f"   {'✓' if logged_out else '✗'} Logged out")
    
    print("\n" + "=" * 60)
    print("Test complete!")
    print("=" * 60)
