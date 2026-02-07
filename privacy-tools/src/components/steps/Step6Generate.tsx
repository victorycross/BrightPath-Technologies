import { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { useDisclaimer } from '@/state/disclaimer-context.tsx';
import { useDisclaimerPreview } from '@/hooks/use-disclaimer-preview.ts';
import { downloadMarkdown, copyToClipboard, buildFilename } from '@/utils/download.ts';
import { MarkdownPreview } from '@/components/preview/MarkdownPreview.tsx';

export function Step6Generate() {
  const { state } = useDisclaimer();
  const { markdown, metadata, isValid, requirementCount, sections } = useDisclaimerPreview(state);
  const [copied, setCopied] = useState(false);

  if (!isValid || !markdown || !metadata) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Generate Privacy Policy</h2>
        <div className="rounded-md border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
          Cannot generate — required fields are missing. Please go back and complete all steps.
        </div>
      </div>
    );
  }

  function handleDownload() {
    if (!markdown || !metadata) return;
    const filename = buildFilename(metadata.orgName);
    downloadMarkdown(markdown, filename);
  }

  async function handleCopy() {
    if (!markdown) return;
    const ok = await copyToClipboard(markdown);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Your Privacy Policy</h2>

      <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
        <div className="flex-1">
          <p className="text-sm font-medium">{metadata.orgName} — Privacy Policy</p>
          <p className="text-xs text-muted-foreground">
            {requirementCount} requirements · {sections?.length} sections · Generated {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Download className="h-4 w-4" />
            Download .md
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="bg-muted/50 px-4 py-2 border-b border-border">
          <span className="text-xs font-medium text-muted-foreground">Preview</span>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-4">
          <MarkdownPreview markdown={markdown} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground italic">
        This document does not constitute legal advice. Review with qualified legal counsel before publication.
      </p>
    </div>
  );
}
