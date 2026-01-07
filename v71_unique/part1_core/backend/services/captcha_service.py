"""
CHE·NU™ CAPTCHA Integration Service V72

CAPTCHA verification for bot protection:
- Google reCAPTCHA v2/v3
- hCaptcha support
- Turnstile (Cloudflare) support
- Configurable thresholds

@version V72.0
@phase Phase 2 - Authentication Security
"""

import os
import asyncio
import httpx
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List, Tuple
from dataclasses import dataclass, field
from enum import Enum
from abc import ABC, abstractmethod
import hashlib
import secrets


# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════

class CaptchaConfig:
    """CAPTCHA configuration."""
    
    # reCAPTCHA
    RECAPTCHA_SITE_KEY = os.getenv("RECAPTCHA_SITE_KEY", "")
    RECAPTCHA_SECRET_KEY = os.getenv("RECAPTCHA_SECRET_KEY", "")
    RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"
    RECAPTCHA_V3_THRESHOLD = 0.5  # Score threshold for v3
    
    # hCaptcha
    HCAPTCHA_SITE_KEY = os.getenv("HCAPTCHA_SITE_KEY", "")
    HCAPTCHA_SECRET_KEY = os.getenv("HCAPTCHA_SECRET_KEY", "")
    HCAPTCHA_VERIFY_URL = "https://hcaptcha.com/siteverify"
    
    # Cloudflare Turnstile
    TURNSTILE_SITE_KEY = os.getenv("TURNSTILE_SITE_KEY", "")
    TURNSTILE_SECRET_KEY = os.getenv("TURNSTILE_SECRET_KEY", "")
    TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
    
    # General
    ENABLED = os.getenv("CAPTCHA_ENABLED", "true").lower() == "true"
    PROVIDER = os.getenv("CAPTCHA_PROVIDER", "recaptcha")  # recaptcha, hcaptcha, turnstile
    TIMEOUT_SECONDS = 10
    
    # Bypass for testing
    TEST_MODE = os.getenv("CAPTCHA_TEST_MODE", "false").lower() == "true"
    TEST_SECRET = os.getenv("CAPTCHA_TEST_SECRET", "test-captcha-bypass")


# ═══════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════

class CaptchaProvider(Enum):
    """Supported CAPTCHA providers."""
    RECAPTCHA_V2 = "recaptcha_v2"
    RECAPTCHA_V3 = "recaptcha_v3"
    HCAPTCHA = "hcaptcha"
    TURNSTILE = "turnstile"


class CaptchaAction(Enum):
    """Actions requiring CAPTCHA verification."""
    LOGIN = "login"
    REGISTER = "register"
    PASSWORD_RESET = "password_reset"
    CONTACT_FORM = "contact_form"
    COMMENT = "comment"


# ═══════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════

@dataclass
class CaptchaResult:
    """Result of CAPTCHA verification."""
    success: bool
    score: Optional[float] = None  # For reCAPTCHA v3
    action: Optional[str] = None
    challenge_ts: Optional[str] = None
    hostname: Optional[str] = None
    error_codes: List[str] = field(default_factory=list)
    raw_response: Dict[str, Any] = field(default_factory=dict)


@dataclass
class CaptchaChallenge:
    """CAPTCHA challenge for frontend."""
    provider: CaptchaProvider
    site_key: str
    action: Optional[str] = None
    theme: str = "light"
    size: str = "normal"


# ═══════════════════════════════════════════════════════════════════════════
# CAPTCHA VERIFIERS
# ═══════════════════════════════════════════════════════════════════════════

class CaptchaVerifier(ABC):
    """Base class for CAPTCHA verifiers."""
    
    @abstractmethod
    async def verify(
        self, 
        token: str, 
        remote_ip: Optional[str] = None,
        action: Optional[str] = None
    ) -> CaptchaResult:
        """Verify CAPTCHA token."""
        pass
    
    @abstractmethod
    def get_challenge(self, action: Optional[str] = None) -> CaptchaChallenge:
        """Get challenge configuration for frontend."""
        pass


class RecaptchaVerifier(CaptchaVerifier):
    """Google reCAPTCHA verifier (v2 and v3)."""
    
    def __init__(self, version: str = "v2"):
        self._version = version
        self._site_key = CaptchaConfig.RECAPTCHA_SITE_KEY
        self._secret_key = CaptchaConfig.RECAPTCHA_SECRET_KEY
    
    async def verify(
        self, 
        token: str, 
        remote_ip: Optional[str] = None,
        action: Optional[str] = None
    ) -> CaptchaResult:
        """Verify reCAPTCHA token."""
        if not self._secret_key:
            return CaptchaResult(
                success=False,
                error_codes=["missing-secret-key"]
            )
        
        # Test mode bypass
        if CaptchaConfig.TEST_MODE and token == CaptchaConfig.TEST_SECRET:
            return CaptchaResult(
                success=True,
                score=1.0 if self._version == "v3" else None,
                action=action
            )
        
        try:
            async with httpx.AsyncClient(timeout=CaptchaConfig.TIMEOUT_SECONDS) as client:
                data = {
                    "secret": self._secret_key,
                    "response": token,
                }
                
                if remote_ip:
                    data["remoteip"] = remote_ip
                
                response = await client.post(
                    CaptchaConfig.RECAPTCHA_VERIFY_URL,
                    data=data
                )
                
                result = response.json()
                
                # Check success
                success = result.get("success", False)
                
                # For v3, also check score
                score = result.get("score")
                if self._version == "v3" and success:
                    if score is not None and score < CaptchaConfig.RECAPTCHA_V3_THRESHOLD:
                        success = False
                    
                    # Verify action matches
                    response_action = result.get("action")
                    if action and response_action != action:
                        success = False
                
                return CaptchaResult(
                    success=success,
                    score=score,
                    action=result.get("action"),
                    challenge_ts=result.get("challenge_ts"),
                    hostname=result.get("hostname"),
                    error_codes=result.get("error-codes", []),
                    raw_response=result
                )
                
        except Exception as e:
            return CaptchaResult(
                success=False,
                error_codes=["verification-failed", str(e)]
            )
    
    def get_challenge(self, action: Optional[str] = None) -> CaptchaChallenge:
        """Get reCAPTCHA challenge config."""
        provider = CaptchaProvider.RECAPTCHA_V3 if self._version == "v3" else CaptchaProvider.RECAPTCHA_V2
        return CaptchaChallenge(
            provider=provider,
            site_key=self._site_key,
            action=action
        )


class HCaptchaVerifier(CaptchaVerifier):
    """hCaptcha verifier."""
    
    def __init__(self):
        self._site_key = CaptchaConfig.HCAPTCHA_SITE_KEY
        self._secret_key = CaptchaConfig.HCAPTCHA_SECRET_KEY
    
    async def verify(
        self, 
        token: str, 
        remote_ip: Optional[str] = None,
        action: Optional[str] = None
    ) -> CaptchaResult:
        """Verify hCaptcha token."""
        if not self._secret_key:
            return CaptchaResult(
                success=False,
                error_codes=["missing-secret-key"]
            )
        
        # Test mode bypass
        if CaptchaConfig.TEST_MODE and token == CaptchaConfig.TEST_SECRET:
            return CaptchaResult(success=True)
        
        try:
            async with httpx.AsyncClient(timeout=CaptchaConfig.TIMEOUT_SECONDS) as client:
                data = {
                    "secret": self._secret_key,
                    "response": token,
                    "sitekey": self._site_key,
                }
                
                if remote_ip:
                    data["remoteip"] = remote_ip
                
                response = await client.post(
                    CaptchaConfig.HCAPTCHA_VERIFY_URL,
                    data=data
                )
                
                result = response.json()
                
                return CaptchaResult(
                    success=result.get("success", False),
                    challenge_ts=result.get("challenge_ts"),
                    hostname=result.get("hostname"),
                    error_codes=result.get("error-codes", []),
                    raw_response=result
                )
                
        except Exception as e:
            return CaptchaResult(
                success=False,
                error_codes=["verification-failed", str(e)]
            )
    
    def get_challenge(self, action: Optional[str] = None) -> CaptchaChallenge:
        """Get hCaptcha challenge config."""
        return CaptchaChallenge(
            provider=CaptchaProvider.HCAPTCHA,
            site_key=self._site_key
        )


class TurnstileVerifier(CaptchaVerifier):
    """Cloudflare Turnstile verifier."""
    
    def __init__(self):
        self._site_key = CaptchaConfig.TURNSTILE_SITE_KEY
        self._secret_key = CaptchaConfig.TURNSTILE_SECRET_KEY
    
    async def verify(
        self, 
        token: str, 
        remote_ip: Optional[str] = None,
        action: Optional[str] = None
    ) -> CaptchaResult:
        """Verify Turnstile token."""
        if not self._secret_key:
            return CaptchaResult(
                success=False,
                error_codes=["missing-secret-key"]
            )
        
        # Test mode bypass
        if CaptchaConfig.TEST_MODE and token == CaptchaConfig.TEST_SECRET:
            return CaptchaResult(success=True)
        
        try:
            async with httpx.AsyncClient(timeout=CaptchaConfig.TIMEOUT_SECONDS) as client:
                data = {
                    "secret": self._secret_key,
                    "response": token,
                }
                
                if remote_ip:
                    data["remoteip"] = remote_ip
                
                response = await client.post(
                    CaptchaConfig.TURNSTILE_VERIFY_URL,
                    data=data
                )
                
                result = response.json()
                
                return CaptchaResult(
                    success=result.get("success", False),
                    challenge_ts=result.get("challenge_ts"),
                    hostname=result.get("hostname"),
                    action=result.get("action"),
                    error_codes=result.get("error-codes", []),
                    raw_response=result
                )
                
        except Exception as e:
            return CaptchaResult(
                success=False,
                error_codes=["verification-failed", str(e)]
            )
    
    def get_challenge(self, action: Optional[str] = None) -> CaptchaChallenge:
        """Get Turnstile challenge config."""
        return CaptchaChallenge(
            provider=CaptchaProvider.TURNSTILE,
            site_key=self._site_key,
            action=action
        )


# ═══════════════════════════════════════════════════════════════════════════
# CAPTCHA SERVICE
# ═══════════════════════════════════════════════════════════════════════════

class CaptchaService:
    """Unified CAPTCHA service."""
    
    def __init__(self, provider: Optional[str] = None):
        provider = provider or CaptchaConfig.PROVIDER
        self._verifier = self._create_verifier(provider)
        self._enabled = CaptchaConfig.ENABLED
    
    def _create_verifier(self, provider: str) -> CaptchaVerifier:
        """Create verifier for provider."""
        if provider == "recaptcha" or provider == "recaptcha_v2":
            return RecaptchaVerifier("v2")
        elif provider == "recaptcha_v3":
            return RecaptchaVerifier("v3")
        elif provider == "hcaptcha":
            return HCaptchaVerifier()
        elif provider == "turnstile":
            return TurnstileVerifier()
        else:
            # Default to reCAPTCHA v2
            return RecaptchaVerifier("v2")
    
    @property
    def enabled(self) -> bool:
        """Check if CAPTCHA is enabled."""
        return self._enabled
    
    async def verify(
        self,
        token: str,
        remote_ip: Optional[str] = None,
        action: Optional[str] = None
    ) -> CaptchaResult:
        """
        Verify CAPTCHA token.
        
        Args:
            token: CAPTCHA token from frontend
            remote_ip: Client IP address
            action: Action being performed (for reCAPTCHA v3)
        
        Returns:
            CaptchaResult with verification status
        """
        if not self._enabled:
            return CaptchaResult(success=True)
        
        return await self._verifier.verify(token, remote_ip, action)
    
    def get_challenge(self, action: Optional[str] = None) -> CaptchaChallenge:
        """Get challenge configuration for frontend."""
        return self._verifier.get_challenge(action)
    
    def get_client_config(self) -> Dict[str, Any]:
        """Get configuration for frontend client."""
        challenge = self.get_challenge()
        return {
            "enabled": self._enabled,
            "provider": challenge.provider.value,
            "siteKey": challenge.site_key,
        }


# ═══════════════════════════════════════════════════════════════════════════
# FASTAPI DEPENDENCIES
# ═══════════════════════════════════════════════════════════════════════════

from typing import Callable
from functools import wraps


def require_captcha(action: Optional[str] = None):
    """
    FastAPI dependency for CAPTCHA verification.
    
    Usage:
        @router.post("/login")
        async def login(captcha: bool = Depends(require_captcha("login"))):
            ...
    """
    async def verify_captcha(
        request,
        captcha_token: Optional[str] = None
    ) -> bool:
        if not captcha_service.enabled:
            return True
        
        if not captcha_token:
            from fastapi import HTTPException
            raise HTTPException(
                status_code=400,
                detail={
                    "error": "captcha_required",
                    "message": "CAPTCHA verification required"
                }
            )
        
        # Get client IP
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            remote_ip = forwarded.split(",")[0].strip()
        else:
            remote_ip = request.client.host if request.client else None
        
        result = await captcha_service.verify(captcha_token, remote_ip, action)
        
        if not result.success:
            from fastapi import HTTPException
            raise HTTPException(
                status_code=400,
                detail={
                    "error": "captcha_failed",
                    "message": "CAPTCHA verification failed",
                    "errors": result.error_codes
                }
            )
        
        return True
    
    return verify_captcha


# ═══════════════════════════════════════════════════════════════════════════
# SINGLETON
# ═══════════════════════════════════════════════════════════════════════════

captcha_service = CaptchaService()


def get_captcha_service() -> CaptchaService:
    """Get CAPTCHA service singleton."""
    return captcha_service


# ═══════════════════════════════════════════════════════════════════════════
# FRONTEND COMPONENT HELPERS
# ═══════════════════════════════════════════════════════════════════════════

def get_captcha_script_tag(provider: str = None) -> str:
    """Get HTML script tag for CAPTCHA provider."""
    provider = provider or CaptchaConfig.PROVIDER
    
    if provider in ["recaptcha", "recaptcha_v2"]:
        return '<script src="https://www.google.com/recaptcha/api.js" async defer></script>'
    elif provider == "recaptcha_v3":
        site_key = CaptchaConfig.RECAPTCHA_SITE_KEY
        return f'<script src="https://www.google.com/recaptcha/api.js?render={site_key}" async defer></script>'
    elif provider == "hcaptcha":
        return '<script src="https://js.hcaptcha.com/1/api.js" async defer></script>'
    elif provider == "turnstile":
        return '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>'
    
    return ""


def get_captcha_element(provider: str = None, action: str = None) -> str:
    """Get HTML element for CAPTCHA widget."""
    provider = provider or CaptchaConfig.PROVIDER
    
    if provider in ["recaptcha", "recaptcha_v2"]:
        site_key = CaptchaConfig.RECAPTCHA_SITE_KEY
        return f'<div class="g-recaptcha" data-sitekey="{site_key}"></div>'
    elif provider == "recaptcha_v3":
        return ""  # v3 is invisible
    elif provider == "hcaptcha":
        site_key = CaptchaConfig.HCAPTCHA_SITE_KEY
        return f'<div class="h-captcha" data-sitekey="{site_key}"></div>'
    elif provider == "turnstile":
        site_key = CaptchaConfig.TURNSTILE_SITE_KEY
        action_attr = f' data-action="{action}"' if action else ""
        return f'<div class="cf-turnstile" data-sitekey="{site_key}"{action_attr}></div>'
    
    return ""


# ═══════════════════════════════════════════════════════════════════════════
# TEST
# ═══════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    async def test_captcha():
        print("=" * 60)
        print("CHE·NU™ CAPTCHA Service V72 - Test")
        print("=" * 60)
        
        # Enable test mode
        CaptchaConfig.TEST_MODE = True
        CaptchaConfig.ENABLED = True
        
        service = CaptchaService()
        
        # Test client config
        print("\n1. Get client config...")
        config = service.get_client_config()
        print(f"   Provider: {config['provider']}")
        print(f"   Enabled: {config['enabled']}")
        
        # Test successful verification (test mode)
        print("\n2. Test successful verification (test mode)...")
        result = await service.verify(
            token=CaptchaConfig.TEST_SECRET,
            remote_ip="127.0.0.1",
            action="login"
        )
        print(f"   Success: {result.success}")
        
        # Test failed verification
        print("\n3. Test failed verification...")
        result = await service.verify(
            token="invalid-token",
            remote_ip="127.0.0.1"
        )
        print(f"   Success: {result.success}")
        print(f"   Errors: {result.error_codes}")
        
        # Test disabled
        print("\n4. Test with CAPTCHA disabled...")
        service._enabled = False
        result = await service.verify(token="anything")
        print(f"   Success (bypass): {result.success}")
        
        # Test HTML helpers
        print("\n5. Test HTML helpers...")
        print(f"   Script tag: {get_captcha_script_tag()[:50]}...")
        print(f"   Element: {get_captcha_element()[:50]}...")
        
        print("\n" + "=" * 60)
        print("Test complete!")
        print("=" * 60)
    
    asyncio.run(test_captcha())
