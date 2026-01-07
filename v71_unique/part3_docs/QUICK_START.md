# CHE·NU™ V71 — QUICK START GUIDE

## 🚀 5-Minute Setup

### Step 1: Environment Setup

```bash
# Clone/navigate to project
cd CHENU_V71_COMPLETE

# Create .env file
cat > .env << 'EOF'
# Database
DATABASE_URL=postgresql://chenu:password@localhost:5432/chenu_v71
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=$(openssl rand -hex 32)
JWT_ALGORITHM=HS256
JWT_EXPIRY_MINUTES=30
REFRESH_TOKEN_DAYS=7

# OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-secret

# Email (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password

# Embeddings (optional - uses mock if not set)
OPENAI_API_KEY=sk-your-key
EOF
```

### Step 2: Database Setup

```bash
# Create database
createdb chenu_v71

# Or with Docker
docker run -d \
  --name chenu-postgres \
  -e POSTGRES_DB=chenu_v71 \
  -e POSTGRES_USER=chenu \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15
```

### Step 3: Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install fastapi uvicorn sqlalchemy asyncpg redis pydantic python-jose passlib

# Run migrations (if using Alembic)
alembic upgrade head

# Start server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Step 4: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Step 5: Verify Installation

```bash
# Test health endpoint
curl http://localhost:8000/api/v2/health

# Expected response:
# {"status": "healthy", "version": "71.0"}
```

---

## 🔑 Key Endpoints

### Authentication
```bash
# Register
curl -X POST http://localhost:8000/api/v2/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "SecurePass123!"}'

# Login
curl -X POST http://localhost:8000/api/v2/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "SecurePass123!"}'
```

### Nova Pipeline
```bash
# Execute query
curl -X POST http://localhost:8000/api/v2/nova/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "Analyze my documents", "identity_id": "user123"}'
```

### Agents
```bash
# List agents
curl http://localhost:8000/api/v2/agents \
  -H "Authorization: Bearer $TOKEN"

# Create agent
curl -X POST http://localhost:8000/api/v2/agents \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Assistant", "type": "assistant", "capabilities": ["chat"]}'
```

### Knowledge Base
```bash
# Add document
curl -X POST http://localhost:8000/api/v2/knowledge/documents \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Your document content", "doc_type": "text"}'

# Search
curl -X POST http://localhost:8000/api/v2/knowledge/search \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "search terms", "mode": "hybrid"}'
```

---

## 🧪 Run Tests

```bash
cd backend

# All tests
pytest tests/ -v

# Specific phase
pytest tests/test_auth_integration.py -v      # Phase 2
pytest tests/test_pipeline_integration.py -v   # Phase 3
pytest tests/test_agent_integration.py -v      # Phase 4
pytest tests/test_knowledge_integration.py -v  # Phase 5

# With coverage
pytest tests/ -v --cov=services --cov-report=html
```

---

## 🐳 Docker Quick Start

```bash
# Build and run
docker-compose up -d

# Check logs
docker-compose logs -f backend

# Stop
docker-compose down
```

---

## 📚 File Reference

| Phase | Service | Route | Component |
|-------|---------|-------|-----------|
| 2 | auth_service.py | auth_routes.py | AuthComponents.tsx |
| 3 | nova_pipeline_service.py | pipeline_routes.py | PipelineComponents.tsx |
| 4 | agent_orchestration_service.py | agent_routes.py | AgentComponents.tsx |
| 5 | knowledge_base_service.py | knowledge_routes.py | KnowledgeComponents.tsx |

---

## ⚡ Performance Tips

1. **Enable Redis caching** for sessions and search results
2. **Use connection pooling** for database
3. **Configure workers**: `uvicorn main:app --workers 4`
4. **Enable gzip compression** in reverse proxy
5. **Use CDN** for frontend static assets

---

## 🆘 Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Verify DATABASE_URL
echo $DATABASE_URL
```

### Redis Connection Failed
```bash
# Check Redis is running
redis-cli ping

# Should return: PONG
```

### JWT Errors
```bash
# Regenerate JWT secret
export JWT_SECRET=$(openssl rand -hex 32)
```

### Tests Failing
```bash
# Check Python version (needs 3.11+)
python --version

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

---

## 🎯 Ready!

Your CHE·NU V71 instance is now running:
- Backend: http://localhost:8000
- Frontend: http://localhost:3000 (or 5173)
- API Docs: http://localhost:8000/docs

**GOUVERNANCE > EXÉCUTION** 🚀
