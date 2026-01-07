# 🚀 CHE·NU V71 — Deployment Guide

## Prerequisites
- Docker 24+
- Docker Compose 2.20+
- PostgreSQL 15+
- Redis 7+
- Node.js 18+ (dev)
- Python 3.11+ (dev)

## Quick Deploy

```bash
# Production
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose ps
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/chenu
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=["http://localhost:3000"]

# Feature Flags
ENABLE_XR=true
ENABLE_NOVA=true
```

## Health Checks

```bash
# API
curl http://localhost:8000/health

# Database
docker exec chenu-db pg_isready

# Redis
docker exec chenu-redis redis-cli ping
```

## Monitoring

- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001

## Backup

```bash
# Database
pg_dump -h localhost -U chenu chenu > backup.sql

# Restore
psql -h localhost -U chenu chenu < backup.sql
```

## Scaling

```bash
# Scale API nodes
docker-compose up -d --scale api=3
```
