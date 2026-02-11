import { useWorkflow } from '@/state/workflow-context';
import { FormField, TextArea, SelectInput } from '@/components/shared/FormField';

export function ImplementationStep() {
  const { state, dispatch } = useWorkflow();
  const data = state.data.implementationTracking;

  function update(field: string, value: string | number) {
    dispatch({
      type: 'UPDATE_DATA',
      payload: { implementationTracking: { ...data, [field]: value } },
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <FormField label="Current Phase" htmlFor="phase">
          <SelectInput
            id="phase"
            value={data.phase}
            onChange={(e) => update('phase', e.target.value)}
            placeholder="Select phase"
            options={[
              { value: 'not-started', label: 'Not Started' },
              { value: 'poc', label: 'Proof of Concept' },
              { value: 'pilot', label: 'Pilot' },
              { value: 'scaling', label: 'Scaling' },
              { value: 'production', label: 'Production' },
            ]}
          />
        </FormField>

        <FormField label="Testing Status" htmlFor="testingStatus">
          <SelectInput
            id="testingStatus"
            value={data.testingStatus}
            onChange={(e) => update('testingStatus', e.target.value)}
            placeholder="Select status"
            options={[
              { value: 'not-started', label: 'Not Started' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'complete', label: 'Complete' },
            ]}
          />
        </FormField>
      </div>

      <FormField label={`Progress: ${data.progress}%`} htmlFor="progress">
        <input
          id="progress"
          type="range"
          min={0}
          max={100}
          step={5}
          value={data.progress}
          onChange={(e) => update('progress', Number(e.target.value))}
          className="w-full accent-[var(--color-primary)]"
        />
        <div className="mt-1 h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${data.progress}%` }}
          />
        </div>
      </FormField>

      <FormField label="Blockers" htmlFor="blockers" hint="Current impediments to progress.">
        <TextArea
          id="blockers"
          value={data.blockers}
          onChange={(e) => update('blockers', e.target.value)}
          placeholder="List any blockers or issues"
          rows={3}
        />
      </FormField>

      <FormField label="Key Decisions" htmlFor="keyDecisions" hint="Important decisions made or pending.">
        <TextArea
          id="keyDecisions"
          value={data.keyDecisions}
          onChange={(e) => update('keyDecisions', e.target.value)}
          placeholder="Document key decisions and rationale"
          rows={3}
        />
      </FormField>

      <FormField label="Additional Notes" htmlFor="itNotes">
        <TextArea
          id="itNotes"
          value={data.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Other implementation notes"
          rows={2}
        />
      </FormField>
    </div>
  );
}
