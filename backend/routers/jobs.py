from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from typing import List, Optional
import random
from models.models import User, UserRole
from routers.auth import get_current_user
from services.resume_intelligence import get_latest_resume_profile

router = APIRouter()


def require_admin(current_user: User = Depends(get_current_user)):
    role = current_user.role.value if hasattr(current_user.role, "value") else current_user.role
    if role != UserRole.admin.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


# ====== Job Matching Service ======
SAMPLE_JOBS = [
    {
        "id": 1, "title": "Senior Frontend Engineer", "company": "TechCorp Inc.",
        "location": "San Francisco, CA", "salary_range": "$150K - $200K",
        "job_type": "Full-time", "description": "Build modern web applications using React and TypeScript.",
        "required_skills": ["React", "TypeScript", "Node.js", "GraphQL", "CSS", "Testing"],
        "experience_required": 5, "status": "active", "source": "external",
    },
    {
        "id": 2, "title": "Machine Learning Engineer", "company": "AI Solutions Ltd.",
        "location": "New York, NY", "salary_range": "$140K - $190K",
        "job_type": "Full-time", "description": "Design and deploy ML models for production systems.",
        "required_skills": ["Python", "TensorFlow", "PyTorch", "SQL", "Docker", "AWS"],
        "experience_required": 4, "status": "active", "source": "external",
    },
    {
        "id": 3, "title": "Full Stack Developer", "company": "StartupXYZ",
        "location": "Remote", "salary_range": "$120K - $160K",
        "job_type": "Full-time", "description": "Build end-to-end features for our SaaS platform.",
        "required_skills": ["React", "Python", "PostgreSQL", "AWS", "Docker", "Git"],
        "experience_required": 3, "status": "active", "source": "external",
    },
    {
        "id": 4, "title": "Data Scientist", "company": "DataDriven Co.",
        "location": "Austin, TX", "salary_range": "$130K - $175K",
        "job_type": "Full-time", "description": "Analyze large datasets and build predictive models.",
        "required_skills": ["Python", "Machine Learning", "SQL", "Tableau", "Pandas", "Statistics"],
        "experience_required": 3, "status": "active", "source": "external",
    },
    {
        "id": 5, "title": "DevOps Engineer", "company": "CloudFirst",
        "location": "Seattle, WA", "salary_range": "$135K - $180K",
        "job_type": "Full-time", "description": "Manage CI/CD pipelines and cloud infrastructure.",
        "required_skills": ["Docker", "Kubernetes", "AWS", "Terraform", "Linux", "Python"],
        "experience_required": 4, "status": "active", "source": "external",
    },
    {
        "id": 6, "title": "Backend Engineer", "company": "FinTech Corp",
        "location": "Chicago, IL", "salary_range": "$125K - $170K",
        "job_type": "Full-time", "description": "Build scalable APIs and microservices.",
        "required_skills": ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "AWS"],
        "experience_required": 3, "status": "active", "source": "external",
    },
    {
        "id": 7, "title": "iOS Developer", "company": "AppWorks",
        "location": "Los Angeles, CA", "salary_range": "$130K - $175K",
        "job_type": "Full-time", "description": "Develop native iOS applications with Swift.",
        "required_skills": ["Swift", "iOS", "UIKit", "SwiftUI", "Core Data", "Git"],
        "experience_required": 3, "status": "active", "source": "external",
    },
    {
        "id": 8, "title": "Platform Engineer", "company": "ScaleUp Inc.",
        "location": "Remote", "salary_range": "$145K - $195K",
        "job_type": "Full-time", "description": "Build internal developer platforms and tooling.",
        "required_skills": ["Kubernetes", "Go", "Terraform", "AWS", "Python", "Linux"],
        "experience_required": 5, "status": "active", "source": "external",
    },
]

MANAGED_JOB_LISTINGS = [
    {
        "id": 101, "title": "AI Product Analyst", "company": "ProPlace Labs",
        "location": "Remote", "salary_range": "$95K - $130K", "job_type": "Full-time",
        "description": "Turn candidate and market signals into product insights.",
        "required_skills": ["SQL", "Python", "Product Analytics", "Tableau"],
        "experience_required": 2, "status": "pending", "source": "recruiter",
        "posted_by": "Neha Kapoor", "applicants": 18,
    },
    {
        "id": 102, "title": "Cloud Data Engineer", "company": "Northstar Data",
        "location": "Bengaluru, India", "salary_range": "$110K - $155K", "job_type": "Full-time",
        "description": "Build reliable data pipelines on AWS and modern warehouse tooling.",
        "required_skills": ["Python", "AWS", "Docker", "SQL", "Airflow"],
        "experience_required": 4, "status": "active", "source": "recruiter",
        "posted_by": "Rohan Mehta", "applicants": 31,
    },
    {
        "id": 103, "title": "Junior QA Automation Engineer", "company": "BrightHire",
        "location": "Hyderabad, India", "salary_range": "$55K - $75K", "job_type": "Hybrid",
        "description": "Own regression suites and improve test coverage for web products.",
        "required_skills": ["Testing", "JavaScript", "Cypress", "Git"],
        "experience_required": 1, "status": "rejected", "source": "recruiter",
        "posted_by": "Anika Shah", "applicants": 9,
    },
]

APPLICATIONS = [
    {
        "id": 1, "candidate": "Aarav Mehta", "role": "Senior Frontend Engineer",
        "company": "TechCorp Inc.", "match_percentage": 92, "status": "shortlisted",
        "applied_at": "2026-05-02", "skills": ["React", "TypeScript", "Testing"],
    },
    {
        "id": 2, "candidate": "Maya Iyer", "role": "Cloud Data Engineer",
        "company": "Northstar Data", "match_percentage": 86, "status": "reviewed",
        "applied_at": "2026-05-03", "skills": ["Python", "AWS", "SQL"],
    },
    {
        "id": 3, "candidate": "Dev Sharma", "role": "Machine Learning Engineer",
        "company": "AI Solutions Ltd.", "match_percentage": 79, "status": "applied",
        "applied_at": "2026-05-04", "skills": ["Python", "PyTorch", "Docker"],
    },
]

USER_ACCOUNTS = [
    {"id": 1, "name": "Aarav Mehta", "email": "aarav@example.com", "role": "job_seeker", "status": "active", "profile_strength": 88, "last_active": "Today"},
    {"id": 2, "name": "Neha Kapoor", "email": "neha@proplace.ai", "role": "recruiter", "status": "active", "profile_strength": 74, "last_active": "Yesterday"},
    {"id": 3, "name": "Demo Admin", "email": "admin@proplace.ai", "role": "admin", "status": "active", "profile_strength": 100, "last_active": "Today"},
    {"id": 4, "name": "Maya Iyer", "email": "maya@example.com", "role": "job_seeker", "status": "paused", "profile_strength": 69, "last_active": "3 days ago"},
]

MATCH_PREFERENCES = {
    "target_roles": ["Full Stack Developer", "Machine Learning Engineer"],
    "locations": ["Remote", "Bengaluru", "Hyderabad"],
    "minimum_match": 70,
    "job_types": ["Full-time", "Hybrid"],
}

EXTERNAL_SYNC = {
    "source": "D2 Job Database",
    "records_fetched": len(SAMPLE_JOBS),
    "last_sync": "2026-05-05 09:30 IST",
    "status": "connected",
}

# Demo user skills
USER_SKILLS = ["React", "Python", "TypeScript", "Node.js", "SQL", "Docker", "AWS", 
               "Git", "PostgreSQL", "MongoDB", "Machine Learning", "FastAPI"]


def calculate_match(user_skills: List[str], job_skills: List[str], experience_years: float = 0) -> dict:
    """Calculate job match details based on extracted resume skills."""
    if not job_skills:
        return {"score": 0, "matched": [], "missing": []}

    user_lower = {s.lower() for s in user_skills}
    job_lookup = {s.lower(): s for s in job_skills}
    overlap = user_lower & set(job_lookup.keys())
    matched = [job_lookup[skill] for skill in sorted(overlap)]
    missing = [skill for skill_lower, skill in job_lookup.items() if skill_lower not in overlap]
    skill_score = (len(overlap) / len(job_lookup)) * 82
    experience_score = min(experience_years, 5) * 3
    score = min(int(skill_score + experience_score + random.randint(0, 6)), 99)
    return {"score": score, "matched": matched, "missing": missing}


def get_resume_matching_inputs() -> dict:
    profile = get_latest_resume_profile()
    resume_skills = profile.get("skills") or []
    resume_keywords = profile.get("keywords") or []
    combined_skills = list(dict.fromkeys(resume_skills + resume_keywords))

    if combined_skills:
        return {
            "skills": combined_skills,
            "experience_years": profile.get("experience_years", 0),
            "source": profile.get("filename") or "uploaded resume",
        }

    return {
        "skills": USER_SKILLS,
        "experience_years": 0,
        "source": "demo profile",
    }


# ====== Schemas ======
class JobMatch(BaseModel):
    id: int
    title: str
    company: str
    location: str
    salary_range: str
    job_type: str
    description: str
    required_skills: List[str]
    match_percentage: int
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    recommendation_reason: str = ""


class JobListing(BaseModel):
    id: int
    title: str
    company: str
    location: str
    salary_range: str
    job_type: str
    description: str
    required_skills: List[str]
    experience_required: float
    status: str
    source: str
    posted_by: Optional[str] = None
    applicants: Optional[int] = 0


class JobListingCreate(BaseModel):
    title: str
    company: str
    location: str
    salary_range: str
    job_type: str
    description: str
    required_skills: List[str]
    experience_required: float = 0
    posted_by: str = "Recruiter"


class ModerationRequest(BaseModel):
    status: str


class PreferencesUpdate(BaseModel):
    target_roles: List[str]
    locations: List[str]
    minimum_match: int
    job_types: List[str]


class AccountStatusUpdate(BaseModel):
    status: str


class ApplicationSummary(BaseModel):
    id: int
    candidate: str
    role: str
    company: str
    match_percentage: int
    status: str
    applied_at: str
    skills: List[str]


class UserAccountSummary(BaseModel):
    id: int
    name: str
    email: str
    role: str
    status: str
    profile_strength: int
    last_active: str


class JobListResponse(BaseModel):
    jobs: List[JobMatch]
    total: int


class ManagementDashboardResponse(BaseModel):
    listings: List[JobListing]
    applications: List[ApplicationSummary]
    users: List[UserAccountSummary]
    preferences: dict
    external_sync: dict


# ====== Endpoints ======
@router.get("/recommendations", response_model=JobListResponse)
async def get_recommendations(
    search: Optional[str] = Query(None, description="Search term"),
    min_match: int = Query(0, description="Minimum match percentage"),
):
    """Get job recommendations based on user skills."""
    results = []
    resume_inputs = get_resume_matching_inputs()
    active_managed_jobs = [job for job in MANAGED_JOB_LISTINGS if job["status"] == "active"]
    for job in SAMPLE_JOBS + active_managed_jobs:
        match = calculate_match(
            resume_inputs["skills"],
            job["required_skills"],
            resume_inputs["experience_years"],
        )
        if match["score"] >= min_match:
            if search:
                search_lower = search.lower()
                if not (search_lower in job["title"].lower() or 
                       search_lower in job["company"].lower() or
                       any(search_lower in s.lower() for s in job["required_skills"])):
                    continue
            results.append({
                **job,
                "match_percentage": match["score"],
                "matched_skills": match["matched"],
                "missing_skills": match["missing"],
                "recommendation_reason": f"Matched from {resume_inputs['source']}",
            })
    
    # Sort by match percentage
    results.sort(key=lambda x: x["match_percentage"], reverse=True)
    return {"jobs": results, "total": len(results)}


@router.get("/management-dashboard", response_model=ManagementDashboardResponse)
async def get_management_dashboard(_: User = Depends(require_admin)):
    """Recruiter/admin data for posting jobs, reviewing applications, and moderation."""
    return {
        "listings": MANAGED_JOB_LISTINGS,
        "applications": APPLICATIONS,
        "users": USER_ACCOUNTS,
        "preferences": MATCH_PREFERENCES,
        "external_sync": EXTERNAL_SYNC,
    }


@router.post("/listings", response_model=JobListing, status_code=201)
async def post_job_listing(request: JobListingCreate, _: User = Depends(require_admin)):
    """Create a recruiter job listing that admins can moderate."""
    listing = {
        **request.model_dump(),
        "id": max(job["id"] for job in MANAGED_JOB_LISTINGS) + 1 if MANAGED_JOB_LISTINGS else 101,
        "status": "pending",
        "source": "recruiter",
        "applicants": 0,
    }
    MANAGED_JOB_LISTINGS.insert(0, listing)
    return listing


@router.patch("/listings/{job_id}/moderation", response_model=JobListing)
async def moderate_job_listing(
    job_id: int,
    request: ModerationRequest,
    _: User = Depends(require_admin),
):
    """Approve, reject, archive, or reopen a job listing."""
    allowed_statuses = {"pending", "active", "archived", "rejected"}
    if request.status not in allowed_statuses:
        raise HTTPException(status_code=400, detail="Invalid job status")

    for listing in MANAGED_JOB_LISTINGS:
        if listing["id"] == job_id:
            listing["status"] = request.status
            return listing

    raise HTTPException(status_code=404, detail="Job listing not found")


@router.patch("/preferences")
async def set_matching_preferences(request: PreferencesUpdate, _: User = Depends(require_admin)):
    """Save matching preferences used by recruiter/admin workflows."""
    if request.minimum_match < 0 or request.minimum_match > 100:
        raise HTTPException(status_code=400, detail="Minimum match must be between 0 and 100")

    MATCH_PREFERENCES.update(request.model_dump())
    return MATCH_PREFERENCES


@router.patch("/users/{user_id}/status", response_model=UserAccountSummary)
async def manage_user_account(
    user_id: int,
    request: AccountStatusUpdate,
    _: User = Depends(require_admin),
):
    """Update user account status for admin management."""
    allowed_statuses = {"active", "paused", "suspended"}
    if request.status not in allowed_statuses:
        raise HTTPException(status_code=400, detail="Invalid account status")

    for account in USER_ACCOUNTS:
        if account["id"] == user_id:
            account["status"] = request.status
            return account

    raise HTTPException(status_code=404, detail="User account not found")
