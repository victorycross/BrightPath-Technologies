import * as msal from '@azure/msal-node';

const SCOPES = ['Mail.Read', 'Calendars.Read', 'Files.Read', 'User.Read'];

export async function authenticate() {
  const clientId = process.env.AZURE_CLIENT_ID;
  const tenantId = process.env.AZURE_TENANT_ID;

  if (!clientId || !tenantId) {
    throw new Error(
      'Missing AZURE_CLIENT_ID or AZURE_TENANT_ID. Copy .env.example to .env and fill in your values.'
    );
  }

  const config = {
    auth: {
      clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
    },
  };

  const app = new msal.PublicClientApplication(config);

  const deviceCodeRequest = {
    scopes: SCOPES,
    deviceCodeCallback: (response) => {
      console.log('\n' + response.message);
      console.log('Waiting for authentication...\n');
    },
  };

  const response = await app.acquireTokenByDeviceCode(deviceCodeRequest);

  console.log(`Authenticated as: ${response.account.username}`);
  return { accessToken: response.accessToken, account: response.account };
}
