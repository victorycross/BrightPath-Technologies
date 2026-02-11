import { useWorkflow } from '@/state/workflow-context';
import { FormField, TextArea, SelectInput } from '@/components/shared/FormField';

const COMPLIANCE_OPTIONS = [
  { value: 'compliant', label: 'Compliant' },
  { value: 'partial', label: 'Partially Compliant' },
  { value: 'non-compliant', label: 'Non-Compliant' },
  { value: 'not-applicable', label: 'Not Applicable' },
];

export function GovernanceReviewStep() {
  const { state, dispatch } = useWorkflow();
  const data = state.data.governanceReview;

  function update(field: string, value: string) {
    dispatch({
      type: 'UPDATE_DATA',
      payload: { governanceReview: { ...data, [field]: value } },
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <FormField label="Canadian AI Act Compliance" htmlFor="aiActCompliance" hint="Status against Canada's Artificial Intelligence and Data Act (AIDA).">
          <SelectInput
            id="aiActCompliance"
            value={data.aiActCompliance}
            onChange={(e) => update('aiActCompliance', e.target.value)}
            placeholder="Select status"
            options={COMPLIANCE_OPTIONS}
          />
        </FormField>

        <FormField label="PIPEDA Compliance" htmlFor="pipedaCompliance" hint="Personal Information Protection and Electronic Documents Act.">
          <SelectInput
            id="pipedaCompliance"
            value={data.pipedaCompliance}
            onChange={(e) => update('pipedaCompliance', e.target.value)}
            placeholder="Select status"
            options={COMPLIANCE_OPTIONS}
          />
        </FormField>

        <FormField label="Ethics Review" htmlFor="ethicsReview">
          <SelectInput
            id="ethicsReview"
            value={data.ethicsReview}
            onChange={(e) => update('ethicsReview', e.target.value)}
            placeholder="Select status"
            options={[
              { value: 'approved', label: 'Approved' },
              { value: 'pending', label: 'Pending Review' },
              { value: 'not-started', label: 'Not Started' },
            ]}
          />
        </FormField>

        <FormField label="Human Oversight" htmlFor="humanOversight" hint="Level of human-in-the-loop control.">
          <SelectInput
            id="humanOversight"
            value={data.humanOversight}
            onChange={(e) => update('humanOversight', e.target.value)}
            placeholder="Select level"
            options={[
              { value: 'full', label: 'Full – all decisions reviewed' },
              { value: 'partial', label: 'Partial – high-risk decisions reviewed' },
              { value: 'none', label: 'None – fully automated' },
            ]}
          />
        </FormField>
      </div>

      <FormField label="Regulatory Requirements" htmlFor="regulatoryRequirements" hint="List applicable regulations, standards, or frameworks.">
        <TextArea
          id="regulatoryRequirements"
          value={data.regulatoryRequirements}
          onChange={(e) => update('regulatoryRequirements', e.target.value)}
          placeholder="e.g., PIPEDA, AIDA, OSFI guidelines, industry-specific regulations"
          rows={3}
        />
      </FormField>

      <FormField label="Transparency Plan" htmlFor="transparencyPlan" hint="How will AI decisions be explained to stakeholders?">
        <TextArea
          id="transparencyPlan"
          value={data.transparencyPlan}
          onChange={(e) => update('transparencyPlan', e.target.value)}
          placeholder="Outline the explainability and transparency approach"
          rows={3}
        />
      </FormField>

      <FormField label="Additional Notes" htmlFor="grNotes">
        <TextArea
          id="grNotes"
          value={data.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Other governance considerations"
          rows={2}
        />
      </FormField>
    </div>
  );
}
