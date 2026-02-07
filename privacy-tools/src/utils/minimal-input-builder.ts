import {
  Jurisdiction,
  DataCategory,
  ProcessingPurpose,
  LegalBasis,
  DataSource,
  ConsentMechanism,
} from '@core/data/enums.js';
import type { ValidatedInput } from '@core/data/types.js';

interface MinimalInputOptions {
  jurisdictions: Jurisdiction[];
  dataCategories: DataCategory[];
  recipients: { category: string; purpose: string; dataCategories: DataCategory[]; country?: string }[];
}

export function buildMinimalValidatedInput(options: MinimalInputOptions): ValidatedInput {
  return {
    jurisdictions: options.jurisdictions,
    orgProfile: {
      legalName: 'Organization',
      entityType: 'controller',
      industrySector: 'Technology',
      headquartersCountry: 'Canada',
      dpoContact: {
        title: 'Privacy Officer',
        email: 'privacy@organization.example',
      },
    },
    dataPractices: {
      dataCategories: options.dataCategories,
      dataSources: [DataSource.DIRECTLY_FROM_SUBJECT],
      processingPurposes: [
        {
          purpose: ProcessingPurpose.SERVICE_DELIVERY,
          legalBasis: LegalBasis.LEGITIMATE_INTEREST,
        },
      ],
      retentionSchedule: options.dataCategories.map((cat) => ({
        dataCategory: cat,
        period: 'As required for the stated purpose',
      })),
      thirdPartySharing: {
        shares: options.recipients.length > 0,
        sellsData: false,
        sharesForCrossBehavioral: false,
        recipients: options.recipients,
      },
      crossBorderTransfers: {
        transfers: false,
      },
      consentMechanisms: [ConsentMechanism.OPT_IN],
      collectsChildrensData: false,
      usesCookies: false,
      usesAutomatedDecisionMaking: false,
      conductsDPIA: false,
    },
  };
}
