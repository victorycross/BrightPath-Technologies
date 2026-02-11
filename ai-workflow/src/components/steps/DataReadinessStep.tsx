import { useWorkflow } from '@/state/workflow-context';
import { FormField, TextArea, SelectInput } from '@/components/shared/FormField';

export function DataReadinessStep() {
  const { state, dispatch } = useWorkflow();
  const data = state.data.dataReadiness;

  function update(field: string, value: string) {
    dispatch({
      type: 'UPDATE_DATA',
      payload: { dataReadiness: { ...data, [field]: value } },
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <FormField label="Data Available" htmlFor="dataAvailable" hint="Is the necessary data currently accessible?">
          <SelectInput
            id="dataAvailable"
            value={data.dataAvailable}
            onChange={(e) => update('dataAvailable', e.target.value)}
            placeholder="Select"
            options={[
              { value: 'yes', label: 'Yes – fully available' },
              { value: 'partial', label: 'Partially available' },
              { value: 'no', label: 'Not yet available' },
            ]}
          />
        </FormField>

        <FormField label="Data Quality" htmlFor="dataQuality">
          <SelectInput
            id="dataQuality"
            value={data.dataQuality}
            onChange={(e) => update('dataQuality', e.target.value)}
            placeholder="Select"
            options={[
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' },
              { value: 'unknown', label: 'Unknown' },
            ]}
          />
        </FormField>

        <FormField label="PII Present" htmlFor="piiPresent" hint="Does the data contain personally identifiable information?">
          <SelectInput
            id="piiPresent"
            value={data.piiPresent}
            onChange={(e) => update('piiPresent', e.target.value)}
            placeholder="Select"
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
              { value: 'unknown', label: 'Unknown' },
            ]}
          />
        </FormField>

        <FormField label="Data Governance in Place" htmlFor="dataGovernanceInPlace">
          <SelectInput
            id="dataGovernanceInPlace"
            value={data.dataGovernanceInPlace}
            onChange={(e) => update('dataGovernanceInPlace', e.target.value)}
            placeholder="Select"
            options={[
              { value: 'yes', label: 'Yes – fully governed' },
              { value: 'partial', label: 'Partially governed' },
              { value: 'no', label: 'No governance' },
            ]}
          />
        </FormField>
      </div>

      <FormField label="Data Sources" htmlFor="dataSources" hint="List all data sources involved.">
        <TextArea
          id="dataSources"
          value={data.dataSources}
          onChange={(e) => update('dataSources', e.target.value)}
          placeholder="e.g., CRM, ERP, data warehouse, third-party APIs"
          rows={3}
        />
      </FormField>

      <FormField label="Data Volume" htmlFor="dataVolume">
        <TextArea
          id="dataVolume"
          value={data.dataVolume}
          onChange={(e) => update('dataVolume', e.target.value)}
          placeholder="Estimated size and growth rate"
          rows={2}
        />
      </FormField>

      <FormField label="Additional Notes" htmlFor="drNotes">
        <TextArea
          id="drNotes"
          value={data.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Other data readiness considerations"
          rows={2}
        />
      </FormField>
    </div>
  );
}
