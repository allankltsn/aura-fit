import { randomUUID } from 'node:crypto';
import type { IdentityProviderPort, ProviderUser, SocialProvider, TokenSet } from './identity-provider.port';
import {
  EmailNotVerifiedError,
  InvalidCredentialsError,
  InvalidRefreshTokenError,
  UserAlreadyExistsError,
} from './errors';

interface Account extends ProviderUser { password: string }
interface Family { sessionId: string; current: string; alive: boolean; subject: string }

export class InMemoryIdentityProvider implements IdentityProviderPort {
  private accounts = new Map<string, Account>();
  private byEmail = new Map<string, string>();
  private refreshIndex = new Map<string, Family>();
  private families = new Map<string, Family>();
  readonly sentVerification: string[] = [];
  readonly sentReset: string[] = [];

  async createUser(i: { email: string; name: string; password: string; emailVerified?: boolean }): Promise<ProviderUser> {
    const email = i.email.toLowerCase();
    if (this.byEmail.has(email)) throw new UserAlreadyExistsError();
    const acc: Account = { externalId: randomUUID(), email, name: i.name, emailVerified: i.emailVerified ?? false, password: i.password };
    this.accounts.set(acc.externalId, acc);
    this.byEmail.set(email, acc.externalId);
    return { externalId: acc.externalId, email, name: i.name, emailVerified: acc.emailVerified };
  }

  async deleteUser(externalId: string): Promise<void> {
    const acc = this.accounts.get(externalId);
    if (acc) this.byEmail.delete(acc.email);
    this.accounts.delete(externalId);
  }

  markEmailVerified(externalId: string) {
    const acc = this.accounts.get(externalId);
    if (acc) acc.emailVerified = true;
  }

  async authenticate(email: string, password: string): Promise<TokenSet> {
    const id = this.byEmail.get(email.toLowerCase());
    const acc = id ? this.accounts.get(id) : undefined;
    if (!acc || acc.password !== password) throw new InvalidCredentialsError();
    if (!acc.emailVerified) throw new EmailNotVerifiedError();
    return this.issue(acc, randomUUID());
  }

  async refresh(refreshToken: string): Promise<TokenSet> {
    const fam = this.refreshIndex.get(refreshToken);
    if (!fam) throw new InvalidRefreshTokenError();
    if (!fam.alive || fam.current !== refreshToken) {
      fam.alive = false; // reuso: revoga a família inteira
      throw new InvalidRefreshTokenError();
    }
    const acc = this.accounts.get(fam.subject);
    if (!acc) throw new InvalidRefreshTokenError();
    return this.issue(acc, fam.sessionId);
  }

  async revokeSession(refreshToken: string): Promise<void> {
    const fam = this.refreshIndex.get(refreshToken);
    if (fam) fam.alive = false;
  }

  async sendVerificationEmail(externalId: string): Promise<void> { this.sentVerification.push(externalId); }
  async sendPasswordReset(email: string): Promise<void> { this.sentReset.push(email.toLowerCase()); }

  buildSocialLoginUrl(i: { provider: SocialProvider; redirectUri: string; state: string; codeChallenge: string }): string {
    return `https://idp.test/auth?provider=${i.provider}&state=${i.state}&cc=${i.codeChallenge}`;
  }

  async exchangeAuthorizationCode(): Promise<TokenSet> {
    throw new InvalidCredentialsError();
  }

  private issue(acc: Account, sessionId: string): TokenSet {
    const refreshToken = randomUUID();
    const fam = this.families.get(sessionId)
      ?? { sessionId, current: refreshToken, alive: true, subject: acc.externalId };
    fam.current = refreshToken;
    this.families.set(sessionId, fam);
    this.refreshIndex.set(refreshToken, fam);
    return {
      accessToken: `at-${randomUUID()}`,
      refreshToken,
      expiresIn: 600,
      sessionId,
      subject: acc.externalId,
      email: acc.email,
      emailVerified: acc.emailVerified,
    };
  }
}
