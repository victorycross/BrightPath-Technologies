import { useWorkflow } from '@/state/workflow-context';
import { FormField, TextArea, SelectInput } from '@/components/shared/FormField';

const IMPACT_OPTIONS = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export function BusinessImpactStep() {
  const { state, dispatch } = useWorkflow();
  const data = state.data.businessImpact;

  function update(field: string, value: string) {
    dispatch({
      type: 'UPDATE_DATA',
      payload: { businessImpact: { ...data, [field]: value } },
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <FormField label="Strategic Alignment" htmlFor="strategicAlignment" hint="How closely does this align with corporate strategy?">
          <SelectInput
            id="strategicAlignment"
            value={data.strategicAlignment}
            onChange={(e) => update('strategicAlignment', e.target.value)}
            placeholder="Select level"
            options={IMPACT_OPTIONS}
          />
        </FormField>

        <FormField label="Revenue Impact" htmlFor="revenueImpact">
          <SelectInput
            id="revenueImpact"
            value={data.revenueImpact}
            onChange={(e) => update('revenueImpact', e.target.value)}
            placeholder="Select level"
            options={IMPACT_OPTIONS}
          />
        </FormField>

        <FormField label="Cost Reduction Potential" htmlFor="costReduction">
          <SelectInput
            id="costReduction"
            value={data.costReduction}
            onChange={(e) => update('costReduction', e.target.value)}
            placeholder="Select level"
            options={IMPACT_OPTIONS}
          />
        </FormField>

        <FormField label="Customer Experience Impact" htmlFor="customerExperience">
          <SelectInput
            id="customerExperience"
            value={data.customerExperience}
            onChange={(e) => update('customerExperience', e.target.value)}
            placeholder="Select level"
            options={IMPACT_OPTIONS}
          />
        </FormField>
      </div>

      <FormField label="Competitive Advantage" htmlFor="competitiveAdvantage">
        <TextArea
          id="competitiveAdvantage"
          value={data.competitiveAdvantage}
          onChange={(e) => update('competitiveAdvantage', e.target.value)}
          placeholder="How does this create or sustain competitive advantage?"
          rows={3}
        />
      </FormField>

      <FormField label="Estimated ROI" htmlFor="estimatedROI" hint="Include timeframe and assumptions.">
        <TextArea
          id="estimatedROI"
          value={data.estimatedROI}
          onChange={(e) => update('estimatedROI', e.target.value)}
          placeholder="e.g., 15% cost reduction within 12 months, $500K annual savings"
          rows={2}
        />
      </FormField>

      <FormField label="Additional Notes" htmlFor="biNotes">
        <TextArea
          id="biNotes"
          value={data.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Any other business impact considerations"
          rows={2}
        />
      </FormField>
    </div>
  );
}
