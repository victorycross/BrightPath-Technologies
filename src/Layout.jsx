import React, { useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Building2, Menu, X } from 'lucide-react'

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isHome = location.pathname === '/'

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false)
    if (isHome) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate('/#' + sectionId)
    }
  }

  const navItems = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'tools', label: 'Persona-X', href: '/#tools', scroll: 'tools' },
    { id: 'about', label: 'About', href: '/#about', scroll: 'about' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">BrightPath</span>
                <span className="text-xl font-light text-gray-600"> Technologies</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                item.scroll ? (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(item.scroll)
                    }}
                    className="text-sm font-medium transition-colors hover:text-blue-600 text-gray-600"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    to={item.href}
                    className="text-sm font-medium transition-colors hover:text-blue-600 text-gray-600"
                  >
                    {item.label}
                  </Link>
                )
              ))}
              <Link
                to="/contact"
                className="text-sm font-medium transition-colors hover:text-blue-600 text-gray-600"
              >
                Contact
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/contact" className="hidden md:flex">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Button>
              </Link>

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
                {navItems.map((item) => (
                  item.scroll ? (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToSection(item.scroll)
                      }}
                      className="text-left px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-600"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.id}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-left px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-600"
                    >
                      {item.label}
                    </Link>
                  )
                ))}
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-left px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-600"
                >
                  Contact
                </Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Page content */}
      <Outlet />

      {/* Footer */}
      <footer className="py-10 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-bold">BrightPath</span>
                    <span className="text-lg font-light text-gray-300"> Technologies</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400">Toronto, Ontario, Canada</p>
              </div>

              <div className="flex gap-12">
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-gray-200">Persona-X</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/#tools" className="text-gray-400 hover:text-white transition-colors">Advisory Tools</a></li>
                    <li>
                      <a href="https://advisors.brightpathtechnology.io" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                        Launch Persona-X ↗
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-gray-200">Company</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                    <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator className="mb-6 bg-gray-700" />

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} BrightPath Technologies. Toronto, Ontario, Canada.
              </p>
              <div className="flex space-x-6">
                <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Terms of Use
                </Link>
                <Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
