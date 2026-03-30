import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are a productivity analyst helping a professional organize their Microsoft 365 data.

Analyze the provided email, calendar, and OneDrive data and return a structured JSON categorization.

Your response MUST be valid JSON with this exact structure:
{
  "emailSummary": {
    "totalProcessed": <number>,
    "categories": [
      {
        "name": "<category name>",
        "count": <number>,
        "items": [{ "subject": "<subject>", "from": "<sender>", "priority": "high|medium|low" }]
      }
    ],
    "actionItems": ["<description of email requiring action>"],
    "highlights": ["<notable email summary>"]
  },
  "calendarSummary": {
    "totalEvents": <number>,
    "categories": [
      {
        "name": "<category: internal meetings, external meetings, 1:1s, recurring, all-day>",
        "count": <number>,
        "items": [{ "subject": "<subject>", "when": "<date/time>", "with": "<organizer>" }]
      }
    ],
    "upcoming": ["<key upcoming event summary>"],
    "conflicts": ["<any scheduling conflicts detected>"]
  },
  "oneDriveSummary": {
    "totalFiles": <number>,
    "categories": [
      {
        "name": "<category: documents, spreadsheets, presentations, images, other>",
        "count": <number>,
        "items": [{ "name": "<filename>", "modified": "<date>" }]
      }
    ],
    "recentActivity": ["<recently modified file summary>"]
  },
  "overallInsights": [
    "<cross-cutting insight about the user's work patterns, priorities, or suggestions>"
  ]
}

Use these email categories: Action Required, Awaiting Response, FYI/Informational, Newsletters/Automated, Internal Collaboration, External/Client, and any others that fit the data.

Keep action items specific and actionable. Limit highlights to the 5 most important items per section.
Return ONLY the JSON object, no markdown fences or extra text.`;

export async function categorizeData({ emails, calendarEvents, oneDriveFiles }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Missing ANTHROPIC_API_KEY. Get your API key from console.anthropic.com and add it to .env'
    );
  }

  const client = new Anthropic();

  const data = {};
  if (emails?.length) data.emails = emails;
  if (calendarEvents?.length) data.calendarEvents = calendarEvents;
  if (oneDriveFiles?.length) data.oneDriveFiles = oneDriveFiles;

  if (Object.keys(data).length === 0) {
    return {
      emailSummary: null,
      calendarSummary: null,
      oneDriveSummary: null,
      overallInsights: ['No data was extracted to categorize.'],
    };
  }

  console.log('Sending data to Claude for categorization...');

  const userMessage = JSON.stringify(data, null, 2);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  const text = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('');

  // Strip markdown code fences if present
  const cleaned = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn('Could not parse Claude response as JSON, returning raw text');
    return { raw: cleaned };
  }
}
