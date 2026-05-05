from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List
from services.resume_intelligence import analyze_resume, get_latest_resume_profile

router = APIRouter()


# ====== Schemas ======
class ResumeAnalysis(BaseModel):
    filename: str
    skills: List[str]
    keywords: List[str]
    experience_years: float
    ats_score: float
    ats_breakdown: dict
    suggestions: List[str]


class ATSScoreResponse(BaseModel):
    score: float
    breakdown: dict
    suggestions: List[str]


# ====== Endpoints ======
@router.post("/upload", response_model=ResumeAnalysis)
async def upload_resume(file: UploadFile = File(...)):
    """Upload and analyze a resume file."""
    # Validate file type
    allowed_types = [".pdf", ".doc", ".docx", ".txt"]
    ext = "." + file.filename.split(".")[-1].lower() if "." in file.filename else ""
    if ext not in allowed_types:
        raise HTTPException(status_code=400, detail="Unsupported file type. Use PDF, DOC, DOCX, or TXT.")
    
    content = await file.read()
    analysis = analyze_resume(file.filename, content)
    
    suggestions = []
    if len(analysis["skills"]) < 5:
        suggestions.append("Add more technical skills relevant to your target role.")
    if analysis["experience_years"] == 0:
        suggestions.append("Clearly state your years of experience.")
    if analysis["ats_breakdown"].get("format_structure", 0) < 15:
        suggestions.append("Add clear section headings: Experience, Education, Skills, Projects.")
    if analysis["ats_breakdown"].get("content_quality", 0) < 8:
        suggestions.append("Use strong action verbs like 'developed', 'implemented', 'optimized'.")
    if not suggestions:
        suggestions.append("Your resume looks well-optimized! Keep it updated.")
    
    return {
        "filename": file.filename,
        "skills": analysis["skills"],
        "keywords": analysis["keywords"],
        "experience_years": analysis["experience_years"],
        "ats_score": analysis["ats_score"],
        "ats_breakdown": analysis["ats_breakdown"],
        "suggestions": suggestions,
    }


@router.get("/ats-score", response_model=ATSScoreResponse)
async def get_ats_score():
    """Get the latest ATS score from the uploaded resume when available."""
    profile = get_latest_resume_profile()
    if profile.get("filename"):
        return {
            "score": profile["ats_score"],
            "breakdown": profile.get("ats_breakdown", {}),
            "suggestions": [
                f"Top extracted keywords: {', '.join(profile.get('keywords', [])[:5])}.",
                "Use these keywords naturally in your resume and profile.",
                "Open Job Recommendations to see roles matched against these extracted skills.",
            ],
        }

    return {
        "score": 78,
        "breakdown": {
            "keywords_match": 85,
            "format_structure": 92,
            "experience_relevance": 70,
            "skills_coverage": 65,
            "education_match": 80,
        },
        "suggestions": [
            "Add more industry-specific keywords for target role.",
            "Quantify achievements with metrics.",
            "Include relevant certifications section.",
            "Expand skills section with trending technologies.",
        ]
    }
