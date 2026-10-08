import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../api/AuthContext'

type Dashboard = {
  fullName: string
  activeCourses: number
  averageProgress: number
  certificatesCount: number
  courses: {
    id: string
    courseSlug: string
    courseTitle: string
    instructor: string
    progressPercent: number
    completed: boolean
  }[]
}

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState<Dashboard | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    setName(user.fullName)
    setEmail(user.email)
    api<Dashboard>('/dashboard').then(setData).catch(() => navigate('/login'))
  }, [user, navigate])

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault()
    await api('/dashboard/profile', {
      method: 'PUT',
      body: JSON.stringify({ fullName: name, email }),
    })
    setMsg('Profile saved.')
  }

  if (!data) {
    return (
      <div className="container section">
        <div className="empty">Loading dashboard…</div>
      </div>
    )
  }

  return (
    <div className="dash-layout">
      <aside className="dash-side">
        <p style={{ fontWeight: 800, margin: '0 0 1rem 0.5rem' }}>Student Hub</p>
        <Link to="/dashboard" className="active">
          My Courses
        </Link>
        <Link to="/certificate">Certificates</Link>
        <Link to="/dashboard#progress">Progress</Link>
        <Link to="/dashboard#profile">Profile settings</Link>
        <Link to="/instructor">Instructor Panel</Link>
      </aside>

      <div className="dash-main">
        <span className="eyebrow">Welcome back</span>
        <h1 style={{ fontSize: '1.7rem' }}>{data.fullName}</h1>
        <p>Track courses, certificates, and progress across Prime Digital Academy.</p>

        <div className="stat-row" id="progress">
          <div className="stat">
            <span>Active courses</span>
            <strong>{data.activeCourses}</strong>
          </div>
          <div className="stat">
            <span>Avg. progress</span>
            <strong>{data.averageProgress}%</strong>
          </div>
          <div className="stat">
            <span>Certificates</span>
            <strong>{data.certificatesCount}</strong>
          </div>
        </div>

        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>My Courses</h2>
        {data.courses.length === 0 ? (
          <div className="empty">
            No enrollments yet. <Link to="/courses">Browse courses</Link>
          </div>
        ) : (
          <div className="course-grid">
            {data.courses.map((course) => (
              <article key={course.id} className="course-tile">
                <div className="course-body">
                  <h3>{course.courseTitle}</h3>
                  <div className="meta">
                    <span>
                      Instructor <b>{course.instructor}</b>
                    </span>
                  </div>
                  <div className="progress">
                    <span style={{ width: `${course.progressPercent}%` }} />
                  </div>
                  <div className="price-row">
                    <span style={{ fontWeight: 700 }}>{course.progressPercent}% complete</span>
                    <Link to={`/learn/${course.courseSlug}`} className="btn btn-primary btn-sm">
                      Continue
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <form className="panel" style={{ marginTop: '1.5rem' }} id="profile" onSubmit={saveProfile}>
          <h2 style={{ fontSize: '1.2rem' }}>Profile settings</h2>
          <div className="contact-grid" style={{ marginTop: '1rem' }}>
            <div className="form-field">
              <label htmlFor="name">Full name</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          {msg && <p style={{ color: 'var(--primary)', fontWeight: 700 }}>{msg}</p>}
          <button type="submit" className="btn btn-dark btn-sm">
            Save changes
          </button>
        </form>
      </div>
    </div>
  )
}
