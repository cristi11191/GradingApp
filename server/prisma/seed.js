const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
    const hashedPassword = await bcrypt.hash('secret', 10);

    await prisma.user.create({
        data: {
            name: 'admin',
            email: 'admin@test.com',
            password: hashedPassword,
            role: 'admin', // Optional: Set the desired role
        },
    });

    console.log('Seed data created successfully.');
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
