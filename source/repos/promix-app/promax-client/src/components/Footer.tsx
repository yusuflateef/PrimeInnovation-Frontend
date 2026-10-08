import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">Prime Innovation Network</div>
            <p style={{ color: 'rgba(255,255,255,0.75)' }}>
              Official website, corporate identity, and home of Prime Digital Academy —
              building skills, partnerships, and digital opportunity.
            </p>
          </div>
          <div>
            <h4>Learn</h4>
            <Link to="/courses">All Courses</Link>
            <Link to="/learn/ai-fundamentals">Learning Portal</Link>
            <Link to="/certificate">Certificates</Link>
            <Link to="/faq">FAQ</Link>
          </div>
          <div>
            <h4>Network</h4>
            <Link to="/about">About Us</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/instructor">Instructor Panel</Link>
          </div>
          <div>
            <h4>Academy</h4>
            <Link to="/dashboard">Student Dashboard</Link>
            <Link to="/signup">Create Account</Link>
            <Link to="/login">Sign In</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Prime Innovation Network</span>
          <span>Prime Digital Academy — Powered by Prime Innovation Network</span>
        </div>
      </div>
    </footer>
  )
}
