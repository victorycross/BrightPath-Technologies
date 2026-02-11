import { useWorkflow } from '@/state/workflow-context';
import { FormField, TextInput, TextArea, SelectInput } from '@/components/shared/FormField';

export function LaunchMonitoringStep() {
  const { state, dispatch } = useWorkflow();
  const data = state.data.launchMonitoring;

  function update(field: string, value: string) {
    dispatch({
      type: 'UPDATE_DATA',
      payload: { launchMonitoring: { ...data, [field]: value } },
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <FormField label="Target Launch Date" htmlFor="launchDate">
          <TextInput
            id="launchDate"
            type="date"
            value={data.launchDate}
            onChange={(e) => update('launchDate', e.target.value)}
          />
        </FormField>

        <FormField label="Alerts Configured" htmlFor="alertsConfigured">
          <SelectInput
            id="alertsConfigured"
            value={data.alertsConfigured}
            onChange={(e) => update('alertsConfigured', e.target.value)}
            placeholder="Select"
            options={[
              { value: 'yes', label: 'Yes – fully configured' },
              { value: 'partial', label: 'Partially configured' },
              { value: 'no', label: 'Not yet' },
            ]}
          />
        </FormField>

        <FormField label="Feedback Loop" htmlFor="feedbackLoop" hint="Is there a mechanism to collect and act on user feedback?">
          <SelectInput
            id="feedbackLoop"
            value={data.feedbackLoop}
            onChange={(e) => update('feedbackLoop', e.target.value)}
            placeholder="Select"
            options={[
              { value: 'yes', label: 'Yes – active feedback loop' },
              { value: 'partial', label: 'Partially in place' },
              { value: 'no', label: 'Not yet' },
            ]}
          />
        </FormField>
      </div>

      <FormField label="Go-Live Checklist" htmlFor="goLiveChecklist" hint="Key items that must be completed before launch.">
        <TextArea
          id="goLiveChecklist"
          value={data.goLiveChecklist}
          onChange={(e) => update('goLiveChecklist', e.target.value)}
          placeholder="List go-live prerequisites and their status"
          rows={4}
        />
      </FormField>

      <FormField label="Monitoring Metrics" htmlFor="monitoringMetrics" hint="KPIs and metrics to track post-launch.">
        <TextArea
          id="monitoringMetrics"
          value={data.monitoringMetrics}
          onChange={(e) => update('monitoringMetrics', e.target.value)}
          placeholder="e.g., model accuracy, latency, drift detection, user satisfaction"
          rows={4}
        />
      </FormField>

      <FormField label="Retraining Plan" htmlFor="retrainingPlan" hint="When and how will the model be updated?">
        <TextArea
          id="retrainingPlan"
          value={data.retrainingPlan}
          onChange={(e) => update('retrainingPlan', e.target.value)}
          placeholder="Describe retraining triggers, frequency, and process"
          rows={3}
        />
      </FormField>

      <FormField label="Additional Notes" htmlFor="lmNotes">
        <TextArea
          id="lmNotes"
          value={data.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Other launch and monitoring considerations"
          rows={2}
        />
      </FormField>
    </div>
  );
}
