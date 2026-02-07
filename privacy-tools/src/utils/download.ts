export function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(content: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch {
    return false;
  }
}

export function buildFilename(orgName: string): string {
  const dateStamp = new Date().toISOString().slice(0, 10);
  const slug = orgName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-$/, '');
  return `privacy-policy-${slug}-${dateStamp}.md`;
}

export function buildStandaloneFilename(documentType: string): string {
  const dateStamp = new Date().toISOString().slice(0, 10);
  return `${documentType}-${dateStamp}.md`;
}
