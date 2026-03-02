import React from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Award } from 'lucide-react'

const TOOLS = [
  {
    number: '01',
    name: 'Personal Board of Directors',
    category: 'Personal & business use',
    headline: 'A panel of advisors for every decision that matters.',
    description:
      'Eight AI advisors — each with a distinct role-based perspective — analyse your situation and deliver structured, honest guidance. From career crossroads to business strategy, your board provides the clarity you need to move forward with confidence.',
    steps: [
      'Describe your decision',
      'Refine with probing questions',
      'Hear from each advisor',
      'Receive your board brief',
    ],
  },
  {
    number: '02',
    name: 'Business Case Builder',
    category: 'Articulate your vision',
    headline: 'Turn your thinking into a compelling business case.',
    description:
      'Walk through seven key interview questions with expert advisors providing constructive input at every step. The result is a polished, first-person business case you can use to align stakeholders, secure buy-in, and move your project forward.',
    steps: [
      'Select your advisory panel',
      'Answer 7 key questions',
      'Receive expert input on each answer',
      'Generate your business case',
    ],
  },
  {
    number: '03',
    name: 'Software Team Advisor',
    category: 'Viability & gap analysis',
    headline: 'A specialist software team for your next project.',
    description:
      'Assemble the right mix of specialists — from architecture and security to UX and brand — and get a unified brief on the viability of your idea. The Founder joins last to chart the path forward with a strategic, forward-looking vision.',
    steps: [
      'Describe your project',
      'Select (or auto-select) specialists',
      'Receive individual expert responses',
      "Get a team brief with Founder's vision",
    ],
  },
]

function Home() {
  return (
    <div className="animate-fade-in pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        {/* Hero */}
        <div className="mb-10 pt-2">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 leading-snug">
            AI advisory tools for decisions that matter.
          </h2>
          <p className="text-base text-gray-500 leading-relaxed max-w-2xl">
            Persona-X by BrightPath Technologies turns structured AI personas into
            practical advisory frameworks. Choose a tool below to get started.
          </p>
        </div>

        {/* Service cards */}
        <div className="space-y-5">
          {TOOLS.map((tool) => (
            <div
              key={tool.number}
              className="card-hover rounded-2xl border border-black/10 bg-white overflow-hidden"
            >
              <div className="px-6 pt-6 pb-5">
                {/* Header row */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="mt-0.5 shrink-0 text-xs font-bold tabular-nums text-blue-600 bg-blue-600/10 rounded-full px-2 py-0.5">
                    {tool.number}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold text-gray-900 leading-tight">
                        {tool.name}
                      </h3>
                      <span className="rounded-full border border-black/10 px-2 py-0.5 text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                        {tool.category}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-500">
                      {tool.headline}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  {tool.description}
                </p>

                {/* Steps */}
                <div className="flex flex-wrap gap-x-0 gap-y-1 mb-6 items-center">
                  {tool.steps.map((step, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-400">{step}</span>
                      {i < tool.steps.length - 1 && (
                        <span className="text-black/10 text-xs mx-1" aria-hidden>&rarr;</span>
                      )}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href="https://advisors.brightpathtechnology.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Try this tool &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* About section */}
        <div className="mt-16 rounded-2xl border border-black/10 bg-white overflow-hidden">
          <div className="px-6 py-8 md:px-8" id="about">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              About BrightPath Technologies
            </h2>

            <div className="space-y-4 text-sm text-gray-500 leading-relaxed mb-8">
              <p>
                BrightPath Technologies is founded by <strong className="text-gray-900">David Martin</strong>, a
                seasoned technology risk and AI governance leader with over two decades of
                experience across public and private sectors.
              </p>
              <p>
                We work with organisations that need clarity around emerging technologies,
                digital transformation, and the secure, ethical adoption of automation and AI.
              </p>
              <p>
                Persona-X is our flagship AI advisory platform — purpose-built to turn
                structured AI personas into practical decision support frameworks.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                Our Values
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'Truth and Transparency', desc: 'Honest assessments, clear communication, no hidden agendas' },
                  { title: 'Empathy-Led Delivery', desc: 'Understanding your context, constraints, and real-world challenges' },
                  { title: 'Client Experience at the Centre', desc: 'Every engagement designed for your success, not our convenience' },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-gray-900">{title}</span>
                      <span className="text-xs text-gray-400 ml-1">&mdash; {desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Toronto, Ontario, Canada
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-10 text-center" id="contact">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Get in Touch</h3>
          <p className="text-sm text-gray-500 mb-5">
            Questions about our services or Persona-X? We respond within one business day.
          </p>
          <Link
            to="/contact"
            className="inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Contact Us &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
