import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { formatPrice } from '../components/CourseCard'
import { api, type Course } from '../api/client'
import { useAuth } from '../api/AuthContext'

export function CourseDetailPage() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [paystackReady, setPaystackReady] = useState(false)
  const confirming = useRef(false)

  useEffect(() => {
    if (!slug) return
    api<Course>(`/courses/${slug}`, { auth: false })
      .then(setCourse)
      .catch((e: Error) => setError(e.message))
  }, [slug])

  useEffect(() => {
    api<{ configured: boolean }>('/payments/paystack/config', { auth: false })
      .then((c) => setPaystackReady(c.configured))
      .catch(() => setPaystackReady(false))
  }, [])

  // Paystack redirects back with ?reference=...&trxref=...
  useEffect(() => {
    const reference = params.get('reference') || params.get('trxref') || params.get('ref')
    const provider = params.get('provider')
    if (!reference || !slug || !user || confirming.current) return
    if (provider && provider.toLowerCase() !== 'paystack' && !params.get('trxref') && !params.get('reference')) return

    confirming.current = true
    setBusy(true)
    setMessage('Verifying Paystack payment…')
    api(`/payments/confirm/${slug}`, {
      method: 'POST',
      body: JSON.stringify({ paymentProvider: 'Paystack', paymentReference: reference }),
    })
      .then(() => navigate(`/learn/${slug}`, { replace: true }))
      .catch((e: Error) => {
        setMessage(e.message)
        confirming.current = false
      })
      .finally(() => setBusy(false))
  }, [params, slug, user, navigate])

  const enroll = async (provider: 'Free' | 'Paystack') => {
    if (!slug) return
    if (!user) {
      navigate('/login')
      return
    }
    setBusy(true)
    setMessage('')
    try {
      if (course && course.price !== 'Free' && course.price !== 0 && provider === 'Paystack') {
        const callbackUrl = `${window.location.origin}/courses/${slug}?provider=paystack`
        const payment = await api<{ authorizationUrl: string; reference: string }>(`/payments/initialize/${slug}`, {
          method: 'POST',
          body: JSON.stringify({ provider: 'Paystack', callbackUrl }),
        })
        window.location.href = payment.authorizationUrl
        return
      }
      await api(`/enrollments/courses/${slug}`, {
        method: 'POST',
        body: JSON.stringify({ paymentProvider: 'Free' }),
      })
      navigate(`/learn/${slug}`)
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Enrollment failed')
    } finally {
      setBusy(false)
    }
  }

  if (error) {
    return (
      <div className="container section">
        <div className="empty">{error}</div>
        <Link to="/courses" className="btn btn-dark" style={{ marginTop: '1rem' }}>
          Back to Courses
        </Link>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container section">
        <div className="empty">Loading course…</div>
      </div>
    )
  }

  const isFree = course.price === 'Free' || course.price === 0

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: 'var(--secondary)' }}>
            {course.category} · {course.level}
          </span>
          <h1>{course.title}</h1>
          <p>{course.overview}</p>
        </div>
      </section>

      <div className="container detail-layout">
        <div>
          <div className="video-preview">
            <button type="button" className="play-btn" aria-label="Play preview">
              ▶
            </button>
          </div>

          <h2>Course overview</h2>
          <p>{course.overview}</p>
          <div className="meta">
            <span>
              Duration <b>{course.duration}</b>
            </span>
            <span>
              Mode <b>{course.mode}</b>
            </span>
            <span>
              Students <b>{course.students.toLocaleString()}</b>
            </span>
            <span className="rating">
              {course.rating} ({course.reviews} reviews)
            </span>
          </div>

          <h2 style={{ marginTop: '2rem' }}>Instructor</h2>
          <div className="panel" style={{ marginTop: '0.75rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>{course.instructor}</h3>
            <p style={{ color: 'var(--secondary)', fontWeight: 700, marginBottom: '0.5rem' }}>
              {course.instructorRole}
            </p>
            <p style={{ marginBottom: 0 }}>{course.instructorBio}</p>
          </div>

          <h2 style={{ marginTop: '2rem' }}>Curriculum</h2>
          <div className="panel" style={{ marginTop: '0.75rem' }}>
            {(course.curriculum ?? []).map((mod) => (
              <div key={mod.id} className="module">
                <h4>{mod.title}</h4>
                {mod.lessons.map((lesson) => (
                  <div key={lesson.id} className="lesson">
                    <span>{lesson.title}</span>
                    <span>{lesson.duration}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <aside>
          <div className="panel sticky-card enroll-box">
            <span className="eyebrow">Enroll</span>
            <div className="price">{formatPrice(course.price)}</div>
            <p style={{ fontSize: '0.92rem' }}>
              Secure checkout with <b>Paystack</b>. After payment you get instant access to the learning dashboard.
            </p>
            {message && <p style={{ color: 'crimson', fontWeight: 600 }}>{message}</p>}
            {isFree ? (
              <button type="button" className="btn btn-primary" disabled={busy} onClick={() => enroll('Free')}>
                {busy ? 'Enrolling…' : 'Enroll Free'}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                disabled={busy || !paystackReady}
                onClick={() => enroll('Paystack')}
              >
                {busy ? 'Redirecting to Paystack…' : 'Pay with Paystack'}
              </button>
            )}
            {!isFree && !paystackReady && (
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                Paystack is not configured yet. Add your keys in the API <code>appsettings.json</code> under{' '}
                <code>Paystack</code>.
              </p>
            )}
            {!user && (
              <Link to="/signup" className="btn btn-ghost">
                Create Account First
              </Link>
            )}
            <div className="meta" style={{ marginTop: '1rem' }}>
              <span>
                Includes <b>certificate</b>
              </span>
              <span>
                Includes <b>quizzes & materials</b>
              </span>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
