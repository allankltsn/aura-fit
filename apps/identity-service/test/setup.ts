import { execSync } from 'node:child_process';

const base = process.env.DATABASE_URL_IDENTITY!.split('?')[0];
process.env.DATABASE_URL_IDENTITY = `${base}?schema=test`;

execSync('pnpm prisma migrate reset --force --skip-seed --skip-generate', {
  stdio: 'inherit',
  env: process.env,
});
