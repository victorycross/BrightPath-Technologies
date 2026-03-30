const MAX_ITEMS = 200;

export async function extractCalendarEvents(graphClient, { daysBack = 7 } = {}) {
  const start = new Date();
  start.setDate(start.getDate() - daysBack);

  const end = new Date();
  end.setDate(end.getDate() + 7);

  console.log(`Extracting calendar events (${daysBack} days back through 7 days ahead)...`);

  const items = [];
  let url = `/me/calendarView?startDateTime=${start.toISOString()}&endDateTime=${end.toISOString()}`;
  let isFirst = true;

  while (url && items.length < MAX_ITEMS) {
    let response;

    if (isFirst) {
      response = await graphClient
        .api(url)
        .select('id,subject,start,end,location,organizer,attendees,isAllDay,importance,bodyPreview')
        .orderby('start/dateTime')
        .top(50)
        .get();
      isFirst = false;
    } else {
      response = await graphClient.api(url).get();
    }

    const events = response.value || [];
    for (const evt of events) {
      if (items.length >= MAX_ITEMS) break;
      items.push({
        id: evt.id,
        subject: evt.subject,
        start: evt.start?.dateTime,
        end: evt.end?.dateTime,
        timeZone: evt.start?.timeZone,
        location: evt.location?.displayName || null,
        organizer: evt.organizer?.emailAddress?.address || 'unknown',
        attendeeCount: evt.attendees?.length || 0,
        isAllDay: evt.isAllDay,
        importance: evt.importance,
        preview: evt.bodyPreview,
      });
    }

    url = response['@odata.nextLink'] || null;
  }

  console.log(`  Found ${items.length} calendar events`);
  return items;
}
