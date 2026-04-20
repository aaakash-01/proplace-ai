from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import re

router = APIRouter()


# ====== NLP Service (inline for simplicity) ======
TECH_SKILLS = {
    "python", "javascript", "typescript", "java", "c++", "c#", "ruby", "go", "rust", "swift",
    "kotlin", "php", "scala", "r", "matlab", "sql", "nosql", "html", "css", "sass",
    "react", "angular", "vue", "svelte", "next.js", "nuxt", "gatsby", "node.js", "express",
    "fastapi", "django", "flask", "spring", "rails", "laravel",
    "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "cassandra", "dynamodb",
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible", "jenkins",
    "git", "github", "gitlab", "ci/cd", "devops", "agile", "scrum",
    "machine learning", "deep learning", "tensorflow", "pytorch", "scikit-learn", "keras",
    "nlp", "computer vision", "data science", "data engineering", "data analysis",
    "rest api", "graphql", "microservices", "serverless", "oauth", "jwt",
    "figma", "sketch", "adobe xd", "ui/ux", "responsive design",
    "linux", "bash", "powershell", "networking", "security", "penetration testing",
    "blockchain", "web3", "solidity", "smart contracts",
    "tableau", "power bi", "looker", "pandas", "numpy", "matplotlib",
}


def extract_skills(text: str) -> List[str]:
    """Extract skills from resume text using keyword matching."""
    text_lower = text.lower()
    found_skills = []
    for skill in TECH_SKILLS:
        # Use word boundary matching for short skills
        if len(skill) <= 3:
            if re.search(rf'\b{re.escape(skill)}\b', text_lower):
                found_skills.append(skill.title() if len(skill) > 2 else skill.upper())
        else:
            if skill in text_lower:
                found_skills.append(skill.title())
    return sorted(set(found_skills))


def extract_experience_years(text: str) -> float:
    """Extract years of experience from resume text."""
    patterns = [
        r'(\d+)\+?\s*years?\s*(?:of\s+)?experience',
        r'experience\s*:\s*(\d+)\+?\s*years?',
        r'(\d+)\+?\s*years?\s*(?:in|of)\s+(?:software|development|engineering)',
    ]
    for pattern in patterns:
        match = re.search(pattern, text.lower())
        if match:
            return float(match.group(1))
    return 0.0


def calculate_ats_score(text: str, skills: List[str]) -> dict:
    """Calculate ATS compatibility score."""
    score_breakdown = {}
    
    # Keywords (30 points)
    keyword_score = min(len(skills) * 3, 30)
    score_breakdown["keywords_match"] = keyword_score
    
    # Format & Structure (25 points)
    format_score = 0
    sections = ["experience", "education", "skills", "projects", "summary", "objective"]
    for section in sections:
        if section in text.lower():
            format_score += 4
    format_score = min(format_score, 25)
    score_breakdown["format_structure"] = format_score
    
    # Experience (20 points)
    exp_years = extract_experience_years(text)
    exp_score = min(exp_years * 4, 20)
    score_breakdown["experience_relevance"] = exp_score
    
    # Content quality (15 points)
    action_verbs = ["developed", "implemented", "designed", "led", "managed", "created",
                    "built", "improved", "optimized", "deployed", "architected", "automated"]
    action_count = sum(1 for verb in action_verbs if verb in text.lower())
    content_score = min(action_count * 2, 15)
    score_breakdown["content_quality"] = content_score
    
    # Education (10 points)
    edu_keywords = ["bachelor", "master", "phd", "degree", "university", "college", "certification"]
    edu_score = min(sum(2 for kw in edu_keywords if kw in text.lower()), 10)
    score_breakdown["education_match"] = edu_score
    
    total = sum(score_breakdown.values())
    return {"total_score": total, "breakdown": score_breakdown}


# ====== Schemas ======
class ResumeAnalysis(BaseModel):
    filename: str
    skills: List[str]
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
    
    # Read file content
    content = await file.read()
    text = content.decode("utf-8", errors="ignore")
    
    # Extract information
    skills = extract_skills(text)
    experience = extract_experience_years(text)
    ats_result = calculate_ats_score(text, skills)
    
    # Generate suggestions
    suggestions = []
    if len(skills) < 5:
        suggestions.append("Add more technical skills relevant to your target role.")
    if experience == 0:
        suggestions.append("Clearly state your years of experience.")
    if ats_result["breakdown"].get("format_structure", 0) < 15:
        suggestions.append("Add clear section headings: Experience, Education, Skills, Projects.")
    if ats_result["breakdown"].get("content_quality", 0) < 8:
        suggestions.append("Use strong action verbs like 'developed', 'implemented', 'optimized'.")
    if not suggestions:
        suggestions.append("Your resume looks well-optimized! Keep it updated.")
    
    return {
        "filename": file.filename,
        "skills": skills,
        "experience_years": experience,
        "ats_score": ats_result["total_score"],
        "ats_breakdown": ats_result["breakdown"],
        "suggestions": suggestions,
    }


@router.get("/ats-score", response_model=ATSScoreResponse)
async def get_ats_score():
    """Get the latest ATS score (demo data)."""
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
