import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, CheckCircle2, AlertCircle, X, File, ArrowRight } from 'lucide-react'
import PageWrapper, { GlassCard, GlowButton, SectionTitle } from '../components/UI'
import { useNavigate } from 'react-router-dom'

export default function ResumeUpload() {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploaded, setUploaded] = useState(false)
  const navigate = useNavigate()

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (!file) return
    setUploading(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          setUploaded(true)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 200)
  }

  return (
    <PageWrapper>
      <SectionTitle
        title="Resume Upload"
        subtitle="Upload your resume for AI-powered analysis and skill extraction."
      />

      <div className="max-w-2xl mx-auto">
        {/* Upload Zone */}
        <GlassCard hover={false} className="relative overflow-hidden">
          {!uploaded ? (
            <>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
                  dragActive
                    ? 'border-neon-blue bg-neon-blue/5'
                    : file
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-white/10 hover:border-white/20'
                }`}
                onClick={() => document.getElementById('file-input').click()}
                id="drop-zone"
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div
                      key="file"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                        <File className="w-8 h-8 text-emerald-400" />
                      </div>
                      <p className="text-white font-medium mb-1">{file.name}</p>
                      <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setFile(null) }}
                        className="mt-3 text-sm text-red-400 hover:text-red-300 flex items-center gap-1 mx-auto"
                      >
                        <X className="w-3 h-3" /> Remove
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-white font-medium mb-1">
                        {dragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                      </p>
                      <p className="text-sm text-gray-500">or click to browse • PDF, DOC, DOCX, TXT</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Progress Bar */}
              {uploading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Analyzing resume...</span>
                    <span className="text-sm text-neon-blue font-medium">{Math.min(Math.round(progress), 100)}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-purple"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="mt-3 space-y-2">
                    {['Extracting text...', 'Identifying skills...', 'Analyzing experience...'].map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: progress > i * 33 ? 1 : 0.3, x: 0 }}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle2 className={`w-4 h-4 ${progress > (i + 1) * 33 ? 'text-emerald-400' : 'text-gray-600'}`} />
                        <span className={progress > (i + 1) * 33 ? 'text-gray-300' : 'text-gray-600'}>{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {file && !uploading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
                  <GlowButton onClick={handleUpload} className="w-full flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    Analyze Resume
                  </GlowButton>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Resume Analyzed Successfully!</h3>
              <p className="text-gray-400 mb-6">We found 24 skills and 5 years of experience.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <GlowButton onClick={() => navigate('/ats-score')} className="flex items-center justify-center gap-2">
                  View ATS Score <ArrowRight className="w-4 h-4" />
                </GlowButton>
                <button
                  onClick={() => { setFile(null); setUploaded(false); setProgress(0) }}
                  className="px-6 py-3 rounded-xl glass border border-white/10 text-white text-sm font-medium hover:border-white/20 transition-all"
                >
                  Upload Another
                </button>
              </div>
            </motion.div>
          )}
        </GlassCard>

        {/* Tips */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: FileText, text: 'Use PDF format for best results' },
            { icon: CheckCircle2, text: 'Include relevant keywords' },
            { icon: AlertCircle, text: 'Avoid images in resume' },
          ].map((tip, i) => {
            const Icon = tip.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="glass-card p-4 flex items-center gap-3"
              >
                <Icon className="w-4 h-4 text-neon-blue flex-shrink-0" />
                <span className="text-xs text-gray-400">{tip.text}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </PageWrapper>
  )
}
