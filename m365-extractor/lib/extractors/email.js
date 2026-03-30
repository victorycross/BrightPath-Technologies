const MAX_ITEMS = 200;
const PAGE_SIZE = 50;

function buildDateFilter(daysBack) {
  const since = new Date();
  since.setDate(since.getDate() - daysBack);
  return `receivedDateTime ge ${since.toISOString()}`;
}

function normalizeMessage(msg, folder) {
  return {
    id: msg.id,
    subject: msg.subject,
    from: msg.from?.emailAddress?.address || 'unknown',
    received: msg.receivedDateTime,
    preview: msg.bodyPreview,
    importance: msg.importance,
    isRead: msg.isRead,
    categories: msg.categories || [],
    folder,
  };
}

async function fetchMessages(graphClient, endpoint, filter, folder) {
  const items = [];
  let url = endpoint;
  let isFirst = true;

  while (url && items.length < MAX_ITEMS) {
    let response;

    if (isFirst) {
      response = await graphClient
        .api(url)
        .filter(filter)
        .select('id,subject,from,receivedDateTime,bodyPreview,importance,isRead,categories')
        .orderby('receivedDateTime desc')
        .top(PAGE_SIZE)
        .get();
      isFirst = false;
    } else {
      response = await graphClient.api(url).get();
    }

    const messages = response.value || [];
    for (const msg of messages) {
      if (items.length >= MAX_ITEMS) break;
      items.push(normalizeMessage(msg, folder));
    }

    url = response['@odata.nextLink'] || null;
  }

  return items;
}

export async function extractEmails(graphClient, { daysBack = 7 } = {}) {
  const filter = buildDateFilter(daysBack);

  console.log(`Extracting emails from the last ${daysBack} days...`);

  const [inbox, sent] = await Promise.all([
    fetchMessages(graphClient, '/me/messages', filter, 'inbox'),
    fetchMessages(graphClient, '/me/mailFolders/SentItems/messages', filter, 'sent'),
  ]);

  const emails = [...inbox, ...sent];
  console.log(`  Found ${inbox.length} inbox + ${sent.length} sent = ${emails.length} total emails`);

  return emails;
}
