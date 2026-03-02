import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.jsx'
import {
  Shield,
  Brain,
  Cog,
  Database,
  Users,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Target,
  Lightbulb,
  TrendingUp,
  MapPin,
  Award,
  FileText,
  MessageSquare
} from 'lucide-react'

function Home() {
  const [openService, setOpenService] = useState(null)

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const services = [
    {
      id: 'tech-risk',
      icon: Shield,
      title: 'Technology Risk & Assurance',
      description: 'Support with risk-based decisions around cloud, data, and digital transformation',
      details: [
        'Risk-based decisions for cloud migration and data strategy',
        'Policy design and control implementation',
        'Alignment with standards like ISQM1, NIST, and CSA',
        'Digital transformation risk assessment',
        'Third-party technology risk evaluation'
      ]
    },
    {
      id: 'ai-governance',
      icon: Brain,
      title: 'AI & Automation Governance',
      description: 'Practical guidance to safely implement Generative AI and automation tools',
      details: [
        'Generative AI implementation strategy and risk management',
        'AI governance program setup and policy development',
        'Internal AI risk approval processes',
        'Use case reviews and audit-readiness frameworks',
        'Ethical AI guidelines and compliance monitoring'
      ]
    },
    {
      id: 'process-optimization',
      icon: Cog,
      title: 'Process Optimization & Digital Enablement',
      description: 'Reducing complexity through tech-driven process reviews',
      details: [
        'Business process analysis and optimization',
        'Microsoft Power Platform automation solutions',
        'Copilot integration and workflow enhancement',
        'Digital transformation roadmapping',
        'Change management and user adoption strategies'
      ]
    },
    {
      id: 'data-compliance',
      icon: Database,
      title: 'Data & Compliance Strategy',
      description: 'Mapping regulatory obligations to operational reality',
      details: [
        'Regulatory compliance mapping and gap analysis',
        'Data governance framework development',
        'Privacy impact assessments and GDPR compliance',
        'System implementation and decommissioning strategies',
        'Audit preparation and regulatory reporting'
      ]
    },
    {
      id: 'leadership-coaching',
      icon: Users,
      title: 'Coaching for Risk and Tech Leaders',
      description: '1:1 support for building influence and clarity in high-stakes roles',
      details: [
        'Executive coaching for technology and risk leaders',
        'Building bridges between legal, tech, and business teams',
        'Strategic communication and stakeholder management',
        'Leadership development in complex environments',
        'Decision-making frameworks for emerging technologies'
      ]
    }
  ]

  const caseStudies = [
    {
      title: 'Exception Management Workflow',
      subtitle: 'AI-integrated process automation',
      problem: 'Manual exception handling was creating bottlenecks and compliance risks',
      solution: 'Built automated workflow with AI-powered categorization and routing',
      result: '75% reduction in processing time, 90% improvement in audit trail completeness',
      insight: 'AI excels at pattern recognition when combined with human oversight',
      tags: ['AI Integration', 'Process Automation', 'Compliance']
    },
    {
      title: 'Security Barometer',
      subtitle: 'Executive situational awareness dashboard',
      problem: 'Leadership needed real-time visibility into security posture across multiple systems',
      solution: 'Developed executive dashboard with automated risk scoring and trend analysis',
      result: 'Improved incident response time by 60%, enhanced board-level reporting',
      insight: 'Executives need context, not just data — storytelling through metrics matters',
      tags: ['Executive Reporting', 'Security', 'Data Visualization']
    },
    {
      title: 'Generative AI Prompt Library',
      subtitle: 'Risk and compliance use case repository',
      problem: 'Teams were struggling to use AI effectively for risk and compliance tasks',
      solution: 'Created curated prompt library with governance guidelines and best practices',
      result: 'Increased AI adoption by 300%, standardised quality across teams',
      insight: 'Good prompts are reusable assets that compound organisational learning',
      tags: ['AI Governance', 'Knowledge Management', 'Training']
    },
    {
      title: 'Rapid Approval Framework',
      subtitle: 'Emerging technology evaluation process',
      problem: 'New technology requests were stuck in lengthy approval cycles',
      solution: 'Designed risk-based approval framework with clear criteria and fast-track options',
      result: 'Reduced approval time from 6 weeks to 5 days for low-risk technologies',
      insight: "Speed and safety aren't opposites when you have the right framework",
      tags: ['Risk Management', 'Process Design', 'Innovation']
    }
  ]

  return (
    <>
      {/* Home Section */}
      <section id="home" className="pt-24 pb-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
              Solving Complex Problems With{' '}
              <span className="text-blue-600">Integrity</span>,{' '}
              <span className="text-indigo-600">Insight</span>, and{' '}
              <span className="text-purple-600">Innovation</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              BrightPath Technologies helps organisations reduce friction, manage risk, and build smarter systems
              through practical consulting, AI enablement, and governance expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => scrollToSection('services')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4"
              >
                Explore Our Approach
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('case-studies')}
                className="px-8 py-4 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                See Our Work
              </Button>
            </div>
          </div>

          {/* Key Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Practical Solutions</h3>
                <p className="text-sm text-gray-600">
                  No jargon, no over-engineering. We deliver solutions that work in the real world.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold mb-2">Risk-First Thinking</h3>
                <p className="text-sm text-gray-600">
                  Every recommendation balances innovation with security and compliance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Human-Centred</h3>
                <p className="text-sm text-gray-600">
                  Technology serves people, not the other way around. We design for adoption.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">About BrightPath Technologies</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg leading-relaxed text-gray-700">
                    BrightPath Technologies is founded by <strong>David Martin</strong>, a seasoned technology risk and
                    AI governance leader with over two decades of experience across public and private sectors.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700">
                    We work with organisations that need clarity around emerging technologies, digital transformation,
                    and secure, ethical adoption of automation and AI.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700">
                    Our approach combines deep technical expertise with practical business sense, ensuring that
                    every solution we deliver creates real value while managing risk appropriately.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="w-5 h-5 mr-2 text-blue-600" />
                      Our Values
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Truth and Transparency</h4>
                          <p className="text-sm text-gray-600">Honest assessments, clear communication, no hidden agendas</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Empathy-Led Delivery</h4>
                          <p className="text-sm text-gray-600">Understanding your context, constraints, and real-world challenges</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Client Experience at the Centre</h4>
                          <p className="text-sm text-gray-600">Every engagement designed for your success, not our convenience</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-blue-50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Why BrightPath?</h3>
                    <p className="text-sm text-gray-700">
                      We believe technology should illuminate pathways forward, not create more complexity.
                      Our name reflects our commitment to finding clear, bright solutions to complex challenges.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Our Services</h2>

            <div className="space-y-6">
              {services.map((service) => (
                <Card key={service.id} className="border-0 shadow-lg bg-white">
                  <Collapsible
                    open={openService === service.id}
                    onOpenChange={() => setOpenService(openService === service.id ? null : service.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <service.icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="text-left">
                              <CardTitle className="text-xl">{service.title}</CardTitle>
                              <CardDescription className="text-base mt-1">
                                {service.description}
                              </CardDescription>
                            </div>
                          </div>
                          {openService === service.id ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="ml-16">
                          <h4 className="font-medium mb-3 text-gray-900">What we deliver:</h4>
                          <ul className="space-y-2">
                            {service.details.map((detail, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/contact">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4"
                >
                  Discuss Your Needs
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">What We've Built</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {caseStudies.map((study, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-1">{study.title}</CardTitle>
                        <CardDescription className="text-blue-600 font-medium">
                          {study.subtitle}
                        </CardDescription>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {study.tags.slice(0, 2).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-red-600 mb-1">Problem</h4>
                        <p className="text-sm text-gray-700">{study.problem}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-blue-600 mb-1">What we did</h4>
                        <p className="text-sm text-gray-700">{study.solution}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-green-600 mb-1">Result</h4>
                        <p className="text-sm text-gray-700">{study.result}</p>
                      </div>

                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-start">
                          <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Key Insight</h4>
                            <p className="text-sm text-gray-600 italic">{study.insight}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section id="insights" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Insights &amp; Perspectives</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Latest Thinking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-2">The AI Governance Paradox</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Why the organisations that need AI governance most are often the least equipped to implement it effectively.
                      </p>
                      <span className="text-xs text-gray-500">December 2024</span>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium mb-2">Risk as a Competitive Advantage</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        How smart risk management can accelerate innovation rather than slow it down.
                      </p>
                      <span className="text-xs text-gray-500">November 2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Common Pitfalls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">AI Implementation</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Starting with technology instead of use cases</li>
                        <li>• Underestimating change management needs</li>
                        <li>• Ignoring data quality requirements</li>
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Digital Transformation</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Focusing on tools over processes</li>
                        <li>• Insufficient stakeholder alignment</li>
                        <li>• Neglecting security considerations</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Card className="border-0 shadow-lg bg-blue-50">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4">Want to discuss these ideas?</h3>
                  <p className="text-gray-600 mb-6">
                    We believe the best insights come from conversation. Let's explore how these perspectives
                    might apply to your specific challenges.
                  </p>
                  <Link to="/contact">
                    <Button>
                      Start a Conversation
                      <MessageSquare className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Get Started</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-xl font-semibold mb-6">Ready to solve complex problems together?</h3>
                <p className="text-gray-600 mb-8">
                  Whether you're navigating AI governance, managing technology risk, or optimising processes,
                  we're here to help you find practical solutions that work in the real world.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                    <span>Toronto, Canada</span>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="font-medium mb-4">Typical Engagement Timeline</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <span>Initial consultation: 1–2 weeks</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <span>Assessment and planning: 2–4 weeks</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <span>Implementation: 4–12 weeks</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <Card className="border-0 shadow-lg w-full">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-xl font-semibold mb-4">Ready to get in touch?</h3>
                    <p className="text-gray-600 mb-6">
                      Use our contact form to tell us about your challenge. We respond to all enquiries within one business day.
                    </p>
                    <Link to="/contact">
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                        Get in Touch
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
