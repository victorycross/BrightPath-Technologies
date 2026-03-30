const MAX_ITEMS = 200;

function normalizeItem(item) {
  return {
    name: item.name,
    type: item.file ? 'file' : 'folder',
    mimeType: item.file?.mimeType || null,
    size: item.size,
    created: item.createdDateTime,
    modified: item.lastModifiedDateTime,
    webUrl: item.webUrl,
  };
}

export async function extractOneDriveFiles(graphClient, { daysBack = 7 } = {}) {
  console.log('Extracting OneDrive file metadata...');

  const items = [];

  // Fetch recent files
  try {
    const recent = await graphClient
      .api('/me/drive/recent')
      .top(50)
      .get();

    for (const item of recent.value || []) {
      if (items.length >= MAX_ITEMS) break;
      items.push(normalizeItem(item));
    }
  } catch (err) {
    console.warn('  Could not fetch recent files:', err.message);
  }

  // Fetch root folder children
  try {
    const root = await graphClient
      .api('/me/drive/root/children')
      .select('name,size,createdDateTime,lastModifiedDateTime,webUrl,file,folder')
      .top(50)
      .get();

    const existingNames = new Set(items.map((i) => i.name));
    for (const item of root.value || []) {
      if (items.length >= MAX_ITEMS) break;
      if (!existingNames.has(item.name)) {
        items.push(normalizeItem(item));
      }
    }
  } catch (err) {
    console.warn('  Could not fetch root folder:', err.message);
  }

  console.log(`  Found ${items.length} OneDrive items`);
  return items;
}
