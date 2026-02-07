import { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { downloadMarkdown, copyToClipboard } from '@/utils/download.ts';
import { MarkdownPreview } from '@/components/preview/MarkdownPreview.tsx';

interface ExportActionsProps {
  markdown: string;
  filename: string;
  documentTitle: string;
  documentSubtitle?: string;
}

export function ExportActions({ markdown, filename, documentTitle, documentSubtitle }: ExportActionsProps) {
  const [copied, setCopied] = useState(false);

  function handleDownload() {
    downloadMarkdown(markdown, filename);
  }

  async function handleCopy() {
    const ok = await copyToClipboard(markdown);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
        <div className="flex-1">
          <p className="text-sm font-medium">{documentTitle}</p>
          {documentSubtitle && (
            <p className="text-xs text-muted-foreground">{documentSubtitle}</p>
          )}
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
        This document does not constitute legal advice. Review with qualified legal counsel before use.
      </p>
    </div>
  );
}
