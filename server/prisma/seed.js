const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.user.create({
        data: {
            username: 'admin',
            email: 'admin@test.com',
            password: 'secret', // Always hash passwords!
        },
    });
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
