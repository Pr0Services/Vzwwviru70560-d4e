"""
============================================================================
CHE·NU™ V69 — MAIN ENTRY POINT
============================================================================
Run: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
============================================================================
"""

from api import app

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
