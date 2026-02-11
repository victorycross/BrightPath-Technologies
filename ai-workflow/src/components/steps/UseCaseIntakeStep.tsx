import { useWorkflow } from '@/state/workflow-context';
import { FormField, TextInput, TextArea, SelectInput } from '@/components/shared/FormField';

export function UseCaseIntakeStep() {
  const { state, dispatch } = useWorkflow();
  const data = state.data.useCaseIntake;

  function update(field: string, value: string) {
    dispatch({
      type: 'UPDATE_DATA',
      payload: { useCaseIntake: { ...data, [field]: value } },
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <FormField label="Project Name" htmlFor="projectName">
          <TextInput
            id="projectName"
            value={data.projectName}
            onChange={(e) => update('projectName', e.target.value)}
            placeholder="e.g., Customer Churn Predictor"
          />
        </FormField>

        <FormField label="Executive Sponsor" htmlFor="sponsor">
          <TextInput
            id="sponsor"
            value={data.sponsor}
            onChange={(e) => update('sponsor', e.target.value)}
            placeholder="Name and title"
          />
        </FormField>

        <FormField label="Department" htmlFor="department">
          <TextInput
            id="department"
            value={data.department}
            onChange={(e) => update('department', e.target.value)}
            placeholder="e.g., Marketing, Operations"
          />
        </FormField>

        <FormField label="Target Timeline" htmlFor="timeline">
          <SelectInput
            id="timeline"
            value={data.timeline}
            onChange={(e) => update('timeline', e.target.value)}
            placeholder="Select timeline"
            options={[
              { value: 'immediate', label: 'Immediate (< 1 month)' },
              { value: '3-months', label: '1 – 3 months' },
              { value: '6-months', label: '3 – 6 months' },
              { value: '12-months', label: '6 – 12 months' },
            ]}
          />
        </FormField>
      </div>

      <FormField label="Use Case Description" htmlFor="description" hint="Describe the AI use case in detail.">
        <TextArea
          id="description"
          value={data.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="What problem does this AI solution solve?"
          rows={4}
        />
      </FormField>

      <FormField label="Business Objectives" htmlFor="objectives">
        <TextArea
          id="objectives"
          value={data.objectives}
          onChange={(e) => update('objectives', e.target.value)}
          placeholder="Key objectives this initiative supports"
          rows={3}
        />
      </FormField>

      <FormField label="Expected Outcome" htmlFor="expectedOutcome">
        <TextArea
          id="expectedOutcome"
          value={data.expectedOutcome}
          onChange={(e) => update('expectedOutcome', e.target.value)}
          placeholder="What does success look like?"
          rows={3}
        />
      </FormField>
    </div>
  );
}
