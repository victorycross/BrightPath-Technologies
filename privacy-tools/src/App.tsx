import { useState } from 'react';
import { DisclaimerProvider } from '@/state/disclaimer-context.tsx';
import { Layout } from '@/components/layout/Layout.tsx';
import { HomePage } from '@/components/home/HomePage.tsx';
import { WizardPanel } from '@/components/wizard/WizardPanel.tsx';
import { PreviewPanel } from '@/components/preview/PreviewPanel.tsx';
import { EntityRoleStandalone } from '@/components/tools/EntityRoleStandalone.tsx';
import { ProcessorDiscoveryStandalone } from '@/components/tools/ProcessorDiscoveryStandalone.tsx';
import { CookieDisclaimerStandalone } from '@/components/tools/CookieDisclaimerStandalone.tsx';
import type { ActiveView } from '@/types/views.ts';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');

  function renderMainContent() {
    switch (activeView) {
      case 'home':
        return <HomePage onNavigate={setActiveView} />;
      case 'entity-role':
        return <EntityRoleStandalone onClose={() => setActiveView('home')} />;
      case 'processor-discovery':
        return <ProcessorDiscoveryStandalone onClose={() => setActiveView('home')} />;
      case 'cookie-disclaimer':
        return <CookieDisclaimerStandalone onClose={() => setActiveView('home')} />;
      case 'wizard':
      default:
        return <WizardPanel />;
    }
  }

  return (
    <DisclaimerProvider>
      <Layout
        activeView={activeView}
        onNavigate={setActiveView}
        mainContent={renderMainContent()}
        preview={<PreviewPanel />}
      />
    </DisclaimerProvider>
  );
}
