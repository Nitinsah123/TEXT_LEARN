/**
 * Dashboard Page - Main interface for course generation
 * ChatGPT-style interface with sidebar
 */

import { useState, FormEvent, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCourse } from '../context/CourseContext'
import { BookOpen, LogOut, Plus, Trash2, Loader, Search, Share2, Copy, Check, Github } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { courses, generateCourse, saveCourse, fetchCourses, deleteCourse, shareCourse, loading } = useCourse()
  const [topic, setTopic] = useState('')
  const [error, setError] = useState('')
  const [generatedOutline, setGeneratedOutline] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [shareId, setShareId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCourses(searchQuery)
  }, [searchQuery])

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return

    setError('')
    setGeneratedOutline(null)

    try {
      const outline = await generateCourse(topic)
      setGeneratedOutline(outline)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    }
  }

  const handleSave = async () => {
    if (!generatedOutline || saving) return

    try {
      setSaving(true)
      toast.loading('Saving course...', { id: 'save' })
      const saved = await saveCourse(generatedOutline)
      toast.success('Course saved successfully!', { id: 'save' })
      setGeneratedOutline(null)
      setTopic('')
      setTimeout(() => {
        navigate(`/course/${saved.id}/module/0/lesson/0`)
      }, 500)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Save failed'
      toast.error(message, { id: 'save' })
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (courseId: string) => {
    if (confirm('Delete this course?')) {
      try {
        await deleteCourse(courseId)
        toast.success('Course deleted')
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Delete failed'
        toast.error(message)
        setError(message)
      }
    }
  }

  const handleShare = async (courseId: string) => {
    try {
      const id = await shareCourse(courseId)
      setShareId(id)
      toast.success('Share link generated!')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Share failed'
      toast.error(message)
      setError(message)
    }
  }

  const handleCopyShareLink = () => {
    if (shareId) {
      const shareUrl = `${window.location.origin}/share/${shareId}`
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setShareId(null)
      }, 2000)
    }
  }


  return (
    <>
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#1c2128',
          color: '#e6edf3',
          border: '1px solid #30363d',
        },
      }} />
    <div className="flex h-screen bg-[#0d1117]">
      {/* Sidebar */}
      <div className="w-72 bg-[#161b22] border-r border-[#30363d] flex flex-col">
        <div className="p-5 border-b border-[#30363d]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-[#3b82f6]" />
              <span className="font-bold text-xl text-[#e6edf3]">Text2Learn</span>
            </div>
            <a href="https://github.com/DineshDumka/Text2Learn" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#3b82f6] transition-colors" title="View on GitHub">
              <Github className="w-5 h-5" />
            </a>
          </div>
          <div className="text-sm text-[#8b949e]">
            👋 {user?.name}
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-[#30363d]">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8b949e]" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-sm text-[#e6edf3] placeholder-[#8b949e] focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs font-semibold text-[#8b949e] uppercase mb-3 tracking-wider">Your Courses</h3>
          {courses.length === 0 ? (
            <div className="text-center text-[#8b949e] text-sm py-8">
              {searchQuery ? 'No courses found' : 'No courses yet'}
            </div>
          ) : (
            courses.map((course) => (
              <div
                key={course.id}
                className="group p-3 hover:bg-[#21262d] rounded-lg cursor-pointer mb-2 transition-all border border-transparent hover:border-[#30363d]"
                onClick={() => navigate(`/course/${course.id}/module/0/lesson/0`)}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm text-[#8b949e] group-hover:text-[#e6edf3] truncate flex-1">{course.title}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleShare(course.id)
                      }}
                      className="p-1.5 hover:bg-[#21262d] rounded text-[#8b949e] hover:text-[#3b82f6] transition-colors"
                      title="Share course"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(course.id)
                      }}
                      className="p-1.5 hover:bg-[#21262d] rounded text-[#8b949e] hover:text-red-500 transition-colors"
                      title="Delete course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-[#30363d]">
          <button onClick={logout} className="btn-secondary w-full flex items-center justify-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Share Modal */}
      {shareId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShareId(null)}>
          <div className="bg-[#1c2128] border border-[#30363d] rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-[#e6edf3] mb-4">Share Course</h3>
            <p className="text-sm text-[#8b949e] mb-4">Anyone with this link can view the course:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={`${window.location.origin}/share/${shareId}`}
                readOnly
                className="flex-1 px-4 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-sm text-[#e6edf3]"
              />
              <button
                onClick={handleCopyShareLink}
                className="btn-primary flex items-center gap-2 px-4"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          {!generatedOutline ? (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-3 text-[#e6edf3]">
                  Learn Anything, Instantly.
                </h1>
                <p className="text-[#8b949e] text-base">Type a topic. Get a full AI-generated course.</p>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#e6edf3] mb-2">Enter your topic</label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="E.g., React Hooks, Machine Learning Basics, Spanish for Beginners..."
                    className="w-full h-24 p-3 bg-[#21262d] border border-[#30363d] rounded-lg resize-none focus:ring-2 focus:ring-[#3b82f6] outline-none text-[#e6edf3] placeholder-[#8b949e] text-sm"
                    disabled={loading}
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || !topic.trim()}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Generate Course
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="card">
                <h2 className="text-2xl font-bold mb-2 text-[#e6edf3]">{generatedOutline.title}</h2>
                <p className="text-[#8b949e] mb-6 text-sm">{generatedOutline.description}</p>

                <div className="space-y-3">
                  {generatedOutline.modules?.map((module: any, idx: number) => (
                    <div key={idx} className="bg-[#21262d] border border-[#30363d] rounded-lg p-4">
                      <h3 className="font-semibold text-base mb-2 text-[#3b82f6]">
                        Module {idx + 1}: {module.title}
                      </h3>
                      <ul className="list-disc list-inside text-[#8b949e] space-y-1">
                        {module.lessons?.map((lesson: string, lessonIdx: number) => (
                          <li key={lessonIdx} className="text-sm">{lesson}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      'Save & Start Learning'
                    )}
                  </button>
                  <button onClick={() => setGeneratedOutline(null)} className="btn-secondary px-6">
                    New Topic
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export default Dashboard
