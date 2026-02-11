import { useWorkflow } from '@/state/workflow-context';
import { STEPS } from '@/types/steps';
import { Stepper } from './Stepper';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { UseCaseIntakeStep } from '@/components/steps/UseCaseIntakeStep';
import { BusinessImpactStep } from '@/components/steps/BusinessImpactStep';
import { DataReadinessStep } from '@/components/steps/DataReadinessStep';
import { RiskAssessmentStep } from '@/components/steps/RiskAssessmentStep';
import { GovernanceReviewStep } from '@/components/steps/GovernanceReviewStep';
import { DeliveryPlanningStep } from '@/components/steps/DeliveryPlanningStep';
import { ImplementationStep } from '@/components/steps/ImplementationStep';
import { LaunchMonitoringStep } from '@/components/steps/LaunchMonitoringStep';

const STEP_COMPONENTS = [
  UseCaseIntakeStep,
  BusinessImpactStep,
  DataReadinessStep,
  RiskAssessmentStep,
  GovernanceReviewStep,
  DeliveryPlanningStep,
  ImplementationStep,
  LaunchMonitoringStep,
];

export function WizardLayout() {
  const { state, dispatch } = useWorkflow();
  const { currentStep, completedSteps } = state;
  const stepMeta = STEPS[currentStep];
  const StepComponent = STEP_COMPONENTS[currentStep];

  function handleNext() {
    dispatch({ type: 'MARK_COMPLETE', step: currentStep });
    dispatch({ type: 'NEXT_STEP' });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card no-print">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">AI Workflow</h1>
            <p className="text-sm text-muted-foreground">BrightPath Technologies</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              if (confirm('Reset all workflow data? This cannot be undone.')) {
                dispatch({ type: 'RESET' });
              }
            }}
            className="text-xs text-muted-foreground"
          >
            Reset
          </Button>
        </div>
      </header>

      {/* Stepper */}
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <Stepper
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={(step) => dispatch({ type: 'GO_TO_STEP', step })}
        />
      </div>

      {/* Step Content */}
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Card>
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Step {currentStep + 1} of {STEPS.length}
            </p>
            <h2 className="text-2xl font-bold text-foreground">{stepMeta.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{stepMeta.description}</p>
          </div>

          <StepComponent />

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-border pt-6 no-print">
            <Button
              variant="outline"
              onClick={() => dispatch({ type: 'PREV_STEP' })}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            <div className="flex gap-3">
              {!completedSteps.has(currentStep) && (
                <Button
                  variant="secondary"
                  onClick={() => dispatch({ type: 'MARK_COMPLETE', step: currentStep })}
                >
                  Mark Complete
                </Button>
              )}
              {currentStep < STEPS.length - 1 ? (
                <Button onClick={handleNext}>
                  Save &amp; Continue
                </Button>
              ) : (
                <Button
                  onClick={() => dispatch({ type: 'MARK_COMPLETE', step: currentStep })}
                  className="bg-success text-success-foreground hover:opacity-90"
                >
                  Finish Workflow
                </Button>
              )}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
