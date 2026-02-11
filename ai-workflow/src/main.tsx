import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Handle SPA redirect from 404.html on GitHub Pages
const params = new URLSearchParams(window.location.search)
const redirect = params.get('redirect')
if (redirect) {
  const cleanPath = redirect.replace(/^\/ai-workflow/, '') || '/'
  window.history.replaceState(null, '', '/ai-workflow' + cleanPath)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
