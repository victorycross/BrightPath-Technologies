import type { ReactNode } from 'react';
import { Header } from './Header.tsx';
import type { ActiveView } from '@/types/views.ts';

interface LayoutProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  mainContent: ReactNode;
  preview: ReactNode;
}

export function Layout({ activeView, onNavigate, mainContent, preview }: LayoutProps) {
  const showPreview = activeView === 'wizard';

  return (
    <div className="flex h-screen flex-col">
      <Header activeView={activeView} onNavigate={onNavigate} />
      <div className="flex flex-1 overflow-hidden">
        <div className={`overflow-y-auto p-6 ${showPreview ? 'w-full border-r border-border lg:w-3/5' : 'w-full'}`}>
          {mainContent}
        </div>
        {showPreview && (
          <div className="hidden overflow-y-auto bg-muted/30 p-6 lg:block lg:w-2/5">
            {preview}
          </div>
        )}
      </div>
      <footer className="border-t border-border px-6 py-2 text-center text-xs text-muted-foreground">
        Privacy Disclaimer Agent v0.1.0 — This tool does not constitute legal advice.
      </footer>
    </div>
  );
}
