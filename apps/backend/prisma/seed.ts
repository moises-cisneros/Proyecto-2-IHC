import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SEED_PASSWORD = "Planazo123!";

const seedUsers = [
  { email: "usuario1@planazo.com", name: "Usuario Uno" },
  { email: "usuario2@planazo.com", name: "Usuario Dos" },
];

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to seed test users when NODE_ENV=production.");
  }

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  for (const user of seedUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, passwordHash },
      create: { ...user, passwordHash },
    });
    console.log(`Seeded user ${user.email}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
