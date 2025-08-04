import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.jsx'
import { 
  Building2,
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
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Menu,
  X,
  Award,
  Zap,
  Globe,
  Lock,
  BarChart3,
  Settings,
  MessageSquare,
  Calendar,
  FileText,
  Star
} from 'lucide-react'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openService, setOpenService] = useState(null)

  const navigation = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'case-studies', label: 'Case Studies' },
    { id: 'insights', label: 'Insights' },
    { id: 'contact', label: 'Contact' }
  ]

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId)
    setMobileMenuOpen(false)
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
      insight: 'Executives need context, not just data - storytelling through metrics matters',
      tags: ['Executive Reporting', 'Security', 'Data Visualization']
    },
    {
      title: 'Generative AI Prompt Library',
      subtitle: 'Risk and compliance use case repository',
      problem: 'Teams were struggling to use AI effectively for risk and compliance tasks',
      solution: 'Created curated prompt library with governance guidelines and best practices',
      result: 'Increased AI adoption by 300%, standardized quality across teams',
      insight: 'Good prompts are reusable assets that compound organizational learning',
      tags: ['AI Governance', 'Knowledge Management', 'Training']
    },
    {
      title: 'Rapid Approval Framework',
      subtitle: 'Emerging technology evaluation process',
      problem: 'New technology requests were stuck in lengthy approval cycles',
      solution: 'Designed risk-based approval framework with clear criteria and fast-track options',
      result: 'Reduced approval time from 6 weeks to 5 days for low-risk technologies',
      insight: 'Speed and safety aren\'t opposites when you have the right framework',
      tags: ['Risk Management', 'Process Design', 'Innovation']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">BrightPath</span>
                <span className="text-xl font-light text-gray-600"> Technologies</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    activeSection === item.id ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => scrollToSection('contact')}
                className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white"
              >
                Get Started
              </Button>
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="flex flex-col space-y-2 mt-4">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === item.id 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <Button 
                  onClick={() => scrollToSection('contact')}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Get Started
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

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
              BrightPath Technologies helps organizations reduce friction, manage risk, and build smarter systems 
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
                <h3 className="font-semibold mb-2">Human-Centered</h3>
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
                    We work with organizations that need clarity around emerging technologies, digital transformation, 
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
                          <h4 className="font-medium">Client Experience at the Center</h4>
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
              <Button 
                size="lg" 
                onClick={() => scrollToSection('contact')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4"
              >
                Discuss Your Needs
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
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
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Insights & Perspectives</h2>
            
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
                        Why the organizations that need AI governance most are often the least equipped to implement it effectively.
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
                  <Button onClick={() => scrollToSection('contact')}>
                    Start a Conversation
                    <MessageSquare className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Get Started</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-semibold mb-6">Ready to solve complex problems together?</h3>
                <p className="text-gray-600 mb-8">
                  Whether you're navigating AI governance, managing technology risk, or optimizing processes, 
                  we're here to help you find practical solutions that work in the real world.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-blue-600 mr-3" />
                    <span>hello@brightpathtechnologies.io</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-blue-600 mr-3" />
                    <span>+1 (555) 123-4567</span>
                  </div>
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
                      <span>Initial consultation: 1-2 weeks</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <span>Assessment and planning: 2-4 weeks</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <span>Implementation: 4-12 weeks</span>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Tell us about your challenge</CardTitle>
                  <CardDescription>
                    We'll respond within 24 hours with next steps.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Organization</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                          placeholder="Company name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input 
                        type="email" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="your.email@company.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">What are you looking for help with?</label>
                      <div className="grid grid-cols-1 gap-2 mb-3">
                        {['AI Governance', 'Technology Risk', 'Process Optimization', 'Data Strategy', 'Leadership Coaching', 'Other'].map((option) => (
                          <label key={option} className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Tell us more</label>
                      <textarea 
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Describe your challenge, timeline, and what success looks like..."
                      ></textarea>
                    </div>
                    
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Send Message
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-bold">BrightPath</span>
                    <span className="text-lg font-light text-gray-300"> Technologies</span>
                  </div>
                </div>
                <p className="text-gray-300 mb-4 max-w-md">
                  Solving complex problems with integrity, insight, and innovation. 
                  Practical consulting for the modern enterprise.
                </p>
                <p className="text-sm text-gray-400">
                  hello@brightpathtechnologies.io
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Services</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Technology Risk & Assurance</li>
                  <li>AI & Automation Governance</li>
                  <li>Process Optimization</li>
                  <li>Data & Compliance Strategy</li>
                  <li>Leadership Coaching</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><button onClick={() => scrollToSection('about')}>About</button></li>
                  <li><button onClick={() => scrollToSection('case-studies')}>Case Studies</button></li>
                  <li><button onClick={() => scrollToSection('insights')}>Insights</button></li>
                  <li><button onClick={() => scrollToSection('contact')}>Contact</button></li>
                </ul>
              </div>
            </div>
            
            <Separator className="my-8 bg-gray-700" />
            
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">
                © 2024 BrightPath Technologies Inc. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <button className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </button>
                <button className="text-sm text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

