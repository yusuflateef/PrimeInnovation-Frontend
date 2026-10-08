import { useEffect, useState } from 'react'
import { api } from '../api/client'

type Post = { slug: string; title: string; excerpt: string; category: string; date: string }

export function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    api<Post[]>('/content/blog', { auth: false }).then(setPosts).catch(() => undefined)
  }, [])

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: 'var(--secondary)' }}>
            Blog
          </span>
          <h1>Insights from the Network</h1>
          <p>Ideas on AI education, talent, and partnerships shaping Prime Innovation Network.</p>
        </div>
      </section>

      <section className="section">
        <div className="container blog-list">
          {posts.map((post) => (
            <article key={post.slug} className="blog-item">
              <span className="eyebrow">{post.category}</span>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <span style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>
                {new Date(post.date).toLocaleDateString()}
              </span>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
