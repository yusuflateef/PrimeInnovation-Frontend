import { Link } from 'react-router-dom'
import type { Course } from '../api/client'

export function formatPrice(price: number | string | 'Free') {
  if (price === 'Free' || price === 0 || price === '0') return 'Free'
  const n = typeof price === 'number' ? price : Number(price)
  if (Number.isNaN(n)) return String(price)
  return `₦${n.toLocaleString()}`
}

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="course-tile">
      <Link to={`/courses/${course.slug}`}>
        <div className="course-media">
          <span>{course.category}</span>
        </div>
        <div className="course-body">
          <h3>{course.title}</h3>
          <div className="meta">
            <span>
              Instructor <b>{course.instructor}</b>
            </span>
            <span>
              Duration <b>{course.duration}</b>
            </span>
            <span>
              Level <b>{course.level}</b>
            </span>
          </div>
          <div className="price-row">
            <span className="price">{formatPrice(course.price)}</span>
            <span className="rating">
              {course.rating} ({course.reviews})
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
