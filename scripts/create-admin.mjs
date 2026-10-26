import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdmin() {
  const args = process.argv.slice(2);
  const email = args[0] || process.env.INITIAL_ADMIN_EMAIL || "admin@ufy.org";
  const password = args[1] || process.env.INITIAL_ADMIN_PASSWORD || "UfyAdminPassword2026!";
  const name = args[2] || process.env.INITIAL_ADMIN_NAME || "UFY Lead Administrator";
  const role = args[3] || "SUPER_ADMIN";

  if (!email || !password) {
    console.error("Usage: node scripts/create-admin.mjs <email> <password> [name] [role]");
    process.exit(1);
  }

  console.log(`🔐 Provisioning admin account for: ${email}...`);
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.adminUser.upsert({
    where: { email },
    update: {
      passwordHash,
      name,
      role,
      active: true,
    },
    create: {
      email,
      passwordHash,
      name,
      role,
      active: true,
    },
  });

  console.log(`✅ Administrator ready: ${user.name} (${user.email}) - Role: ${user.role}`);
}

createAdmin()
  .catch((e) => {
    console.error("❌ Failed to provision admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
