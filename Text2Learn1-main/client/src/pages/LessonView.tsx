/**
 * Lesson View Page - Enhanced Learning Experience
 * Features: Sidebar navigation, Progress tracking, YouTube integration, Lesson navigation
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCourse } from '../context/CourseContext'
import { 
  BookOpen, ChevronLeft, Loader, Menu, X, 
  CheckCircle, Circle, PlayCircle, ArrowLeft, ArrowRight, Globe 
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const LessonView = () => {
  const { courseId, moduleIndex, lessonIndex } = useParams()
  const navigate = useNavigate()
  const { currentCourse, fetchCourse, generateLesson, loading, translateCourse } = useCourse()
  const [lessonContent, setLessonContent] = useState<any>(null)
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [currentLessonComplete, setCurrentLessonComplete] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [translating, setTranslating] = useState(false)

  useEffect(() => {
    if (courseId) {
      fetchCourse(courseId)
      loadProgress()
    }
  }, [courseId])

  // Load saved progress from localStorage
  const loadProgress = () => {
    const saved = localStorage.getItem(`progress_${courseId}`)
    if (saved) {
      setCompletedLessons(new Set(JSON.parse(saved)))
    }
  }

  // Save progress to localStorage
  const saveProgress = (lessonKey: string) => {
    const updated = new Set(completedLessons)
    updated.add(lessonKey)
    setCompletedLessons(updated)
    localStorage.setItem(`progress_${courseId}`, JSON.stringify([...updated]))
  }

  const loadLesson = async () => {
    if (!currentCourse || moduleIndex === undefined || lessonIndex === undefined) return

    const module = currentCourse.outline.modules[Number(moduleIndex)]
    const lessonTitle = module?.lessons[Number(lessonIndex)]

    if (!lessonTitle) return

    // Check if current lesson is completed
    const lessonKey = `${moduleIndex}-${lessonIndex}`
    setCurrentLessonComplete(completedLessons.has(lessonKey))

    try {
      const content = await generateLesson({
        courseTitle: currentCourse.title,
        moduleTitle: module.title,
        lessonTitle,
      })
      setLessonContent(content)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lesson')
    }
  }

  useEffect(() => {
    if (currentCourse) {
      loadLesson()
    }
  }, [currentCourse, moduleIndex, lessonIndex])

  // Calculate progress
  const calculateProgress = () => {
    if (!currentCourse) return 0
    const totalLessons = currentCourse.outline.modules.reduce(
      (sum: number, module: any) => sum + module.lessons.length,
      0
    )
    return Math.round((completedLessons.size / totalLessons) * 100)
  }

  // Mark lesson as complete
  const markComplete = () => {
    const lessonKey = `${moduleIndex}-${lessonIndex}`
    saveProgress(lessonKey)
    setCurrentLessonComplete(true)
  }

  // Navigate to next lesson
  const goToNextLesson = () => {
    if (!currentCourse) return
    const currentModIdx = Number(moduleIndex)
    const currentLesIdx = Number(lessonIndex)
    const currentModule = currentCourse.outline.modules[currentModIdx]
    
    if (currentLesIdx < currentModule.lessons.length - 1) {
      navigate(`/course/${courseId}/module/${currentModIdx}/lesson/${currentLesIdx + 1}`)
    } else if (currentModIdx < currentCourse.outline.modules.length - 1) {
      navigate(`/course/${courseId}/module/${currentModIdx + 1}/lesson/0`)
    }
  }

  // Navigate to previous lesson
  const goToPreviousLesson = () => {
    if (!currentCourse) return
    const currentModIdx = Number(moduleIndex)
    const currentLesIdx = Number(lessonIndex)
    
    if (currentLesIdx > 0) {
      navigate(`/course/${courseId}/module/${currentModIdx}/lesson/${currentLesIdx - 1}`)
    } else if (currentModIdx > 0) {
      const prevModule = currentCourse.outline.modules[currentModIdx - 1]
      navigate(`/course/${courseId}/module/${currentModIdx - 1}/lesson/${prevModule.lessons.length - 1}`)
    }
  }

  const canGoNext = () => {
    if (!currentCourse) return false
    const currentModIdx = Number(moduleIndex)
    const currentLesIdx = Number(lessonIndex)
    const currentModule = currentCourse.outline.modules[currentModIdx]
    return currentLesIdx < currentModule.lessons.length - 1 || 
           currentModIdx < currentCourse.outline.modules.length - 1
  }

  const canGoPrevious = () => {
    const currentModIdx = Number(moduleIndex)
    const currentLesIdx = Number(lessonIndex)
    return currentModIdx > 0 || currentLesIdx > 0
  }

  const handleTranslate = async (language: string) => {
    if (!courseId) return
    
    const languageNames: Record<string, string> = {
      en: 'English',
      hi: 'Hindi',
      es: 'Spanish',
      fr: 'French',
      de: 'German'
    }
    
    try {
      setTranslating(true)
      setShowLanguageMenu(false)
      toast.loading(`Translating to ${languageNames[language]}...`, { id: 'translate' })
      await translateCourse(courseId, language)
      setLessonContent(null) // Reset to reload translated content
      toast.success(`Course translated to ${languageNames[language]}!`, { id: 'translate' })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Translation failed'
      setError(errorMsg)
      toast.error(errorMsg, { id: 'translate' })
    } finally {
      setTranslating(false)
    }
  }

  if (!currentCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  const progress = calculateProgress()
  const currentModule = currentCourse.outline.modules[Number(moduleIndex)]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Fixed/Sticky */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-[#161b22] border-r border-[#30363d] transition-all duration-300 overflow-hidden fixed left-0 top-0 h-screen z-30 lg:sticky lg:top-0`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-[#30363d] flex items-center justify-between">
            <h3 className="font-bold text-base text-[#e6edf3]">Course Outline</h3>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden hover:bg-gray-100 p-1 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Sidebar Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
          {currentCourse.outline.modules.map((module: any, modIdx: number) => (
            <div key={modIdx} className="mb-4">
              <h4 className="font-semibold text-xs text-[#8b949e] mb-2">
                Module {modIdx + 1}: {module.title}
              </h4>
              <div className="space-y-1">
                {module.lessons.map((lesson: string, lesIdx: number) => {
                  const lessonKey = `${modIdx}-${lesIdx}`
                  const isCompleted = completedLessons.has(lessonKey)
                  const isCurrent = modIdx === Number(moduleIndex) && lesIdx === Number(lessonIndex)
                  
                  return (
                    <button
                      key={lesIdx}
                      onClick={() => navigate(`/course/${courseId}/module/${modIdx}/lesson/${lesIdx}`)}
                      className={`w-full text-left p-2 rounded text-xs flex items-center gap-2 transition-colors ${
                        isCurrent 
                          ? 'bg-[#3b82f6]/20 text-[#3b82f6] font-medium' 
                          : isCompleted
                          ? 'text-green-500 hover:bg-[#21262d]'
                          : 'text-[#8b949e] hover:bg-[#21262d]'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 flex-shrink-0" />
                      )}
                      <span className="truncate">{lesson}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen ${sidebarOpen ? 'lg:ml-0' : ''}`}>
        {/* Header */}
        <header className="bg-[#1a1f26] border-b border-gray-800 sticky top-0 z-10">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                {!sidebarOpen && (
                  <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-300">
                    <Menu className="w-6 h-6" />
                  </button>
                )}
                <button onClick={() => navigate('/dashboard')} className="btn-secondary flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Back to Dashboard
                </button>
              </div>
              
              {/* Translation Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  disabled={translating}
                  className="btn-secondary flex items-center gap-2"
                  title="Translate Course"
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">{translating ? 'Translating...' : 'Translate'}</span>
                </button>
                
                {showLanguageMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1c2128] border border-[#30363d] rounded-lg shadow-xl py-2 z-20">
                    {[
                      { code: 'en', name: 'English', flag: '🇺🇸' },
                      { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
                      { code: 'es', name: 'Spanish', flag: '🇪🇸' },
                      { code: 'fr', name: 'French', flag: '🇫🇷' },
                      { code: 'de', name: 'German', flag: '🇩🇪' }
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleTranslate(lang.code)}
                        className="w-full text-left px-4 py-2 hover:bg-[#21262d] text-[#e6edf3] flex items-center gap-2 transition-colors text-sm"
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-[#3b82f6]" />
              <div className="flex-1">
                <h1 className="font-bold text-base text-[#e6edf3]">{currentCourse.title}</h1>
                <p className="text-xs text-[#8b949e]">
                  Module {Number(moduleIndex) + 1} - {currentModule?.title}
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#8b949e]">Course Progress</span>
                <span className="font-semibold text-[#3b82f6]">{progress}%</span>
              </div>
              <div className="w-full bg-[#21262d] rounded-full h-1.5">
                <div 
                  className="bg-[#3b82f6] h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Lesson Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader className="w-8 h-8 animate-spin text-primary-600" />
              </div>
            ) : lessonContent ? (
              <div className="card">
                {/* Lesson Title */}
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2 text-[#e6edf3]">{lessonContent.title}</h2>
                  {lessonContent.estimatedMinutes && (
                    <p className="text-[#8b949e] text-sm">
                      ⏱️ Estimated time: {lessonContent.estimatedMinutes} minutes
                    </p>
                  )}
                </div>

                {/* Learning Objectives */}
                {lessonContent.objectives && (
                  <div className="bg-[#1c2128] border border-[#3b82f6]/30 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold mb-2 flex items-center gap-2 text-[#3b82f6]">
                      <PlayCircle className="w-5 h-5" />
                      Learning Objectives:
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-[#e6edf3]">
                      {lessonContent.objectives.map((obj: string, idx: number) => (
                        <li key={idx}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Lesson Content Blocks */}
                <div className="space-y-4">
                  {lessonContent.content?.map((block: any, idx: number) => (
                    <ContentBlock key={idx} block={block} />
                  ))}
                </div>

                {/* Mark Complete Button */}
                {!currentLessonComplete && (
                  <div className="mt-8 p-4 bg-[#1c2128] border border-[#30363d] rounded-lg">
                    <button
                      onClick={markComplete}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Mark as Complete
                    </button>
                  </div>
                )}

                {currentLessonComplete && (
                  <div className="mt-8 p-4 bg-green-900/20 border border-green-500/30 rounded-lg text-center">
                    <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-green-300 font-semibold">✅ Lesson Completed!</p>
                  </div>
                )}
              </div>
            ) : error ? (
              <div className="card text-center text-red-600">{error}</div>
            ) : null}

            {/* Navigation Buttons */}
            {lessonContent && (
              <div className="flex items-center justify-between mt-8 gap-4">
                <button
                  onClick={goToPreviousLesson}
                  disabled={!canGoPrevious()}
                  className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous Lesson
                </button>
                <button
                  onClick={goToNextLesson}
                  disabled={!canGoNext()}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Lesson
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

// Component to render different content block types
const ContentBlock = ({ block }: { block: any }) => {
  switch (block.type) {
    case 'heading':
      const HeadingTag = `h${block.level || 2}` as keyof JSX.IntrinsicElements
      return <HeadingTag className="text-2xl font-bold mt-6 mb-3 text-[#e6edf3]">{block.text}</HeadingTag>

    case 'paragraph':
      return <p className="text-[#e6edf3] leading-relaxed mb-4">{block.text}</p>

    case 'code':
      return (
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <code>{block.text}</code>
        </pre>
      )

    case 'list':
      const ListTag = block.ordered ? 'ol' : 'ul'
      return (
        <ListTag className={block.ordered ? 'list-decimal list-inside space-y-2 mb-4' : 'list-disc list-inside space-y-2 mb-4'}>
          {block.items?.map((item: string, idx: number) => (
            <li key={idx} className="text-[#e6edf3]">{item}</li>
          ))}
        </ListTag>
      )

    case 'video':
      return <VideoBlock query={block.query} />

    case 'mcq':
      return <MCQBlock block={block} />

    default:
      return null
  }
}

// Enhanced Video Block with YouTube Integration
const VideoBlock = ({ query }: { query: string }) => {
  const [videoId, setVideoId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        // Extract YouTube video ID from query
        // For now, we'll use a search to find relevant video
        const response = await axios.get(`/api/youtube/search`, {
          params: { q: query }
        })
        
        if (response.data.success && response.data.data.length > 0) {
          setVideoId(response.data.data[0].videoId)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error('Failed to fetch video:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchVideo()
  }, [query])

  if (loading) {
    return (
      <div className="my-6 bg-[#1c2128] h-64 flex items-center justify-center rounded-lg border border-[#30363d]">
        <Loader className="w-6 h-6 animate-spin text-[#3b82f6]" />
      </div>
    )
  }

  if (error || !videoId) {
    // Create YouTube search URL
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
    
    return (
      <div className="my-6 bg-[#1c2128] border border-[#30363d] p-6 rounded-lg">
        <div className="flex items-start gap-4">
          <PlayCircle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h4 className="font-semibold text-[#e6edf3] mb-2">📹 Recommended Video</h4>
            <p className="text-[#8b949e] mb-3">
              Search YouTube for: <span className="font-medium text-[#e6edf3]">"{query}"</span>
            </p>
            <a
              href={youtubeSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              Search on YouTube
            </a>
            <p className="text-xs text-[#8b949e] mt-3">
              💡 Tip: YouTube integration requires a valid API key in the backend
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="my-6">
      <div className="bg-black rounded-lg overflow-hidden">
        <iframe
          width="100%"
          height="400"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={query}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full"
        />
      </div>
      <p className="text-sm text-[#8b949e] mt-2">📹 {query}</p>
    </div>
  )
}

// MCQ Component
const MCQBlock = ({ block }: { block: any }) => {
  const [selected, setSelected] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)

  return (
    <div className="border-2 border-[#3b82f6]/30 rounded-lg p-6 my-6 bg-[#1c2128]">
      <h4 className="font-semibold mb-4 text-[#e6edf3]">📝 {block.question}</h4>
      <div className="space-y-2">
        {block.options?.map((option: any, idx: number) => (
          <button
            key={idx}
            onClick={() => {
              setSelected(idx)
              setShowAnswer(true)
            }}
            className={`w-full text-left p-3 rounded border-2 transition-colors ${
              showAnswer && option.isCorrect
                ? 'bg-green-900/30 border-green-500 text-green-200'
                : showAnswer && selected === idx && !option.isCorrect
                ? 'bg-red-900/30 border-red-500 text-red-200'
                : 'bg-[#1c2128] border-[#30363d] text-[#e6edf3] hover:border-[#3b82f6]'
            }`}
            disabled={showAnswer}
          >
            {option.text}
          </button>
        ))}
      </div>
      {showAnswer && block.explanation && (
        <div className="mt-4 p-3 bg-[#1c2128] rounded border border-[#3b82f6]/30">
          <p className="text-sm font-semibold text-[#e6edf3]">💡 Explanation:</p>
          <p className="text-sm text-[#8b949e] mt-1">{block.explanation}</p>
        </div>
      )}
    </div>
  )
}

export default LessonView
