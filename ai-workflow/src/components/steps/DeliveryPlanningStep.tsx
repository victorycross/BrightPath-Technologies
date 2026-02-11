import { useWorkflow } from '@/state/workflow-context';
import { FormField, TextInput, TextArea, SelectInput } from '@/components/shared/FormField';

export function DeliveryPlanningStep() {
  const { state, dispatch } = useWorkflow();
  const data = state.data.deliveryPlanning;

  function update(field: string, value: string) {
    dispatch({
      type: 'UPDATE_DATA',
      payload: { deliveryPlanning: { ...data, [field]: value } },
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <FormField label="Build Approach" htmlFor="approach">
          <SelectInput
            id="approach"
            value={data.approach}
            onChange={(e) => update('approach', e.target.value)}
            placeholder="Select approach"
            options={[
              { value: 'build', label: 'Build in-house' },
              { value: 'buy', label: 'Buy / SaaS solution' },
              { value: 'hybrid', label: 'Hybrid' },
            ]}
          />
        </FormField>

        <FormField label="Infrastructure" htmlFor="infrastructure">
          <SelectInput
            id="infrastructure"
            value={data.infrastructure}
            onChange={(e) => update('infrastructure', e.target.value)}
            placeholder="Select"
            options={[
              { value: 'cloud', label: 'Cloud' },
              { value: 'on-premise', label: 'On-Premise' },
              { value: 'hybrid', label: 'Hybrid' },
            ]}
          />
        </FormField>

        <FormField label="Team Size" htmlFor="teamSize">
          <TextInput
            id="teamSize"
            value={data.teamSize}
            onChange={(e) => update('teamSize', e.target.value)}
            placeholder="e.g., 5 FTEs + 2 contractors"
          />
        </FormField>

        <FormField label="Budget" htmlFor="budget">
          <TextInput
            id="budget"
            value={data.budget}
            onChange={(e) => update('budget', e.target.value)}
            placeholder="e.g., $250K – $400K"
          />
        </FormField>
      </div>

      <FormField label="Technology Stack" htmlFor="techStack" hint="Key technologies, platforms, and tools.">
        <TextArea
          id="techStack"
          value={data.techStack}
          onChange={(e) => update('techStack', e.target.value)}
          placeholder="e.g., Python, TensorFlow, AWS SageMaker, Snowflake"
          rows={3}
        />
      </FormField>

      <FormField label="Milestones" htmlFor="milestones" hint="Key deliverables and target dates.">
        <TextArea
          id="milestones"
          value={data.milestones}
          onChange={(e) => update('milestones', e.target.value)}
          placeholder="List major milestones with target completion dates"
          rows={4}
        />
      </FormField>

      <FormField label="Dependencies" htmlFor="dependencies">
        <TextArea
          id="dependencies"
          value={data.dependencies}
          onChange={(e) => update('dependencies', e.target.value)}
          placeholder="External dependencies, blockers, or prerequisites"
          rows={3}
        />
      </FormField>

      <FormField label="Additional Notes" htmlFor="dpNotes">
        <TextArea
          id="dpNotes"
          value={data.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Other delivery planning notes"
          rows={2}
        />
      </FormField>
    </div>
  );
}
