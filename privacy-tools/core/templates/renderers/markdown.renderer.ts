import type { DisclaimerSection, DisclaimerMetadata } from '../../data/types.js';
import { JURISDICTION_LABELS } from '../../data/enums.js';
import { formatDate } from '../../utils/validators.js';

export function renderMarkdown(
  sections: DisclaimerSection[],
  metadata: DisclaimerMetadata,
): string {
  const lines: string[] = [];

  // YAML frontmatter
  lines.push('---');
  lines.push(`title: "Privacy Policy — ${metadata.orgName}"`);
  lines.push(`effective_date: "${formatDate(metadata.generatedAt)}"`);
  lines.push(`generated: "${metadata.generatedAt.toISOString()}"`);
  lines.push(`version: "${metadata.version}"`);
  lines.push(`jurisdictions:`);
  for (const j of metadata.jurisdictions) {
    lines.push(`  - "${j}"`);
  }
  lines.push(`requirement_count: ${metadata.requirementCount}`);
  lines.push('---');
  lines.push('');

  // Table of contents (sequential numbering based on actual sections present)
  lines.push('## Table of Contents');
  lines.push('');
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const anchor = section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
    lines.push(`${i + 1}. [${section.heading}](#${anchor})`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // Sections
  for (const section of sections) {
    // Use H1 for the first section (Privacy Policy), H2 for the rest
    const headingLevel = section.id === 'preamble' ? '#' : '##';
    lines.push(`${headingLevel} ${section.heading}`);
    lines.push('');

    for (const para of section.paragraphs) {
      if (para.emphasis === 'bold') {
        lines.push(`**${para.text}**`);
      } else if (para.emphasis === 'italic') {
        lines.push(`*${para.text}*`);
      } else {
        lines.push(para.text);
      }
      lines.push('');
    }

    // Jurisdiction callouts (only shown when multiple jurisdictions apply;
    // with a single jurisdiction the content is already in the main body)
    if (metadata.jurisdictions.length > 1) {
      for (const callout of section.jurisdictionCallouts) {
        lines.push(`### ${callout.heading}`);
        lines.push('');
        lines.push(callout.body);
        lines.push('');
      }
    }

    lines.push('---');
    lines.push('');
  }

  // Statutory references appendix
  const allCitations = sections.flatMap((s) => s.citations);
  if (allCitations.length > 0) {
    lines.push('## Statutory References');
    lines.push('');
    lines.push('This policy has been prepared with reference to the following statutory provisions:');
    lines.push('');

    const seen = new Set<string>();
    for (const cit of allCitations) {
      const key = `${cit.jurisdiction}-${cit.reference}`;
      if (seen.has(key)) continue;
      seen.add(key);
      lines.push(`- **${cit.reference}** (${JURISDICTION_LABELS[cit.jurisdiction]})`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
