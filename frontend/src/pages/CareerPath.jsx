import { motion } from 'framer-motion'
import { 
  GitBranch, Star, Lock, CheckCircle2, ChevronRight, Rocket, 
  Award, ArrowRight, Zap, Target, BookOpen, TrendingUp
} from 'lucide-react'
import PageWrapper, { GlassCard, SectionTitle, GlowButton } from '../components/UI'

const careerStages = [
  {
    id: 1,
    title: 'Junior Developer',
    level: 'Entry Level',
    status: 'completed',
    salary: '$60K - $85K',
    duration: '0-2 years',
    skills: ['HTML/CSS', 'JavaScript', 'React Basics', 'Git', 'REST APIs'],
    milestones: ['First job', 'Build portfolio', 'Learn fundamentals'],
  },
  {
    id: 2,
    title: 'Mid-Level Developer',
    level: 'Intermediate',
    status: 'current',
    salary: '$85K - $130K',
    duration: '2-5 years',
    skills: ['TypeScript', 'Node.js', 'Database Design', 'Testing', 'CI/CD'],
    milestones: ['Lead feature development', 'Mentor juniors', 'System design basics'],
  },
  {
    id: 3,
    title: 'Senior Developer',
    level: 'Senior',
    status: 'next',
    salary: '$130K - $180K',
    duration: '5-8 years',
    skills: ['Architecture', 'Performance Optimization', 'Cloud Services', 'Team Leadership', 'Microservices'],
    milestones: ['Design systems', 'Technical decision making', 'Cross-team collaboration'],
  },
  {
    id: 4,
    title: 'Staff Engineer',
    level: 'Staff',
    status: 'locked',
    salary: '$180K - $250K',
    duration: '8-12 years',
    skills: ['System Architecture', 'Technical Strategy', 'Org-wide Impact', 'Innovation', 'Mentorship at Scale'],
    milestones: ['Define technical vision', 'Drive org-wide initiatives', 'Industry influence'],
  },
  {
    id: 5,
    title: 'Principal / CTO',
    level: 'Executive',
    status: 'locked',
    salary: '$250K+',
    duration: '12+ years',
    skills: ['Business Strategy', 'Executive Leadership', 'Product Vision', 'Investor Relations', 'Team Building'],
    milestones: ['Shape company direction', 'Build engineering culture', 'Industry thought leadership'],
  },
]

const futureSkills = [
  { name: 'AI/ML Engineering', growth: '+340%', demand: 'Very High', icon: '🤖' },
  { name: 'Rust Programming', growth: '+180%', demand: 'High', icon: '⚡' },
  { name: 'Web3 / Blockchain', growth: '+150%', demand: 'High', icon: '🔗' },
  { name: 'Platform Engineering', growth: '+120%', demand: 'High', icon: '🏗️' },
  { name: 'Edge Computing', growth: '+95%', demand: 'Medium', icon: '🌐' },
  { name: 'Quantum Computing', growth: '+80%', demand: 'Emerging', icon: '💎' },
]

function TimelineNode({ stage, index, total }) {
  const statusConfig = {
    completed: { 
      bg: 'bg-emerald-500', 
      border: 'border-emerald-500', 
      glow: 'shadow-emerald-500/30',
      icon: CheckCircle2,
      badge: 'bg-emerald-400/10 text-emerald-400 border-emerald-500/20'
    },
    current: { 
      bg: 'bg-gradient-to-br from-neon-blue to-neon-purple', 
      border: 'border-neon-blue', 
      glow: 'shadow-neon-blue',
      icon: Star,
      badge: 'bg-neon-blue/10 text-neon-blue border-neon-blue/20'
    },
    next: { 
      bg: 'bg-white/20', 
      border: 'border-white/20', 
      glow: '',
      icon: Target,
      badge: 'bg-white/5 text-gray-400 border-white/10'
    },
    locked: { 
      bg: 'bg-white/5', 
      border: 'border-white/10', 
      glow: '',
      icon: Lock,
      badge: 'bg-white/3 text-gray-600 border-white/5'
    },
  }

  const config = statusConfig[stage.status]
  const StatusIcon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15 }}
      className="relative"
    >
      {/* Connector Line */}
      {index < total - 1 && (
        <div className="absolute left-6 top-16 w-0.5 h-full -bottom-4">
          <div className={`w-full h-full ${
            stage.status === 'completed' ? 'bg-gradient-to-b from-emerald-500 to-emerald-500/20' 
            : stage.status === 'current' ? 'bg-gradient-to-b from-neon-blue to-white/5'
            : 'bg-white/5'
          }`} />
        </div>
      )}

      <div className="flex gap-4">
        {/* Node Circle */}
        <div className={`relative w-12 h-12 rounded-full ${config.bg} ${config.glow} flex items-center justify-center flex-shrink-0 z-10`}>
          <StatusIcon className={`w-5 h-5 ${stage.status === 'locked' ? 'text-gray-600' : 'text-white'}`} />
          {stage.status === 'current' && (
            <div className="absolute inset-0 rounded-full animate-ping bg-neon-blue/20" />
          )}
        </div>

        {/* Content Card */}
        <GlassCard 
          hover={stage.status !== 'locked'}
          className={`flex-1 mb-6 ${stage.status === 'locked' ? 'opacity-50' : ''} ${
            stage.status === 'current' ? 'border-neon-blue/20' : ''
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`text-lg font-bold ${stage.status === 'locked' ? 'text-gray-500' : 'text-white'}`}>
                  {stage.title}
                </h3>
                {stage.status === 'current' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-blue/20 text-neon-blue font-bold uppercase tracking-wider">
                    You are here
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{stage.level} • {stage.duration}</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${config.badge}`}>
              {stage.salary}
            </span>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {stage.skills.map(skill => (
              <span
                key={skill}
                className={`px-2 py-0.5 rounded-md text-xs ${
                  stage.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                  : stage.status === 'current' ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/10'
                  : 'bg-white/5 text-gray-500 border border-white/5'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Milestones */}
          <div className="space-y-1.5">
            {stage.milestones.map((milestone, j) => (
              <div key={j} className="flex items-center gap-2">
                {stage.status === 'completed' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                ) : (
                  <div className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 ${
                    stage.status === 'current' ? 'border-neon-blue/30' : 'border-white/10'
                  }`} />
                )}
                <span className={`text-xs ${stage.status === 'completed' ? 'text-gray-400 line-through' : stage.status === 'locked' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {milestone}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </motion.div>
  )
}

export default function CareerPath() {
  return (
    <PageWrapper>
      <SectionTitle
        title="Career Path Visualization"
        subtitle="Your personalized career roadmap based on skills and industry trends."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <div className="space-y-0">
            {careerStages.map((stage, i) => (
              <TimelineNode key={stage.id} stage={stage} index={i} total={careerStages.length} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Future Skills */}
          <GlassCard hover={false}>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-neon-purple" />
              Trending Future Skills
            </h3>
            <div className="space-y-3">
              {futureSkills.map((skill, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/3 transition-colors group"
                >
                  <span className="text-xl">{skill.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors truncate">
                      {skill.name}
                    </p>
                    <p className="text-xs text-gray-500">{skill.demand} demand</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                    {skill.growth}
                  </span>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Quick Tips */}
          <GlassCard hover={false}>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Growth Tips
            </h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex gap-2">
                <BookOpen className="w-4 h-4 text-neon-blue flex-shrink-0 mt-0.5" />
                <p>Learn system design patterns to advance to senior roles.</p>
              </div>
              <div className="flex gap-2">
                <Award className="w-4 h-4 text-neon-purple flex-shrink-0 mt-0.5" />
                <p>Get AWS or GCP certification to boost cloud skills.</p>
              </div>
              <div className="flex gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p>Contribute to open source to build industry recognition.</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </PageWrapper>
  )
}
