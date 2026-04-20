import { motion } from 'framer-motion'
import { 
  Target, FileText, Briefcase, BarChart3, MessageSquare, TrendingUp,
  ArrowUpRight, Clock, CheckCircle2, AlertCircle
} from 'lucide-react'
import PageWrapper, { GlassCard, SectionTitle, StatCard } from '../components/UI'
import { Link } from 'react-router-dom'

const recentActivity = [
  { icon: FileText, text: 'Resume analyzed', time: '2 hours ago', status: 'success' },
  { icon: Target, text: 'ATS score updated: 78/100', time: '2 hours ago', status: 'success' },
  { icon: Briefcase, text: '12 new job matches found', time: '5 hours ago', status: 'info' },
  { icon: MessageSquare, text: 'Mock interview completed', time: '1 day ago', status: 'success' },
  { icon: AlertCircle, text: '3 skill gaps identified', time: '1 day ago', status: 'warning' },
]

const quickActions = [
  { icon: FileText, label: 'Upload Resume', path: '/resume', color: 'from-cyan-500 to-blue-500' },
  { icon: Target, label: 'View ATS Score', path: '/ats-score', color: 'from-purple-500 to-pink-500' },
  { icon: Briefcase, label: 'Browse Jobs', path: '/jobs', color: 'from-emerald-500 to-teal-500' },
  { icon: MessageSquare, label: 'Mock Interview', path: '/interview', color: 'from-orange-500 to-amber-500' },
]

export default function Dashboard() {
  return (
    <PageWrapper>
      <SectionTitle 
        title="Dashboard" 
        subtitle="Welcome back! Here's your career overview." 
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Target} label="ATS Score" value="78/100" trend="+5" color="neon-blue" />
        <StatCard icon={BarChart3} label="Skills Matched" value="24" trend="+3" color="neon-purple" />
        <StatCard icon={Briefcase} label="Job Matches" value="47" trend="+12" color="green" />
        <StatCard icon={TrendingUp} label="Profile Strength" value="85%" trend="+8%" color="neon-pink" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action, i) => {
              const Icon = action.icon
              return (
                <Link key={i} to={action.path}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="glass-card p-4 flex items-center gap-3 cursor-pointer group"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors flex-1">{action.label}</span>
                    <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-neon-blue transition-colors" />
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <GlassCard hover={false} className="divide-y divide-white/5">
            {recentActivity.map((activity, i) => {
              const Icon = activity.icon
              const statusColors = {
                success: 'text-emerald-400 bg-emerald-400/10',
                info: 'text-neon-blue bg-neon-blue/10',
                warning: 'text-amber-400 bg-amber-400/10',
              }
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${statusColors[activity.status]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200">{activity.text}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                  {activity.status === 'success' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  )}
                </motion.div>
              )
            })}
          </GlassCard>
        </div>
      </div>

      {/* Skills Overview */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">Top Skills Detected</h3>
        <div className="flex flex-wrap gap-2">
          {['React', 'Python', 'Machine Learning', 'Node.js', 'SQL', 'Docker', 'AWS', 'TypeScript', 'Git', 'REST APIs', 'TensorFlow', 'MongoDB'].map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="px-3 py-1.5 rounded-lg glass border border-white/5 text-sm text-gray-300 hover:border-neon-blue/20 hover:text-neon-blue transition-all cursor-default"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}
