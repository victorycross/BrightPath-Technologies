import React, { useState } from 'react'
import { ExternalLink, Lock, Github, ChevronDown, ChevronUp } from 'lucide-react'

// ---------------------------------------------------------------------------
// Repo inventory — organised by category
// ---------------------------------------------------------------------------
const CATEGORIES = [
  {
    id: 'brightpath',
    label: 'BrightPath / Business',
    repos: [
      { name: 'BrightPath-Technologies', description: 'Business consulting website — brightpathtechnology.io', visibility: 'public' },
      { name: 'brightpath-foundation', description: 'Professional website for BrightPath Foundation — Illuminating Educational Pathways', visibility: 'public' },
      { name: 'brightpath-risk-tracker', description: 'Risk tracker tool', visibility: 'public' },
      { name: 'victorycross.github.io', description: 'GitHub Pages root — BrightPath Technology landing', visibility: 'public' },
    ],
  },
  {
    id: 'ai',
    label: 'AI & Personas',
    repos: [
      { name: 'persona-x', description: 'Structured AI persona creation, validation, and panel runtime framework', visibility: 'public', url: 'https://advisors.brightpathtechnology.io' },
      { name: '500-agents', description: 'Curated collection of AI agent use cases across industries', visibility: 'private' },
      { name: 'agentic-core', description: 'Core agentic framework and shared utilities', visibility: 'private' },
      { name: 'demo-agent', description: 'Template test — minimal agentic demo', visibility: 'private' },
    ],
  },
  {
    id: 'risk',
    label: 'Risk & Compliance Tools',
    repos: [
      { name: 'pwc-risk-platform', description: 'Comprehensive risk assessment, compliance tracking, and governance framework', visibility: 'private' },
      { name: 'compliance-canvas', description: 'Interactive compliance framework mapping and standards comparison tool', visibility: 'private' },
      { name: 'tprm', description: 'Technology Risk & Compliance Program with One Firm Risk integration', visibility: 'private' },
      { name: 'sdlc-compliance-auditor', description: 'Enterprise SDLC Compliance Audit & Vibe-Code Remediation Tool', visibility: 'private' },
      { name: 'evidence-coordinator', description: 'Evidence collection and coordination tool for audit engagements', visibility: 'private' },
      { name: 'exception-dashboard', description: 'Exception tracking and management dashboard for audit and compliance workflows', visibility: 'private' },
      { name: 'copilot-strategy-dashboard', description: 'M365 Copilot governance and adoption strategy dashboard', visibility: 'public' },
    ],
  },
  {
    id: 'personal',
    label: 'Personal / Portfolio',
    repos: [
      { name: 'david-martin-website', description: 'Personal and professional portfolio — david-martin.ca', visibility: 'public', url: 'https://david-martin.ca' },
      { name: 'david-martin-canvas', description: 'Portfolio design experiments', visibility: 'public' },
      { name: 'martin-family-history', description: 'Martin family genealogy research and documentation', visibility: 'private' },
      { name: 'jorgensen-kidd-archives', description: 'Danish genealogy archives — Jørgensen and Kidd family records', visibility: 'private' },
    ],
  },
  {
    id: 'apps',
    label: 'Apps & Tools',
    repos: [
      { name: 'cleaning-planner', description: 'Home Cleaning Planner — room-by-room task tracker for the whole household', visibility: 'public' },
      { name: 'cost-wise-home-ai', description: 'AI-powered home cost optimization tool', visibility: 'private' },
      { name: 'supply-savvy', description: 'Supply chain optimization and tracking tool', visibility: 'private' },
      { name: 'staff-vision-insights-dashboard', description: 'Staff analytics and insights dashboard', visibility: 'private' },
      { name: 'safety-radar-canada', description: 'Canadian safety incident tracking and visualization', visibility: 'public' },
      { name: 'crisis-guardian', description: 'Crisis response coordination and incident management platform', visibility: 'public' },
      { name: 'tusc-website', description: 'Official website for the Toronto Urban Scooter Community (TUSC)', visibility: 'public' },
      { name: 'MediaOrganizerApp', description: 'Professional macOS media file organizer built with SwiftUI', visibility: 'public' },
    ],
  },
  {
    id: 'ofr',
    label: 'OFR / Professional Work',
    repos: [
      { name: 'OFR-Issue-Tracker', description: 'M365-native Power Apps canvas application for cross-firm risk issue management', visibility: 'public' },
      { name: 'ofr_tracker_incident', description: 'OFR incident tracking utility', visibility: 'public' },
      { name: 'solution-intake-review', description: 'Solution intake and review workflow tool', visibility: 'private' },
    ],
  },
  {
    id: 'internal',
    label: 'Internal / Infrastructure',
    repos: [
      { name: 'project-templates', description: 'Shared project scaffolding and templates', visibility: 'private' },
    ],
  },
]

const GITHUB_BASE = 'https://github.com/victorycross'

// ---------------------------------------------------------------------------
// LoginGate
// ---------------------------------------------------------------------------
function LoginGate({ onAuth }) {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('https://api.github.com/user', {
        headers: { Authorization: `token ${token.trim()}` },
      })
      if (!res.ok) {
        setError('Invalid token — check it and try again.')
        return
      }
      const user = await res.json()
      if (user.login !== 'victorycross') {
        setError('Unauthorized — this page is restricted.')
        return
      }
      sessionStorage.setItem('gh_token', token.trim())
      onAuth(token.trim())
    } catch {
      setError('Could not reach GitHub — check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Lock className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-500 tracking-wide uppercase">Private Area</span>
        </div>

        <div className="bg-white rounded-xl border border-black/10 shadow-sm p-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Sign in</h1>
          <p className="text-sm text-gray-500 mb-6">
            Enter a GitHub Personal Access Token for{' '}
            <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">victorycross</span>
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label htmlFor="token" className="block text-xs font-medium text-gray-600 mb-1.5">
                GitHub Token
              </label>
              <input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_••••••••••••••••••••"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono placeholder:font-sans placeholder:text-gray-400"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !token.trim()}
              className="w-full py-2 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Github className="w-4 h-4" />
              {loading ? 'Verifying…' : 'Continue'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Generate a token at{' '}
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            github.com/settings/tokens
          </a>
        </p>
      </div>
    </main>
  )
}

// ---------------------------------------------------------------------------
// RepoCard
// ---------------------------------------------------------------------------
function RepoCard({ repo }) {
  const githubUrl = `${GITHUB_BASE}/${repo.name}`
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-900 font-mono">{repo.name}</span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
              repo.visibility === 'private'
                ? 'bg-gray-100 text-gray-500'
                : 'bg-blue-50 text-blue-600'
            }`}
          >
            {repo.visibility}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{repo.description}</p>
        {repo.url && (
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline mt-0.5 inline-block"
          >
            {repo.url.replace('https://', '')}
          </a>
        )}
      </div>
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        title={`Open ${repo.name} on GitHub`}
      >
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  )
}

// ---------------------------------------------------------------------------
// CategorySection
// ---------------------------------------------------------------------------
function CategorySection({ category }) {
  const [open, setOpen] = useState(true)
  return (
    <section className="bg-white rounded-xl border border-black/10 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-gray-900">{category.label}</h2>
          <span className="text-xs text-gray-400">{category.repos.length} repos</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-2">
          {category.repos.map((repo) => (
            <RepoCard key={repo.name} repo={repo} />
          ))}
        </div>
      )}
    </section>
  )
}

// ---------------------------------------------------------------------------
// ProjectsPage
// ---------------------------------------------------------------------------
export default function Projects() {
  const [token, setToken] = useState(() => sessionStorage.getItem('gh_token'))

  const totalActive = CATEGORIES.reduce((sum, c) => sum + c.repos.length, 0)

  const handleLogout = () => {
    sessionStorage.removeItem('gh_token')
    setToken(null)
  }

  if (!token) return <LoginGate onAuth={setToken} />

  return (
    <main className="pt-24 pb-16 px-6">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Project Repository</h1>
            <p className="text-sm text-gray-500 mt-1">
              {totalActive} active repositories across {CATEGORIES.length} categories
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors mt-1"
          >
            Sign out
          </button>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-4">
          {CATEGORIES.map((category) => (
            <CategorySection key={category.id} category={category} />
          ))}
        </div>

        {/* Footer note */}
        <p className="text-xs text-gray-400 text-center mt-8">
          Archived repositories are excluded. View all on{' '}
          <a
            href={GITHUB_BASE}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            github.com/victorycross
          </a>
        </p>
      </div>
    </main>
  )
}
