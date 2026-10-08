import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CourseCard } from '../components/CourseCard'
import { api, type Course } from '../api/client'

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'] as const

export function CoursesPage() {
  const [params] = useSearchParams()
  const [level, setLevel] = useState<string>('All')
  const [category, setCategory] = useState(params.get('category') ?? 'All')
  const [categories, setCategories] = useState<string[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setCategory(params.get('category') ?? 'All')
  }, [params])

  useEffect(() => {
    api<string[]>('/courses/categories', { auth: false }).then(setCategories).catch(() => undefined)
  }, [])

  useEffect(() => {
    setLoading(true)
    const qs = new URLSearchParams()
    if (level !== 'All') qs.set('level', level)
    if (category !== 'All') qs.set('category', category)
    api<Course[]>(`/courses?${qs}`, { auth: false })
      .then(setCourses)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [level, category])

  const empty = useMemo(() => !loading && courses.length === 0, [loading, courses])

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: 'var(--secondary)' }}>
            Prime Digital Academy
          </span>
          <h1>Courses</h1>
          <p>Filter by level and category. Every program includes curriculum, instructor guidance, and certification.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <h3 style={{ fontSize: '1rem' }}>Level</h3>
          <div className="filters">
            {levels.map((l) => (
              <button
                key={l}
                type="button"
                className={`chip ${level === l ? 'active' : ''}`}
                onClick={() => setLevel(l)}
              >
                {l}
              </button>
            ))}
          </div>

          <h3 style={{ fontSize: '1rem' }}>Category</h3>
          <div className="filters">
            <button
              type="button"
              className={`chip ${category === 'All' ? 'active' : ''}`}
              onClick={() => setCategory('All')}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`chip ${category === c ? 'active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {error && <div className="empty">{error}</div>}
          {loading && <div className="empty">Loading courses…</div>}
          {empty && <div className="empty">No courses match these filters.</div>}
          {!loading && courses.length > 0 && (
            <div className="course-grid">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
