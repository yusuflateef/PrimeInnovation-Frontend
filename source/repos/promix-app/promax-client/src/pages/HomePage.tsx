import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CourseCard } from '../components/CourseCard'
import { api, type Course } from '../api/client'

const homeCategories = [
  { name: 'AI', label: 'Artificial Intelligence', href: '/courses?category=AI+%26+Machine+Learning' },
  { name: 'Data', label: 'Data & Analytics', href: '/courses?category=Data+Analysis' },
  { name: 'Programming', label: 'Web Development', href: '/courses?category=Web+Development' },
  { name: 'Design', label: 'UI/UX Design', href: '/courses?category=UI%2FUX' },
]

type Testimonial = { name: string; role: string; quote: string }

export function HomePage() {
  const [featured, setFeatured] = useState<Course[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      api<{ featuredCourses: Course[]; testimonials: Testimonial[] }>('/content/home', { auth: false }),
    ])
      .then(([home]) => {
        setFeatured(home.featuredCourses)
        setTestimonials(home.testimonials)
      })
      .catch((e: Error) => setError(e.message))
  }, [])

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-brand">
            PRIME
            <span>Innovation Network</span>
          </div>
          <h1>Skills, partnerships, and digital opportunity — built for the next generation.</h1>
          <p>
            Our official platform for brand authority, programs, and Prime Digital Academy —
            where learners, partners, NGOs, and investors connect.
          </p>
          <div className="hero-cta">
            <Link to="/courses" className="btn btn-primary">
              Explore Courses
            </Link>
            <Link to="/signup" className="btn btn-gold">
              Enroll Now
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Categories</span>
            <h2>Learn what the future demands</h2>
            <p>AI, Data, Programming, and Design — curated pathways for real careers.</p>
            <div className="gold-mark" />
          </div>
          <div className="category-grid">
            {homeCategories.map((cat) => (
              <Link key={cat.name} to={cat.href} className="category-item">
                <strong>{cat.name}</strong>
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Featured Courses</span>
            <h2>Start with Prime Digital Academy</h2>
            <p>Powered by Prime Innovation Network — practical programs with certificates that verify.</p>
            <div className="gold-mark" />
          </div>
          {error && <div className="empty">{error}. Is the API running on port 5080?</div>}
          <div className="course-grid">
            {featured.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <div style={{ marginTop: '1.75rem' }}>
            <Link to="/courses" className="btn btn-dark">
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Testimonials</span>
            <h2>Trusted by learners across the network</h2>
            <div className="gold-mark" />
          </div>
          <div className="testimonial-grid">
            {testimonials.map((t) => (
              <blockquote key={t.name} className="testimonial">
                <p>“{t.quote}”</p>
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <div className="gold-mark" />
          <h2>Ready to enroll?</h2>
          <p>
            Join Prime Digital Academy today. Build skills in AI, data, development, and design —
            then earn a verifiable certificate.
          </p>
          <div className="hero-cta">
            <Link to="/signup" className="btn btn-gold">
              Enroll Now
            </Link>
            <Link to="/contact" className="btn btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.35)' }}>
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
