import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: { description: 'Administrator role with full access' },
    create: {
      name: 'admin',
      description: 'Administrator role with full access',
      permissions: {
        create: [
          { name: 'dashboard.view', description: 'View dashboard summary' },
          { name: 'notifications.view', description: 'View notifications' },
          { name: 'notifications.update', description: 'Mark notifications as read' },
          { name: 'notifications.create', description: 'Send notifications' },
          { name: 'roles.view', description: 'View roles' },
          { name: 'permissions.view', description: 'View permissions' },
        ],
      },
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      name: 'Administrator',
      password,
      roleId: adminRole.id,
      active: true,
    },
    create: {
      email: 'admin@example.com',
      name: 'Administrator',
      password,
      active: true,
      roleId: adminRole.id,
    },
  });

  console.log('Seed data created: admin user and admin role');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
