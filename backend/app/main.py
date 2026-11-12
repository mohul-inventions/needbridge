from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.seed_data import seed_database
from app.db import init_db

# Import routers
from app.routes.auth import router as auth_router
from app.routes.demands import router as demands_router
from app.routes.clusters import router as clusters_router
from app.routes.campaigns import router as campaigns_router
from app.routes.suppliers import router as suppliers_router
from app.routes.payments import router as payments_router
from app.routes.ledger import router as ledger_router
from app.routes.analytics import router as analytics_router
from app.routes.agents import router as agents_router
from app.routes.admin import router as admin_router

app = FastAPI(
    title="NEEDBRIDGE API",
    description="AI-Powered Cross-Community Demand Intelligence & Collective Procurement Network API",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_initialized = False

def ensure_initialized():
    global _initialized
    if _initialized:
        return
    try:
        init_db()
        seed_database()
        _initialized = True
        print("NEEDBRIDGE backend started successfully with active AI Multi-Agent pipeline.")
    except Exception as e:
        print(f"Startup notice: {e}")

# Initialize database schema and auto-seed demo data on startup & serverless cold start
@app.on_event("startup")
def startup_event():
    ensure_initialized()

@app.middleware("http")
async def db_init_middleware(request, call_next):
    ensure_initialized()
    return await call_next(request)

# Register API routers under /api
app.include_router(auth_router, prefix="/api")
app.include_router(demands_router, prefix="/api")
app.include_router(clusters_router, prefix="/api")
app.include_router(campaigns_router, prefix="/api")
app.include_router(suppliers_router, prefix="/api")
app.include_router(payments_router, prefix="/api")
app.include_router(ledger_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")
app.include_router(agents_router, prefix="/api")
app.include_router(admin_router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "NEEDBRIDGE API",
        "version": "1.0.0",
        "multi_agent_system": "active",
        "agents_operational": [
            "Demand Intelligence Agent",
            "Community Discovery Agent",
            "Procurement Optimization Agent",
            "Alternative Product Agent",
            "Financial Intelligence Agent",
            "Risk & Trust Agent",
            "Procurement Coordinator Agent"
        ]
    }
