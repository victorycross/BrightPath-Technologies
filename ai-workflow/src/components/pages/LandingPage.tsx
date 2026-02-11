import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/shared/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/shared/Card';
import { STEPS } from '@/types/steps';

const ICONS = ['📋', '📊', '🗄️', '⚠️', '🏛️', '🚀', '⚙️', '📡'];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary mb-3">
            BrightPath Technologies
          </p>
          <h1 className="text-4xl font-bold text-foreground md:text-5xl">
            AI Workflow Manager
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A guided 8-step process to take your AI initiative from use case intake through
            risk review, delivery planning, and launch monitoring — with Canadian regulatory
            compliance built in.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button onClick={() => navigate('/workflow')} className="px-8 py-3 text-base">
              Start New Workflow
            </Button>
            <Button variant="outline" onClick={() => navigate('/workflow')} className="px-8 py-3 text-base">
              Resume Workflow
            </Button>
          </div>
        </div>
      </header>

      {/* Steps overview */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-center text-2xl font-bold text-foreground mb-2">The 8-Step Process</h2>
        <p className="text-center text-muted-foreground mb-8">
          Each step captures critical information to ensure responsible, effective AI deployment.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Card key={step.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{ICONS[i]}</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                </div>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription className="mt-1">{step.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Value Props */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Canadian Compliance</h3>
              <p className="text-sm text-muted-foreground">
                Built-in checks for PIPEDA, AIDA, and Canadian regulatory frameworks
                to keep your AI initiatives compliant.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Practical Implementation</h3>
              <p className="text-sm text-muted-foreground">
                Move beyond theory with actionable deliverables at every stage — from
                risk mitigation plans to go-live checklists.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Progress Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Auto-saved progress with step completion tracking. Pick up right where
                you left off, anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} BrightPath Technologies. All rights reserved.
      </footer>
    </div>
  );
}
