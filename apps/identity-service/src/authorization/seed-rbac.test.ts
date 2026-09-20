import { PrismaClient } from '@prisma/client';
import { ROLE_PERMISSIONS } from '@aura/authz';
import { afterAll, describe, expect, it } from 'vitest';
import { seedRolesAndPermissions } from './seed-rbac';

const prisma = new PrismaClient();
afterAll(() => prisma.$disconnect());

describe('seedRolesAndPermissions', () => {
  it('creates roles with the permissions from @aura/authz', async () => {
    await seedRolesAndPermissions(prisma);
    for (const [name, perms] of Object.entries(ROLE_PERMISSIONS)) {
      const role = await prisma.role.findUniqueOrThrow({
        where: { name },
        include: { permissions: { include: { permission: true } } },
      });
      expect(role.permissions.map((p) => p.permission.code).sort()).toEqual([...perms].sort());
    }
  });

  it('is idempotent', async () => {
    await seedRolesAndPermissions(prisma);
    await seedRolesAndPermissions(prisma);
    expect(await prisma.role.count()).toBe(3);
  });
});
