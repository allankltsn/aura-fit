import { PrismaClient } from '@prisma/client';
import { seedRolesAndPermissions } from '../src/authorization/seed-rbac';

const prisma = new PrismaClient();
seedRolesAndPermissions(prisma)
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
