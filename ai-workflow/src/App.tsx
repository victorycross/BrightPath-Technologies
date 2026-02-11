import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { WorkflowProvider } from '@/state/workflow-context'
import { LandingPage } from '@/components/pages/LandingPage'
import { WizardLayout } from '@/components/wizard/WizardLayout'

export default function App() {
  return (
    <BrowserRouter basename="/ai-workflow">
      <WorkflowProvider>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="workflow" element={<WizardLayout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </WorkflowProvider>
    </BrowserRouter>
  )
}
