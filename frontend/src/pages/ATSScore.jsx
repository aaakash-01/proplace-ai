import { motion } from 'framer-motion'
import { 
  Target, CheckCircle2, AlertTriangle, XCircle, TrendingUp, 
  FileText, Lightbulb, ArrowRight 
} from 'lucide-react'
import PageWrapper, { GlassCard, SectionTitle, GlowButton } from '../components/UI'
import { Link } from 'react-router-dom'

const score = 78
const categories = [
  { name: 'Keywords Match', score: 85, max: 100, color: 'from-emerald-500 to-teal-500' },
  { name: 'Format & Structure', score: 92, max: 100, color: 'from-cyan-500 to-blue-500' },
  { name: 'Experience Relevance', score: 70, max: 100, color: 'from-purple-500 to-violet-500' },
  { name: 'Skills Coverage', score: 65, max: 100, color: 'from-amber-500 to-orange-500' },
  { name: 'Education Match', score: 80, max: 100, color: 'from-pink-500 to-rose-500' },
]

const suggestions = [
  { type: 'success', icon: CheckCircle2, text: 'Strong action verbs detected in experience section', priority: 'Good' },
  { type: 'success', icon: CheckCircle2, text: 'Clean, parseable format with proper headings', priority: 'Good' },
  { type: 'warning', icon: AlertTriangle, text: 'Add more industry-specific keywords for target role', priority: 'Medium' },
  { type: 'warning', icon: AlertTriangle, text: 'Quantify achievements with metrics (e.g., "increased by 30%")', priority: 'Medium' },
  { type: 'error', icon: XCircle, text: 'Missing relevant certifications section', priority: 'High' },
  { type: 'error', icon: XCircle, text: 'Skills section could be expanded with trending technologies', priority: 'High' },
]

function CircularProgress({ value, size = 200, strokeWidth = 12 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference
  const color = value >= 80 ? '#10b981' : value >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-4xl font-black text-white"
        >
          {value}
        </motion.span>
        <span className="text-sm text-gray-400 font-medium">out of 100</span>
      </div>
    </div>
  )
}

export default function ATSScore() {
  return (
    <PageWrapper>
      <SectionTitle
        title="ATS Score Analysis"
        subtitle="Detailed breakdown of your resume's ATS compatibility."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Display */}
        <div className="lg:col-span-1">
          <GlassCard hover={false} className="flex flex-col items-center text-center">
            <CircularProgress value={score} />
            <div className="mt-6">
              <p className="text-lg font-semibold text-white mb-1">
                {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'}
              </p>
              <p className="text-sm text-gray-400">
                {score >= 80
                  ? 'Your resume is well-optimized for ATS systems.'
                  : 'There are opportunities to improve your ATS score.'}
              </p>
            </div>
            <Link to="/jobs" className="w-full mt-6">
              <GlowButton className="w-full flex items-center justify-center gap-2">
                View Job Matches <ArrowRight className="w-4 h-4" />
              </GlowButton>
            </Link>
          </GlassCard>
        </div>

        {/* Categories Breakdown */}
        <div className="lg:col-span-2">
          <GlassCard hover={false}>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-neon-blue" />
              Score Breakdown
            </h3>
            <div className="space-y-5">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">{cat.name}</span>
                    <span className="text-sm font-bold text-white">{cat.score}%</span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${cat.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.score}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Suggestions */}
        <div className="lg:col-span-3">
          <GlassCard hover={false}>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              Improvement Suggestions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestions.map((s, i) => {
                const Icon = s.icon
                const typeColors = {
                  success: 'border-emerald-500/20 bg-emerald-500/5',
                  warning: 'border-amber-500/20 bg-amber-500/5',
                  error: 'border-red-500/20 bg-red-500/5',
                }
                const iconColors = {
                  success: 'text-emerald-400',
                  warning: 'text-amber-400',
                  error: 'text-red-400',
                }
                const priorityColors = {
                  Good: 'bg-emerald-400/10 text-emerald-400',
                  Medium: 'bg-amber-400/10 text-amber-400',
                  High: 'bg-red-400/10 text-red-400',
                }
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-4 rounded-xl border ${typeColors[s.type]} flex items-start gap-3`}
                  >
                    <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColors[s.type]}`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-200">{s.text}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${priorityColors[s.priority]}`}>
                      {s.priority}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </PageWrapper>
  )
}
