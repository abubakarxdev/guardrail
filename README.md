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
- **Dual-Email Support System:** Built-in interactive support ticketing system that automatically dispatches confirmation emails to users and detailed inquiries to admin inboxes via the Resend API.
- **Modern UI/UX ("Linear-Style"):** A stunning, dark-mode first interface built with Next.js, featuring micro-animations, glassmorphism, dynamic radial gradients, and a premium aesthetic using `framer-motion`.
- **Dynamic Public Pages:** Includes beautifully crafted Marketing Pages (Bento-box features grid, Markdown-styled Documentation, Vertical Timeline Changelog, and an interactive CLI simulation on the landing page).
- **Asynchronous Processing:** Heavy file parsing and auditing algorithms are offloaded to FastAPI BackgroundTasks for non-blocking execution.

## 🏗️ Architecture

GuardRail is built with a modern, decoupled architecture designed for deployment on edge and serverless platforms.

### Frontend (Next.js 14 App Router)
- **Framework:** Next.js 14 (React)
- **Styling:** Tailwind CSS & Vanilla CSS for advanced glassmorphism
- **Animations:** Framer Motion (optimized for Static Site Generation)
- **Key Components:** Interactive dashboard, real-time file upload zone, line-highlighting code viewer, responsive sidebar navigation.

### Backend (FastAPI)
- **Framework:** FastAPI (Python 3.10+)
- **Database:** PostgreSQL via SQLAlchemy ORM (Hosted on Neon Serverless Postgres)
- **Task Queue:** Built-in FastAPI BackgroundTasks for asynchronous audit processing
- **Email Delivery:** Resend Python SDK for transactional emails and support ticketing
- **Parsers:** `python-hcl2` for Terraform and `pyyaml` for Kubernetes
- **Deployment:** Render (Live at `https://guardrail-api-92m6.onrender.com/`)

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL

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
# Database (Neon Serverless Postgres / Local)
DATABASE_URL=postgresql://user:password@localhost:5432/guardrail_db

# JWT Auth
SECRET_KEY=your_super_secret_key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Resend Email API
RESEND_API_KEY=re_your_api_key_here
SENDER_EMAIL=onboarding@resend.dev
ADMIN_EMAIL=admin@yourdomain.com
```

**Run Database Migrations & Start Servers:**
```bash
# Start the FastAPI Server
uvicorn app.main:app --reload --port 8000
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
# Clear cache if experiencing Framer Motion type errors
rm -rf .next 
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 🚀 Production Deployment

1. **Database:** Deploy your PostgreSQL database on [Neon](https://neon.tech/) and grab the connection string.
2. **Backend:** Deploy the FastAPI backend on [Render](https://render.com) using a Web Service. Ensure you set all the Environment variables (`DATABASE_URL`, `RESEND_API_KEY`, etc.) in the Render dashboard.
3. **Frontend:** Deploy the Next.js frontend to Render or Vercel. Be sure to clear the `.next` cache before building to prevent Static Generation issues with `framer-motion` variants. Set `NEXT_PUBLIC_API_URL` to your live Render backend URL.

---

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
