import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Briefcase, MapPin, Clock, DollarSign, Star, ExternalLink, 
  Bookmark, Filter, Search, Building2, TrendingUp 
} from 'lucide-react'
import PageWrapper, { GlassCard, SectionTitle } from '../components/UI'


function MatchBadge({ match }) {
  const color = match >= 90 ? 'from-emerald-500 to-teal-500 text-emerald-100' 
    : match >= 75 ? 'from-cyan-500 to-blue-500 text-cyan-100' 
    : 'from-amber-500 to-orange-500 text-amber-100'
  return (
    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${color} text-xs font-bold flex items-center gap-1`}>
      <TrendingUp className="w-3 h-3" />
      {match}% Match
    </div>
  )
}

export default function JobRecommendations() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [savedJobs, setSavedJobs] = useState([])

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs/recommendations')
        const data = await response.json()
        
        if (!response.ok) throw new Error('Failed to fetch jobs')
        
        // Map backend fields to frontend expectations
        const mappedJobs = data.jobs.map(job => ({
          ...job,
          salary: job.salary_range,
          type: job.job_type,
          match: job.match_percentage,
          skills: job.required_skills,
          posted: 'Just now', // Placeholder since backend doesn't provide
          logo: '🏢' // Placeholder
        }))
        
        setJobs(mappedJobs)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchJobs()
  }, [])

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const toggleSave = (id) => {
    setSavedJobs(prev => prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id])
  }

  return (
    <PageWrapper>
      <SectionTitle
        title="Job Recommendations"
        subtitle="AI-matched positions based on your resume and skills."
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, company, or skill..."
            className="glass-input w-full pl-10 pr-4 py-3 text-sm"
          />
        </div>
        <button className="glass-input px-4 py-3 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Job Cards */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-white/10 border-t-neon-blue rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-red-400 text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredJobs.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard className="relative group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl flex-shrink-0">
                    {job.logo}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white group-hover:text-neon-blue transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3" />
                      {job.company}
                    </p>
                  </div>
                </div>
                <MatchBadge match={job.match} />
              </div>

              <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> {job.salary}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {job.posted}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {job.skills.map(skill => (
                  <span key={skill} className="px-2.5 py-1 rounded-md bg-white/5 text-xs text-gray-300 border border-white/5">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 glow-btn py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 rounded-lg">
                  Apply Now <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={() => toggleSave(job.id)}
                  className={`p-2.5 rounded-lg border transition-all ${
                    savedJobs.includes(job.id)
                      ? 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-4 h-4" fill={savedJobs.includes(job.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
        {filteredJobs.length === 0 && !loading && !error && (
          <div className="col-span-1 lg:col-span-2 text-center py-10 text-gray-400">
            No jobs found matching your search.
          </div>
        )}
      </div>
      )}
    </PageWrapper>
  )
}
