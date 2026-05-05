import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
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
import OperationsConsole from './pages/OperationsConsole'
import ProfilePage from './pages/ProfilePage'

function RequireAuth({ children }) {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  const location = useLocation()

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  try {
    const parsedUser = JSON.parse(user)
    const needsResumeUpload = parsedUser.role === 'job_seeker' && parsedUser.needsResumeUpload === true
    if (needsResumeUpload && location.pathname !== '/resume') {
      return <Navigate to="/resume" replace />
    }
  } catch {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return <Navigate to="/login" replace />
  }

  return children
}

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
            <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/resume" element={<RequireAuth><ResumeUpload /></RequireAuth>} />
            <Route path="/ats-score" element={<RequireAuth><ATSScore /></RequireAuth>} />
            <Route path="/jobs" element={<RequireAuth><JobRecommendations /></RequireAuth>} />
            <Route path="/skill-gap" element={<RequireAuth><SkillGap /></RequireAuth>} />
            <Route path="/interview" element={<RequireAuth><MockInterview /></RequireAuth>} />
            <Route path="/career-path" element={<RequireAuth><CareerPath /></RequireAuth>} />
            <Route path="/operations" element={<RequireAuth><OperationsConsole /></RequireAuth>} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  )
}

export default App
