const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    console.log("Modelos disponibles:", Object.keys(prisma));
    if (prisma.verificationToken) {
      console.log("✅ VerificationToken model existe");
    } else {
      console.log("❌ VerificationToken model NO existe");
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
test();
