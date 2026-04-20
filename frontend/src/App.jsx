import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Dashboard from './pages/Dashboard'
import ResumeUpload from './pages/ResumeUpload'
import ATSScore from './pages/ATSScore'
import JobRecommendations from './pages/JobRecommendations'
import SkillGap from './pages/SkillGap'
import MockInterview from './pages/MockInterview'
import CareerPath from './pages/CareerPath'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-900">
        <div className="bg-mesh" />
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resume" element={<ResumeUpload />} />
            <Route path="/ats-score" element={<ATSScore />} />
            <Route path="/jobs" element={<JobRecommendations />} />
            <Route path="/skill-gap" element={<SkillGap />} />
            <Route path="/interview" element={<MockInterview />} />
            <Route path="/career-path" element={<CareerPath />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  )
}

export default App
