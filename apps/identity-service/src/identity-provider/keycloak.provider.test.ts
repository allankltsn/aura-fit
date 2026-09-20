import { describe } from 'vitest';
import { KeycloakProvider } from './keycloak.provider';
import { runProviderContract } from './provider.contract';

const url = process.env.KEYCLOAK_URL;

describe.skipIf(!url)('Keycloak integration', () => {
  runProviderContract('Keycloak', async () =>
    new KeycloakProvider({
      baseUrl: url!,
      realm: process.env.KEYCLOAK_REALM ?? 'aura',
      clientId: process.env.KEYCLOAK_CLIENT_ID ?? 'aura-identity',
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      webClientId: 'aura-web',
    }),
  );
});
