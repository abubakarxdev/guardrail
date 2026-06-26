from app.core.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    try:
        conn.execute(text('ALTER TABLE users ADD COLUMN reset_password_token VARCHAR;'))
        conn.execute(text('ALTER TABLE users ADD COLUMN reset_password_expires TIMESTAMP;'))
        conn.commit()
        print("Columns added successfully")
    except Exception as e:
        print("Error:", e)
