"""
CHE·NU™ Database Configuration

Async SQLAlchemy setup with PostgreSQL (production) or SQLite (development).
Includes session management and connection pooling.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator, Optional

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    AsyncEngine,
    create_async_engine,
    async_sessionmaker,
)
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool

from app.core.config import settings


# ═══════════════════════════════════════════════════════════════════════════════
# BASE MODEL
# ═══════════════════════════════════════════════════════════════════════════════

class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass


# ═══════════════════════════════════════════════════════════════════════════════
# ENGINE & SESSION
# ═══════════════════════════════════════════════════════════════════════════════

# Global engine instance (lazy initialized)
_engine: Optional[AsyncEngine] = None
_session_factory: Optional[async_sessionmaker] = None


def get_database_url() -> str:
    """Get database URL, defaulting to SQLite for development."""
    url = settings.DATABASE_URL
    
    # Use SQLite if PostgreSQL is not configured/available
    if url.startswith("postgresql://") or url.startswith("postgresql+"):
        # Try to use SQLite for development if no real DB
        import os
        if os.environ.get("USE_SQLITE", "true").lower() == "true":
            return "sqlite+aiosqlite:///./chenu_dev.db"
    
    return url


def get_engine() -> AsyncEngine:
    """Get or create async database engine (lazy initialization)."""
    global _engine
    
    if _engine is None:
        db_url = get_database_url()
        
        if "sqlite" in db_url:
            # SQLite configuration
            _engine = create_async_engine(
                db_url,
                echo=settings.DATABASE_ECHO,
                connect_args={"check_same_thread": False},
            )
        else:
            # PostgreSQL configuration
            _engine = create_async_engine(
                db_url,
                echo=settings.DATABASE_ECHO,
                pool_size=settings.DATABASE_POOL_SIZE,
                max_overflow=settings.DATABASE_MAX_OVERFLOW,
                pool_pre_ping=True,
            )
    
    return _engine


def get_session_factory() -> async_sessionmaker:
    """Get or create session factory (lazy initialization)."""
    global _session_factory
    
    if _session_factory is None:
        _session_factory = async_sessionmaker(
            get_engine(),
            class_=AsyncSession,
            expire_on_commit=False,
            autoflush=False,
        )
    
    return _session_factory


# Backward compatibility aliases
def create_engine() -> AsyncEngine:
    """Create async database engine (deprecated, use get_engine)."""
    return get_engine()


def create_test_engine() -> AsyncEngine:
    """Create engine for testing (no connection pooling)."""
    return create_async_engine(
        "sqlite+aiosqlite:///./test.db",
        echo=True,
        poolclass=NullPool,
    )


# Lazy properties for backward compatibility
engine = None  # Will be initialized on first use via get_engine()
async_session_factory = None  # Will be initialized via get_session_factory()


# ═══════════════════════════════════════════════════════════════════════════════
# SESSION DEPENDENCY
# ═══════════════════════════════════════════════════════════════════════════════

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency for database sessions.
    
    Usage:
        @router.get("/items")
        async def get_items(db: AsyncSession = Depends(get_db)):
            ...
    """
    factory = get_session_factory()
    async with factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


@asynccontextmanager
async def get_db_context() -> AsyncGenerator[AsyncSession, None]:
    """
    Context manager for database sessions (non-FastAPI use).
    
    Usage:
        async with get_db_context() as db:
            result = await db.execute(...)
    """
    factory = get_session_factory()
    async with factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# ═══════════════════════════════════════════════════════════════════════════════
# LIFECYCLE
# ═══════════════════════════════════════════════════════════════════════════════

async def init_db() -> None:
    """Initialize database (create tables if not exist)."""
    engine = get_engine()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db() -> None:
    """Close database connections."""
    global _engine
    if _engine:
        await _engine.dispose()
        _engine = None


# ═══════════════════════════════════════════════════════════════════════════════
# HEALTH CHECK
# ═══════════════════════════════════════════════════════════════════════════════

async def check_db_health() -> bool:
    """Check database connectivity."""
    try:
        factory = get_session_factory()
        async with factory() as session:
            from sqlalchemy import text
            await session.execute(text("SELECT 1"))
            return True
    except Exception:
        return False
