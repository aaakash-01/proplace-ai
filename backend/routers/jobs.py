from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional
import random

router = APIRouter()


# ====== Job Matching Service ======
SAMPLE_JOBS = [
    {
        "id": 1, "title": "Senior Frontend Engineer", "company": "TechCorp Inc.",
        "location": "San Francisco, CA", "salary_range": "$150K - $200K",
        "job_type": "Full-time", "description": "Build modern web applications using React and TypeScript.",
        "required_skills": ["React", "TypeScript", "Node.js", "GraphQL", "CSS", "Testing"],
        "experience_required": 5,
    },
    {
        "id": 2, "title": "Machine Learning Engineer", "company": "AI Solutions Ltd.",
        "location": "New York, NY", "salary_range": "$140K - $190K",
        "job_type": "Full-time", "description": "Design and deploy ML models for production systems.",
        "required_skills": ["Python", "TensorFlow", "PyTorch", "SQL", "Docker", "AWS"],
        "experience_required": 4,
    },
    {
        "id": 3, "title": "Full Stack Developer", "company": "StartupXYZ",
        "location": "Remote", "salary_range": "$120K - $160K",
        "job_type": "Full-time", "description": "Build end-to-end features for our SaaS platform.",
        "required_skills": ["React", "Python", "PostgreSQL", "AWS", "Docker", "Git"],
        "experience_required": 3,
    },
    {
        "id": 4, "title": "Data Scientist", "company": "DataDriven Co.",
        "location": "Austin, TX", "salary_range": "$130K - $175K",
        "job_type": "Full-time", "description": "Analyze large datasets and build predictive models.",
        "required_skills": ["Python", "Machine Learning", "SQL", "Tableau", "Pandas", "Statistics"],
        "experience_required": 3,
    },
    {
        "id": 5, "title": "DevOps Engineer", "company": "CloudFirst",
        "location": "Seattle, WA", "salary_range": "$135K - $180K",
        "job_type": "Full-time", "description": "Manage CI/CD pipelines and cloud infrastructure.",
        "required_skills": ["Docker", "Kubernetes", "AWS", "Terraform", "Linux", "Python"],
        "experience_required": 4,
    },
    {
        "id": 6, "title": "Backend Engineer", "company": "FinTech Corp",
        "location": "Chicago, IL", "salary_range": "$125K - $170K",
        "job_type": "Full-time", "description": "Build scalable APIs and microservices.",
        "required_skills": ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "AWS"],
        "experience_required": 3,
    },
    {
        "id": 7, "title": "iOS Developer", "company": "AppWorks",
        "location": "Los Angeles, CA", "salary_range": "$130K - $175K",
        "job_type": "Full-time", "description": "Develop native iOS applications with Swift.",
        "required_skills": ["Swift", "iOS", "UIKit", "SwiftUI", "Core Data", "Git"],
        "experience_required": 3,
    },
    {
        "id": 8, "title": "Platform Engineer", "company": "ScaleUp Inc.",
        "location": "Remote", "salary_range": "$145K - $195K",
        "job_type": "Full-time", "description": "Build internal developer platforms and tooling.",
        "required_skills": ["Kubernetes", "Go", "Terraform", "AWS", "Python", "Linux"],
        "experience_required": 5,
    },
]

# Demo user skills
USER_SKILLS = ["React", "Python", "TypeScript", "Node.js", "SQL", "Docker", "AWS", 
               "Git", "PostgreSQL", "MongoDB", "Machine Learning", "FastAPI"]


def calculate_match(user_skills: List[str], job_skills: List[str]) -> int:
    """Calculate job match percentage based on skill overlap."""
    if not job_skills:
        return 0
    user_lower = {s.lower() for s in user_skills}
    job_lower = {s.lower() for s in job_skills}
    overlap = user_lower & job_lower
    base_match = (len(overlap) / len(job_lower)) * 100
    # Add some variation
    return min(int(base_match + random.randint(-5, 10)), 99)


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


class JobListResponse(BaseModel):
    jobs: List[JobMatch]
    total: int


# ====== Endpoints ======
@router.get("/recommendations", response_model=JobListResponse)
async def get_recommendations(
    search: Optional[str] = Query(None, description="Search term"),
    min_match: int = Query(0, description="Minimum match percentage"),
):
    """Get job recommendations based on user skills."""
    results = []
    for job in SAMPLE_JOBS:
        match = calculate_match(USER_SKILLS, job["required_skills"])
        if match >= min_match:
            if search:
                search_lower = search.lower()
                if not (search_lower in job["title"].lower() or 
                       search_lower in job["company"].lower() or
                       any(search_lower in s.lower() for s in job["required_skills"])):
                    continue
            results.append({
                **job,
                "match_percentage": match,
            })
    
    # Sort by match percentage
    results.sort(key=lambda x: x["match_percentage"], reverse=True)
    return {"jobs": results, "total": len(results)}
