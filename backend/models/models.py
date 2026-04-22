import enum
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, JSON, Enum, Boolean
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class UserRole(str, enum.Enum):
    job_seeker = "job_seeker"
    recruiter = "recruiter"
    admin = "admin"

class JobStatus(str, enum.Enum):
    pending = "pending"
    active = "active"
    archived = "archived"
    rejected = "rejected"

class ApplicationStatus(str, enum.Enum):
    applied = "applied"
    reviewed = "reviewed"
    shortlisted = "shortlisted"
    rejected = "rejected"
    accepted = "accepted"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.job_seeker, nullable=False)
    preferences = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    jobs_posted = relationship("Job", back_populates="employer")
    applications = relationship("Application", back_populates="applicant")
    job_matches = relationship("JobMatch", back_populates="user")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    raw_text = Column(Text)
    skills = Column(JSON, default=[])
    experience_years = Column(Float, default=0)
    education = Column(JSON, default=[])
    ats_score = Column(Float, default=0)
    ats_breakdown = Column(JSON, default={})
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="resumes")
    applications = relationship("Application", back_populates="resume")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    employer_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Nullable for external jobs
    title = Column(String(200), nullable=False)
    company = Column(String(200), nullable=False)
    location = Column(String(100))
    salary_range = Column(String(50))
    job_type = Column(String(50)) # e.g. Full-time, Part-time
    description = Column(Text)
    required_skills = Column(JSON, default=[])
    experience_required = Column(Float, default=0)
    status = Column(Enum(JobStatus), default=JobStatus.pending)
    is_external = Column(Boolean, default=False)
    posted_at = Column(DateTime, default=datetime.utcnow)

    employer = relationship("User", back_populates="jobs_posted")
    applications = relationship("Application", back_populates="job")
    matches = relationship("JobMatch", back_populates="job")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    applicant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.applied)
    applied_at = Column(DateTime, default=datetime.utcnow)

    job = relationship("Job", back_populates="applications")
    applicant = relationship("User", back_populates="applications")
    resume = relationship("Resume", back_populates="applications")


class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    match_score = Column(Float, nullable=False)
    match_details = Column(JSON, default={})
    generated_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="job_matches")
    job = relationship("Job", back_populates="matches")
