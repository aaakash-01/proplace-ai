from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()


# ====== Skill Analysis Data ======
SKILL_ANALYSIS = {
    "current_skills": {
        "React": 90, "Python": 75, "Machine Learning": 60, "SQL": 80,
        "AWS": 45, "Docker": 55, "Node.js": 85, "TypeScript": 70,
    },
    "target_role_required": {
        "React": 85, "Python": 90, "Machine Learning": 85, "SQL": 75,
        "AWS": 80, "Docker": 70, "Node.js": 70, "TypeScript": 80,
    }
}

LEARNING_RESOURCES = {
    "AWS": [
        {"name": "AWS Solutions Architect Course", "platform": "Coursera", "duration": "40 hrs", "url": "#"},
        {"name": "AWS Certified Developer", "platform": "Udemy", "duration": "25 hrs", "url": "#"},
    ],
    "Machine Learning": [
        {"name": "ML Specialization", "platform": "Coursera", "duration": "60 hrs", "url": "#"},
        {"name": "Hands-On ML with Scikit-Learn", "platform": "O'Reilly", "duration": "30 hrs", "url": "#"},
    ],
    "Python": [
        {"name": "Advanced Python Programming", "platform": "Pluralsight", "duration": "20 hrs", "url": "#"},
        {"name": "Python for Data Science", "platform": "DataCamp", "duration": "15 hrs", "url": "#"},
    ],
    "Docker": [
        {"name": "Docker & Kubernetes Complete Guide", "platform": "Udemy", "duration": "20 hrs", "url": "#"},
        {"name": "Container Orchestration", "platform": "Pluralsight", "duration": "15 hrs", "url": "#"},
    ],
    "TypeScript": [
        {"name": "TypeScript Masterclass", "platform": "Udemy", "duration": "18 hrs", "url": "#"},
        {"name": "Advanced TypeScript Patterns", "platform": "Frontend Masters", "duration": "12 hrs", "url": "#"},
    ],
}


# ====== Schemas ======
class SkillComparison(BaseModel):
    skill: str
    current: int
    required: int
    gap: int


class LearningResource(BaseModel):
    name: str
    platform: str
    duration: str
    url: str


class SkillGapResult(BaseModel):
    skill: str
    gap: int
    priority: str
    resources: List[LearningResource]


class GapAnalysisResponse(BaseModel):
    radar_data: List[SkillComparison]
    gap_analysis: List[SkillGapResult]
    total_skills: int
    skills_meeting_target: int
    average_gap: float


# ====== Endpoints ======
@router.get("/gap-analysis", response_model=GapAnalysisResponse)
async def get_gap_analysis(target_role: Optional[str] = Query("Senior Full Stack Developer")):
    """Analyze skill gaps against target role requirements."""
    
    radar_data = []
    gaps = []
    meeting_target = 0
    
    for skill, current in SKILL_ANALYSIS["current_skills"].items():
        required = SKILL_ANALYSIS["target_role_required"].get(skill, 70)
        gap = max(required - current, 0)
        radar_data.append({
            "skill": skill,
            "current": current,
            "required": required,
            "gap": gap,
        })
        
        if gap > 0:
            priority = "Critical" if gap >= 30 else "High" if gap >= 15 else "Medium"
            gaps.append({
                "skill": skill,
                "gap": gap,
                "priority": priority,
                "resources": LEARNING_RESOURCES.get(skill, []),
            })
        else:
            meeting_target += 1
    
    # Sort gaps by severity
    gaps.sort(key=lambda x: x["gap"], reverse=True)
    
    total_gap = sum(g["gap"] for g in gaps)
    avg_gap = total_gap / len(SKILL_ANALYSIS["current_skills"]) if SKILL_ANALYSIS["current_skills"] else 0
    
    return {
        "radar_data": radar_data,
        "gap_analysis": gaps,
        "total_skills": len(SKILL_ANALYSIS["current_skills"]),
        "skills_meeting_target": meeting_target,
        "average_gap": round(avg_gap, 1),
    }
