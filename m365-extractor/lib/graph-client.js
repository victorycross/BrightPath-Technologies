import { Client } from '@microsoft/microsoft-graph-client';

export function createGraphClient(accessToken) {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });
}
