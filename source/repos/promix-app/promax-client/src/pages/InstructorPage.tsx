import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api, mediaUrl, type Course } from '../api/client'
import { useAuth } from '../api/AuthContext'

type Stats = { publishedCourses: number; activeStudents: number; averageCompletion: number }
type Student = {
  fullName: string
  email: string
  course: string
  courseSlug: string
  progressPercent: number
  completed: boolean
  enrolledAt: string
}
type Tab = 'upload' | 'students' | 'manage'

export function InstructorPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'upload'

  const [stats, setStats] = useState<Stats | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedSlug, setSelectedSlug] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [modulesText, setModulesText] = useState('Introduction to the course | Welcome (10 min), Overview (15 min)')
  const [editOverview, setEditOverview] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [moduleTitle, setModuleTitle] = useState('')
  const [lessonTitle, setLessonTitle] = useState('')
  const [uploadBusy, setUploadBusy] = useState(false)

  const setTab = (next: Tab) => {
    setParams({ tab: next })
    setMsg('')
    setError('')
  }

  const refresh = useCallback(async () => {
    const [s, cats, studs, mine] = await Promise.all([
      api<Stats>('/instructor/stats'),
      api<string[]>('/courses/categories', { auth: false }),
      api<Student[]>('/instructor/students'),
      api<Course[]>('/instructor/courses'),
    ])
    setStats(s)
    setCategories(cats)
    setStudents(studs)
    setCourses(mine)
    setSelectedSlug((prev) => prev || mine[0]?.slug || '')
  }, [])

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    refresh().catch((e: Error) => setError(e.message))
  }, [user, navigate, refresh])

  useEffect(() => {
    const course = courses.find((c) => c.slug === selectedSlug)
    if (!course) return
    setEditTitle(course.title)
    setEditOverview(course.overview)
    setEditPrice(course.price === 'Free' ? 'Free' : String(course.price))
  }, [selectedSlug, courses])

  const parseCurriculum = (text: string) =>
    text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [mod, lessonsPart] = line.split('|').map((p) => p.trim())
        const lessons = (lessonsPart || 'Lesson 1 (10 min)')
          .split(',')
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => {
            const match = l.match(/^(.*?)\s*\((.+?)\)\s*$/)
            return match
              ? { title: match[1], duration: match[2] }
              : { title: l, duration: '10 min' }
          })
        return { title: mod || 'Module', lessons }
      })

  const onCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const priceRaw = String(form.get('price') ?? '')
    const price = priceRaw.toLowerCase() === 'free' || priceRaw === '' ? null : Number(priceRaw)
    const skills = String(form.get('skills') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    try {
      setError('')
      const created = await api<Course>('/instructor/courses', {
        method: 'POST',
        body: JSON.stringify({
          title: form.get('title'),
          overview: form.get('overview'),
          duration: form.get('duration'),
          price,
          level: form.get('level'),
          category: form.get('category'),
          mode: form.get('mode'),
          featured: form.get('featured') === 'on',
          skills: skills.length ? skills : ['Practical Skills'],
          instructorBio: form.get('instructorBio'),
          curriculum: parseCurriculum(modulesText),
        }),
      })
      setMsg(`Course published: ${created.slug}`)
      setSelectedSlug(created.slug)
      e.currentTarget.reset()
      await refresh()
      setTab('manage')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish')
    }
  }

  const saveCourse = async () => {
    if (!selectedSlug) return
    try {
      const priceRaw = editPrice
      const body = {
        title: editTitle,
        overview: editOverview,
        isFree: priceRaw.toLowerCase() === 'free',
        price: priceRaw.toLowerCase() === 'free' ? null : Number(priceRaw),
      }
      await api(`/instructor/courses/${selectedSlug}`, { method: 'PUT', body: JSON.stringify(body) })
      setMsg('Course updated.')
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    }
  }

  const deleteCourse = async () => {
    if (!selectedSlug || !confirm(`Delete course ${selectedSlug}?`)) return
    await api(`/instructor/courses/${selectedSlug}`, { method: 'DELETE' })
    setMsg('Course deleted.')
    setSelectedSlug('')
    await refresh()
  }

  const addModule = async () => {
    if (!selectedSlug || !moduleTitle.trim()) return
    const lessons = lessonTitle.trim()
      ? [{ title: lessonTitle.trim(), duration: '15 min' }]
      : [{ title: 'Introduction', duration: '10 min' }]
    await api(`/instructor/courses/${selectedSlug}/modules`, {
      method: 'POST',
      body: JSON.stringify({ title: moduleTitle, lessons }),
    })
    setModuleTitle('')
    setLessonTitle('')
    setMsg('Module added.')
    await refresh()
  }

  const uploadFile = async (file: File, kind: 'material' | 'preview') => {
    if (!selectedSlug) return
    setUploadBusy(true)
    try {
      const body = new FormData()
      body.append('file', file)
      body.append('kind', kind)
      body.append('title', file.name)
      await api(`/instructor/courses/${selectedSlug}/upload`, { method: 'POST', body })
      setMsg(kind === 'preview' ? 'Preview video uploaded.' : 'Material uploaded.')
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploadBusy(false)
    }
  }

  const selected = courses.find((c) => c.slug === selectedSlug)

  return (
    <div className="dash-layout">
      <aside className="dash-side">
        <p style={{ fontWeight: 800, margin: '0 0 1rem 0.5rem' }}>Instructor Panel</p>
        <button type="button" className={tab === 'upload' ? 'active' : ''} onClick={() => setTab('upload')}>
          Upload course
        </button>
        <button type="button" className={tab === 'students' ? 'active' : ''} onClick={() => setTab('students')}>
          Track students
        </button>
        <button type="button" className={tab === 'manage' ? 'active' : ''} onClick={() => setTab('manage')}>
          Manage content
        </button>
        <Link to="/dashboard">Student view</Link>
      </aside>

      <div className="dash-main">
        <span className="eyebrow">Advanced</span>
        <h1 style={{ fontSize: '1.7rem' }}>Instructor workspace</h1>
        <p>Upload courses, manage content, and track learners across Prime Digital Academy.</p>
        <p style={{ fontSize: '0.9rem' }}>
          Instructor demo: ada@primedigitalacademy.com / Instructor@123
        </p>

        {error && <div className="empty">{error}</div>}
        {msg && <p style={{ color: 'var(--primary)', fontWeight: 700 }}>{msg}</p>}

        {stats && (
          <div className="stat-row">
            <div className="stat">
              <span>Published courses</span>
              <strong>{stats.publishedCourses}</strong>
            </div>
            <div className="stat">
              <span>Active students</span>
              <strong>{stats.activeStudents}</strong>
            </div>
            <div className="stat">
              <span>Avg. completion</span>
              <strong>{stats.averageCompletion}%</strong>
            </div>
          </div>
        )}

        {tab === 'upload' && (
          <form className="panel" onSubmit={onCreate}>
            <h2 style={{ fontSize: '1.2rem' }}>Upload a new course</h2>
            <div className="contact-grid" style={{ marginTop: '1rem' }}>
              <div className="form-field">
                <label htmlFor="title">Course title</label>
                <input id="title" name="title" required />
              </div>
              <div className="form-field">
                <label htmlFor="category">Category</label>
                <select id="category" name="category">
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="level">Level</label>
                <select id="level" name="level">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="mode">Mode</label>
                <select id="mode" name="mode">
                  <option>Online</option>
                  <option>Hybrid</option>
                  <option>Physical</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="duration">Duration</label>
                <input id="duration" name="duration" defaultValue="6 Weeks" required />
              </div>
              <div className="form-field">
                <label htmlFor="price">Price (₦) or Free</label>
                <input id="price" name="price" placeholder="Free or 45000" />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="skills">Skills (comma-separated)</label>
              <input id="skills" name="skills" placeholder="Python, Data Cleaning, Visualization" />
            </div>
            <div className="form-field">
              <label htmlFor="overview">Course overview</label>
              <textarea id="overview" name="overview" rows={4} required />
            </div>
            <div className="form-field">
              <label htmlFor="instructorBio">Instructor bio</label>
              <textarea id="instructorBio" name="instructorBio" rows={2} placeholder="Short instructor profile" />
            </div>
            <div className="form-field">
              <label htmlFor="modules">Curriculum (one module per line: Module | Lesson (10 min), Lesson 2 (15 min))</label>
              <textarea id="modules" rows={4} value={modulesText} onChange={(e) => setModulesText(e.target.value)} />
            </div>
            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
              <input type="checkbox" name="featured" /> Featured on homepage
            </label>
            <button type="submit" className="btn btn-primary">
              Publish course
            </button>
          </form>
        )}

        {tab === 'students' && (
          <div className="panel">
            <h2 style={{ fontSize: '1.2rem' }}>Track students</h2>
            {students.length === 0 ? (
              <div className="empty" style={{ marginTop: '1rem' }}>
                No enrollments on your courses yet.
              </div>
            ) : (
              <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
                      <th style={{ padding: '0.6rem' }}>Student</th>
                      <th style={{ padding: '0.6rem' }}>Email</th>
                      <th style={{ padding: '0.6rem' }}>Course</th>
                      <th style={{ padding: '0.6rem' }}>Progress</th>
                      <th style={{ padding: '0.6rem' }}>Status</th>
                      <th style={{ padding: '0.6rem' }}>Enrolled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={`${s.email}-${s.courseSlug}-${s.enrolledAt}`} style={{ borderBottom: '1px solid var(--line)' }}>
                        <td style={{ padding: '0.6rem' }}>{s.fullName}</td>
                        <td style={{ padding: '0.6rem' }}>{s.email}</td>
                        <td style={{ padding: '0.6rem' }}>{s.course}</td>
                        <td style={{ padding: '0.6rem' }}>{s.progressPercent}%</td>
                        <td style={{ padding: '0.6rem' }}>{s.completed ? 'Completed' : 'In progress'}</td>
                        <td style={{ padding: '0.6rem' }}>{new Date(s.enrolledAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'manage' && (
          <div className="panel">
            <h2 style={{ fontSize: '1.2rem' }}>Manage content</h2>
            {courses.length === 0 ? (
              <div className="empty" style={{ marginTop: '1rem' }}>
                No courses yet. Publish one in Upload course.
              </div>
            ) : (
              <>
                <div className="form-field" style={{ marginTop: '1rem' }}>
                  <label htmlFor="courseSelect">Select course</label>
                  <select id="courseSelect" value={selectedSlug} onChange={(e) => setSelectedSlug(e.target.value)}>
                    {courses.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {selected && (
                  <>
                    <div className="contact-grid">
                      <div className="form-field">
                        <label htmlFor="editTitle">Title</label>
                        <input id="editTitle" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                      </div>
                      <div className="form-field">
                        <label htmlFor="editPrice">Price</label>
                        <input id="editPrice" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                      </div>
                    </div>
                    <div className="form-field">
                      <label htmlFor="editOverview">Overview</label>
                      <textarea id="editOverview" rows={3} value={editOverview} onChange={(e) => setEditOverview(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      <button type="button" className="btn btn-primary btn-sm" onClick={saveCourse}>
                        Save changes
                      </button>
                      <Link to={`/courses/${selected.slug}`} className="btn btn-ghost btn-sm">
                        View public page
                      </Link>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={deleteCourse}>
                        Delete course
                      </button>
                    </div>

                    <h3 style={{ fontSize: '1.05rem' }}>Curriculum</h3>
                    {(selected.curriculum ?? []).map((m) => (
                      <div key={m.id} className="module">
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                          <h4>{m.title}</h4>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={async () => {
                              await api(`/instructor/courses/${selected.slug}/modules/${m.id}`, { method: 'DELETE' })
                              setMsg('Module removed.')
                              await refresh()
                            }}
                          >
                            Remove
                          </button>
                        </div>
                        {m.lessons.map((l) => (
                          <div key={l.id} className="lesson">
                            <span>{l.title}</span>
                            <span>{l.duration}</span>
                          </div>
                        ))}
                      </div>
                    ))}

                    <div className="contact-grid" style={{ marginTop: '1rem' }}>
                      <div className="form-field">
                        <label htmlFor="moduleTitle">New module title</label>
                        <input id="moduleTitle" value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} />
                      </div>
                      <div className="form-field">
                        <label htmlFor="lessonTitle">First lesson title</label>
                        <input id="lessonTitle" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} />
                      </div>
                    </div>
                    <button type="button" className="btn btn-dark btn-sm" onClick={addModule}>
                      Add module
                    </button>

                    <h3 style={{ fontSize: '1.05rem', marginTop: '1.5rem' }}>Uploads</h3>
                    <div className="contact-grid">
                      <div className="form-field">
                        <label htmlFor="materialFile">Course material (PDF, ZIP, etc.)</label>
                        <input
                          id="materialFile"
                          type="file"
                          disabled={uploadBusy}
                          onChange={(e) => {
                            const f = e.target.files?.[0]
                            if (f) void uploadFile(f, 'material')
                            e.currentTarget.value = ''
                          }}
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="previewFile">Preview / lesson video</label>
                        <input
                          id="previewFile"
                          type="file"
                          accept="video/*,image/*"
                          disabled={uploadBusy}
                          onChange={(e) => {
                            const f = e.target.files?.[0]
                            if (f) void uploadFile(f, 'preview')
                            e.currentTarget.value = ''
                          }}
                        />
                      </div>
                    </div>
                    {(selected.materials ?? []).length > 0 && (
                      <ul>
                        {selected.materials!.map((m) => (
                          <li key={m.id}>
                            <a href={mediaUrl(m.fileUrl)} target="_blank" rel="noreferrer">
                              {m.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                    {selected.previewVideoUrl && (
                      <p style={{ fontSize: '0.9rem' }}>
                        Preview file: <a href={mediaUrl(selected.previewVideoUrl)}>{selected.previewVideoUrl}</a>
                      </p>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
