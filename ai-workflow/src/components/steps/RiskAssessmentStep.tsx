import { useWorkflow } from '@/state/workflow-context';
import { FormField, TextArea, SelectInput } from '@/components/shared/FormField';

const RISK_OPTIONS = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export function RiskAssessmentStep() {
  const { state, dispatch } = useWorkflow();
  const data = state.data.riskAssessment;

  function update(field: string, value: string) {
    dispatch({
      type: 'UPDATE_DATA',
      payload: { riskAssessment: { ...data, [field]: value } },
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FormField label="Bias Risk" htmlFor="biasRisk" hint="Risk of discriminatory or unfair outcomes.">
          <SelectInput
            id="biasRisk"
            value={data.biasRisk}
            onChange={(e) => update('biasRisk', e.target.value)}
            placeholder="Select level"
            options={RISK_OPTIONS}
          />
        </FormField>

        <FormField label="Privacy Risk" htmlFor="privacyRisk" hint="Exposure of personal or sensitive data.">
          <SelectInput
            id="privacyRisk"
            value={data.privacyRisk}
            onChange={(e) => update('privacyRisk', e.target.value)}
            placeholder="Select level"
            options={RISK_OPTIONS}
          />
        </FormField>

        <FormField label="Security Risk" htmlFor="securityRisk" hint="Vulnerability to adversarial attacks.">
          <SelectInput
            id="securityRisk"
            value={data.securityRisk}
            onChange={(e) => update('securityRisk', e.target.value)}
            placeholder="Select level"
            options={RISK_OPTIONS}
          />
        </FormField>

        <FormField label="Reputational Risk" htmlFor="reputationalRisk" hint="Potential brand or trust impact.">
          <SelectInput
            id="reputationalRisk"
            value={data.reputationalRisk}
            onChange={(e) => update('reputationalRisk', e.target.value)}
            placeholder="Select level"
            options={RISK_OPTIONS}
          />
        </FormField>

        <FormField label="Operational Risk" htmlFor="operationalRisk" hint="Impact on day-to-day operations.">
          <SelectInput
            id="operationalRisk"
            value={data.operationalRisk}
            onChange={(e) => update('operationalRisk', e.target.value)}
            placeholder="Select level"
            options={RISK_OPTIONS}
          />
        </FormField>
      </div>

      <FormField label="Mitigation Plan" htmlFor="mitigationPlan" hint="Describe how identified risks will be addressed.">
        <TextArea
          id="mitigationPlan"
          value={data.mitigationPlan}
          onChange={(e) => update('mitigationPlan', e.target.value)}
          placeholder="For each high or medium risk, outline the mitigation strategy"
          rows={4}
        />
      </FormField>

      <FormField label="Additional Notes" htmlFor="raNotes">
        <TextArea
          id="raNotes"
          value={data.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Other risk considerations"
          rows={2}
        />
      </FormField>
    </div>
  );
}
