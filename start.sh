#!/bin/bash

# CHE·NU™ V75 — Quick Start Script
# ==================================

echo "╔══════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                          ║"
echo "║                    CHE·NU™ V75 — PRODUCTION READY                       ║"
echo "║                                                                          ║"
echo "╚══════════════════════════════════════════════════════════════════════════╝"

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "🐳 Docker detected. Starting with docker-compose..."
    docker-compose up -d
    echo "✅ Services started!"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend:  http://localhost:8000"
    echo "📚 API Docs: http://localhost:8000/api/docs"
else
    echo "📦 Docker not found. Starting manually..."
    
    # Start backend
    echo "🚀 Starting backend..."
    cd backend
    if [ ! -d "venv" ]; then
        python -m venv venv
    fi
    source venv/bin/activate
    pip install -r requirements.txt
    python main.py &
    
    # Start frontend
    echo "🚀 Starting frontend..."
    cd ../frontend
    npm install
    npm run dev &
    
    echo "✅ Services started!"
fi
