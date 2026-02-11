import { cn } from '@/lib/utils';
import { STEPS } from '@/types/steps';

interface StepperProps {
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick: (step: number) => void;
}

export function Stepper({ currentStep, completedSteps, onStepClick }: StepperProps) {
  return (
    <nav aria-label="Workflow progress" className="w-full overflow-x-auto no-print">
      <ol className="flex items-center gap-1 min-w-max px-1 py-2">
        {STEPS.map((step, i) => {
          const isActive = i === currentStep;
          const isComplete = completedSteps.has(i);
          const isClickable = isComplete || i <= currentStep;

          return (
            <li key={step.id} className="flex items-center">
              <button
                onClick={() => isClickable && onStepClick(i)}
                disabled={!isClickable}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive && 'bg-primary text-primary-foreground font-medium',
                  !isActive && isComplete && 'bg-success/15 text-success hover:bg-success/25',
                  !isActive && !isComplete && isClickable && 'text-foreground hover:bg-accent',
                  !isClickable && 'text-muted-foreground cursor-not-allowed opacity-50',
                )}
                aria-current={isActive ? 'step' : undefined}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                    isActive && 'bg-primary-foreground text-primary',
                    !isActive && isComplete && 'bg-success text-success-foreground',
                    !isActive && !isComplete && 'border border-current',
                  )}
                >
                  {isComplete && !isActive ? (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="hidden lg:inline">{step.shortTitle}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={cn('mx-1 h-px w-4', isComplete ? 'bg-success' : 'bg-border')} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
