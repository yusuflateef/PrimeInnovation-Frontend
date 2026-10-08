import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, mediaUrl, type Course } from '../api/client'
import { useAuth } from '../api/AuthContext'

const tabs = ['Notes', 'Materials', 'Assignments', 'Quiz'] as const

export function LearnPage() {
  const { slug } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState<Course | null>(null)
  const [progress, setProgress] = useState(0)
  const [completed, setCompleted] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [tab, setTab] = useState<(typeof tabs)[number]>('Notes')
  const [quizMsg, setQuizMsg] = useState('')
  const [error, setError] = useState('')
  const [activeLesson, setActiveLesson] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    if (!slug) return
    api<{
      enrollment: { progressPercent: number }
      course: Course
      completedLessonIds: string[]
      notes: { content: string }[]
    }>(`/enrollments/courses/${slug}`)
      .then((data) => {
        setCourse(data.course)
        setProgress(data.enrollment.progressPercent)
        setCompleted(data.completedLessonIds)
        setNotes(data.notes[0]?.content ?? '')
        const first = data.course.curriculum?.[0]?.lessons[0]?.id
        setActiveLesson(first ?? null)
      })
      .catch((e: Error) => setError(e.message))
  }, [slug, user, navigate])

  const markComplete = async (lessonId: string) => {
    if (!slug) return
    const res = await api<{ progressPercent: number }>(`/learn/${slug}/progress`, {
      method: 'POST',
      body: JSON.stringify({ lessonId, completed: true }),
    })
    setProgress(res.progressPercent)
    setCompleted((prev) => (prev.includes(lessonId) ? prev : [...prev, lessonId]))
  }

  const saveNotes = async () => {
    if (!slug) return
    await api(`/learn/${slug}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content: notes, lessonId: activeLesson }),
    })
  }

  if (error) {
    return (
      <div className="container section">
        <div className="empty">{error}</div>
        <Link to={`/courses/${slug}`} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Enroll first
        </Link>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container section">
        <div className="empty">Loading learning portal…</div>
      </div>
    )
  }

  return (
    <div className="dash-layout">
      <aside className="dash-side">
        <p style={{ fontWeight: 800, margin: '0 0 1rem 0.5rem' }}>Learning Portal</p>
        <Link to="/dashboard">My Courses</Link>
        <Link to={`/learn/${course.slug}`} className="active">
          Current Course
        </Link>
        <Link to="/certificate">Certificate</Link>
        <Link to="/dashboard">Profile</Link>
      </aside>

      <div className="dash-main">
        <span className="eyebrow">Prime Digital Academy</span>
        <h1 style={{ fontSize: '1.6rem' }}>{course.title}</h1>
        <p>
          Instructor: <b style={{ color: 'var(--ink)' }}>{course.instructor}</b>
        </p>

        <div style={{ maxWidth: 420, marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
            <span>Course progress</span>
            <span>{progress}%</span>
          </div>
          <div className="progress">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="learn-grid">
          <div>
            <div className="player">
              <div style={{ textAlign: 'center' }}>
                <button type="button" className="play-btn">
                  ▶
                </button>
                <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '1rem' }}>
                  Video player · {activeLesson ? 'Lesson in progress' : 'Select a lesson'}
                </p>
                {activeLesson && (
                  <button
                    type="button"
                    className="btn btn-gold btn-sm"
                    style={{ marginTop: '0.75rem' }}
                    onClick={() => markComplete(activeLesson)}
                  >
                    Mark lesson complete
                  </button>
                )}
              </div>
            </div>

            <div className="tabs">
              {tabs.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`chip ${tab === t ? 'active' : ''}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === 'Notes' && (
              <>
                <textarea className="note-box" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Write your lesson notes here..." />
                <button type="button" className="btn btn-dark btn-sm" style={{ marginTop: '0.75rem' }} onClick={saveNotes}>
                  Save notes
                </button>
              </>
            )}
            {tab === 'Materials' && (
              <div className="panel">
                <p>Downloadable materials for this module:</p>
                {(course.materials ?? []).map((m) => (
                  <a
                    key={m.id}
                    href={mediaUrl(m.fileUrl)}
                    className="btn btn-dark btn-sm"
                    style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download {m.title}
                  </a>
                ))}
              </div>
            )}
            {tab === 'Assignments' && (
              <div className="panel">
                {(course.assignments ?? []).map((a) => (
                  <div key={a.id} style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.05rem' }}>{a.title}</h3>
                    <p>{a.description}</p>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={async () => {
                        await api(`/learn/${slug}/assignments/${a.id}`, {
                          method: 'POST',
                          body: JSON.stringify({ content: 'Submitted via learning portal' }),
                        })
                        alert('Assignment submitted.')
                      }}
                    >
                      Submit assignment
                    </button>
                  </div>
                ))}
              </div>
            )}
            {tab === 'Quiz' && (
              <div className="quiz-box panel">
                {(course.quiz ?? []).map((q) => (
                  <div key={q.id}>
                    <h3 style={{ fontSize: '1.05rem' }}>Quick check</h3>
                    <p>{q.question}</p>
                    {q.options.map((opt, idx) => (
                      <label key={opt} style={{ display: 'block', marginBottom: '0.4rem' }}>
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          onChange={async () => {
                            const res = await api<{ correct: boolean; message: string }>(`/learn/${slug}/quiz`, {
                              method: 'POST',
                              body: JSON.stringify({ questionId: q.id, selectedOptionIndex: idx }),
                            })
                            setQuizMsg(res.message)
                          }}
                        />{' '}
                        {opt}
                      </label>
                    ))}
                    {quizMsg && <p style={{ fontWeight: 700, color: 'var(--primary)' }}>{quizMsg}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="panel">
            <h3 style={{ fontSize: '1.05rem' }}>Curriculum</h3>
            {(course.curriculum ?? []).map((mod) => (
              <div key={mod.id} className="module">
                <h4>{mod.title}</h4>
                {mod.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    type="button"
                    className="lesson"
                    style={{
                      width: '100%',
                      background: activeLesson === lesson.id ? 'var(--secondary-soft)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                    onClick={() => setActiveLesson(lesson.id)}
                  >
                    <span>
                      {completed.includes(lesson.id) ? '✓ ' : ''}
                      {lesson.title}
                    </span>
                    <span>{lesson.duration}</span>
                  </button>
                ))}
              </div>
            ))}
            <Link to="/certificate" className="btn btn-gold btn-sm" style={{ marginTop: '1rem', width: '100%' }}>
              View certificate path
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
