import { KeycloakProvider } from '../../../../../apps/identity-service/src/identity-provider/keycloak.provider';

const MP = 'http://mailpit:8025/api/v1';
const base = process.env.KEYCLOAK_URL!;
const realm = process.env.KEYCLOAK_REALM ?? 'aura';
const p = new KeycloakProvider({
  baseUrl: base, realm, clientId: process.env.KEYCLOAK_CLIENT_ID ?? 'aura-identity',
  clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!, webClientId: 'aura-web',
});
const PW = 'QaProbe-Pass-12345';
const ts = Date.now();
const mk = (n: string) => `qa-${ts}-${n}@example.com`;
const mask = (s: string) =>
  s.replace(/(https?:\/\/[^\s"<>?]*)(\?[^\s"<>]*)?/g, (_m, a) => a.slice(0, 60) + '?[MASKED]').replace(/eyJ[\w-]+\.[\w-]+\.[\w-]+/g, '[JWT]');
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const created: string[] = [];

async function msgs(to?: string): Promise<any[]> {
  const j: any = await (await fetch(`${MP}/messages?limit=200`)).json();
  return (j.messages as any[]).filter((m) => !to || m.To.some((t: any) => t.Address === to));
}
async function waitMsgs(to: string, n: number, ms = 6000) {
  const end = Date.now() + ms;
  let r = await msgs(to);
  while (r.length < n && Date.now() < end) { await sleep(500); r = await msgs(to); }
  return r;
}
async function mk_(email: string, verified: boolean) {
  const u = await p.createUser({ email, name: 'Qa Probe', password: PW, emailVerified: verified });
  created.push(u.externalId);
  return u;
}
async function tryX(label: string, f: () => Promise<any>) {
  try {
    const r = await f();
    console.log(`${label} -> OK`, typeof r === 'object' && r ? Object.keys(r) : r);
    return r;
  } catch (e: any) {
    console.log(`${label} -> THROWS ${e.constructor.name}: ${e.message}`);
    return e;
  }
}
const rawToken = async (email: string, pw: string) => {
  const r = await fetch(`${base}/realms/${realm}/protocol/openid-connect/token`, {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'password', client_id: process.env.KEYCLOAK_CLIENT_ID!, client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
      username: email, password: pw, scope: 'openid email profile',
    }),
  });
  const j: any = await r.json().catch(() => ({}));
  return `${r.status} ${JSON.stringify(j.access_token ? { access_token: '[JWT]' } : j)}`;
};

async function main() {
  console.log('== ITEM 1: sendVerificationEmail');
  const e1 = mk('verify');
  const u1 = await mk_(e1, false);
  console.log('mailbox before for', e1, (await msgs(e1)).length);
  await p.sendVerificationEmail(u1.externalId);
  const m1 = await waitMsgs(e1, 1);
  console.log('emails to', e1, ':', m1.length);
  for (const m of m1) {
    const full: any = await (await fetch(`${MP}/message/${m.ID}`)).json();
    console.log('  To:', full.To.map((t: any) => t.Address), 'Subject:', full.Subject);
    const links: string[] = (full.Text + full.HTML).match(/https?:\/\/[^\s"<>]+/g) ?? [];
    console.log('  links (masked):', [...new Set(links.map(mask))]);
    console.log('  link has action-token and realm path:', links.some((l) => /action-token/.test(l) && l.includes(`/realms/${realm}/`)));
  }

  console.log('\n== ITEM 2: sendPasswordReset');
  await tryX('reset existing', () => p.sendPasswordReset(e1));
  const m2 = await waitMsgs(e1, 2);
  console.log('emails to existing now:', m2.length, 'subjects:', m2.map((m: any) => m.Subject));
  const ghost = mk('ghost');
  const b2 = (await msgs()).length;
  await tryX('reset nonexistent', () => p.sendPasswordReset(ghost));
  await sleep(3000);
  console.log('emails to nonexistent:', (await msgs(ghost)).length, '| total mailbox delta after ghost call:', (await msgs()).length - b2);
  await tryX('reset weird email a+b@x.com%&', () => p.sendPasswordReset('a+b@x.com%&'));
  const t = async (em: string) => { const s = performance.now(); await p.sendPasswordReset(em); return Math.round(performance.now() - s); };
  console.log('timing ms existing vs nonexistent:', await t(e1), await t(mk('ghost2')));

  console.log('\n== ITEM 3: brute force');
  const e3 = mk('brute');
  await mk_(e3, true);
  await tryX('login ok (sanity)', () => p.authenticate(e3, PW));
  console.log('raw wrong pw (before):', await rawToken(e3, 'wrong-password-1'));
  for (let i = 2; i <= 7; i++) await tryX(`wrong #${i}`, () => p.authenticate(e3, `wrong-password-${i}`));
  console.log('raw wrong pw (after lock):', await rawToken(e3, 'wrong-password-x'));
  await tryX('CORRECT pw after 7 failures', () => p.authenticate(e3, PW));
  console.log('raw CORRECT pw after lock:', await rawToken(e3, PW));
  await tryX('nonexistent user, wrong pw', () => p.authenticate(mk('nouser'), 'whatever-12345'));
  console.log('raw nonexistent:', await rawToken(mk('nouser2'), 'whatever-12345'));

  console.log('\n== ITEM 4: revokeSession');
  const e4 = mk('revoke');
  await mk_(e4, true);
  const ts4: any = await p.authenticate(e4, PW);
  const ui = async () => (await fetch(`${base}/realms/${realm}/protocol/openid-connect/userinfo`, { headers: { authorization: `Bearer ${ts4.accessToken}` } })).status;
  console.log('userinfo before revoke:', await ui(), 'expiresIn', ts4.expiresIn);
  await p.revokeSession(ts4.refreshToken);
  console.log('userinfo after revoke (old access token):', await ui());
  await tryX('refresh after revoke', () => p.refresh(ts4.refreshToken));
  const intro = await fetch(`${base}/realms/${realm}/protocol/openid-connect/token/introspect`, {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: process.env.KEYCLOAK_CLIENT_ID!, client_secret: process.env.KEYCLOAK_CLIENT_SECRET!, token: ts4.accessToken }),
  });
  console.log('introspect old access token active?', ((await intro.json()) as any).active);
  await tryX('revokeSession with garbage token', () => p.revokeSession('garbage'));

  console.log('\n== ITEM 5: email_verified=false branch');
  const e5 = mk('unverified');
  await mk_(e5, false);
  console.log('raw unverified+correct pw:', await rawToken(e5, PW));
  await tryX('authenticate unverified', () => p.authenticate(e5, PW));
  const e5b = mk('flip');
  const u5b = await mk_(e5b, true);
  const ts5: any = await p.authenticate(e5b, PW);
  const adm = (p as any).admin.bind(p);
  const cur: any = await (await adm(`/users/${u5b.externalId}`)).json();
  const put = await adm(`/users/${u5b.externalId}`, { method: 'PUT', body: JSON.stringify({ ...cur, emailVerified: false }) });
  console.log('admin flip emailVerified=false status', put.status);
  const r5: any = await tryX('refresh after flip (provider does not check emailVerified)', () => p.refresh(ts5.refreshToken));
  console.log('refresh tokenset emailVerified =', r5?.emailVerified);
  await tryX('authenticate after flip', () => p.authenticate(e5b, PW));
}

main()
  .catch((e) => console.log('FATAL', e.constructor.name, e.message))
  .finally(async () => {
    for (const id of created) { try { await p.deleteUser(id); } catch (e: any) { console.log('cleanup fail', id, e.message); } }
    const left = await Promise.all(created.map(async (id) => (await (p as any).admin(`/users/${id}`)).status));
    console.log('\nCLEANUP: deleted', created.length, 'users; GET status after delete =', left.join(','), '(404 expected)');
  });
