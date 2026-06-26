from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Fix for SQLAlchemy 1.4+ which deprecated 'postgres://' and strip any stray quotes
db_url = settings.DATABASE_URL
if db_url:
    db_url = db_url.strip().strip("'").strip('"')
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

# Create engine
engine = create_engine(db_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
