import fs from 'fs';
import path from 'path';

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

export function formatSummary(data) {
  const lines = [];
  lines.push('═══════════════════════════════════════════════');
  lines.push('  M365 Data Extraction — Categorized Summary');
  lines.push('═══════════════════════════════════════════════');
  lines.push('');

  if (data.raw) {
    lines.push(data.raw);
    return lines.join('\n');
  }

  if (data.emailSummary) {
    const es = data.emailSummary;
    lines.push(`📧 EMAILS (${es.totalProcessed || 0} processed)`);
    lines.push('───────────────────────────────────────────────');
    for (const cat of es.categories || []) {
      lines.push(`  ${cat.name}: ${cat.count} emails`);
      for (const item of (cat.items || []).slice(0, 3)) {
        lines.push(`    - [${item.priority || '?'}] "${item.subject}" from ${item.from}`);
      }
    }
    if (es.actionItems?.length) {
      lines.push('');
      lines.push('  Action Items:');
      for (const action of es.actionItems) {
        lines.push(`    → ${action}`);
      }
    }
    if (es.highlights?.length) {
      lines.push('');
      lines.push('  Highlights:');
      for (const h of es.highlights) {
        lines.push(`    ★ ${h}`);
      }
    }
    lines.push('');
  }

  if (data.calendarSummary) {
    const cs = data.calendarSummary;
    lines.push(`📅 CALENDAR (${cs.totalEvents || 0} events)`);
    lines.push('───────────────────────────────────────────────');
    for (const cat of cs.categories || []) {
      lines.push(`  ${cat.name}: ${cat.count} events`);
      for (const item of (cat.items || []).slice(0, 3)) {
        lines.push(`    - "${item.subject}" @ ${item.when} with ${item.with}`);
      }
    }
    if (cs.upcoming?.length) {
      lines.push('');
      lines.push('  Upcoming:');
      for (const u of cs.upcoming) {
        lines.push(`    → ${u}`);
      }
    }
    if (cs.conflicts?.length) {
      lines.push('');
      lines.push('  Conflicts:');
      for (const c of cs.conflicts) {
        lines.push(`    ⚠ ${c}`);
      }
    }
    lines.push('');
  }

  if (data.oneDriveSummary) {
    const os = data.oneDriveSummary;
    lines.push(`📁 ONEDRIVE (${os.totalFiles || 0} files)`);
    lines.push('───────────────────────────────────────────────');
    for (const cat of os.categories || []) {
      lines.push(`  ${cat.name}: ${cat.count} files`);
      for (const item of (cat.items || []).slice(0, 3)) {
        lines.push(`    - ${item.name} (modified: ${item.modified})`);
      }
    }
    if (os.recentActivity?.length) {
      lines.push('');
      lines.push('  Recent Activity:');
      for (const r of os.recentActivity) {
        lines.push(`    → ${r}`);
      }
    }
    lines.push('');
  }

  if (data.overallInsights?.length) {
    lines.push('💡 INSIGHTS');
    lines.push('───────────────────────────────────────────────');
    for (const insight of data.overallInsights) {
      lines.push(`  • ${insight}`);
    }
    lines.push('');
  }

  lines.push('═══════════════════════════════════════════════');
  return lines.join('\n');
}

export function writeResults(categorizedData, outputDir = './output') {
  const dir = path.resolve(outputDir);
  fs.mkdirSync(dir, { recursive: true });

  const ts = timestamp();

  const jsonPath = path.join(dir, `m365-extract-${ts}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(categorizedData, null, 2));

  const summary = formatSummary(categorizedData);
  const txtPath = path.join(dir, `m365-extract-${ts}.txt`);
  fs.writeFileSync(txtPath, summary);

  return { jsonPath, txtPath, summary };
}
