#!/bin/bash
# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║                    CHE·NU™ V72 — DEPLOYMENT SCRIPT                           ║
# ║                                                                              ║
# ║  Production deployment with Docker, health checks, and rollback support     ║
# ║  GOUVERNANCE > EXÉCUTION                                                    ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

set -e

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
VERSION="72.0.0"
APP_NAME="chenu"
ENVIRONMENT="${ENVIRONMENT:-production}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[✓]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[⚠]${NC} $1"; }
log_error() { echo -e "${RED}[✗]${NC} $1"; }
log_step() { echo -e "${PURPLE}[STEP]${NC} $1"; }

# ═══════════════════════════════════════════════════════════════════════════════
# BANNER
# ═══════════════════════════════════════════════════════════════════════════════

print_banner() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                              ║"
    echo "║              ██████╗██╗  ██╗███████╗   ███╗   ██╗██╗   ██╗™                  ║"
    echo "║             ██╔════╝██║  ██║██╔════╝   ████╗  ██║██║   ██║                   ║"
    echo "║             ██║     ███████║█████╗     ██╔██╗ ██║██║   ██║                   ║"
    echo "║             ██║     ██╔══██║██╔══╝     ██║╚██╗██║██║   ██║                   ║"
    echo "║             ╚██████╗██║  ██║███████╗██╗██║ ╚████║╚██████╔╝                   ║"
    echo "║              ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝                    ║"
    echo "║                                                                              ║"
    echo "║                    V72 DEPLOYMENT — GOUVERNANCE > EXÉCUTION                 ║"
    echo "║                                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# ═══════════════════════════════════════════════════════════════════════════════
# PREREQUISITES CHECK
# ═══════════════════════════════════════════════════════════════════════════════

check_prerequisites() {
    log_step "Checking prerequisites..."
    
    # Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    log_success "Docker: $(docker --version | cut -d' ' -f3)"
    
    # Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    log_success "Docker Compose: available"
    
    # Node.js (for frontend build)
    if ! command -v node &> /dev/null; then
        log_warning "Node.js not found locally (will use Docker)"
    else
        log_success "Node.js: $(node --version)"
    fi
    
    # Python (for backend)
    if ! command -v python3 &> /dev/null; then
        log_warning "Python3 not found locally (will use Docker)"
    else
        log_success "Python: $(python3 --version)"
    fi
    
    # Check env file
    if [[ ! -f "$PROJECT_ROOT/.env.$ENVIRONMENT" ]] && [[ ! -f "$PROJECT_ROOT/.env" ]]; then
        log_warning "No .env file found, using defaults"
    fi
    
    echo ""
}

# ═══════════════════════════════════════════════════════════════════════════════
# ENVIRONMENT SETUP
# ═══════════════════════════════════════════════════════════════════════════════

setup_environment() {
    log_step "Setting up environment for: $ENVIRONMENT"
    
    # Load environment variables
    if [[ -f "$PROJECT_ROOT/.env.$ENVIRONMENT" ]]; then
        export $(grep -v '^#' "$PROJECT_ROOT/.env.$ENVIRONMENT" | xargs)
        log_success "Loaded .env.$ENVIRONMENT"
    elif [[ -f "$PROJECT_ROOT/.env" ]]; then
        export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)
        log_success "Loaded .env"
    fi
    
    # Set defaults
    export COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-$APP_NAME}"
    export API_PORT="${API_PORT:-8000}"
    export FRONTEND_PORT="${FRONTEND_PORT:-3000}"
    export DATABASE_URL="${DATABASE_URL:-postgresql://chenu:chenu@db:5432/chenu}"
    export REDIS_URL="${REDIS_URL:-redis://redis:6379/0}"
    
    echo ""
}

# ═══════════════════════════════════════════════════════════════════════════════
# BUILD FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

build_frontend() {
    log_step "Building frontend (V72)..."
    
    cd "$PROJECT_ROOT/frontend"
    
    # Install dependencies
    if [[ -f "package-lock.json" ]]; then
        npm ci --silent
    else
        npm install --silent
    fi
    
    # Build for production
    npm run build
    
    log_success "Frontend built successfully"
    echo ""
}

build_backend() {
    log_step "Building backend..."
    
    cd "$PROJECT_ROOT/backend"
    
    # Create virtual environment if not exists
    if [[ ! -d "venv" ]]; then
        python3 -m venv venv
    fi
    
    # Install dependencies
    source venv/bin/activate
    pip install -q -r requirements.txt
    
    # Run migrations check
    if [[ -f "alembic.ini" ]]; then
        alembic check || log_warning "Pending migrations detected"
    fi
    
    deactivate
    
    log_success "Backend prepared successfully"
    echo ""
}

build_docker_images() {
    log_step "Building Docker images..."
    
    cd "$PROJECT_ROOT"
    
    # Build with BuildKit for better caching
    export DOCKER_BUILDKIT=1
    export COMPOSE_DOCKER_CLI_BUILD=1
    
    docker-compose -f docker-compose.yml -f docker-compose.$ENVIRONMENT.yml build \
        --build-arg VERSION=$VERSION \
        --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
    
    log_success "Docker images built"
    echo ""
}

# ═══════════════════════════════════════════════════════════════════════════════
# DEPLOYMENT FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

backup_current_state() {
    log_step "Backing up current state..."
    
    BACKUP_DIR="$PROJECT_ROOT/backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup database
    if docker-compose ps db &> /dev/null; then
        docker-compose exec -T db pg_dump -U chenu chenu > "$BACKUP_DIR/database.sql" 2>/dev/null || true
        log_success "Database backed up"
    fi
    
    # Save current image tags
    docker images --format "{{.Repository}}:{{.Tag}}" | grep "$APP_NAME" > "$BACKUP_DIR/images.txt" || true
    
    # Save current compose state
    docker-compose config > "$BACKUP_DIR/compose-state.yml" 2>/dev/null || true
    
    log_success "Backup saved to: $BACKUP_DIR"
    echo ""
}

deploy_services() {
    log_step "Deploying services..."
    
    cd "$PROJECT_ROOT"
    
    # Pull latest images if using registry
    if [[ -n "$DOCKER_REGISTRY" ]]; then
        docker-compose pull
    fi
    
    # Deploy with zero-downtime (rolling update)
    docker-compose -f docker-compose.yml -f docker-compose.$ENVIRONMENT.yml up -d \
        --remove-orphans \
        --scale api=2 \
        --no-build
    
    log_success "Services deployed"
    echo ""
}

run_migrations() {
    log_step "Running database migrations..."
    
    # Wait for database
    for i in {1..30}; do
        if docker-compose exec -T db pg_isready -U chenu &> /dev/null; then
            break
        fi
        sleep 1
    done
    
    # Run Alembic migrations
    docker-compose exec -T api alembic upgrade head || {
        log_error "Migration failed"
        return 1
    }
    
    log_success "Migrations completed"
    echo ""
}

# ═══════════════════════════════════════════════════════════════════════════════
# HEALTH CHECKS
# ═══════════════════════════════════════════════════════════════════════════════

health_check() {
    log_step "Running health checks..."
    
    local max_attempts=30
    local attempt=1
    
    # API health check
    log_info "Checking API health..."
    while [[ $attempt -le $max_attempts ]]; do
        if curl -sf "http://localhost:$API_PORT/health" > /dev/null 2>&1; then
            log_success "API is healthy"
            break
        fi
        
        if [[ $attempt -eq $max_attempts ]]; then
            log_error "API health check failed after $max_attempts attempts"
            return 1
        fi
        
        sleep 2
        ((attempt++))
    done
    
    # Frontend health check
    log_info "Checking Frontend health..."
    attempt=1
    while [[ $attempt -le $max_attempts ]]; do
        if curl -sf "http://localhost:$FRONTEND_PORT" > /dev/null 2>&1; then
            log_success "Frontend is healthy"
            break
        fi
        
        if [[ $attempt -eq $max_attempts ]]; then
            log_error "Frontend health check failed after $max_attempts attempts"
            return 1
        fi
        
        sleep 2
        ((attempt++))
    done
    
    # Database connectivity
    log_info "Checking Database..."
    if docker-compose exec -T db pg_isready -U chenu &> /dev/null; then
        log_success "Database is healthy"
    else
        log_error "Database health check failed"
        return 1
    fi
    
    # Redis connectivity
    log_info "Checking Redis..."
    if docker-compose exec -T redis redis-cli ping &> /dev/null; then
        log_success "Redis is healthy"
    else
        log_warning "Redis check failed (non-critical)"
    fi
    
    echo ""
    return 0
}

# ═══════════════════════════════════════════════════════════════════════════════
# ROLLBACK
# ═══════════════════════════════════════════════════════════════════════════════

rollback() {
    log_error "Deployment failed! Rolling back..."
    
    cd "$PROJECT_ROOT"
    
    # Find latest backup
    LATEST_BACKUP=$(ls -td "$PROJECT_ROOT/backups"/*/ 2>/dev/null | head -1)
    
    if [[ -n "$LATEST_BACKUP" ]] && [[ -f "$LATEST_BACKUP/compose-state.yml" ]]; then
        log_info "Rolling back to: $LATEST_BACKUP"
        
        # Restore previous compose state
        docker-compose down
        docker-compose -f "$LATEST_BACKUP/compose-state.yml" up -d
        
        # Restore database if needed
        if [[ -f "$LATEST_BACKUP/database.sql" ]]; then
            log_info "Restoring database..."
            docker-compose exec -T db psql -U chenu chenu < "$LATEST_BACKUP/database.sql"
        fi
        
        log_warning "Rolled back to previous state"
    else
        log_error "No backup found for rollback!"
        exit 1
    fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# CLEANUP
# ═══════════════════════════════════════════════════════════════════════════════

cleanup() {
    log_step "Cleaning up..."
    
    # Remove unused Docker resources
    docker system prune -f --volumes 2>/dev/null || true
    
    # Remove old backups (keep last 5)
    cd "$PROJECT_ROOT/backups" 2>/dev/null && ls -td */ | tail -n +6 | xargs rm -rf 2>/dev/null || true
    
    log_success "Cleanup complete"
    echo ""
}

# ═══════════════════════════════════════════════════════════════════════════════
# POST-DEPLOYMENT
# ═══════════════════════════════════════════════════════════════════════════════

post_deploy() {
    log_step "Post-deployment tasks..."
    
    # Warm up caches
    log_info "Warming up caches..."
    curl -sf "http://localhost:$API_PORT/api/v1/spheres" > /dev/null 2>&1 || true
    curl -sf "http://localhost:$API_PORT/api/v1/agents" > /dev/null 2>&1 || true
    
    # Send deployment notification (if webhook configured)
    if [[ -n "$SLACK_WEBHOOK_URL" ]]; then
        curl -sf -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"✅ CHE·NU V$VERSION deployed to $ENVIRONMENT\"}" \
            "$SLACK_WEBHOOK_URL" > /dev/null 2>&1 || true
    fi
    
    log_success "Post-deployment tasks complete"
    echo ""
}

print_summary() {
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║                         DEPLOYMENT SUCCESSFUL! ✨                            ║"
    echo "╠══════════════════════════════════════════════════════════════════════════════╣"
    echo "║                                                                              ║"
    echo "║   Version:     V$VERSION                                                       ║"
    echo "║   Environment: $ENVIRONMENT                                                       ║"
    echo "║                                                                              ║"
    echo "║   Frontend:    http://localhost:$FRONTEND_PORT                                     ║"
    echo "║   API:         http://localhost:$API_PORT                                          ║"
    echo "║   API Docs:    http://localhost:$API_PORT/docs                                     ║"
    echo "║                                                                              ║"
    echo "║   🛡️ GOUVERNANCE > EXÉCUTION                                                ║"
    echo "║                                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════

main() {
    print_banner
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --env|-e)
                ENVIRONMENT="$2"
                shift 2
                ;;
            --skip-build)
                SKIP_BUILD=true
                shift
                ;;
            --skip-backup)
                SKIP_BACKUP=true
                shift
                ;;
            --rollback)
                rollback
                exit 0
                ;;
            --help|-h)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  -e, --env ENV      Set environment (default: production)"
                echo "  --skip-build       Skip build step"
                echo "  --skip-backup      Skip backup step"
                echo "  --rollback         Rollback to previous deployment"
                echo "  -h, --help         Show this help"
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Run deployment steps
    check_prerequisites
    setup_environment
    
    [[ -z "$SKIP_BACKUP" ]] && backup_current_state
    
    if [[ -z "$SKIP_BUILD" ]]; then
        build_frontend
        build_backend
        build_docker_images
    fi
    
    deploy_services
    run_migrations
    
    if ! health_check; then
        rollback
        exit 1
    fi
    
    post_deploy
    cleanup
    print_summary
}

# Run main if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
