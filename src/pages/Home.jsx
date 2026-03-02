import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { ArrowRight, ExternalLink, CheckCircle, Award } from 'lucide-react'

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
    <>
      {/* Hero */}
      <section id="home" className="pt-24 pb-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-4">
              BrightPath Technologies
            </p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
              AI advisory tools for<br />decisions that matter.
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Persona-X turns structured AI personas into practical advisory frameworks.
              Get structured guidance grounded in expertise — for career decisions, business cases,
              and software viability.
            </p>
            <a
              href="https://advisors.brightpathtechnology.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
                Try Persona-X
                <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-3 text-gray-900">Advisory Tools</h2>
            <p className="text-lg text-gray-600 mb-12">
              Three purpose-built frameworks for structured decision support.
            </p>

            <div className="space-y-6">
              {TOOLS.map((tool) => (
                <div
                  key={tool.number}
                  className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden"
                >
                  <div className="px-6 pt-6 pb-6">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <span className="mt-0.5 shrink-0 text-xs font-bold text-blue-600 bg-blue-100 rounded-full px-2 py-0.5">
                        {tool.number}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-semibold text-gray-900">{tool.name}</h3>
                          <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                            {tool.category}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-600">{tool.headline}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed mb-5">
                      {tool.description}
                    </p>

                    {/* Steps */}
                    <div className="flex flex-wrap gap-y-1 items-center">
                      {tool.steps.map((step, i) => (
                        <span key={i} className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-500">{step}</span>
                          {i < tool.steps.length - 1 && (
                            <span className="text-gray-300 text-xs mx-0.5" aria-hidden>→</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <a
                href="https://advisors.brightpathtechnology.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  Access Persona-X
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">
              About BrightPath Technologies
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-5 text-lg leading-relaxed text-gray-700">
                <p>
                  BrightPath Technologies is founded by <strong>David Martin</strong>, a seasoned
                  technology risk and AI governance leader with over two decades of experience across
                  public and private sectors.
                </p>
                <p>
                  We work with organisations that need clarity around emerging technologies, digital
                  transformation, and the secure, ethical adoption of automation and AI.
                </p>
                <p>
                  Persona-X is our flagship AI advisory platform — purpose-built to turn structured
                  AI personas into practical decision support frameworks.
                </p>
              </div>

              <div className="space-y-5">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    Our Values
                  </h3>
                  <div className="space-y-4">
                    {[
                      { title: 'Truth and Transparency', desc: 'Honest assessments, clear communication, no hidden agendas' },
                      { title: 'Empathy-Led Delivery', desc: 'Understanding your context, constraints, and real-world challenges' },
                      { title: 'Client Experience at the Centre', desc: 'Every engagement designed for your success, not our convenience' },
                    ].map(({ title, desc }) => (
                      <div key={title} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-gray-900">{title}</h4>
                          <p className="text-sm text-gray-600">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Toronto, Ontario, Canada</h3>
                  <p className="text-sm text-gray-700">
                    We believe technology should illuminate pathways forward, not create more
                    complexity. Practical consulting for the modern enterprise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Get in Touch</h2>
            <p className="text-lg text-gray-600 mb-10">
              Questions about our services or Persona-X? We respond to all enquiries within
              one business day.
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
                Contact Us
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
