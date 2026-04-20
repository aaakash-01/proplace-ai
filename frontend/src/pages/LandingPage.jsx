import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Brain, FileText, Target, Briefcase, BarChart3, MessageSquare, 
  GitBranch, Sparkles, ArrowRight, Zap, Shield, TrendingUp, ChevronRight
} from 'lucide-react'

const features = [
  { icon: FileText, title: 'Smart Resume Parsing', desc: 'AI-powered NLP extracts skills, experience, and qualifications from your resume instantly.', color: 'from-cyan-500 to-blue-500' },
  { icon: Target, title: 'ATS Score Analysis', desc: 'Get detailed ATS compatibility scores with actionable improvement suggestions.', color: 'from-purple-500 to-pink-500' },
  { icon: Briefcase, title: 'Job Matching', desc: 'ML-powered recommendations match you with jobs based on skills and experience.', color: 'from-emerald-500 to-teal-500' },
  { icon: BarChart3, title: 'Skill Gap Analysis', desc: 'Identify missing skills for your dream role with personalized learning paths.', color: 'from-orange-500 to-amber-500' },
  { icon: MessageSquare, title: 'AI Mock Interviews', desc: 'Practice with AI interviewer simulations tailored to your target role.', color: 'from-pink-500 to-rose-500' },
  { icon: GitBranch, title: 'Career Roadmap', desc: 'Visualize your career progression with AI-generated growth paths.', color: 'from-violet-500 to-purple-500' },
]

const stats = [
  { value: '50K+', label: 'Resumes Analyzed' },
  { value: '95%', label: 'Match Accuracy' },
  { value: '10K+', label: 'Jobs Matched' },
  { value: '4.9★', label: 'User Rating' },
]

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            background: i % 2 === 0 ? '#00f5ff' : '#7b2ff7',
            animationDuration: Math.random() * 10 + 10 + 's',
            animationDelay: Math.random() * 5 + 's',
          }}
        />
      ))}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <FloatingParticles />
        
        {/* Radial glow behind hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-neon-blue/10 via-neon-purple/5 to-transparent rounded-full blur-3xl" />
        
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neon-blue/20 mb-8">
              <Sparkles className="w-4 h-4 text-neon-blue" />
              <span className="text-sm text-neon-blue font-medium">AI-Powered Career Intelligence</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6"
          >
            <span className="text-white">Your Career,</span>
            <br />
            <span className="gradient-text">Supercharged by AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Upload your resume, get instant ATS scores, discover perfect job matches, 
            and accelerate your career with AI-powered insights and mock interviews.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="glow-btn px-8 py-4 text-base font-bold flex items-center gap-2 rounded-xl"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-4 rounded-xl glass border border-white/10 text-white font-semibold text-base hover:border-neon-blue/30 transition-all"
              >
                Sign In
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to <span className="gradient-text">Land Your Dream Job</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our AI platform covers every aspect of your job search journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="glass-card p-8 group cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-neon-purple/5" />
            <div className="relative">
              <Zap className="w-12 h-12 text-neon-blue mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Career?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Join thousands of professionals using AI to accelerate their job search.
              </p>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="glow-btn px-10 py-4 text-base font-bold flex items-center gap-2 mx-auto rounded-xl"
                >
                  Start For Free
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-neon-blue" />
            <span className="font-bold gradient-text">ProPlace AI</span>
          </div>
          <p className="text-sm text-gray-500">© 2026 ProPlace AI. Built with Intelligence.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
