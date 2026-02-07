import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type {
  ValidatedInput,
  GenerationOptions,
  GeneratedDisclaimer,
  GeneratedOutput,
} from '../data/types.js';
import { OutputFormat } from '../data/enums.js';
import { mapRegulations } from './regulatory-mapper.js';
import { buildDisclaimer } from './disclaimer-builder.js';
import { renderMarkdown } from '../templates/renderers/markdown.renderer.js';

export async function generateDisclaimer(
  input: ValidatedInput,
  options: GenerationOptions,
): Promise<GeneratedDisclaimer> {
  // Step 1: Map regulations
  const requirements = mapRegulations(input);

  // Step 2: Build disclaimer structure
  const { sections, metadata } = buildDisclaimer(requirements, input);

  // Step 3: Ensure output directory exists
  if (!existsSync(options.outputDir)) {
    mkdirSync(options.outputDir, { recursive: true });
  }

  // Step 4: Render to requested formats
  const outputs: GeneratedOutput[] = [];
  const dateStamp = new Date().toISOString().slice(0, 10);
  const slug = metadata.orgName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-$/, '');

  for (const format of options.formats) {
    switch (format) {
      case OutputFormat.MARKDOWN: {
        const content = renderMarkdown(sections, metadata);
        const filePath = join(options.outputDir, `privacy-policy-${slug}-${dateStamp}.md`);
        writeFileSync(filePath, content, 'utf-8');
        outputs.push({ format, filePath, content });
        break;
      }
      case OutputFormat.DOCX: {
        // DOCX renderer to be implemented in Phase 2
        break;
      }
      case OutputFormat.HTML: {
        // HTML renderer to be implemented in Phase 3
        break;
      }
    }
  }

  return { sections, outputs, metadata };
}
