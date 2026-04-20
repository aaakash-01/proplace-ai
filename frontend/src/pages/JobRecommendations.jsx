import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Briefcase, MapPin, Clock, DollarSign, Star, ExternalLink, 
  Bookmark, Filter, Search, Building2, TrendingUp 
} from 'lucide-react'
import PageWrapper, { GlassCard, SectionTitle } from '../components/UI'

const jobs = [
  {
    id: 1, title: 'Senior Frontend Engineer', company: 'TechCorp Inc.', location: 'San Francisco, CA',
    salary: '$150K - $200K', type: 'Full-time', match: 95, posted: '2 days ago',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    logo: '🏢'
  },
  {
    id: 2, title: 'Machine Learning Engineer', company: 'AI Solutions Ltd.', location: 'New York, NY',
    salary: '$140K - $190K', type: 'Full-time', match: 88, posted: '3 days ago',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL'],
    logo: '🤖'
  },
  {
    id: 3, title: 'Full Stack Developer', company: 'StartupXYZ', location: 'Remote',
    salary: '$120K - $160K', type: 'Full-time', match: 82, posted: '1 day ago',
    skills: ['React', 'Python', 'PostgreSQL', 'AWS'],
    logo: '🚀'
  },
  {
    id: 4, title: 'Data Scientist', company: 'DataDriven Co.', location: 'Austin, TX',
    salary: '$130K - $175K', type: 'Full-time', match: 76, posted: '5 days ago',
    skills: ['Python', 'Machine Learning', 'SQL', 'Tableau'],
    logo: '📊'
  },
  {
    id: 5, title: 'DevOps Engineer', company: 'CloudFirst', location: 'Seattle, WA',
    salary: '$135K - $180K', type: 'Full-time', match: 71, posted: '1 week ago',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
    logo: '☁️'
  },
  {
    id: 6, title: 'Backend Engineer', company: 'FinTech Corp', location: 'Chicago, IL',
    salary: '$125K - $170K', type: 'Full-time', match: 68, posted: '4 days ago',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'Redis'],
    logo: '💰'
  },
]

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
  const [searchTerm, setSearchTerm] = useState('')
  const [savedJobs, setSavedJobs] = useState([])

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
      </div>
    </PageWrapper>
  )
}
