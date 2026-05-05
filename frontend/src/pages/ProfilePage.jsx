import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BadgeCheck,
  BarChart3,
  Briefcase,
  Building2,
  FileText,
  Mail,
  ShieldCheck,
  Sparkles,
  Target,
  UserCircle,
  Users,
} from 'lucide-react'
import PageWrapper, { GlassCard, SectionTitle, StatCard } from '../components/UI'

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}

const roleProfiles = {
  job_seeker: {
    label: 'Job Seeker',
    headline: 'Career profile',
    summary: 'Resume strength, job matches, skills, and interview progress in one place.',
    icon: UserCircle,
    stats: [
      { icon: Target, label: 'ATS Score', value: '78/100', color: 'neon-blue' },
      { icon: Briefcase, label: 'Job Matches', value: '47', color: 'green' },
      { icon: BarChart3, label: 'Skills Matched', value: '24', color: 'neon-purple' },
    ],
    actions: [
      { label: 'Upload Resume', path: '/resume', icon: FileText },
      { label: 'View Jobs', path: '/jobs', icon: Briefcase },
      { label: 'Skill Gap', path: '/skill-gap', icon: BarChart3 },
    ],
    details: [
      'Resume parsing and ATS analysis enabled',
      'AI job recommendations available',
      'Career roadmap and mock interview tools ready',
    ],
  },
  recruiter: {
    label: 'Recruiter',
    headline: 'Recruiter profile',
    summary: 'Manage hiring preferences, review candidates, and submit roles for admin moderation.',
    icon: Building2,
    stats: [
      { icon: Briefcase, label: 'Posted Jobs', value: '3', color: 'green' },
      { icon: Users, label: 'Applications', value: '58', color: 'neon-blue' },
      { icon: Target, label: 'Avg Match', value: '86%', color: 'neon-purple' },
    ],
    actions: [
      { label: 'Browse Jobs', path: '/jobs', icon: Briefcase },
      { label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    ],
    details: [
      'Recruiter role is active',
      'Job posting workflow is connected to admin moderation',
      'Candidate matching data is available in the platform',
    ],
  },
  admin: {
    label: 'Admin',
    headline: 'Admin profile',
    summary: 'System control profile for moderation, user management, and job data supervision.',
    icon: ShieldCheck,
    stats: [
      { icon: ShieldCheck, label: 'Pending Reviews', value: '1', color: 'neon-purple' },
      { icon: Users, label: 'User Accounts', value: '4', color: 'neon-blue' },
      { icon: Briefcase, label: 'Active Listings', value: '1', color: 'green' },
    ],
    actions: [
      { label: 'Open Ops', path: '/operations', icon: ShieldCheck },
      { label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    ],
    details: [
      'Admin-only operations console enabled',
      'User account management available',
      'Job listing moderation and external data status available',
    ],
  },
}

export default function ProfilePage() {
  const user = getStoredUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const profile = roleProfiles[user.role] || roleProfiles.job_seeker
  const ProfileIcon = profile.icon

  return (
    <PageWrapper>
      <SectionTitle
        title="Profile"
        subtitle="Your account, role, and available workspace."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <GlassCard hover={false} className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-blue via-neon-purple to-neon-pink flex items-center justify-center mb-5">
              <ProfileIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">{user.name}</h1>
            <p className="text-sm text-gray-400 flex items-center gap-2 mb-4">
              <Mail className="w-4 h-4" />
              {user.email}
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-sm font-semibold">
              <BadgeCheck className="w-4 h-4" />
              {profile.label}
            </span>
          </div>
        </GlassCard>

        <GlassCard hover={false} className="lg:col-span-2">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-neon-blue" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">{profile.headline}</h2>
              <p className="text-sm text-gray-400 leading-6">{profile.summary}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {profile.stats.map(stat => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard hover={false}>
          <h3 className="text-lg font-semibold text-white mb-4">Profile Status</h3>
          <div className="space-y-3">
            {profile.details.map((detail, index) => (
              <motion.div
                key={detail}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <BadgeCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">{detail}</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.actions.map(action => {
              const ActionIcon = action.icon
              return (
                <Link
                  key={action.path}
                  to={action.path}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-neon-blue/30 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:text-neon-blue text-gray-300 transition-colors">
                      <ActionIcon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                      {action.label}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </GlassCard>
      </div>
    </PageWrapper>
  )
}
