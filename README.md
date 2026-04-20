# 🚀 ProPlace AI – Intelligent Career & Job Matching Assistant

AI-powered career platform that analyzes resumes, provides ATS scores, recommends jobs, detects skill gaps, and offers AI mock interviews.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📄 Resume Parsing | NLP-based skill extraction from uploaded resumes |
| 🎯 ATS Score | Detailed ATS compatibility analysis with improvement tips |
| 💼 Job Matching | AI-powered job recommendations with match percentages |
| 📊 Skill Gap Analysis | Radar charts comparing your skills vs role requirements |
| 🤖 AI Mock Interview | Interactive chat-based interview simulation |
| 🗺️ Career Roadmap | Visual career path with milestones and trending skills |
| 🔐 JWT Authentication | Secure signup/login with token-based auth |

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide Icons  
**Backend:** FastAPI, SQLAlchemy, SQLite (PostgreSQL-ready)  
**Auth:** JWT (python-jose + passlib)

## 📁 Project Structure

```
proplace-ai/
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, UI components
│   │   ├── pages/          # 9 page components
│   │   ├── App.jsx         # Router setup
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles + glassmorphism
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── routers/            # API route handlers
│   │   ├── auth.py         # JWT login/signup
│   │   ├── resume.py       # Resume upload & ATS scoring
│   │   ├── jobs.py         # Job recommendations
│   │   ├── skills.py       # Skill gap analysis
│   │   ├── interview.py    # AI mock interview
│   │   └── career.py       # Career path data
│   ├── models/             # SQLAlchemy models
│   ├── services/           # Business logic
│   ├── database.py         # DB config
│   ├── main.py             # FastAPI app
│   └── requirements.txt
└── README.md
```

## 🚀 Setup & Run

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+

### Frontend

```bash
cd proplace-ai/frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

### Backend

```bash
cd proplace-ai/backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
# API docs at http://localhost:8000/docs
```

## 🎨 Design

- **Theme:** Dark mode with glassmorphism
- **Colors:** Neon Blue (#00f5ff), Purple (#7b2ff7), Black gradients
- **Animations:** Framer Motion page transitions & micro-interactions
- **Charts:** Recharts (Radar, Bar charts)
- **Responsive:** Mobile + Desktop optimized

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| POST | `/api/resume/upload` | Upload & analyze resume |
| GET | `/api/resume/ats-score` | Get ATS score |
| GET | `/api/jobs/recommendations` | Get job matches |
| GET | `/api/skills/gap-analysis` | Skill gap data |
| POST | `/api/interview/chat` | Interview chat |
| GET | `/api/career/path` | Career roadmap |

## 📜 License

MIT License – Built with ❤️ by ProPlace AI
