import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../api/AuthContext'

export function SignupPage() {
  const { register, googleSignIn } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setBusy(true)
    setError('')
    try {
      await register(
        String(form.get('name')),
        String(form.get('email')),
        String(form.get('password')),
        String(form.get('phone') || '') || undefined,
      )
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={onSubmit}>
        <span className="eyebrow">Join the Academy</span>
        <h1 style={{ fontSize: '1.6rem' }}>Create your account</h1>
        <p>Sign up for Prime Digital Academy — powered by Prime Innovation Network.</p>

        <div className="form-field">
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" required />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className="form-field">
          <label htmlFor="phone">Phone (Nigeria)</label>
          <input id="phone" name="phone" type="tel" placeholder="0803xxxxxxx" />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required minLength={8} />
        </div>
        {error && <p style={{ color: 'crimson', fontWeight: 600 }}>{error}</p>}
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={busy}>
          {busy ? 'Creating…' : 'Sign up'}
        </button>

        <div className="divider">or</div>
        <button
          type="button"
          className="btn btn-ghost"
          style={{ width: '100%' }}
          onClick={async () => {
            try {
              await googleSignIn('Google User', 'google.user@example.com')
              navigate('/dashboard')
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Google sign-in failed')
            }
          }}
        >
          Continue with Google
        </button>

        <p style={{ marginTop: '1rem', fontSize: '0.92rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--secondary)', fontWeight: 700 }}>
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
