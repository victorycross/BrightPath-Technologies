import { Jurisdiction, JURISDICTION_LABELS, DATA_CATEGORY_LABELS, DataCategory } from '@core/data/enums.js';
import type { MappedRequirement } from '@core/data/types.js';
import { getRoleImplication } from './role-implications.ts';

// --- Processor Disclosure ---

interface Recipient {
  category: string;
  purpose: string;
  dataCategories: DataCategory[];
  country?: string;
}

interface ProcessorDisclosureInput {
  recipients: Recipient[];
  jurisdictions: Jurisdiction[];
  requirements: MappedRequirement[];
  generatedAt: Date;
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function shortLabel(cat: DataCategory): string {
  return DATA_CATEGORY_LABELS[cat].split('(')[0].trim();
}

export function renderProcessorDisclosure(input: ProcessorDisclosureInput): string {
  const lines: string[] = [];

  // YAML frontmatter
  lines.push('---');
  lines.push('title: "Third-Party Processor Disclosure"');
  lines.push('document_type: "processor_disclosure"');
  lines.push(`generated: "${input.generatedAt.toISOString()}"`);
  lines.push('jurisdictions:');
  for (const j of input.jurisdictions) {
    lines.push(`  - "${j}"`);
  }
  lines.push(`processor_count: ${input.recipients.length}`);
  lines.push('---');
  lines.push('');

  // Title
  lines.push('# Third-Party Processor Disclosure');
  lines.push('');
  lines.push(
    'This document identifies the categories of third-party service providers with whom personal information may be shared, the purposes of such sharing, and the applicable regulatory requirements.',
  );
  lines.push('');

  // Third-Party Service Providers
  lines.push('## Third-Party Service Providers');
  lines.push('');
  if (input.recipients.length === 0) {
    lines.push('No third-party service providers identified.');
  } else {
    lines.push(
      'The following categories of third-party service providers may receive personal information in connection with the stated purposes:',
    );
    lines.push('');
    for (const r of input.recipients) {
      lines.push(`- **${r.category}**: ${r.purpose}`);
      if (r.country) {
        lines.push(`  - Location: ${r.country}`);
      }
      if (r.dataCategories.length > 0) {
        const labels = r.dataCategories.map(shortLabel).join(', ');
        lines.push(`  - Data categories: ${labels}`);
      }
    }
  }
  lines.push('');

  // Processor Registry Table
  lines.push('## Processor Registry');
  lines.push('');
  if (input.recipients.length > 0) {
    lines.push('| Category | Purpose | Data Categories | Country |');
    lines.push('|----------|---------|-----------------|---------|');
    for (const r of input.recipients) {
      const cats = r.dataCategories.map(shortLabel).join(', ');
      const country = r.country || 'Not specified';
      lines.push(`| ${r.category} | ${r.purpose} | ${cats} | ${country} |`);
    }
  } else {
    lines.push('No processors registered.');
  }
  lines.push('');

  // Regulatory Disclosure Requirements
  if (input.requirements.length > 0) {
    lines.push('## Regulatory Disclosure Requirements');
    lines.push('');

    const byJurisdiction = new Map<Jurisdiction, MappedRequirement[]>();
    for (const req of input.requirements) {
      const existing = byJurisdiction.get(req.jurisdiction) ?? [];
      existing.push(req);
      byJurisdiction.set(req.jurisdiction, existing);
    }

    for (const [jurisdiction, reqs] of byJurisdiction) {
      lines.push(`### ${JURISDICTION_LABELS[jurisdiction]}`);
      lines.push('');
      for (const req of reqs) {
        lines.push(req.disclaimerLanguage);
        lines.push('');
      }
    }
  }

  // Statutory References
  const allCitations = input.requirements;
  if (allCitations.length > 0) {
    lines.push('## Statutory References');
    lines.push('');
    const seen = new Set<string>();
    for (const req of allCitations) {
      const key = `${req.jurisdiction}-${req.statutoryReference}`;
      if (seen.has(key)) continue;
      seen.add(key);
      lines.push(`- **${req.statutoryReference}** (${JURISDICTION_LABELS[req.jurisdiction]})`);
    }
    lines.push('');
  }

  // Legal disclaimer
  lines.push('---');
  lines.push('');
  lines.push(
    '*This document does not constitute legal advice. It is generated as a reference tool and should be reviewed by qualified legal counsel before use in regulatory filings, data processing agreements, or public-facing disclosures.*',
  );
  lines.push('');

  return lines.join('\n');
}

// --- Role Determination Memo ---

interface DecisionPathEntry {
  questionNumber: number;
  question: string;
  answer: 'Yes' | 'No';
}

interface RoleDeterminationInput {
  entityType: 'controller' | 'processor' | 'joint_controller';
  outcomeLabel: string;
  outcomeExplanation: string;
  decisionPath: DecisionPathEntry[];
  jurisdictions: Jurisdiction[];
  generatedAt: Date;
}

const ENTITY_TYPE_DISPLAY: Record<string, string> = {
  controller: 'Data Controller',
  processor: 'Data Processor',
  joint_controller: 'Joint Controller',
};

export function renderRoleDeterminationMemo(input: RoleDeterminationInput): string {
  const lines: string[] = [];

  // YAML frontmatter
  lines.push('---');
  lines.push('title: "Entity Role Determination Memo"');
  lines.push('document_type: "role_determination"');
  lines.push(`determined_role: "${input.entityType}"`);
  lines.push(`generated: "${input.generatedAt.toISOString()}"`);
  lines.push('jurisdictions:');
  for (const j of input.jurisdictions) {
    lines.push(`  - "${j}"`);
  }
  lines.push('---');
  lines.push('');

  // Title
  lines.push('# Entity Role Determination Memo');
  lines.push('');
  lines.push(
    `Date: ${formatDate(input.generatedAt)}`,
  );
  lines.push('');

  // Conclusion
  lines.push('## Conclusion');
  lines.push('');
  lines.push(
    `Based on the assessment below, the organization is classified as a **${ENTITY_TYPE_DISPLAY[input.entityType] ?? input.entityType}**.`,
  );
  lines.push('');
  lines.push(input.outcomeExplanation);
  lines.push('');

  // Decision Path
  if (input.decisionPath.length > 0) {
    lines.push('## Decision Path');
    lines.push('');
    lines.push(
      'The following questions were assessed to arrive at the determination:',
    );
    lines.push('');
    for (const entry of input.decisionPath) {
      lines.push(`${entry.questionNumber}. **${entry.question}**`);
      lines.push(`   - Answer: ${entry.answer}`);
    }
    lines.push('');
  }

  // Regulatory Implications
  if (input.jurisdictions.length > 0) {
    lines.push('## Regulatory Implications');
    lines.push('');
    lines.push(
      `The following outlines the obligations of a ${ENTITY_TYPE_DISPLAY[input.entityType] ?? input.entityType} under each applicable jurisdiction:`,
    );
    lines.push('');

    for (const jurisdiction of input.jurisdictions) {
      lines.push(`### ${JURISDICTION_LABELS[jurisdiction]}`);
      lines.push('');
      const text = getRoleImplication(jurisdiction, input.entityType);
      if (text) {
        lines.push(text);
      } else {
        lines.push('Regulatory implications not available for this jurisdiction.');
      }
      lines.push('');
    }
  }

  // Legal disclaimer
  lines.push('---');
  lines.push('');
  lines.push(
    '*This memo does not constitute legal advice. The role determination is based on the responses provided and should be validated by qualified legal counsel. Regulatory obligations may vary based on specific circumstances not captured in this assessment.*',
  );
  lines.push('');

  return lines.join('\n');
}

export type { DecisionPathEntry, ProcessorDisclosureInput, RoleDeterminationInput };
