import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Briefcase,
  CheckCircle2,
  Database,
  Filter,
  Gauge,
  PauseCircle,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  UserCog,
  Users,
  XCircle,
} from 'lucide-react'
import PageWrapper, { GlassCard, SectionTitle, StatCard } from '../components/UI'

const emptyListing = {
  title: '',
  company: '',
  location: '',
  salary_range: '',
  job_type: 'Full-time',
  description: '',
  required_skills: '',
  experience_required: 0,
  posted_by: 'Recruiter',
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function StatusPill({ status }) {
  const styles = {
    active: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20',
    pending: 'text-amber-300 bg-amber-400/10 border-amber-400/20',
    rejected: 'text-red-300 bg-red-400/10 border-red-400/20',
    archived: 'text-gray-300 bg-white/5 border-white/10',
    reviewed: 'text-cyan-300 bg-cyan-400/10 border-cyan-400/20',
    shortlisted: 'text-purple-300 bg-purple-400/10 border-purple-400/20',
    applied: 'text-blue-300 bg-blue-400/10 border-blue-400/20',
    paused: 'text-amber-300 bg-amber-400/10 border-amber-400/20',
    suspended: 'text-red-300 bg-red-400/10 border-red-400/20',
  }

  return (
    <span className={`px-2.5 py-1 rounded-md border text-xs font-semibold capitalize ${styles[status] || styles.archived}`}>
      {status}
    </span>
  )
}

function IconButton({ icon: Icon, label, onClick, className = '' }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`p-2 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-neon-blue/30 transition-colors ${className}`}
    >
      <Icon className="w-4 h-4" />
    </button>
  )
}

export default function OperationsConsole() {
  const user = getStoredUser()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [listingForm, setListingForm] = useState(emptyListing)
  const [preferences, setPreferences] = useState(null)
  const [saving, setSaving] = useState(false)

  const loadDashboard = async () => {
    try {
      const response = await fetch('/api/jobs/management-dashboard', {
        headers: authHeaders(),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Failed to load management data')
      setDashboard(data)
      setPreferences({
        target_roles: data.preferences.target_roles.join(', '),
        locations: data.preferences.locations.join(', '),
        minimum_match: data.preferences.minimum_match,
        job_types: data.preferences.job_types.join(', '),
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role === 'admin') {
      loadDashboard()
    } else {
      setLoading(false)
    }
  }, [user?.role])

  const stats = useMemo(() => {
    if (!dashboard) return { pending: 0, active: 0, applicants: 0, users: 0 }
    return {
      pending: dashboard.listings.filter(job => job.status === 'pending').length,
      active: dashboard.listings.filter(job => job.status === 'active').length,
      applicants: dashboard.applications.length,
      users: dashboard.users.length,
    }
  }, [dashboard])

  const updateListing = (field, value) => {
    setListingForm(prev => ({ ...prev, [field]: value }))
  }

  const submitListing = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...listingForm,
        required_skills: listingForm.required_skills
          .split(',')
          .map(skill => skill.trim())
          .filter(Boolean),
        experience_required: Number(listingForm.experience_required) || 0,
      }

      const response = await fetch('/api/jobs/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Unable to post listing')

      setDashboard(prev => ({ ...prev, listings: [data, ...prev.listings] }))
      setListingForm(emptyListing)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const moderateListing = async (id, status) => {
    const response = await fetch(`/api/jobs/listings/${id}/moderation`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ status }),
    })
    const data = await response.json()
    if (!response.ok) {
      setError(data.detail || 'Unable to update listing')
      return
    }

    setDashboard(prev => ({
      ...prev,
      listings: prev.listings.map(job => (job.id === id ? data : job)),
    }))
  }

  const savePreferences = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const payload = {
        target_roles: preferences.target_roles.split(',').map(item => item.trim()).filter(Boolean),
        locations: preferences.locations.split(',').map(item => item.trim()).filter(Boolean),
        minimum_match: Number(preferences.minimum_match) || 0,
        job_types: preferences.job_types.split(',').map(item => item.trim()).filter(Boolean),
      }

      const response = await fetch('/api/jobs/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Unable to save preferences')

      setDashboard(prev => ({ ...prev, preferences: data }))
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const updateAccountStatus = async (id, status) => {
    const response = await fetch(`/api/jobs/users/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ status }),
    })
    const data = await response.json()
    if (!response.ok) {
      setError(data.detail || 'Unable to update account')
      return
    }

    setDashboard(prev => ({
      ...prev,
      users: prev.users.map(user => (user.id === id ? data : user)),
    }))
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'admin') {
    return (
      <PageWrapper>
        <GlassCard hover={false} className="max-w-xl mx-auto text-center">
          <ShieldCheck className="w-12 h-12 text-neon-blue mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Admin Access Required</h1>
          <p className="text-sm text-gray-400 mb-6">
            The operations console is available only for admin accounts.
          </p>
          <Link to="/dashboard" className="glow-btn inline-flex px-5 py-3 text-sm font-semibold">
            Back to Dashboard
          </Link>
        </GlassCard>
      </PageWrapper>
    )
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex justify-center items-center py-24">
          <div className="w-8 h-8 border-4 border-white/10 border-t-neon-blue rounded-full animate-spin" />
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <SectionTitle
        title="Operations Console"
        subtitle="Recruiter and admin workflows for the recommendation system."
      />

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Briefcase} label="Active Listings" value={stats.active} color="green" />
        <StatCard icon={ShieldCheck} label="Pending Review" value={stats.pending} color="neon-purple" />
        <StatCard icon={Users} label="Applications" value={stats.applicants} color="neon-blue" />
        <StatCard icon={UserCog} label="User Accounts" value={stats.users} color="neon-pink" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <GlassCard hover={false} className="xl:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <Plus className="w-5 h-5 text-neon-blue" />
            <h3 className="text-lg font-semibold text-white">Post Job Listing</h3>
          </div>

          <form onSubmit={submitListing} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="glass-input px-3 py-3 text-sm" placeholder="Job title" value={listingForm.title} onChange={event => updateListing('title', event.target.value)} required />
            <input className="glass-input px-3 py-3 text-sm" placeholder="Company" value={listingForm.company} onChange={event => updateListing('company', event.target.value)} required />
            <input className="glass-input px-3 py-3 text-sm" placeholder="Location" value={listingForm.location} onChange={event => updateListing('location', event.target.value)} required />
            <input className="glass-input px-3 py-3 text-sm" placeholder="Salary range" value={listingForm.salary_range} onChange={event => updateListing('salary_range', event.target.value)} required />
            <select className="glass-input px-3 py-3 text-sm" value={listingForm.job_type} onChange={event => updateListing('job_type', event.target.value)}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Hybrid</option>
              <option>Remote</option>
            </select>
            <input className="glass-input px-3 py-3 text-sm" type="number" min="0" placeholder="Experience required" value={listingForm.experience_required} onChange={event => updateListing('experience_required', event.target.value)} />
            <input className="glass-input px-3 py-3 text-sm md:col-span-2" placeholder="Required skills, separated by commas" value={listingForm.required_skills} onChange={event => updateListing('required_skills', event.target.value)} required />
            <textarea className="glass-input px-3 py-3 text-sm md:col-span-2 min-h-24 resize-none" placeholder="Description" value={listingForm.description} onChange={event => updateListing('description', event.target.value)} required />
            <button disabled={saving} className="glow-btn md:col-span-2 py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
              <Plus className="w-4 h-4" />
              Submit for Moderation
            </button>
          </form>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-5">
            <SlidersHorizontal className="w-5 h-5 text-neon-purple" />
            <h3 className="text-lg font-semibold text-white">Matching Preferences</h3>
          </div>

          {preferences && (
            <form onSubmit={savePreferences} className="space-y-4">
              <input className="glass-input w-full px-3 py-3 text-sm" value={preferences.target_roles} onChange={event => setPreferences(prev => ({ ...prev, target_roles: event.target.value }))} />
              <input className="glass-input w-full px-3 py-3 text-sm" value={preferences.locations} onChange={event => setPreferences(prev => ({ ...prev, locations: event.target.value }))} />
              <input className="glass-input w-full px-3 py-3 text-sm" value={preferences.job_types} onChange={event => setPreferences(prev => ({ ...prev, job_types: event.target.value }))} />
              <label className="block text-sm text-gray-400">
                Minimum match
                <input className="glass-input w-full px-3 py-3 text-sm mt-2" type="number" min="0" max="100" value={preferences.minimum_match} onChange={event => setPreferences(prev => ({ ...prev, minimum_match: event.target.value }))} />
              </label>
              <button disabled={saving} className="glow-btn w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                <Filter className="w-4 h-4" />
                Save Preferences
              </button>
            </form>
          )}
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <GlassCard hover={false}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">Moderate Job Listings</h3>
            </div>
            <StatusPill status={dashboard.external_sync.status} />
          </div>

          <div className="space-y-3">
            {dashboard.listings.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{job.title}</h4>
                    <p className="text-xs text-gray-400">{job.company} - {job.location}</p>
                  </div>
                  <StatusPill status={job.status} />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-500">{job.applicants} applicants</span>
                  <span className="text-xs text-gray-500">{job.source}</span>
                  <div className="ml-auto flex items-center gap-2">
                    <IconButton icon={CheckCircle2} label="Approve" onClick={() => moderateListing(job.id, 'active')} />
                    <IconButton icon={PauseCircle} label="Archive" onClick={() => moderateListing(job.id, 'archived')} />
                    <IconButton icon={XCircle} label="Reject" onClick={() => moderateListing(job.id, 'rejected')} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-5">
            <Gauge className="w-5 h-5 text-neon-blue" />
            <h3 className="text-lg font-semibold text-white">Review Applications</h3>
          </div>

          <div className="space-y-3">
            {dashboard.applications.map(application => (
              <div key={application.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{application.candidate}</h4>
                    <p className="text-xs text-gray-400">{application.role} at {application.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-neon-blue">{application.match_percentage}%</p>
                    <StatusPill status={application.status} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {application.skills.map(skill => (
                    <span key={skill} className="px-2 py-1 rounded-md bg-white/5 text-xs text-gray-300 border border-white/5">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <GlassCard hover={false} className="xl:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <UserCog className="w-5 h-5 text-neon-pink" />
            <h3 className="text-lg font-semibold text-white">Manage User Accounts</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-white/10">
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Strength</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dashboard.users.map(user => (
                  <tr key={user.id}>
                    <td className="py-3">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </td>
                    <td className="py-3 text-sm text-gray-300 capitalize">{user.role.replace('_', ' ')}</td>
                    <td className="py-3 text-sm text-neon-blue">{user.profile_strength}%</td>
                    <td className="py-3"><StatusPill status={user.status} /></td>
                    <td className="py-3">
                      <div className="flex justify-end gap-2">
                        <IconButton icon={CheckCircle2} label="Activate" onClick={() => updateAccountStatus(user.id, 'active')} />
                        <IconButton icon={PauseCircle} label="Pause" onClick={() => updateAccountStatus(user.id, 'paused')} />
                        <IconButton icon={XCircle} label="Suspend" onClick={() => updateAccountStatus(user.id, 'suspended')} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-5">
            <Database className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Job Data Source</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500">Source</p>
              <p className="text-sm font-semibold text-white">{dashboard.external_sync.source}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Records fetched</p>
              <p className="text-sm font-semibold text-white">{dashboard.external_sync.records_fetched}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Last sync</p>
              <p className="text-sm font-semibold text-white">{dashboard.external_sync.last_sync}</p>
            </div>
            <StatusPill status={dashboard.external_sync.status} />
          </div>
        </GlassCard>
      </div>
    </PageWrapper>
  )
}
