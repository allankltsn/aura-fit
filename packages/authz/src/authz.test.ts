import { describe, expect, it } from 'vitest';
import { PERMISSIONS, ROLE_PERMISSIONS, hasPermission, isPermission } from './index';

describe('authz catalog', () => {
  const all = Object.values(PERMISSIONS);

  it('uses the recurso:acao format', () => {
    for (const p of all) expect(p).toMatch(/^[a-z]+:[a-z]+$/);
  });

  it('only grants permissions that exist in the catalog', () => {
    for (const perms of Object.values(ROLE_PERMISSIONS)) {
      for (const p of perms) expect(isPermission(p)).toBe(true);
    }
  });

  it('aluno cannot create invites nor manage roles', () => {
    expect(hasPermission(ROLE_PERMISSIONS.aluno, PERMISSIONS.INVITES_CREATE)).toBe(false);
    expect(hasPermission(ROLE_PERMISSIONS.aluno, PERMISSIONS.ROLES_MANAGE)).toBe(false);
  });

  it('personal can create invites but not manage roles', () => {
    expect(hasPermission(ROLE_PERMISSIONS.personal, PERMISSIONS.INVITES_CREATE)).toBe(true);
    expect(hasPermission(ROLE_PERMISSIONS.personal, PERMISSIONS.ROLES_MANAGE)).toBe(false);
  });

  it('admin manages roles and users', () => {
    expect(hasPermission(ROLE_PERMISSIONS.admin, PERMISSIONS.ROLES_MANAGE)).toBe(true);
    expect(hasPermission(ROLE_PERMISSIONS.admin, PERMISSIONS.USERS_MANAGE)).toBe(true);
  });

  it('rejects unknown strings', () => {
    expect(isPermission('students:hack')).toBe(false);
  });
});
