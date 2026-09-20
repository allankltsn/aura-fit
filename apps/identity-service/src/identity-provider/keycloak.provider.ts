import type { IdentityProviderPort, ProviderUser, SocialProvider, TokenSet } from './identity-provider.port';
import {
  EmailNotVerifiedError,
  InvalidCredentialsError,
  InvalidRefreshTokenError,
  UserAlreadyExistsError,
} from './errors';

export interface KeycloakConfig {
  baseUrl: string;
  realm: string;
  clientId: string;
  clientSecret: string;
  webClientId: string;
}

const FORM = { 'content-type': 'application/x-www-form-urlencoded' };

export class KeycloakProvider implements IdentityProviderPort {
  constructor(private readonly cfg: KeycloakConfig) {}

  // Timeout em toda chamada ao Keycloak: um provedor lento não pode travar login/refresh.
  private http(url: string, init: RequestInit = {}): Promise<Response> {
    return fetch(url, { ...init, signal: AbortSignal.timeout(10_000) });
  }

  private get realmUrl() { return `${this.cfg.baseUrl}/realms/${this.cfg.realm}`; }
  private get adminUrl() { return `${this.cfg.baseUrl}/admin/realms/${this.cfg.realm}`; }
  private get tokenUrl() { return `${this.realmUrl}/protocol/openid-connect/token`; }

  private async adminToken(): Promise<string> {
    const res = await this.http(this.tokenUrl, {
      method: 'POST', headers: FORM,
      body: new URLSearchParams({
        grant_type: 'client_credentials', client_id: this.cfg.clientId, client_secret: this.cfg.clientSecret,
      }),
    });
    if (!res.ok) throw new Error('keycloak_admin_auth_failed');
    return ((await res.json()) as { access_token: string }).access_token;
  }

  private async admin(path: string, init: RequestInit = {}): Promise<Response> {
    const token = await this.adminToken();
    return this.http(`${this.adminUrl}${path}`, {
      ...init,
      headers: { ...(init.headers ?? {}), authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    });
  }

  async createUser(i: { email: string; name: string; password: string; emailVerified?: boolean }): Promise<ProviderUser> {
    const email = i.email.toLowerCase();
    const [firstName, ...rest] = i.name.trim().split(' ');
    const res = await this.admin('/users', {
      method: 'POST',
      body: JSON.stringify({
        username: email, email, firstName, lastName: rest.join(' ') || '-',
        enabled: true, emailVerified: i.emailVerified ?? false,
        credentials: [{ type: 'password', value: i.password, temporary: false }],
      }),
    });
    if (res.status === 409) throw new UserAlreadyExistsError();
    if (!res.ok) throw new Error(`keycloak_create_user_failed:${res.status}`);
    const externalId = res.headers.get('location')!.split('/').pop()!;
    return { externalId, email, name: i.name, emailVerified: i.emailVerified ?? false };
  }

  async deleteUser(externalId: string): Promise<void> {
    await this.admin(`/users/${externalId}`, { method: 'DELETE' });
  }

  async authenticate(email: string, password: string): Promise<TokenSet> {
    const res = await this.http(this.tokenUrl, {
      method: 'POST', headers: FORM,
      body: new URLSearchParams({
        grant_type: 'password', client_id: this.cfg.clientId, client_secret: this.cfg.clientSecret,
        username: email.toLowerCase(), password, scope: 'openid email profile',
      }),
    });
    if (res.status === 400 || res.status === 401) {
      const err = (await res.json().catch(() => ({}))) as { error?: string; error_description?: string };
      // R4: credenciais corretas mas e-mail não verificado (verifyEmail=true no realm).
      if (err.error === 'invalid_grant' && /not fully set up/i.test(err.error_description ?? '')) {
        throw new EmailNotVerifiedError();
      }
      throw new InvalidCredentialsError();
    }
    if (!res.ok) throw new Error(`keycloak_token_failed:${res.status}`);
    const tokens = this.toTokenSet(await res.json());
    if (!tokens.emailVerified) throw new EmailNotVerifiedError();
    return tokens;
  }

  async refresh(refreshToken: string): Promise<TokenSet> {
    const res = await this.http(this.tokenUrl, {
      method: 'POST', headers: FORM,
      body: new URLSearchParams({
        grant_type: 'refresh_token', client_id: this.cfg.clientId,
        client_secret: this.cfg.clientSecret, refresh_token: refreshToken,
      }),
    });
    if (res.status === 400 || res.status === 401) throw new InvalidRefreshTokenError();
    if (!res.ok) throw new Error(`keycloak_refresh_failed:${res.status}`);
    return this.toTokenSet(await res.json());
  }

  async revokeSession(refreshToken: string): Promise<void> {
    await this.http(`${this.realmUrl}/protocol/openid-connect/logout`, {
      method: 'POST', headers: FORM,
      body: new URLSearchParams({
        client_id: this.cfg.clientId, client_secret: this.cfg.clientSecret, refresh_token: refreshToken,
      }),
    });
  }

  async sendVerificationEmail(externalId: string): Promise<void> {
    await this.admin(`/users/${externalId}/execute-actions-email?lifespan=86400`, {
      method: 'PUT', body: JSON.stringify(['VERIFY_EMAIL']),
    });
  }

  async sendPasswordReset(email: string): Promise<void> {
    const res = await this.admin(`/users?email=${encodeURIComponent(email.toLowerCase())}&exact=true`);
    const users = (await res.json()) as { id: string }[];
    if (!users[0]) return; // resposta sempre genérica
    await this.admin(`/users/${users[0].id}/execute-actions-email?lifespan=900`, {
      method: 'PUT', body: JSON.stringify(['UPDATE_PASSWORD']),
    });
  }

  buildSocialLoginUrl(i: { provider: SocialProvider; redirectUri: string; state: string; codeChallenge: string }): string {
    const q = new URLSearchParams({
      client_id: this.cfg.webClientId, response_type: 'code', scope: 'openid email profile',
      redirect_uri: i.redirectUri, state: i.state,
      code_challenge: i.codeChallenge, code_challenge_method: 'S256', kc_idp_hint: i.provider,
    });
    return `${this.realmUrl}/protocol/openid-connect/auth?${q}`;
  }

  async exchangeAuthorizationCode(i: { code: string; redirectUri: string; codeVerifier: string }): Promise<TokenSet> {
    const res = await this.http(this.tokenUrl, {
      method: 'POST', headers: FORM,
      body: new URLSearchParams({
        grant_type: 'authorization_code', client_id: this.cfg.webClientId,
        code: i.code, redirect_uri: i.redirectUri, code_verifier: i.codeVerifier,
      }),
    });
    if (!res.ok) throw new InvalidCredentialsError();
    return this.toTokenSet(await res.json());
  }

  private toTokenSet(body: { access_token: string; refresh_token: string; expires_in: number }): TokenSet {
    // Token vindo direto do Keycloak no back-channel: só lemos claims. A verificação de assinatura é do BFF.
    const claims = JSON.parse(Buffer.from(body.access_token.split('.')[1], 'base64url').toString()) as {
      sub: string; sid: string; email: string; email_verified: boolean;
    };
    return {
      accessToken: body.access_token, refreshToken: body.refresh_token, expiresIn: body.expires_in,
      sessionId: claims.sid, subject: claims.sub, email: claims.email, emailVerified: claims.email_verified,
    };
  }
}
