import { describe, expect, it } from 'vitest';
import type { IdentityProviderPort } from './identity-provider.port';
import {
  EmailNotVerifiedError,
  InvalidCredentialsError,
  InvalidRefreshTokenError,
  UserAlreadyExistsError,
} from './errors';

const uniq = () => `u${Date.now()}${Math.floor(Math.random() * 1e6)}@example.com`;
const PW = 'Sup3r-secret-pw';

export function runProviderContract(name: string, make: () => Promise<IdentityProviderPort>) {
  describe(`IdentityProviderPort contract: ${name}`, () => {
    it('creates a user and authenticates with the right password', async () => {
      const p = await make();
      const email = uniq();
      const user = await p.createUser({ email, name: 'Rafael', password: PW, emailVerified: true });
      const tokens = await p.authenticate(email, PW);
      expect(tokens.subject).toBe(user.externalId);
      expect(tokens.emailVerified).toBe(true);
      expect(tokens.accessToken).toBeTruthy();
    });

    it('rejects an unverified account with valid credentials as email_not_verified', async () => {
      const p = await make();
      const email = uniq();
      await p.createUser({ email, name: 'A', password: PW });
      await expect(p.authenticate(email, PW)).rejects.toBeInstanceOf(EmailNotVerifiedError);
    });

    it('rejects wrong password and unknown email with the same error', async () => {
      const p = await make();
      const email = uniq();
      await p.createUser({ email, name: 'A', password: PW, emailVerified: true });
      await expect(p.authenticate(email, 'nope')).rejects.toBeInstanceOf(InvalidCredentialsError);
      await expect(p.authenticate(uniq(), 'nope')).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it('rejects duplicate e-mail', async () => {
      const p = await make();
      const email = uniq();
      await p.createUser({ email, name: 'A', password: PW });
      await expect(p.createUser({ email, name: 'B', password: PW }))
        .rejects.toBeInstanceOf(UserAlreadyExistsError);
    });

    it('rotates refresh tokens and revokes the family on reuse', async () => {
      const p = await make();
      const email = uniq();
      await p.createUser({ email, name: 'A', password: PW, emailVerified: true });
      const first = await p.authenticate(email, PW);
      const second = await p.refresh(first.refreshToken);
      expect(second.refreshToken).not.toBe(first.refreshToken);
      await expect(p.refresh(first.refreshToken)).rejects.toBeInstanceOf(InvalidRefreshTokenError);
      await expect(p.refresh(second.refreshToken)).rejects.toBeInstanceOf(InvalidRefreshTokenError);
    });

    it('revokeSession invalidates the refresh token', async () => {
      const p = await make();
      const email = uniq();
      await p.createUser({ email, name: 'A', password: PW, emailVerified: true });
      const t = await p.authenticate(email, PW);
      await p.revokeSession(t.refreshToken);
      await expect(p.refresh(t.refreshToken)).rejects.toBeInstanceOf(InvalidRefreshTokenError);
    });

    it('password reset never reveals whether the e-mail exists', async () => {
      const p = await make();
      await expect(p.sendPasswordReset(uniq())).resolves.toBeUndefined();
    });

    it('deleteUser removes the account', async () => {
      const p = await make();
      const email = uniq();
      const u = await p.createUser({ email, name: 'A', password: PW, emailVerified: true });
      await p.deleteUser(u.externalId);
      await expect(p.authenticate(email, PW)).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
  });
}
