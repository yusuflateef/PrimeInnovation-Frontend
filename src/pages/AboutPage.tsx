import { Link } from 'react-router-dom'

export function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: 'var(--secondary)' }}>
            About Us
          </span>
          <h1>Prime Innovation Network</h1>
          <p>
            Our official website, corporate identity, and brand authority — built to showcase vision, list
            programs, attract partners, and host our learning platform.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div>
            <span className="eyebrow">Main Website</span>
            <h2>Prime Innovation Network</h2>
            <div className="gold-mark" />
            <p>
              We exist to showcase vision, list all programs, attract partners, NGOs, and investors, and host
              the learning platform that powers digital skills at scale.
            </p>
          </div>
          <div>
            <span className="eyebrow">Learning Portal</span>
            <h2>Prime Digital Academy</h2>
            <div className="gold-mark" />
            <p>
              Our course platform, student learning environment, and training hub — powered by Prime Innovation
              Network. From enrollment to verified certificates, everything lives here.
            </p>
            <Link to="/courses" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              Browse programs
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
