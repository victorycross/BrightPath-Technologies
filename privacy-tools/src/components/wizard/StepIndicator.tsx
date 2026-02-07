import { cn } from '@/lib/utils.ts';

const STEPS = [
  { num: 1, label: 'Jurisdictions' },
  { num: 2, label: 'Organization' },
  { num: 3, label: 'Data Practices' },
  { num: 4, label: 'Third Parties' },
  { num: 5, label: 'Review' },
  { num: 6, label: 'Generate' },
];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      {STEPS.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                step.num === current && 'bg-primary text-primary-foreground',
                step.num < current && 'bg-primary/20 text-primary',
                step.num > current && 'bg-muted text-muted-foreground',
              )}
            >
              {step.num < current ? '✓' : step.num}
            </div>
            <span className="mt-1 hidden text-xs text-muted-foreground sm:block">{step.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                'mx-2 h-px w-8 sm:w-12',
                step.num < current ? 'bg-primary/40' : 'bg-border',
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
