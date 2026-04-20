from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, resume, jobs, skills, interview, career

# ✅ ADD THESE IMPORTS
from database import engine , Base
from models import  User, Resume, Job

app = FastAPI(
    title="ProPlace AI API",
    description="Intelligent Career & Job Matching Assistant",
    version="1.0.0"
)

# ✅ CREATE TABLES ON STARTUP
@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(skills.router, prefix="/api/skills", tags=["Skills"])
app.include_router(interview.router, prefix="/api/interview", tags=["Interview"])
app.include_router(career.router, prefix="/api/career", tags=["Career"])

@app.get("/")
async def root():
    return {"message": "ProPlace AI API is running", "version": "1.0.0"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}