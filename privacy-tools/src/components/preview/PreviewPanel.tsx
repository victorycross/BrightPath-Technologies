import { FileText } from 'lucide-react';
import { useDisclaimer } from '@/state/disclaimer-context.tsx';
import { useDisclaimerPreview } from '@/hooks/use-disclaimer-preview.ts';
import { MarkdownPreview } from './MarkdownPreview.tsx';

export function PreviewPanel() {
  const { state } = useDisclaimer();
  const { markdown, isValid, requirementCount, sections } = useDisclaimerPreview(state);

  if (!isValid || !markdown) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <FileText className="mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">Live Preview</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Complete all required fields to see your privacy policy preview.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">Live Preview</h3>
        <span className="text-xs text-muted-foreground">
          {requirementCount} reqs · {sections?.length} sections
        </span>
      </div>
      <MarkdownPreview markdown={markdown} />
    </div>
  );
}
