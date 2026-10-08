import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../api/AuthContext'
import { api } from '../api/client'

export function LoginPage() {
  const { login, googleSignIn } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [resetMsg, setResetMsg] = useState('')
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setBusy(true)
    setError('')
    try {
      await login(String(form.get('email')), String(form.get('password')))
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  const resetPassword = async () => {
    const email = (document.getElementById('email') as HTMLInputElement)?.value
    if (!email) {
      setResetMsg('Enter your email first.')
      return
    }
    try {
      const res = await api<{ message: string; token?: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
        auth: false,
      })
      setResetMsg(res.message)
    } catch (err) {
      setResetMsg(err instanceof Error ? err.message : 'Reset failed')
    }
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={onSubmit}>
        <span className="eyebrow">Authentication</span>
        <h1 style={{ fontSize: '1.6rem' }}>Sign in</h1>
        <p>Access your courses, progress, and certificates.</p>
        <p style={{ fontSize: '0.85rem' }}>Demo: alex@example.com / Student@123</p>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required placeholder="you@email.com" />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required placeholder="••••••••" />
        </div>
        {error && <p style={{ color: 'crimson', fontWeight: 600 }}>{error}</p>}
        {resetMsg && <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>{resetMsg}</p>}
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
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
          <Link to="/signup" style={{ color: 'var(--secondary)', fontWeight: 700 }}>
            Create an account
          </Link>
          {' · '}
          <button type="button" onClick={resetPassword} style={{ background: 'none', border: 'none', color: 'var(--secondary)', fontWeight: 700, cursor: 'pointer' }}>
            Reset password
          </button>
        </p>
      </form>
    </div>
  )
}
