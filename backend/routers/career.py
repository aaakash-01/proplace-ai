from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()


# ====== Career Path Data ======
CAREER_PATHS = {
    "software-engineering": {
        "title": "Software Engineering",
        "stages": [
            {
                "id": 1, "title": "Junior Developer", "level": "Entry Level",
                "salary": "$60K - $85K", "duration": "0-2 years",
                "skills": ["HTML/CSS", "JavaScript", "React Basics", "Git", "REST APIs"],
                "milestones": ["First job", "Build portfolio", "Learn fundamentals"],
            },
            {
                "id": 2, "title": "Mid-Level Developer", "level": "Intermediate",
                "salary": "$85K - $130K", "duration": "2-5 years",
                "skills": ["TypeScript", "Node.js", "Database Design", "Testing", "CI/CD"],
                "milestones": ["Lead feature development", "Mentor juniors", "System design basics"],
            },
            {
                "id": 3, "title": "Senior Developer", "level": "Senior",
                "salary": "$130K - $180K", "duration": "5-8 years",
                "skills": ["Architecture", "Performance Optimization", "Cloud Services", "Team Leadership", "Microservices"],
                "milestones": ["Design systems", "Technical decision making", "Cross-team collaboration"],
            },
            {
                "id": 4, "title": "Staff Engineer", "level": "Staff",
                "salary": "$180K - $250K", "duration": "8-12 years",
                "skills": ["System Architecture", "Technical Strategy", "Org-wide Impact", "Innovation", "Mentorship at Scale"],
                "milestones": ["Define technical vision", "Drive org-wide initiatives", "Industry influence"],
            },
            {
                "id": 5, "title": "Principal / CTO", "level": "Executive",
                "salary": "$250K+", "duration": "12+ years",
                "skills": ["Business Strategy", "Executive Leadership", "Product Vision", "Investor Relations", "Team Building"],
                "milestones": ["Shape company direction", "Build engineering culture", "Industry thought leadership"],
            },
        ]
    }
}

TRENDING_SKILLS = [
    {"name": "AI/ML Engineering", "growth": "+340%", "demand": "Very High"},
    {"name": "Rust Programming", "growth": "+180%", "demand": "High"},
    {"name": "Web3 / Blockchain", "growth": "+150%", "demand": "High"},
    {"name": "Platform Engineering", "growth": "+120%", "demand": "High"},
    {"name": "Edge Computing", "growth": "+95%", "demand": "Medium"},
    {"name": "Quantum Computing", "growth": "+80%", "demand": "Emerging"},
]


# ====== Schemas ======
class CareerStage(BaseModel):
    id: int
    title: str
    level: str
    salary: str
    duration: str
    skills: List[str]
    milestones: List[str]


class CareerPathResponse(BaseModel):
    title: str
    current_stage: int
    stages: List[CareerStage]
    trending_skills: List[dict]
    growth_tips: List[str]


# ====== Endpoints ======
@router.get("/path", response_model=CareerPathResponse)
async def get_career_path(
    track: str = Query("software-engineering", description="Career track"),
    current_years: int = Query(3, description="Years of experience"),
):
    """Get career path visualization data."""
    path = CAREER_PATHS.get(track, CAREER_PATHS["software-engineering"])
    
    # Determine current stage based on experience
    current_stage = 1
    if current_years >= 12:
        current_stage = 5
    elif current_years >= 8:
        current_stage = 4
    elif current_years >= 5:
        current_stage = 3
    elif current_years >= 2:
        current_stage = 2
    
    growth_tips = [
        "Learn system design patterns to advance to senior roles.",
        "Get AWS or GCP certification to boost cloud skills.",
        "Contribute to open source to build industry recognition.",
        "Build side projects to demonstrate full-stack capabilities.",
        "Practice mock interviews regularly to improve communication.",
    ]
    
    return {
        "title": path["title"],
        "current_stage": current_stage,
        "stages": path["stages"],
        "trending_skills": TRENDING_SKILLS,
        "growth_tips": growth_tips,
    }
