import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('React app starting...')
const rootElement = document.getElementById('root')
console.log('Root element:', rootElement)

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  console.log('React app rendered')
} else {
  console.error('Root element not found!')
}
