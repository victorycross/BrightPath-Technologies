import React, { useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'

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
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-black/10 shadow-sm">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="group">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
                Persona-X
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                by BrightPath Technologies
              </p>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) =>
                item.scroll ? (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(item.scroll)
                    }}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    to={item.href}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              )}
              <Link
                to="/contact"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-500 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-black/10">
              <div className="flex flex-col gap-1 mt-4">
                {navItems.map((item) =>
                  item.scroll ? (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToSection(item.scroll)
                      }}
                      className="text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.id}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      {item.label}
                    </Link>
                  )
                )}
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Contact
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Page content */}
      <Outlet />

      {/* Footer — light theme matching advisors site */}
      <footer className="border-t border-black/10 bg-white mt-12">
        <div className="mx-auto max-w-3xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} BrightPath Technologies. Toronto, Ontario, Canada.
            </p>
            <a
              href="https://advisors.brightpathtechnology.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:opacity-80 transition-opacity"
            >
              advisors.brightpathtechnology.io &uarr;
            </a>
          </div>
          <nav className="flex items-center gap-5" aria-label="Legal">
            <Link to="/contact" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Contact</Link>
            <Link to="/privacy" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Terms of Use</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

export default Layout
