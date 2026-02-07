import { useState, useRef, useEffect } from 'react';
import { Shield, Wrench, Building2, Users, Home, ChevronDown } from 'lucide-react';
import type { ActiveView } from '@/types/views.ts';

interface HeaderProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

const TOOLS = [
  {
    id: 'entity-role' as const,
    label: 'Entity Role Determination',
    description: 'Determine if you are a controller, processor, or joint controller',
    icon: Building2,
  },
  {
    id: 'processor-discovery' as const,
    label: 'Processor Discovery',
    description: 'Identify third-party service providers you share data with',
    icon: Users,
  },
];

export function Header({ activeView, onNavigate }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Shield className="h-6 w-6 text-primary" />
          <div className="text-left">
            <h1 className="text-lg font-semibold text-foreground">Privacy Policy Generator</h1>
            <p className="text-xs text-muted-foreground">Regulatory-precise privacy disclaimers</p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {activeView !== 'home' && (
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              <Home className="h-4 w-4" />
              Home
            </button>
          )}

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              <Wrench className="h-4 w-4" />
              Tools
              <ChevronDown className={`h-3 w-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-80 rounded-lg border border-border bg-card shadow-lg">
                <div className="p-1">
                  {TOOLS.map((tool) => {
                    const Icon = tool.icon;
                    const isActive = activeView === tool.id;
                    return (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => {
                          onNavigate(tool.id);
                          setDropdownOpen(false);
                        }}
                        className={`flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left hover:bg-accent ${
                          isActive ? 'bg-accent/50' : ''
                        }`}
                      >
                        <Icon className="mt-0.5 h-4 w-4 text-primary" />
                        <div>
                          <span className="block text-sm font-medium">{tool.label}</span>
                          <span className="block text-xs text-muted-foreground">{tool.description}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
