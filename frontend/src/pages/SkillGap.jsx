import { motion } from 'framer-motion'
import { 
  BarChart3, TrendingUp, BookOpen, ExternalLink, Target, Zap, Award
} from 'lucide-react'
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts'
import PageWrapper, { GlassCard, SectionTitle, GlowButton } from '../components/UI'

const radarData = [
  { skill: 'React', current: 90, required: 85 },
  { skill: 'Python', current: 75, required: 90 },
  { skill: 'ML/AI', current: 60, required: 85 },
  { skill: 'SQL', current: 80, required: 75 },
  { skill: 'AWS', current: 45, required: 80 },
  { skill: 'Docker', current: 55, required: 70 },
  { skill: 'Node.js', current: 85, required: 70 },
  { skill: 'TypeScript', current: 70, required: 80 },
]

const gapData = [
  { skill: 'AWS', gap: 35, current: 45, required: 80 },
  { skill: 'ML/AI', gap: 25, current: 60, required: 85 },
  { skill: 'Python', gap: 15, current: 75, required: 90 },
  { skill: 'Docker', gap: 15, current: 55, required: 70 },
  { skill: 'TypeScript', gap: 10, current: 70, required: 80 },
]

const learningPaths = [
  {
    skill: 'AWS',
    gap: 35,
    priority: 'Critical',
    resources: [
      { name: 'AWS Solutions Architect Course', platform: 'Coursera', duration: '40 hrs' },
      { name: 'AWS Certified Developer', platform: 'Udemy', duration: '25 hrs' },
    ]
  },
  {
    skill: 'Machine Learning',
    gap: 25,
    priority: 'High',
    resources: [
      { name: 'ML Specialization', platform: 'Coursera', duration: '60 hrs' },
      { name: 'Hands-On ML with Scikit-Learn', platform: 'O\'Reilly', duration: '30 hrs' },
    ]
  },
  {
    skill: 'Docker & Containers',
    gap: 15,
    priority: 'Medium',
    resources: [
      { name: 'Docker & Kubernetes Complete Guide', platform: 'Udemy', duration: '20 hrs' },
      { name: 'Container Orchestration', platform: 'Pluralsight', duration: '15 hrs' },
    ]
  },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass p-3 rounded-lg border border-white/10 text-sm">
        <p className="text-white font-medium mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="text-xs">
            {p.name}: {p.value}%
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function SkillGap() {
  return (
    <PageWrapper>
      <SectionTitle
        title="Skill Gap Analysis"
        subtitle="Compare your skills against industry requirements for your target role."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Radar Chart */}
        <GlassCard hover={false}>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-neon-blue" />
            Skills Radar
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis 
                dataKey="skill" 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={false}
              />
              <Radar
                name="Required"
                dataKey="required"
                stroke="#7b2ff7"
                fill="#7b2ff7"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Radar
                name="Your Skills"
                dataKey="current"
                stroke="#00f5ff"
                fill="#00f5ff"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neon-blue" />
              <span className="text-xs text-gray-400">Your Skills</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neon-purple" />
              <span className="text-xs text-gray-400">Required</span>
            </div>
          </div>
        </GlassCard>

        {/* Gap Bar Chart */}
        <GlassCard hover={false}>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-neon-purple" />
            Skill Gaps (Top 5)
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={gapData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis dataKey="skill" type="category" tick={{ fill: '#94a3b8', fontSize: 12 }} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="current" name="Current" stackId="a" radius={[0, 0, 0, 0]}>
                {gapData.map((_, i) => (
                  <Cell key={i} fill="#00f5ff" fillOpacity={0.7} />
                ))}
              </Bar>
              <Bar dataKey="gap" name="Gap" stackId="a" radius={[0, 4, 4, 0]}>
                {gapData.map((_, i) => (
                  <Cell key={i} fill="#ef4444" fillOpacity={0.4} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neon-blue" />
              <span className="text-xs text-gray-400">Current Level</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 opacity-60" />
              <span className="text-xs text-gray-400">Gap</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Learning Paths */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          Recommended Learning Paths
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {learningPaths.map((path, i) => {
            const priorityColors = {
              Critical: 'bg-red-400/10 text-red-400 border-red-500/20',
              High: 'bg-amber-400/10 text-amber-400 border-amber-500/20',
              Medium: 'bg-blue-400/10 text-blue-400 border-blue-500/20',
            }
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-neon-blue" />
                      <h4 className="font-semibold text-white">{path.skill}</h4>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${priorityColors[path.priority]}`}>
                      {path.priority}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {path.resources.map((resource, j) => (
                      <div key={j} className="p-3 rounded-lg bg-white/3 border border-white/5">
                        <p className="text-sm text-gray-200 font-medium mb-1">{resource.name}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{resource.platform}</span>
                          <span>{resource.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 py-2.5 rounded-lg glass border border-white/10 text-sm text-gray-300 hover:text-neon-blue hover:border-neon-blue/20 transition-all flex items-center justify-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Start Learning
                  </button>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </PageWrapper>
  )
}
