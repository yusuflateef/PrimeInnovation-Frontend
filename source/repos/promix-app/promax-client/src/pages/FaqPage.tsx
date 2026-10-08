import { useEffect, useState } from 'react'
import { api } from '../api/client'

type Faq = { question: string; answer: string }

export function FaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([])

  useEffect(() => {
    api<Faq[]>('/content/faqs', { auth: false }).then(setFaqs).catch(() => undefined)
  }, [])

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: 'var(--secondary)' }}>
            FAQ
          </span>
          <h1>Frequently asked questions</h1>
          <p>Answers about the Network, Academy, certificates, and payments.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          {faqs.map((item) => (
            <details key={item.question} className="faq-item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
