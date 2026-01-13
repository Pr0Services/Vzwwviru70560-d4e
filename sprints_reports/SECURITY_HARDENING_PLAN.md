# 🔒 CHE·NU V42.1 — SECURITY HARDENING PLAN

## OWASP Top 10 Compliance + Enterprise Security

**Version**: 42.1  
**Date**: Janvier 2026  
**Status**: Implementation Phase  
**Priority**: P0 — CRITIQUE

---

## 📊 EXECUTIVE SUMMARY

| Catégorie | Tests | Status |
|-----------|-------|--------|
| OWASP Top 10 | 10 | 🔄 En cours |
| Authentication | 15 | 🔄 |
| Authorization | 12 | 🔄 |
| Data Protection | 10 | 🔄 |
| API Security | 18 | 🔄 |
| Infrastructure | 8 | 🔄 |
| **TOTAL** | **73** | **À implémenter** |

---

## 🛡️ OWASP TOP 10 (2021) COMPLIANCE

### A01:2021 — Broken Access Control

**Risque**: Accès non autorisé aux ressources

**Contrôles requis**:
```python
# 1. Deny by default
@router.get("/api/v1/resource/{id}")
async def get_resource(
    id: str,
    current_user: User = Depends(get_current_user),
    authz: AuthorizationService = Depends()
):
    # Explicit permission check
    if not await authz.can_access(current_user, "resource", id):
        raise HTTPException(403, "Access denied")
    return await resource_service.get(id)

# 2. Rate limiting per user
@limiter.limit("100/minute")
async def api_endpoint():
    pass

# 3. CORS restrictive
CORS_ORIGINS = [
    "https://app.chenu.io",
    "https://api.chenu.io"
]
```

**Checklist**:
- [ ] Deny by default sur toutes les routes
- [ ] Vérification ownership sur chaque ressource
- [ ] Rate limiting par user/IP
- [ ] CORS restrictif (whitelist only)
- [ ] Désactiver directory listing
- [ ] Invalider JWT au logout

---

### A02:2021 — Cryptographic Failures

**Risque**: Données sensibles exposées

**Contrôles requis**:
```python
# 1. Encryption at rest (database)
SQLALCHEMY_DATABASE_URI = "postgresql+asyncpg://..."
# + pgcrypto extension enabled

# 2. Encryption in transit
SSL_CERT_PATH = "/etc/ssl/certs/chenu.crt"
SSL_KEY_PATH = "/etc/ssl/private/chenu.key"

# 3. Password hashing (Argon2id)
from argon2 import PasswordHasher
ph = PasswordHasher(
    time_cost=3,
    memory_cost=65536,
    parallelism=4
)

def hash_password(password: str) -> str:
    return ph.hash(password)

def verify_password(password: str, hash: str) -> bool:
    try:
        return ph.verify(hash, password)
    except:
        return False

# 4. Sensitive data classification
SENSITIVE_FIELDS = [
    "password", "ssn", "credit_card", "api_key",
    "secret", "token", "private_key"
]
```

**Checklist**:
- [ ] TLS 1.3 only (disable TLS 1.0, 1.1, 1.2)
- [ ] Argon2id pour passwords (pas bcrypt)
- [ ] AES-256-GCM pour encryption at rest
- [ ] Pas de secrets en logs
- [ ] Rotation des clés (90 jours)
- [ ] HSTS header enabled

---

### A03:2021 — Injection

**Risque**: SQL, NoSQL, OS, LDAP injection

**Contrôles requis**:
```python
# 1. Parameterized queries (SQLAlchemy)
# ❌ MAUVAIS
query = f"SELECT * FROM users WHERE id = {user_id}"

# ✅ BON
stmt = select(User).where(User.id == user_id)
result = await session.execute(stmt)

# 2. Input validation (Pydantic)
from pydantic import BaseModel, validator, constr
import re

class UserInput(BaseModel):
    username: constr(min_length=3, max_length=50, regex=r'^[a-zA-Z0-9_]+$')
    email: EmailStr
    
    @validator('username')
    def validate_username(cls, v):
        if any(c in v for c in ['<', '>', '"', "'", ';', '--']):
            raise ValueError('Invalid characters')
        return v

# 3. Command injection prevention
import shlex
# ❌ MAUVAIS
os.system(f"process {user_input}")

# ✅ BON
subprocess.run(["process", shlex.quote(user_input)], check=True)
```

**Checklist**:
- [ ] Parameterized queries everywhere
- [ ] Pydantic validation on all inputs
- [ ] No string concatenation in queries
- [ ] Escape shell commands
- [ ] Content-Type validation
- [ ] File upload validation

---

### A04:2021 — Insecure Design

**Risque**: Architecture vulnérable

**Contrôles requis**:
```python
# 1. Threat modeling
THREAT_MODEL = {
    "assets": ["user_data", "agent_keys", "api_tokens"],
    "threats": ["data_breach", "privilege_escalation", "dos"],
    "mitigations": ["encryption", "rbac", "rate_limiting"]
}

# 2. Security by design - Agent system
class AgentSecurityPolicy:
    MAX_TOKEN_BUDGET = 100000
    REQUIRE_HUMAN_APPROVAL = ["delete", "transfer", "admin"]
    ISOLATION_LEVEL = "strict"
    
    @staticmethod
    def check_action(agent: Agent, action: str) -> bool:
        if action in AgentSecurityPolicy.REQUIRE_HUMAN_APPROVAL:
            return False  # Requires checkpoint
        return True

# 3. Defense in depth
SECURITY_LAYERS = [
    "WAF",           # Layer 1: Web Application Firewall
    "Rate Limiter",  # Layer 2: Request throttling
    "Auth",          # Layer 3: Authentication
    "Authz",         # Layer 4: Authorization
    "Validation",    # Layer 5: Input validation
    "Audit",         # Layer 6: Logging
]
```

**Checklist**:
- [ ] Threat model documented
- [ ] Security requirements in specs
- [ ] Defense in depth implemented
- [ ] Fail securely (deny on error)
- [ ] Principle of least privilege
- [ ] Agent isolation verified

---

### A05:2021 — Security Misconfiguration

**Risque**: Configuration par défaut vulnérable

**Contrôles requis**:
```python
# 1. Security headers
SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy": "default-src 'self'; script-src 'self'",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
}

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    return response

# 2. Production config
class ProductionConfig:
    DEBUG = False
    TESTING = False
    LOG_LEVEL = "WARNING"
    SHOW_STACK_TRACES = False
    
# 3. Remove default credentials
FORBIDDEN_PASSWORDS = [
    "admin", "password", "123456", "root",
    "chenu", "nova", "test"
]
```

**Checklist**:
- [ ] Debug mode OFF en production
- [ ] Stack traces cachées
- [ ] Default accounts supprimés
- [ ] Security headers configurés
- [ ] Unnecessary features désactivées
- [ ] Error messages génériques

---

### A06:2021 — Vulnerable Components

**Risque**: Dépendances avec vulnérabilités connues

**Contrôles requis**:
```bash
# 1. Dependency scanning
pip install safety pip-audit
safety check
pip-audit

# 2. GitHub Dependabot (.github/dependabot.yml)
version: 2
updates:
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "daily"
    open-pull-requests-limit: 10

# 3. Lock file avec hashes
pip-compile --generate-hashes requirements.in

# 4. Minimal base image
FROM python:3.11-slim-bookworm
# NOT python:3.11 (full image)
```

**Checklist**:
- [ ] Dependabot enabled
- [ ] Weekly vulnerability scans
- [ ] Lock files with hashes
- [ ] Minimal Docker images
- [ ] No outdated packages (>6 months)
- [ ] CVE monitoring active

---

### A07:2021 — Identification & Authentication Failures

**Risque**: Auth bypass, credential stuffing

**Contrôles requis**:
```python
# 1. Strong password policy
PASSWORD_POLICY = {
    "min_length": 12,
    "require_uppercase": True,
    "require_lowercase": True,
    "require_digit": True,
    "require_special": True,
    "max_age_days": 90,
    "history_count": 5,  # Can't reuse last 5
}

# 2. Account lockout
LOCKOUT_POLICY = {
    "max_attempts": 5,
    "lockout_duration_minutes": 30,
    "reset_after_minutes": 60,
}

async def check_login_attempts(user_id: str) -> bool:
    attempts = await redis.get(f"login_attempts:{user_id}")
    if attempts and int(attempts) >= LOCKOUT_POLICY["max_attempts"]:
        return False
    return True

# 3. MFA support
class MFAService:
    def generate_totp_secret(self) -> str:
        return pyotp.random_base32()
    
    def verify_totp(self, secret: str, code: str) -> bool:
        totp = pyotp.TOTP(secret)
        return totp.verify(code, valid_window=1)

# 4. JWT security
JWT_CONFIG = {
    "algorithm": "RS256",  # NOT HS256
    "access_token_expire_minutes": 15,
    "refresh_token_expire_days": 7,
    "issuer": "https://api.chenu.io",
    "audience": "https://app.chenu.io",
}
```

**Checklist**:
- [ ] Strong password policy
- [ ] Account lockout (5 attempts)
- [ ] MFA available
- [ ] JWT RS256 (not HS256)
- [ ] Short token expiry (15 min)
- [ ] Secure session management
- [ ] Credential stuffing protection

---

### A08:2021 — Software & Data Integrity Failures

**Risque**: Code ou data non vérifié

**Contrôles requis**:
```python
# 1. Signed releases
GPG_KEY_ID = "CHE-NU-RELEASE-KEY"

# 2. Integrity checks
import hashlib

def verify_file_integrity(filepath: str, expected_hash: str) -> bool:
    sha256 = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            sha256.update(chunk)
    return sha256.hexdigest() == expected_hash

# 3. CI/CD security
# .github/workflows/security.yml
name: Security Checks
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Bandit
        run: bandit -r backend/
      - name: Run Safety
        run: safety check
      - name: Run Trivy
        uses: aquasecurity/trivy-action@master

# 4. Agent code signing
class AgentCodeVerifier:
    def verify_agent(self, agent_id: str, signature: str) -> bool:
        # Verify agent hasn't been tampered
        agent_hash = self.compute_agent_hash(agent_id)
        return self.verify_signature(agent_hash, signature)
```

**Checklist**:
- [ ] Signed releases
- [ ] Dependency integrity (hashes)
- [ ] CI/CD pipeline secured
- [ ] Code review required
- [ ] No unsigned code execution
- [ ] Agent integrity verification

---

### A09:2021 — Security Logging & Monitoring

**Risque**: Attaques non détectées

**Contrôles requis**:
```python
# 1. Structured logging
import structlog

logger = structlog.get_logger()

# Security events to log
SECURITY_EVENTS = [
    "login_success", "login_failure", "logout",
    "password_change", "mfa_enabled", "mfa_disabled",
    "permission_denied", "rate_limit_exceeded",
    "suspicious_activity", "data_export",
    "agent_action", "kill_switch_activated"
]

async def log_security_event(
    event_type: str,
    user_id: str,
    ip_address: str,
    details: dict
):
    await logger.ainfo(
        event_type,
        user_id=user_id,
        ip=ip_address,
        timestamp=datetime.utcnow().isoformat(),
        **details
    )
    
    # Also write to audit table
    await audit_log.insert({
        "event_type": event_type,
        "user_id": user_id,
        "ip_address": ip_address,
        "details": details,
        "created_at": datetime.utcnow()
    })

# 2. Alert thresholds
ALERT_THRESHOLDS = {
    "failed_logins_per_hour": 10,
    "rate_limits_per_minute": 50,
    "permission_denied_per_hour": 20,
    "suspicious_ips_per_day": 5,
}

# 3. Log retention
LOG_RETENTION = {
    "security_logs": 365,  # 1 year
    "audit_logs": 730,     # 2 years
    "access_logs": 90,     # 3 months
    "debug_logs": 7,       # 1 week
}
```

**Checklist**:
- [ ] All auth events logged
- [ ] All admin actions logged
- [ ] Agent actions logged
- [ ] Alerting configured
- [ ] Log integrity (append-only)
- [ ] 1 year retention minimum
- [ ] SIEM integration ready

---

### A10:2021 — Server-Side Request Forgery (SSRF)

**Risque**: Accès réseau interne non autorisé

**Contrôles requis**:
```python
# 1. URL validation
import ipaddress
from urllib.parse import urlparse

BLOCKED_HOSTS = [
    "localhost", "127.0.0.1", "0.0.0.0",
    "169.254.169.254",  # AWS metadata
    "metadata.google.internal",
]

BLOCKED_NETWORKS = [
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("127.0.0.0/8"),
]

def is_safe_url(url: str) -> bool:
    parsed = urlparse(url)
    
    # Check blocked hosts
    if parsed.hostname in BLOCKED_HOSTS:
        return False
    
    # Check private networks
    try:
        ip = ipaddress.ip_address(parsed.hostname)
        for network in BLOCKED_NETWORKS:
            if ip in network:
                return False
    except ValueError:
        pass  # Not an IP, hostname
    
    # Only allow HTTPS
    if parsed.scheme != "https":
        return False
    
    return True

# 2. Whitelist for external calls
ALLOWED_EXTERNAL_HOSTS = [
    "api.anthropic.com",
    "api.openai.com",
    "oauth.google.com",
]
```

**Checklist**:
- [ ] URL validation before fetch
- [ ] Block private IP ranges
- [ ] Block cloud metadata endpoints
- [ ] Whitelist external services
- [ ] No user-controlled redirects
- [ ] DNS rebinding protection

---

## 🔐 ADDITIONAL SECURITY CONTROLS

### API Security

```python
# 1. API Key management
class APIKeyService:
    KEY_PREFIX = "chenu_"
    KEY_LENGTH = 32
    
    def generate_key(self) -> tuple[str, str]:
        """Returns (key, hash)"""
        key = self.KEY_PREFIX + secrets.token_urlsafe(self.KEY_LENGTH)
        hash = hashlib.sha256(key.encode()).hexdigest()
        return key, hash
    
    def validate_key(self, key: str, stored_hash: str) -> bool:
        computed = hashlib.sha256(key.encode()).hexdigest()
        return secrets.compare_digest(computed, stored_hash)

# 2. Request signing
class RequestSigner:
    def sign_request(self, method: str, path: str, body: bytes, timestamp: int) -> str:
        message = f"{method}\n{path}\n{timestamp}\n{hashlib.sha256(body).hexdigest()}"
        return hmac.new(self.secret, message.encode(), hashlib.sha256).hexdigest()

# 3. Rate limiting tiers
RATE_LIMITS = {
    "anonymous": "10/minute",
    "authenticated": "100/minute",
    "premium": "1000/minute",
    "enterprise": "10000/minute",
}
```

### Agent Security (CHE·NU Specific)

```python
# 1. Agent sandboxing
class AgentSandbox:
    ALLOWED_OPERATIONS = {
        "L3": ["read", "suggest"],
        "L2": ["read", "write", "suggest"],
        "L1": ["read", "write", "execute", "delegate"],
        "L0": ["*"],  # NOVA only
    }
    
    def can_execute(self, agent: Agent, operation: str) -> bool:
        level_key = f"L{agent.level}"
        allowed = self.ALLOWED_OPERATIONS.get(level_key, [])
        return "*" in allowed or operation in allowed

# 2. Token budget enforcement
class TokenBudgetEnforcer:
    async def check_budget(self, agent_id: str, tokens_needed: int) -> bool:
        agent = await self.get_agent(agent_id)
        if agent.tokens_used_today + tokens_needed > agent.token_budget:
            await self.log_budget_exceeded(agent_id)
            return False
        return True

# 3. Human checkpoint for critical actions
CHECKPOINT_REQUIRED_ACTIONS = [
    "delete_data",
    "export_data", 
    "modify_permissions",
    "financial_transaction",
    "external_api_call",
    "agent_creation",
]
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Critical (Week 1)
- [ ] OWASP A01: Access control on all endpoints
- [ ] OWASP A02: TLS 1.3, Argon2id passwords
- [ ] OWASP A03: Parameterized queries audit
- [ ] OWASP A07: Account lockout, JWT RS256
- [ ] Security headers middleware

### Phase 2: High (Week 2)
- [ ] OWASP A05: Production config hardening
- [ ] OWASP A06: Dependency scanning CI
- [ ] OWASP A09: Security logging
- [ ] Rate limiting all endpoints
- [ ] Input validation audit

### Phase 3: Medium (Week 3)
- [ ] OWASP A04: Threat model documentation
- [ ] OWASP A08: Code signing, CI/CD security
- [ ] OWASP A10: SSRF protection
- [ ] API key management
- [ ] Agent sandboxing verification

### Phase 4: Hardening (Week 4)
- [ ] Penetration testing
- [ ] Security audit review
- [ ] Documentation finalization
- [ ] Incident response plan
- [ ] Security training

---

## 📊 SECURITY METRICS

| Metric | Target | Current |
|--------|--------|---------|
| OWASP Compliance | 100% | 🔄 |
| Critical vulns | 0 | TBD |
| High vulns | 0 | TBD |
| Medium vulns | <5 | TBD |
| Test coverage (security) | 80% | 0% |
| Time to patch critical | <24h | N/A |

---

## 🚨 INCIDENT RESPONSE

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| **SEV1** | Data breach, system compromise | Immediate |
| **SEV2** | Auth bypass, privilege escalation | <1 hour |
| **SEV3** | Vulnerability discovered | <24 hours |
| **SEV4** | Minor security issue | <1 week |

### Response Procedure

```
1. DETECT    → Alerting / Monitoring
2. CONTAIN   → Isolate affected systems
3. ERADICATE → Remove threat
4. RECOVER   → Restore services
5. LEARN     → Post-mortem, improvements
```

---

**Document**: Security Hardening V42.1  
**Classification**: INTERNAL  
**Next Review**: Février 2026
