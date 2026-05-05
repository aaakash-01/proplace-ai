import re
from collections import Counter
from typing import Dict, List


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
    "product analytics", "airflow", "cypress", "testing", "redux", "tailwind",
}

STOP_WORDS = {
    "about", "above", "after", "again", "against", "also", "and", "any", "are", "because",
    "been", "before", "being", "between", "both", "but", "can", "did", "does", "doing",
    "down", "during", "each", "few", "for", "from", "had", "has", "have", "having",
    "her", "here", "hers", "him", "his", "how", "into", "its", "more", "most", "not",
    "off", "once", "only", "other", "our", "out", "over", "own", "same", "she", "should",
    "some", "such", "than", "that", "the", "their", "them", "then", "there", "these",
    "they", "this", "those", "through", "too", "under", "until", "very", "was", "were",
    "what", "when", "where", "which", "while", "who", "why", "will", "with", "you",
    "your", "resume", "experience", "project", "work", "team", "using", "built",
}

LATEST_RESUME_PROFILE: Dict = {
    "filename": None,
    "skills": [],
    "keywords": [],
    "experience_years": 0,
    "ats_score": 0,
}


def extract_text_from_bytes(filename: str, content: bytes) -> str:
    """Best-effort text extraction without external OCR dependencies."""
    ext = "." + filename.split(".")[-1].lower() if "." in filename else ""

    if ext in {".txt", ".csv", ".md"}:
        return content.decode("utf-8", errors="ignore")

    decoded = content.decode("utf-8", errors="ignore")
    if decoded.strip():
        return decoded

    return content.decode("latin-1", errors="ignore")


def extract_skills(text: str) -> List[str]:
    text_lower = text.lower()
    found_skills = []

    for skill in TECH_SKILLS:
        if len(skill) <= 3:
            if re.search(rf"\b{re.escape(skill)}\b", text_lower):
                found_skills.append(format_skill(skill))
        elif skill in text_lower:
            found_skills.append(format_skill(skill))

    return sorted(set(found_skills))


def extract_keywords(text: str, limit: int = 20) -> List[str]:
    words = re.findall(r"[a-zA-Z][a-zA-Z+#./-]{2,}", text.lower())
    candidates = [
        word.strip(".-/")
        for word in words
        if len(word) > 2 and word not in STOP_WORDS and not word.isdigit()
    ]
    counts = Counter(candidates)
    return [format_skill(word) for word, _ in counts.most_common(limit)]


def extract_experience_years(text: str) -> float:
    patterns = [
        r"(\d+)\+?\s*years?\s*(?:of\s+)?experience",
        r"experience\s*:\s*(\d+)\+?\s*years?",
        r"(\d+)\+?\s*years?\s*(?:in|of)\s+(?:software|development|engineering)",
    ]
    for pattern in patterns:
        match = re.search(pattern, text.lower())
        if match:
            return float(match.group(1))
    return 0.0


def calculate_ats_score(text: str, skills: List[str], keywords: List[str]) -> dict:
    score_breakdown = {}

    score_breakdown["keywords_match"] = min((len(skills) * 3) + len(keywords), 35)

    format_score = 0
    sections = ["experience", "education", "skills", "projects", "summary", "objective"]
    for section in sections:
        if section in text.lower():
            format_score += 4
    score_breakdown["format_structure"] = min(format_score, 25)

    exp_years = extract_experience_years(text)
    score_breakdown["experience_relevance"] = min(exp_years * 4, 20)

    action_verbs = [
        "developed", "implemented", "designed", "led", "managed", "created",
        "built", "improved", "optimized", "deployed", "architected", "automated",
    ]
    action_count = sum(1 for verb in action_verbs if verb in text.lower())
    score_breakdown["content_quality"] = min(action_count * 2, 15)

    edu_keywords = ["bachelor", "master", "phd", "degree", "university", "college", "certification"]
    score_breakdown["education_match"] = min(sum(2 for word in edu_keywords if word in text.lower()), 10)

    return {"total_score": sum(score_breakdown.values()), "breakdown": score_breakdown}


def analyze_resume(filename: str, content: bytes) -> dict:
    text = extract_text_from_bytes(filename, content)
    skills = extract_skills(text)
    keywords = extract_keywords(text)
    experience_years = extract_experience_years(text)
    ats_result = calculate_ats_score(text, skills, keywords)

    profile = {
        "filename": filename,
        "skills": skills,
        "keywords": keywords,
        "experience_years": experience_years,
        "ats_score": ats_result["total_score"],
        "ats_breakdown": ats_result["breakdown"],
        "raw_text_length": len(text),
    }
    LATEST_RESUME_PROFILE.update(profile)
    return profile


def get_latest_resume_profile() -> dict:
    return LATEST_RESUME_PROFILE.copy()


def format_skill(skill: str) -> str:
    special = {
        "aws": "AWS",
        "gcp": "GCP",
        "sql": "SQL",
        "nosql": "NoSQL",
        "html": "HTML",
        "css": "CSS",
        "sass": "Sass",
        "ui/ux": "UI/UX",
        "nlp": "NLP",
        "jwt": "JWT",
        "ci/cd": "CI/CD",
        "c++": "C++",
        "c#": "C#",
        "api": "API",
        "apis": "APIs",
        "fastapi": "FastAPI",
        "postgresql": "PostgreSQL",
        "typescript": "TypeScript",
        "javascript": "JavaScript",
        "node.js": "Node.js",
        "next.js": "Next.js",
        "rest api": "REST API",
    }
    return special.get(skill.lower(), skill.title())
