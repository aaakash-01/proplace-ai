from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
import random

router = APIRouter()


# ====== Interview Data ======
INTERVIEW_QUESTIONS = {
    "behavioral": [
        "Tell me about a time when you faced a significant challenge at work. How did you handle it?",
        "Describe a situation where you had to work with a difficult team member.",
        "Give me an example of when you took initiative on a project.",
        "Tell me about a time you received critical feedback. How did you respond?",
        "Describe a situation where you had to meet a tight deadline.",
    ],
    "technical": [
        "Explain the difference between REST and GraphQL APIs. When would you choose one over the other?",
        "How would you optimize a React application that's experiencing performance issues?",
        "Explain the concept of database indexing. How does it improve query performance?",
        "What are the key differences between SQL and NoSQL databases?",
        "Explain the SOLID principles of object-oriented design.",
    ],
    "system-design": [
        "How would you design a URL shortening service like bit.ly?",
        "Design a real-time chat application. What technologies and architecture would you use?",
        "How would you design a job matching system that handles millions of users?",
        "Walk me through designing a scalable notification system.",
        "Design an API rate limiting system.",
    ],
    "leadership": [
        "How do you approach mentoring junior developers on your team?",
        "Describe your experience leading a project from inception to delivery.",
        "How do you handle conflicting priorities between team members?",
        "Tell me about a time you had to make a tough technical decision.",
        "How do you foster a culture of continuous learning in your team?",
    ],
}

FEEDBACK_TEMPLATES = [
    {
        "rating": "strong",
        "feedback": "Great answer! You provided a clear structure with specific examples. Consider adding quantifiable metrics to strengthen your response.",
        "tips": ["Use the STAR method", "Add specific numbers/metrics", "Mention the impact"],
    },
    {
        "rating": "good",
        "feedback": "Good start! Your answer demonstrates relevant experience. Try to be more specific about the technologies and methodologies you used.",
        "tips": ["Be more specific", "Mention exact tools", "Describe your thought process"],
    },
    {
        "rating": "average",
        "feedback": "Your response covers the basics. To improve, provide more depth and specific examples from your experience.",
        "tips": ["Add concrete examples", "Show problem-solving approach", "Discuss lessons learned"],
    },
]


# ====== Schemas ======
class ChatMessage(BaseModel):
    message: str
    topic: str
    question_index: int = 0


class InterviewResponse(BaseModel):
    ai_feedback: str
    rating: str
    tips: List[str]
    next_question: Optional[str]
    is_complete: bool
    score: int


class TopicQuestions(BaseModel):
    topic: str
    questions: List[str]


# ====== Endpoints ======
@router.post("/chat", response_model=InterviewResponse)
async def interview_chat(chat: ChatMessage):
    """Simulate an AI interview conversation."""
    topic = chat.topic
    q_index = chat.question_index
    
    # Get feedback
    feedback = random.choice(FEEDBACK_TEMPLATES)
    score = random.randint(65, 95)
    
    # Get next question
    questions = INTERVIEW_QUESTIONS.get(topic, INTERVIEW_QUESTIONS["behavioral"])
    next_q_index = q_index + 1
    is_complete = next_q_index >= len(questions)
    next_question = questions[next_q_index] if not is_complete else None
    
    return {
        "ai_feedback": feedback["feedback"],
        "rating": feedback["rating"],
        "tips": feedback["tips"],
        "next_question": next_question,
        "is_complete": is_complete,
        "score": score,
    }


@router.get("/topics")
async def get_topics():
    """Get available interview topics."""
    return {
        "topics": [
            {"id": "behavioral", "label": "Behavioral", "question_count": len(INTERVIEW_QUESTIONS["behavioral"])},
            {"id": "technical", "label": "Technical", "question_count": len(INTERVIEW_QUESTIONS["technical"])},
            {"id": "system-design", "label": "System Design", "question_count": len(INTERVIEW_QUESTIONS["system-design"])},
            {"id": "leadership", "label": "Leadership", "question_count": len(INTERVIEW_QUESTIONS["leadership"])},
        ]
    }


@router.get("/questions/{topic}", response_model=TopicQuestions)
async def get_questions(topic: str):
    """Get questions for a specific topic."""
    if topic not in INTERVIEW_QUESTIONS:
        topic = "behavioral"
    return {"topic": topic, "questions": INTERVIEW_QUESTIONS[topic]}
