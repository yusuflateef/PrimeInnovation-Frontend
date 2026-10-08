import { NavLink, Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../api/AuthContext'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const close = () => setOpen(false)

  return (
    <header className={`nav ${open ? 'open' : ''}`}>
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={close}>
          <img src="/logo.png" alt="Prime Innovation Network logo" />
          <div className="brand-text">
            <strong>PRIME</strong>
            <span>Innovation Network</span>
          </div>
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>

        <nav className="nav-links" aria-label="Primary">
          <NavLink to="/" end onClick={close}>
            Home
          </NavLink>
          <NavLink to="/courses" onClick={close}>
            Courses
          </NavLink>
          <NavLink to="/about" onClick={close}>
            About
          </NavLink>
          <NavLink to="/blog" onClick={close}>
            Blog
          </NavLink>
          <NavLink to="/faq" onClick={close}>
            FAQ
          </NavLink>
          <NavLink to="/contact" onClick={close}>
            Contact
          </NavLink>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost btn-sm" onClick={close}>
                {user.fullName.split(' ')[0]}
              </Link>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  logout()
                  close()
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="btn btn-ghost btn-sm" onClick={close}>
                Dashboard
              </Link>
              <Link to="/login" className="btn btn-primary btn-sm" onClick={close}>
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
