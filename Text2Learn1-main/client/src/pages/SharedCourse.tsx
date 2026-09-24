/**
 * SharedCourse Page
 * Public view of shared courses (no auth required)
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCourse } from '../context/CourseContext'
import { BookOpen, Loader, ArrowLeft, ExternalLink, Github } from 'lucide-react'
import type { Course } from '../types'

const SharedCourse = () => {
  const { shareId } = useParams<{ shareId: string }>()
  const navigate = useNavigate()
  const { fetchSharedCourse } = useCourse()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSharedCourse = async () => {
      if (!shareId) return
      
      try {
        setLoading(true)
        const data = await fetchSharedCourse(shareId)
        setCourse(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load shared course')
      } finally {
        setLoading(false)
      }
    }

    loadSharedCourse()
  }, [shareId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#3b82f6] animate-spin mx-auto mb-4" />
          <p className="text-[#8b949e]">Loading shared course...</p>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-2">Course Not Found</h2>
          <p className="text-[#8b949e] mb-6">{error || 'This course may have been removed or the link is invalid.'}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go to Homepage
          </button>
        </div>
      </div>
    )
  }

  const outline = course.outline as any

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Header */}
      <header className="bg-[#161b22] border-b border-[#30363d] sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-[#3b82f6]" />
              <span className="font-bold text-lg text-[#e6edf3]">Text2Learn</span>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://github.com/DineshDumka/Text2Learn" target="_blank" rel="noopener noreferrer" className="text-[#8b949e] hover:text-[#3b82f6] transition-colors" title="View on GitHub">
                <Github className="w-5 h-5" />
              </a>
              <button onClick={() => navigate('/')} className="btn-secondary flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button onClick={() => navigate('/signup')} className="btn-primary flex items-center gap-2">
                Create Your Own
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Course Header */}
          <div className="card mb-8">
            <div className="mb-4 inline-block px-3 py-1 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-full text-[#3b82f6] text-xs">
              Shared Course
            </div>
            <h1 className="text-3xl font-bold text-[#e6edf3] mb-3">{outline.title || course.title}</h1>
            <p className="text-base text-[#8b949e] mb-4">{outline.description || course.description}</p>
            <div className="flex items-center gap-4 text-sm text-[#8b949e]">
              <span>📚 {outline.modules?.length || 0} Modules</span>
              <span>•</span>
              <span>Shared by a Text2Learn user</span>
            </div>
          </div>

          {/* Modules */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#e6edf3] mb-4">Course Outline</h2>
            {outline.modules?.map((module: any, idx: number) => (
              <div key={idx} className="card">
                <h3 className="text-lg font-semibold text-[#3b82f6] mb-3">
                  Module {idx + 1}: {module.title}
                </h3>
                <p className="text-[#8b949e] mb-4 text-sm">{module.description}</p>
                <ul className="space-y-2">
                  {module.lessons?.map((lesson: string, lessonIdx: number) => (
                    <li key={lessonIdx} className="flex items-start gap-2 text-[#8b949e]">
                      <span className="text-[#3b82f6] mt-1">→</span>
                      <span className="text-sm">{lesson}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 bg-[#1c2128] border border-[#30363d] rounded-lg p-8 text-center">
            <h3 className="text-xl font-bold text-[#e6edf3] mb-3">Want to create your own course?</h3>
            <p className="text-[#8b949e] mb-6 text-sm">Join Text2Learn and generate unlimited AI-powered courses for free</p>
            <button onClick={() => navigate('/signup')} className="btn-primary px-6 py-3">
              Sign Up Free
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SharedCourse
