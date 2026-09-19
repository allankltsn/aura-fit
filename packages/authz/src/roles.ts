import { PERMISSIONS as P, type Permission } from './permissions';

export type RoleName = 'personal' | 'aluno' | 'admin';

export const ROLE_PERMISSIONS: Record<RoleName, readonly Permission[]> = {
  aluno: [P.PROFILE_READ, P.PROFILE_UPDATE],
  personal: [P.PROFILE_READ, P.PROFILE_UPDATE, P.INVITES_CREATE, P.INVITES_READ],
  admin: [
    P.PROFILE_READ, P.PROFILE_UPDATE,
    P.USERS_READ, P.USERS_MANAGE,
    P.ROLES_READ, P.ROLES_MANAGE,
    P.TENANTS_READ, P.AUDIT_READ,
  ],
};
