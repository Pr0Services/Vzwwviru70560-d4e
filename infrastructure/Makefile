# ═══════════════════════════════════════════════════════════════════════════════
# CHE·NU™ V76 — MAKEFILE
# ═══════════════════════════════════════════════════════════════════════════════
# Common development and deployment commands

.PHONY: help install dev test docker clean migrate

# Default target
help:
	@echo "═══════════════════════════════════════════════════════════════════════════════"
	@echo "CHE·NU™ V76 — Available Commands"
	@echo "═══════════════════════════════════════════════════════════════════════════════"
	@echo ""
	@echo "Development:"
	@echo "  make install      Install Python dependencies"
	@echo "  make dev          Start development server"
	@echo "  make test         Run all tests"
	@echo "  make test-cov     Run tests with coverage"
	@echo ""
	@echo "Database:"
	@echo "  make migrate      Run database migrations"
	@echo "  make migrate-new  Create new migration"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-up    Start all services"
	@echo "  make docker-dev   Start with dev tools"
	@echo "  make docker-down  Stop all services"
	@echo "  make docker-logs  View API logs"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean        Clean cache and temp files"
	@echo "  make lint         Run linters"
	@echo ""
	@echo "═══════════════════════════════════════════════════════════════════════════════"

# ═══════════════════════════════════════════════════════════════════════════════
# DEVELOPMENT
# ═══════════════════════════════════════════════════════════════════════════════

install:
	cd backend && pip install -r requirements.txt

dev:
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

test:
	cd backend && pytest -v

test-cov:
	cd backend && pytest --cov=app --cov-report=html --cov-report=term

lint:
	cd backend && ruff check app/
	cd backend && mypy app/

# ═══════════════════════════════════════════════════════════════════════════════
# DATABASE
# ═══════════════════════════════════════════════════════════════════════════════

migrate:
	cd backend && alembic upgrade head

migrate-new:
	@read -p "Migration message: " msg; \
	cd backend && alembic revision --autogenerate -m "$$msg"

migrate-down:
	cd backend && alembic downgrade -1

# ═══════════════════════════════════════════════════════════════════════════════
# DOCKER
# ═══════════════════════════════════════════════════════════════════════════════

docker-up:
	docker-compose up -d

docker-dev:
	docker-compose --profile dev up -d

docker-down:
	docker-compose down

docker-clean:
	docker-compose down -v

docker-logs:
	docker-compose logs -f api

docker-build:
	docker-compose build --no-cache

# ═══════════════════════════════════════════════════════════════════════════════
# MAINTENANCE
# ═══════════════════════════════════════════════════════════════════════════════

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "htmlcov" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	find . -type f -name ".coverage" -delete 2>/dev/null || true

# ═══════════════════════════════════════════════════════════════════════════════
# QUICK START
# ═══════════════════════════════════════════════════════════════════════════════

setup: install
	cp .env.example .env
	@echo "✅ Setup complete! Edit .env and run 'make docker-up' or 'make dev'"

all: docker-up migrate
	@echo "✅ CHE·NU V76 is running at http://localhost:8000"
