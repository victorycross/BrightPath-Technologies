import { useDisclaimer } from '@/state/disclaimer-context.tsx';
import { StepIndicator } from './StepIndicator.tsx';
import { StepNavigation } from './StepNavigation.tsx';
import { Step1Jurisdictions } from '@/components/steps/Step1Jurisdictions.tsx';
import { Step2OrgProfile } from '@/components/steps/Step2OrgProfile.tsx';
import { Step3DataPractices } from '@/components/steps/Step3DataPractices.tsx';
import { Step4ThirdParty } from '@/components/steps/Step4ThirdParty.tsx';
import { Step5Review } from '@/components/steps/Step5Review.tsx';
import { Step6Generate } from '@/components/steps/Step6Generate.tsx';

const TOTAL_STEPS = 6;

export function WizardPanel() {
  const { state, dispatch } = useDisclaimer();
  const step = state.currentStep;

  function canAdvance(): boolean {
    switch (step) {
      case 1: return state.jurisdictions.length > 0;
      case 2: return !!(state.orgProfile.legalName && state.orgProfile.entityType && state.orgProfile.industrySector && state.orgProfile.headquartersCountry && state.orgProfile.dpoContact?.email && state.orgProfile.dpoContact?.title);
      case 3: return (state.dataPractices.dataCategories ?? []).length > 0 && (state.dataPractices.processingPurposes ?? []).length > 0 && (state.dataPractices.consentMechanisms ?? []).length > 0 && (state.dataPractices.dataSources ?? []).length > 0;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  }

  function goBack() {
    if (step > 1) dispatch({ type: 'SET_STEP', payload: step - 1 });
  }

  function goNext() {
    if (step < TOTAL_STEPS && canAdvance()) {
      dispatch({ type: 'SET_STEP', payload: step + 1 });
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <StepIndicator current={step} />
      <div className="min-h-[400px]">
        {step === 1 && <Step1Jurisdictions />}
        {step === 2 && <Step2OrgProfile />}
        {step === 3 && <Step3DataPractices />}
        {step === 4 && <Step4ThirdParty />}
        {step === 5 && <Step5Review />}
        {step === 6 && <Step6Generate />}
      </div>
      {step < TOTAL_STEPS && (
        <StepNavigation
          current={step}
          onBack={goBack}
          onNext={goNext}
          nextDisabled={!canAdvance()}
          nextLabel={step === 5 ? 'Generate' : undefined}
        />
      )}
    </div>
  );
}
