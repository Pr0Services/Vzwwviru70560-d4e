"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                    CHE·NU™ V72 — CORE CONFIGURATION                          ║
║                                                                              ║
║  Application configuration and settings                                      ║
║  GOUVERNANCE > EXÉCUTION                                                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
from functools import lru_cache
import os

# ═══════════════════════════════════════════════════════════════════════════════
# SETTINGS
# ═══════════════════════════════════════════════════════════════════════════════

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # App info
    APP_NAME: str = "CHE·NU V72"
    APP_VERSION: str = "72.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    
    # API
    API_PREFIX: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "change-me-in-production-use-long-random-string"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://chenu.io",
        "https://staging.chenu.io",
    ]
    
    # Database
    DATABASE_URL: str = "postgresql://chenu:chenu@localhost:5432/chenu"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10
    DATABASE_ECHO: bool = False
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_PREFIX: str = "chenu:"
    
    # OPA (Governance)
    OPA_URL: str = "http://localhost:8181"
    OPA_POLICY_PATH: str = "/v1/data/chenu/governance"
    OPA_TIMEOUT: int = 5
    
    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_DEFAULT: int = 100
    RATE_LIMIT_WINDOW: int = 60
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # File Storage
    STORAGE_PATH: str = "/data/chenu/files"
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    ALLOWED_EXTENSIONS: List[str] = [
        "pdf", "doc", "docx", "xls", "xlsx",
        "png", "jpg", "jpeg", "gif",
        "txt", "md", "json", "csv"
    ]
    
    # External Services
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    
    # Feature Flags
    FEATURE_XR_ENABLED: bool = True
    FEATURE_AGENTS_ENABLED: bool = True
    FEATURE_NOVA_ENABLED: bool = True
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

# ═══════════════════════════════════════════════════════════════════════════════
# SINGLETON
# ═══════════════════════════════════════════════════════════════════════════════

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()

settings = get_settings()

# ═══════════════════════════════════════════════════════════════════════════════
# GOVERNANCE CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

class GovernanceConfig:
    """Governance-specific configuration."""
    
    # GOUVERNANCE > EXÉCUTION
    REQUIRE_CHECKPOINT_FOR = [
        "external_api_call",
        "data_export",
        "data_delete",
        "agent_hire",
        "agent_dismiss",
        "decision_make",
        "thread_archive",
        "file_share",
        "settings_change",
    ]
    
    # Risk level thresholds
    RISK_LEVELS = {
        "low": {"auto_approve": True, "notify": False},
        "medium": {"auto_approve": False, "notify": True},
        "high": {"auto_approve": False, "notify": True, "require_reason": True},
        "critical": {"auto_approve": False, "notify": True, "require_admin": True},
    }
    
    # Checkpoint expiration
    CHECKPOINT_EXPIRE_HOURS = 24
    
    # Audit retention
    AUDIT_RETENTION_DAYS = 365
    
    # Decision aging thresholds (in hours)
    AGING_THRESHOLDS = {
        "GREEN": 0,
        "YELLOW": 48,   # 2 days
        "RED": 120,     # 5 days
        "BLINK": 168,   # 7 days
        "ARCHIVE": 336, # 14 days
    }

governance_config = GovernanceConfig()

# ═══════════════════════════════════════════════════════════════════════════════
# SPHERE CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

SPHERES = [
    {"id": "personal", "name_fr": "Personnel", "name_en": "Personal", "icon": "🏠", "color": "#3EB4A2", "order": 0},
    {"id": "business", "name_fr": "Affaires", "name_en": "Business", "icon": "💼", "color": "#D8B26A", "order": 1},
    {"id": "government", "name_fr": "Gouvernement", "name_en": "Government", "icon": "🏛️", "color": "#8B5CF6", "order": 2},
    {"id": "studio", "name_fr": "Studio", "name_en": "Studio", "icon": "🎨", "color": "#EC4899", "order": 3},
    {"id": "community", "name_fr": "Communauté", "name_en": "Community", "icon": "👥", "color": "#F59E0B", "order": 4},
    {"id": "social", "name_fr": "Social & Médias", "name_en": "Social & Media", "icon": "📱", "color": "#3B82F6", "order": 5},
    {"id": "entertainment", "name_fr": "Divertissement", "name_en": "Entertainment", "icon": "🎮", "color": "#EF4444", "order": 6},
    {"id": "team", "name_fr": "Mon Équipe", "name_en": "My Team", "icon": "👔", "color": "#10B981", "order": 7},
    {"id": "scholar", "name_fr": "Scholar", "name_en": "Scholar", "icon": "📚", "color": "#6366F1", "order": 8},
]

# 6 Bureau sections per sphere (frozen architecture)
BUREAU_SECTIONS = [
    "QuickCapture",
    "ResumeWorkspace",
    "Threads",
    "DataFiles",
    "ActiveAgents",
    "Meetings",
]

# ═══════════════════════════════════════════════════════════════════════════════
# AGENT LEVELS
# ═══════════════════════════════════════════════════════════════════════════════

AGENT_LEVELS = {
    0: {"name": "System", "description": "Nova and core system agents", "cost_range": (0, 0)},
    1: {"name": "Assistant", "description": "General purpose assistants", "cost_range": (10, 50)},
    2: {"name": "Specialist", "description": "Domain specialists", "cost_range": (50, 200)},
    3: {"name": "Expert", "description": "Senior experts", "cost_range": (200, 1000)},
}

# ═══════════════════════════════════════════════════════════════════════════════
# MATURITY LEVELS
# ═══════════════════════════════════════════════════════════════════════════════

MATURITY_LEVELS = {
    "SEED": {"range": (0, 20), "icon": "🌱", "color": "#9CA3AF"},
    "SPROUTING": {"range": (20, 40), "icon": "🌿", "color": "#86EFAC"},
    "GROWING": {"range": (40, 60), "icon": "🌳", "color": "#4ADE80"},
    "MATURE": {"range": (60, 80), "icon": "🌾", "color": "#22C55E"},
    "RIPE": {"range": (80, 100), "icon": "🍎", "color": "#D8B26A"},
}

def get_maturity_level(score: int) -> str:
    """Get maturity level from score."""
    for level, config in MATURITY_LEVELS.items():
        low, high = config["range"]
        if low <= score < high:
            return level
    return "RIPE" if score >= 80 else "SEED"
