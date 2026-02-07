import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils.ts';

interface StepNavigationProps {
  current: number;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}

export function StepNavigation({ current, onBack, onNext, nextLabel, nextDisabled }: StepNavigationProps) {
  return (
    <div className="mt-6 flex justify-between">
      <button
        type="button"
        onClick={onBack}
        disabled={current <= 1}
        className={cn(
          'inline-flex items-center gap-1 rounded-md border border-border px-4 py-2 text-sm font-medium',
          current <= 1
            ? 'cursor-not-allowed opacity-40'
            : 'hover:bg-accent',
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className={cn(
          'inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground',
          nextDisabled
            ? 'cursor-not-allowed opacity-40'
            : 'hover:bg-primary/90',
        )}
      >
        {nextLabel ?? 'Next'}
        {!nextLabel && <ChevronRight className="h-4 w-4" />}
      </button>
    </div>
  );
}
