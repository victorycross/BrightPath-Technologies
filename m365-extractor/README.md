# M365 Data Extractor + Claude Categorizer

CLI tool that extracts data from Microsoft 365 (email, calendar, OneDrive) via Microsoft Graph API and uses Claude AI to categorize and summarize it.

## Prerequisites

- **Node.js 18+** installed on your Windows device
- **Azure AD App Registration** with these delegated API permissions:
  - `Mail.Read` — Read user mail
  - `Calendars.Read` — Read user calendars
  - `Files.Read` — Read user files
  - `User.Read` — Sign in and read user profile
- **Admin consent** granted for the above permissions (ask your IT admin if needed)
- **Claude API key** from [console.anthropic.com](https://console.anthropic.com)

> **Note:** The Claude API key is separate from a Claude Pro chat subscription. API usage is pay-per-use and billed through your Anthropic console account.

## Setup

1. Navigate to this directory:
   ```bash
   cd m365-extractor
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy the environment template and fill in your values:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your Azure client ID, tenant ID, and Anthropic API key.

## Azure App Registration Setup

If you need to configure your Azure app registration for device code flow:

1. Go to [Azure Portal](https://portal.azure.com) > Azure Active Directory > App registrations
2. Select your app (or create a new one)
3. Under **Authentication**, enable **Allow public client flows** (required for device code flow)
4. Under **API permissions**, add the Microsoft Graph delegated permissions listed above
5. Click **Grant admin consent** (or request it from your admin)

## Usage

```bash
# Extract and categorize everything from the last 7 days
node index.js --source all

# Extract only emails from the last 3 days
node index.js --source email --days 3

# Extract only calendar events
node index.js --source calendar

# Extract only OneDrive file metadata
node index.js --source onedrive

# Custom output directory
node index.js --source all --output ./my-results
```

Or use the npm scripts:

```bash
pnpm run extract:all
pnpm run extract:email
pnpm run extract:calendar
pnpm run extract:onedrive
```

## How It Works

1. **Authenticate** — Uses Microsoft device code flow. You'll see a URL and code to enter in your browser. Sign in with your corporate credentials.
2. **Extract** — Pulls data from Microsoft Graph API:
   - **Email**: Inbox and sent items with date filtering (uses `bodyPreview`, not full body)
   - **Calendar**: Events from the past N days through 7 days ahead
   - **OneDrive**: Recent files and root folder metadata (no file content downloads)
3. **Categorize** — Sends extracted metadata to Claude (Sonnet) for AI categorization
4. **Output** — Writes timestamped JSON and human-readable summary to `output/`

## Output

Results are saved to the `output/` directory (gitignored):

- `m365-extract-<timestamp>.json` — Full structured categorization
- `m365-extract-<timestamp>.txt` — Human-readable summary

The summary includes:
- Email categories (Action Required, FYI, Newsletters, etc.) with action items
- Calendar breakdown (internal/external, 1:1s, recurring) with upcoming events
- OneDrive file organization by type
- Cross-cutting productivity insights

## Privacy & Security

- Data is processed locally on your machine and sent only to Anthropic's API
- Only email previews (not full bodies) are extracted
- Only file metadata (not content) is extracted from OneDrive
- Output files may contain sensitive corporate data — the `output/` directory is gitignored
- Your `.env` file containing credentials is gitignored
