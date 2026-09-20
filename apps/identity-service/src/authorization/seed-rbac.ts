import type { PrismaClient } from '@prisma/client';
import { PERMISSIONS, ROLE_PERMISSIONS } from '@aura/authz';

export async function seedRolesAndPermissions(prisma: PrismaClient): Promise<void> {
  for (const code of Object.values(PERMISSIONS)) {
    await prisma.permission.upsert({ where: { code }, update: {}, create: { code } });
  }
  for (const [name, codes] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
    const perms = await prisma.permission.findMany({ where: { code: { in: [...codes] } } });
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    await prisma.rolePermission.createMany({
      data: perms.map((p) => ({ roleId: role.id, permissionId: p.id })),
    });
  }
}
