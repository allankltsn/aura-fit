export const IDENTITY_PROVIDER = Symbol('IDENTITY_PROVIDER');

// id do provedor = alias do Identity Provider no Keycloak. Quem pode ser usado é decidido por config
// (SOCIAL_PROVIDERS, hoje só "google"), não por tipo: incluir outro provedor não exige mudar a porta.
export type SocialProvider = string;

export interface TokenSet {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  sessionId: string;
  subject: string;
  email: string;
  emailVerified: boolean;
}

export interface ProviderUser {
  externalId: string;
  email: string;
  name: string;
  emailVerified: boolean;
}

export interface IdentityProviderPort {
  createUser(input: { email: string; name: string; password: string; emailVerified?: boolean }): Promise<ProviderUser>;
  deleteUser(externalId: string): Promise<void>;
  authenticate(email: string, password: string): Promise<TokenSet>;
  refresh(refreshToken: string): Promise<TokenSet>;
  revokeSession(refreshToken: string): Promise<void>;
  sendVerificationEmail(externalId: string): Promise<void>;
  sendPasswordReset(email: string): Promise<void>;
  buildSocialLoginUrl(input: {
    provider: SocialProvider; redirectUri: string; state: string; codeChallenge: string;
  }): string;
  exchangeAuthorizationCode(input: {
    code: string; redirectUri: string; codeVerifier: string;
  }): Promise<TokenSet>;
}
