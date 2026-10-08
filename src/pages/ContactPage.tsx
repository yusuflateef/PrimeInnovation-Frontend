import { useState, type FormEvent } from 'react'
import { api } from '../api/client'

export function ContactPage() {
  const [msg, setMsg] = useState('')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const res = await api<{ message: string }>('/content/contact', {
      method: 'POST',
      body: JSON.stringify({
        fullName: form.get('name'),
        email: form.get('email'),
        topic: form.get('topic'),
        message: form.get('message'),
      }),
      auth: false,
    })
    setMsg(res.message)
    e.currentTarget.reset()
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: 'var(--secondary)' }}>
            Contact
          </span>
          <h1>Let’s build together</h1>
          <p>Reach out for partnerships, enrollment support, NGO collaborations, or investor conversations.</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <form className="panel" onSubmit={onSubmit}>
            <div className="form-field">
              <label htmlFor="c-name">Full name</label>
              <input id="c-name" name="name" required />
            </div>
            <div className="form-field">
              <label htmlFor="c-email">Email</label>
              <input id="c-email" name="email" type="email" required />
            </div>
            <div className="form-field">
              <label htmlFor="c-topic">Topic</label>
              <select id="c-topic" name="topic" defaultValue="Enrollment">
                <option>Enrollment</option>
                <option>Partnership / NGO</option>
                <option>Investor</option>
                <option>Instructor application</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="c-msg">Message</label>
              <textarea id="c-msg" name="message" rows={5} required />
            </div>
            {msg && <p style={{ color: 'var(--primary)', fontWeight: 700 }}>{msg}</p>}
            <button type="submit" className="btn btn-primary">
              Send message
            </button>
          </form>

          <div>
            <h2>Prime Innovation Network</h2>
            <p>Official website & corporate identity</p>
            <div className="meta">
              <span>
                Email <b>hello@primeinnovation.network</b>
              </span>
              <span>
                Academy <b>learn@primedigitalacademy.com</b>
              </span>
              <span>
                Payments <b>Paystack · Flutterwave</b>
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
