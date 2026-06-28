from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, audits, dashboard, reports, policies
# Import models so SQLAlchemy registers them with Base.metadata
from app import models  # noqa: F401

# Automatically build database tables on start
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="SaaS Security Compliance Auditor for Infrastructure as Code (IaC) configuration audits."
)

# Set up CORS middleware to allow calls from Next.js (usually http://localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development, allow all. Customize for production security.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api import auth, audits, dashboard, reports, policies, support

# Include routers
app.include_router(auth.router)
app.include_router(audits.router)
app.include_router(dashboard.router)
app.include_router(reports.router)
app.include_router(policies.router)
app.include_router(support.router)

@app.get("/health", tags=["system"])
def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": "1.0.0"
    }
