import 'dotenv/config';
import { authenticate } from './lib/auth.js';
import { createGraphClient } from './lib/graph-client.js';
import { extractEmails } from './lib/extractors/email.js';
import { extractCalendarEvents } from './lib/extractors/calendar.js';
import { extractOneDriveFiles } from './lib/extractors/onedrive.js';
import { categorizeData } from './lib/categorize.js';
import { writeResults, formatSummary } from './lib/output.js';

function getArg(name, defaultVal) {
  const args = process.argv.slice(2);
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultVal;
}

function printUsage() {
  console.log(`
M365 Data Extractor + Claude Categorizer

Usage:
  node index.js [options]

Options:
  --source <type>   Data to extract: email, calendar, onedrive, all (default: all)
  --days <number>   Days of history to extract (default: 7)
  --output <dir>    Output directory (default: ./output)
  --help            Show this help message

Examples:
  node index.js --source all --days 7
  node index.js --source email --days 3
  node index.js --source calendar
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printUsage();
    return;
  }

  const source = getArg('source', process.env.EXTRACT_SOURCE || 'all');
  const daysBack = parseInt(getArg('days', process.env.EXTRACT_DAYS_BACK || '7'), 10);
  const outputDir = getArg('output', process.env.OUTPUT_DIR || './output');

  const validSources = ['email', 'calendar', 'onedrive', 'all'];
  if (!validSources.includes(source)) {
    console.error(`Invalid source "${source}". Must be one of: ${validSources.join(', ')}`);
    process.exit(1);
  }

  console.log(`\nM365 Data Extractor`);
  console.log(`Source: ${source} | Days back: ${daysBack} | Output: ${outputDir}\n`);

  // Authenticate
  const { accessToken } = await authenticate();
  const graphClient = createGraphClient(accessToken);

  // Extract
  const extractAll = source === 'all';
  const results = {};

  if (extractAll || source === 'email') {
    results.emails = await extractEmails(graphClient, { daysBack });
  }
  if (extractAll || source === 'calendar') {
    results.calendarEvents = await extractCalendarEvents(graphClient, { daysBack });
  }
  if (extractAll || source === 'onedrive') {
    results.oneDriveFiles = await extractOneDriveFiles(graphClient, { daysBack });
  }

  // Categorize with Claude
  const categorized = await categorizeData(results);

  // Output
  const { jsonPath, txtPath, summary } = writeResults(categorized, outputDir);

  console.log('\n' + summary);
  console.log(`\nResults saved to:`);
  console.log(`  JSON: ${jsonPath}`);
  console.log(`  Text: ${txtPath}`);
}

main().catch((err) => {
  console.error('\nError:', err.message || err);
  process.exit(1);
});
