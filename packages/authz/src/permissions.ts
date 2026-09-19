export const PERMISSIONS = {
  PROFILE_READ: 'profile:read',
  PROFILE_UPDATE: 'profile:update',
  INVITES_CREATE: 'invites:create',
  INVITES_READ: 'invites:read',
  USERS_READ: 'users:read',
  USERS_MANAGE: 'users:manage',
  ROLES_READ: 'roles:read',
  ROLES_MANAGE: 'roles:manage',
  TENANTS_READ: 'tenants:read',
  AUDIT_READ: 'audit:read',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ALL = new Set<string>(Object.values(PERMISSIONS));

export function isPermission(value: string): value is Permission {
  return ALL.has(value);
}

export function hasPermission(granted: readonly string[], required: Permission): boolean {
  return granted.includes(required);
}
