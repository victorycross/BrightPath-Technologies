import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xbdaeegl'

const SERVICE_OPTIONS = [
  'AI & Automation Governance',
  'Technology Risk & Assurance',
  'Process Optimisation & Digital Enablement',
  'Data & Compliance Strategy',
  'Leadership Coaching',
  'Persona-X Tools',
  'Other',
]

function Contact() {
  const [formState, setFormState] = useState('idle') // idle | submitting | success | error
  const [form, setForm] = useState({
    name: '',
    email: '',
    organisation: '',
    service: '',
    message: '',
    consent: false,
  })

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.consent) return
    setFormState('submitting')

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          organisation: form.organisation,
          service: form.service,
          message: form.message,
        }),
      })
      setFormState(res.ok ? 'success' : 'error')
    } catch {
      setFormState('error')
    }
  }

  if (formState === 'success') {
    return (
      <div className="animate-fade-in pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="max-w-lg mx-auto py-16 text-center">
            <div className="mb-4 flex justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 text-2xl">
                &#10003;
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Message received</h2>
            <p className="text-sm text-gray-500 mb-8">
              Thank you for getting in touch. We&rsquo;ll respond within one business day.
            </p>
            <button
              onClick={() => {
                setFormState('idle')
                setForm({ name: '', email: '', organisation: '', service: '', message: '', consent: false })
              }}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline"
            >
              Send another message
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Get in Touch</h2>
          <p className="text-sm text-gray-500 mb-8">
            We respond to all enquiries within one business day.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5" htmlFor="name">
                  Name <span className="text-blue-600">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-600/50 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5" htmlFor="email">
                  Email <span className="text-blue-600">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-600/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5" htmlFor="organisation">
                Organisation <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="organisation"
                name="organisation"
                type="text"
                value={form.organisation}
                onChange={handleChange}
                placeholder="Company or organisation name"
                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-600/50 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5" htmlFor="service">
                What can we help with? <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <select
                id="service"
                name="service"
                value={form.service}
                onChange={handleChange}
                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-600/50 focus:outline-none transition-colors"
              >
                <option value="">Select a topic&hellip;</option>
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5" htmlFor="message">
                Message <span className="text-blue-600">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us about your challenge or question&hellip;"
                className="w-full resize-none rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-600/50 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                required
                checked={form.consent}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 rounded border-black/10 accent-blue-600"
              />
              <label htmlFor="consent" className="text-xs text-gray-500 leading-relaxed">
                I have read and agree to the{' '}
                <Link to="/privacy" className="text-blue-600 underline hover:opacity-80">Privacy Policy</Link>.
              </label>
            </div>

            {formState === 'error' && (
              <p className="text-xs text-rose-600 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2">
                Something went wrong. Please try again or email us directly.
              </p>
            )}

            <button
              type="submit"
              disabled={!form.consent || formState === 'submitting'}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {formState === 'submitting' ? 'Sending\u2026' : 'Send Message \u2192'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
