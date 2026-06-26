<div align="center">
  <h1 align="center">GuardRail</h1>
  <p align="center">
    <strong>A production-grade Static Analysis & Compliance Auditing platform for Cloud Infrastructure.</strong>
  </p>
</div>

## 🛡️ Overview

GuardRail is a modern SaaS application designed to enforce security policies and compliance standards on Infrastructure-as-Code (IaC). It parses, analyzes, and scores your Terraform and Kubernetes configuration files before they ever reach production. 

With a beautiful, responsive dashboard and a robust FastAPI backend, GuardRail identifies critical misconfigurations (like exposed SSH ports or unencrypted S3 buckets) right down to the exact line of code.

## ✨ Features

- **Automated IaC Auditing:** Upload `.tf` or `.yaml` files and instantly receive a comprehensive A-F security grade.
- **Line-Level Violation Viewer:** An interactive code viewer that highlights exact lines causing security violations.
- **Secure Authentication:** Full JWT-based authentication system with secure password resets powered by [Resend](https://resend.com).
- **Asynchronous Processing:** Heavy file parsing and auditing algorithms are offloaded to Celery workers backed by Redis.
- **Modern UI/UX:** A stunning, dark-mode first interface built with Next.js, featuring micro-animations, glassmorphism, and a premium aesthetic.

## 🏗️ Architecture

GuardRail is built with a modern, decoupled architecture:

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Vanilla CSS & Tailwind CSS for utility classes
- **Key Components:** Interactive dashboard, real-time file upload zone, line-highlighting code viewer

### Backend
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL via SQLAlchemy ORM
- **Task Queue:** Celery + Redis for asynchronous audit processing
- **Email Delivery:** Resend Python SDK
- **Parsers:** `python-hcl2` for Terraform and `pyyaml` for Kubernetes

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL
- Redis Server (Running on `localhost:6379`)

### 1. Backend Setup
Navigate to the backend directory and set up your virtual environment:

```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # On Windows
pip install -r requirements.txt
```

**Environment Variables:**
Create a `.env` file in the `backend/` directory:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/guardrail_db
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your_super_secret_key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
RESEND_API_KEY=re_your_api_key_here
SENDER_EMAIL=onboarding@resend.dev
```

**Run Database Migrations & Start Servers:**
```bash
# Start the FastAPI Server
uvicorn app.main:app --reload --port 8000

# In a separate terminal, start the Celery Worker
celery -A app.tasks.worker worker --loglevel=info --pool=solo
```

### 2. Frontend Setup
Navigate to the frontend directory:

```bash
cd frontend
npm install
```

**Environment Variables:**
Create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Start the Development Server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
