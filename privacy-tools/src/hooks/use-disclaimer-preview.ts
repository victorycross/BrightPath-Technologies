import { useMemo } from 'react';
import { ValidatedInputSchema } from '@core/data/types.js';
import type { DisclaimerSection, DisclaimerMetadata } from '@core/data/types.js';
import { mapRegulations } from '@core/core/regulatory-mapper.js';
import { buildDisclaimer } from '@core/core/disclaimer-builder.js';
import { renderMarkdown } from '@core/templates/renderers/markdown.renderer.js';
import type { DisclaimerState } from '@/state/disclaimer-reducer.ts';

interface PreviewResult {
  markdown: string | null;
  sections: DisclaimerSection[] | null;
  metadata: DisclaimerMetadata | null;
  isValid: boolean;
  requirementCount: number;
}

export function useDisclaimerPreview(state: DisclaimerState): PreviewResult {
  return useMemo(() => {
    const dp = state.dataPractices;
    const raw = {
      jurisdictions: state.jurisdictions,
      orgProfile: state.orgProfile,
      dataPractices: {
        ...dp,
        collectsChildrensData: dp.collectsChildrensData ?? false,
        usesCookies: dp.usesCookies ?? false,
        usesAutomatedDecisionMaking: dp.usesAutomatedDecisionMaking ?? false,
        conductsDPIA: dp.conductsDPIA ?? false,
        thirdPartySharing: dp.thirdPartySharing ?? { shares: false, recipients: [], sellsData: false, sharesForCrossBehavioral: false },
        crossBorderTransfers: dp.crossBorderTransfers ?? { transfers: false, destinations: [] },
      },
    };

    const result = ValidatedInputSchema.safeParse(raw);
    if (!result.success) {
      return { markdown: null, sections: null, metadata: null, isValid: false, requirementCount: 0 };
    }

    const input = result.data;
    const requirements = mapRegulations(input);
    const { sections, metadata } = buildDisclaimer(requirements, input);
    const markdown = renderMarkdown(sections, metadata);

    return {
      markdown,
      sections,
      metadata,
      isValid: true,
      requirementCount: requirements.length,
    };
  }, [state.jurisdictions, state.orgProfile, state.dataPractices]);
}
