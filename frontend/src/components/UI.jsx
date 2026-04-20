import { motion } from 'framer-motion'

export default function PageWrapper({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={`pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}
    >
      {children}
    </motion.div>
  )
}

export function GlassCard({ children, className = '', hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{ duration: 0.2 }}
      className={`glass-card p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function GlowButton({ children, className = '', ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`glow-btn px-6 py-3 text-sm font-semibold ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function SectionTitle({ title, subtitle, className = '' }) {
  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">{title}</h2>
      {subtitle && <p className="text-gray-400 text-sm sm:text-base">{subtitle}</p>}
    </div>
  )
}

export function LoadingSkeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
  )
}

export function StatCard({ icon: Icon, label, value, trend, color = 'neon-blue' }) {
  const colorMap = {
    'neon-blue': 'from-cyan-500/20 to-cyan-500/5 text-neon-blue border-cyan-500/20',
    'neon-purple': 'from-purple-500/20 to-purple-500/5 text-neon-purple border-purple-500/20',
    'neon-pink': 'from-pink-500/20 to-pink-500/5 text-neon-pink border-pink-500/20',
    'green': 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20',
  }
  return (
    <GlassCard className="relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[color]} opacity-30`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
          {trend && (
            <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
              {trend}
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
      </div>
    </GlassCard>
  )
}
