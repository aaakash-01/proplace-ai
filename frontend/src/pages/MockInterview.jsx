import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, Send, Bot, User, RotateCcw, Lightbulb, 
  ThumbsUp, ThumbsDown, Sparkles, Mic, MicOff
} from 'lucide-react'
import PageWrapper, { GlassCard, SectionTitle, GlowButton } from '../components/UI'

const interviewTopics = [
  { id: 'behavioral', label: 'Behavioral', emoji: '🎯' },
  { id: 'technical', label: 'Technical', emoji: '💻' },
  { id: 'system-design', label: 'System Design', emoji: '🏗️' },
  { id: 'leadership', label: 'Leadership', emoji: '👥' },
]

const aiQuestions = {
  behavioral: [
    "Tell me about a time when you faced a significant challenge at work. How did you handle it?",
    "Describe a situation where you had to work with a difficult team member. What was the outcome?",
    "Give me an example of when you took initiative on a project. What motivated you?",
    "Tell me about a time you received critical feedback. How did you respond?",
  ],
  technical: [
    "Can you explain the difference between REST and GraphQL APIs? When would you choose one over the other?",
    "How would you optimize a React application that's experiencing performance issues?",
    "Explain the concept of database indexing. How does it improve query performance?",
    "What are the key differences between SQL and NoSQL databases? Give use cases for each.",
  ],
  'system-design': [
    "How would you design a URL shortening service like bit.ly?",
    "Design a real-time chat application. What technologies and architecture would you use?",
    "How would you design a job matching system that handles millions of users?",
    "Walk me through designing a scalable notification system.",
  ],
  leadership: [
    "How do you approach mentoring junior developers on your team?",
    "Describe your experience leading a project from inception to delivery.",
    "How do you handle conflicting priorities between team members?",
    "Tell me about a time you had to make a tough technical decision for your team.",
  ],
}

const feedbackTemplates = [
  "Great answer! You provided a clear structure with the STAR method. Consider adding more specific metrics to quantify your impact.",
  "Good start! Try to be more specific about your technical approach. Mention the exact technologies and frameworks you used.",
  "Solid response! You demonstrated strong problem-solving skills. Next time, also discuss what you learned from the experience.",
  "Well articulated! Your answer shows good leadership qualities. Consider mentioning how you measured the success of your approach.",
]

export default function MockInterview() {
  const [topic, setTopic] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startInterview = (selectedTopic) => {
    setTopic(selectedTopic)
    setMessages([])
    setQuestionIndex(0)
    setTimeout(() => {
      setMessages([{
        role: 'ai',
        content: `Welcome to your ${selectedTopic} interview practice! I'll ask you a series of questions. Take your time to think before answering.\n\nLet's begin!`,
        timestamp: new Date(),
      }])
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'ai',
          content: aiQuestions[selectedTopic][0],
          timestamp: new Date(),
          isQuestion: true,
        }])
      }, 1500)
    }, 500)
  }

  const handleSend = () => {
    if (!input.trim() || isTyping) return
    
    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI feedback
    setTimeout(() => {
      const feedback = feedbackTemplates[questionIndex % feedbackTemplates.length]
      setMessages(prev => [...prev, {
        role: 'ai',
        content: feedback,
        timestamp: new Date(),
        isFeedback: true,
      }])

      // Ask next question
      const nextIndex = questionIndex + 1
      if (nextIndex < aiQuestions[topic].length) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'ai',
            content: aiQuestions[topic][nextIndex],
            timestamp: new Date(),
            isQuestion: true,
          }])
          setQuestionIndex(nextIndex)
          setIsTyping(false)
        }, 1500)
      } else {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'ai',
            content: "🎉 Great job completing the interview practice! You've answered all the questions. Here's a summary:\n\n• Communication: Strong\n• Technical Depth: Good\n• Structure: Excellent\n• Areas to Improve: Add more metrics\n\nKeep practicing to build confidence!",
            timestamp: new Date(),
          }])
          setIsTyping(false)
        }, 1500)
      }
    }, 2000)
  }

  const resetInterview = () => {
    setTopic(null)
    setMessages([])
    setQuestionIndex(0)
    setIsTyping(false)
  }

  return (
    <PageWrapper>
      <SectionTitle
        title="AI Mock Interview"
        subtitle="Practice with an AI interviewer tailored to your target role."
      />

      {!topic ? (
        /* Topic Selection */
        <div className="max-w-2xl mx-auto">
          <GlassCard hover={false} className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-8 h-8 text-neon-blue" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Choose Interview Type</h3>
            <p className="text-gray-400 text-sm mb-8">Select a category to start your mock interview session.</p>
            
            <div className="grid grid-cols-2 gap-3">
              {interviewTopics.map((t) => (
                <motion.button
                  key={t.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startInterview(t.id)}
                  className="glass-card p-6 text-center cursor-pointer group"
                >
                  <span className="text-3xl mb-3 block">{t.emoji}</span>
                  <span className="text-sm font-semibold text-white group-hover:text-neon-blue transition-colors">{t.label}</span>
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </div>
      ) : (
        /* Chat Interface */
        <div className="max-w-3xl mx-auto">
          <GlassCard hover={false} className="flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">AI Interviewer</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    {interviewTopics.find(t => t.id === topic)?.label} Interview
                  </p>
                </div>
              </div>
              <button
                onClick={resetInterview}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                title="Start Over"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'ai' 
                        ? 'bg-gradient-to-br from-neon-blue/20 to-neon-purple/20' 
                        : 'bg-white/10'
                    }`}>
                      {msg.role === 'ai' ? <Bot className="w-4 h-4 text-neon-blue" /> : <User className="w-4 h-4 text-gray-400" />}
                    </div>
                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block p-3.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 text-white rounded-tr-md'
                          : msg.isFeedback
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-gray-200 rounded-tl-md'
                          : msg.isQuestion
                          ? 'bg-white/5 border border-neon-blue/10 text-gray-200 rounded-tl-md'
                          : 'bg-white/5 text-gray-200 rounded-tl-md'
                      }`} style={{ whiteSpace: 'pre-line' }}>
                        {msg.isFeedback && (
                          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium mb-2">
                            <Lightbulb className="w-3.5 h-3.5" />
                            Feedback
                          </div>
                        )}
                        {msg.isQuestion && (
                          <div className="flex items-center gap-1.5 text-neon-blue text-xs font-medium mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            Question {questionIndex + 1}
                          </div>
                        )}
                        {msg.content}
                      </div>
                      {msg.role === 'ai' && msg.isFeedback && (
                        <div className="flex items-center gap-2 mt-2">
                          <button className="p-1.5 rounded-md text-gray-600 hover:text-emerald-400 hover:bg-emerald-400/10 transition-all">
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-md text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all">
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-neon-blue" />
                  </div>
                  <div className="bg-white/5 rounded-2xl rounded-tl-md p-3.5 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="pt-4 border-t border-white/5 mt-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your answer..."
                  className="glass-input flex-1 px-4 py-3 text-sm"
                  disabled={isTyping}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={isTyping || !input.trim()}
                  className="glow-btn p-3 rounded-xl disabled:opacity-30"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </PageWrapper>
  )
}
