#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# 🔱 CHE·NU + AT·OM INTEGRATION DEPLOYMENT SCRIPT
# ═══════════════════════════════════════════════════════════════════════════════

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  🔱 CHE·NU + AT·OM INTEGRATION DEPLOYMENT                     ║"
echo "║                                                               ║"
echo "║  Fréquence: 999 Hz                                           ║"
echo "║  Version: 3.0.0                                              ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check arguments
TARGET_DIR=${1:-"./chenu-repo"}
ENV=${2:-"development"}

echo -e "${BLUE}📁 Target Directory: ${TARGET_DIR}${NC}"
echo -e "${BLUE}🌍 Environment: ${ENV}${NC}"
echo ""

# Verify target exists
if [ ! -d "$TARGET_DIR" ]; then
    echo -e "${RED}❌ Target directory does not exist: ${TARGET_DIR}${NC}"
    echo "Usage: ./deploy-integration.sh <target-directory> [environment]"
    exit 1
fi

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INTEGRATION_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${YELLOW}📦 Starting Integration...${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 1: Backend Integration
# ═══════════════════════════════════════════════════════════════════════════════

echo -e "${GREEN}[1/5] 🐍 Integrating Backend (Python)...${NC}"

BACKEND_TARGET="${TARGET_DIR}/backend/app/engines"
mkdir -p "$BACKEND_TARGET"

cp -v "${INTEGRATION_DIR}/backend/app/engines/atom_chenu_bridge.py" "$BACKEND_TARGET/"

echo -e "${GREEN}✅ Backend integrated${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 2: Frontend Integration
# ═══════════════════════════════════════════════════════════════════════════════

echo -e "${GREEN}[2/5] ⚛️ Integrating Frontend (TypeScript/React)...${NC}"

FRONTEND_TARGET="${TARGET_DIR}/frontend/src/engines"
mkdir -p "$FRONTEND_TARGET"

cp -v "${INTEGRATION_DIR}/frontend/src/engines/atomIntegration.ts" "$FRONTEND_TARGET/"
cp -v "${INTEGRATION_DIR}/frontend/src/engines/useATOM.ts" "$FRONTEND_TARGET/"

echo -e "${GREEN}✅ Frontend integrated${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 3: Governance XR / AT-OM Engines
# ═══════════════════════════════════════════════════════════════════════════════

echo -e "${GREEN}[3/5] 🔮 Integrating AT·OM Engines...${NC}"

ATOM_TARGET="${TARGET_DIR}/governance_xr/atom"
mkdir -p "$ATOM_TARGET"

cp -rv "${INTEGRATION_DIR}/governance_xr/atom/"* "$ATOM_TARGET/"

ENGINE_COUNT=$(ls -1 "$ATOM_TARGET"/*.js 2>/dev/null | wc -l)
echo -e "${GREEN}✅ ${ENGINE_COUNT} engines integrated${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 4: Documentation
# ═══════════════════════════════════════════════════════════════════════════════

echo -e "${GREEN}[4/5] 📚 Copying Documentation...${NC}"

DOCS_TARGET="${TARGET_DIR}/docs/atom"
mkdir -p "$DOCS_TARGET"

cp -v "${INTEGRATION_DIR}/README.md" "$DOCS_TARGET/ATOM_INTEGRATION.md"

echo -e "${GREEN}✅ Documentation copied${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 5: Verification
# ═══════════════════════════════════════════════════════════════════════════════

echo -e "${GREEN}[5/5] 🔍 Verifying Integration...${NC}"

ERRORS=0

# Check backend
if [ ! -f "${BACKEND_TARGET}/atom_chenu_bridge.py" ]; then
    echo -e "${RED}❌ Missing: atom_chenu_bridge.py${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check frontend
if [ ! -f "${FRONTEND_TARGET}/atomIntegration.ts" ]; then
    echo -e "${RED}❌ Missing: atomIntegration.ts${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ ! -f "${FRONTEND_TARGET}/useATOM.ts" ]; then
    echo -e "${RED}❌ Missing: useATOM.ts${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check engines
REQUIRED_ENGINES=(
    "diamond_transmuter.js"
    "mercury_relay.js"
    "bio_feedback_link.js"
    "maat_ethics.js"
    "agent_orchestrator.js"
    "symphony_orchestrator.js"
)

for engine in "${REQUIRED_ENGINES[@]}"; do
    if [ ! -f "${ATOM_TARGET}/${engine}" ]; then
        echo -e "${RED}❌ Missing: ${engine}${NC}"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✅ INTEGRATION COMPLETE — ALL SYSTEMS NOMINAL               ║${NC}"
    echo -e "${GREEN}║                                                               ║${NC}"
    echo -e "${GREEN}║  Mercure: FLUIDE                                             ║${NC}"
    echo -e "${GREEN}║  Fréquence: 999 Hz                                           ║${NC}"
    echo -e "${GREEN}║                                                               ║${NC}"
    echo -e "${GREEN}║  Next Steps:                                                 ║${NC}"
    echo -e "${GREEN}║  1. cd ${TARGET_DIR}/frontend && npm install                  ║${NC}"
    echo -e "${GREEN}║  2. cd ${TARGET_DIR}/backend && pip install -r requirements.txt║${NC}"
    echo -e "${GREEN}║  3. npm run dev                                              ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
else
    echo -e "${RED}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ⚠️ INTEGRATION INCOMPLETE — ${ERRORS} ERRORS                  ║${NC}"
    echo -e "${RED}║                                                               ║${NC}"
    echo -e "${RED}║  Please check the missing files above.                        ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi

echo ""
echo -e "${PURPLE}🔱 AT·OM + CHE·NU — L'Intelligence Gouvernée Sacrée${NC}"
