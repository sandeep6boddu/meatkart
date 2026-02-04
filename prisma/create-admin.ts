import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Force load .env.local because that's where the user seems to have it on Next.js projects
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });


const prisma = new PrismaClient();

async function createAdmin() {
    const email = 'sandeep@webenrich.com';
    const phone = '9876543210'; // Admin phone

    // 1. Check if user exists by email (since email is not unique in DB constraint but logically should be for login)
    const existingUserByEmail = await prisma.user.findFirst({
        where: { email }
    });

    if (existingUserByEmail) {
        console.log(`User found by email: ${existingUserByEmail.id}. Updating to admin...`);
        const updated = await prisma.user.update({
            where: { id: existingUserByEmail.id },
            data: { role: 'admin' }
        });
        console.log('User updated:', updated);
        return;
    }

    // 2. If not found by email, try to create. 
    // We need a unique phone. 
    try {
        const newUser = await prisma.user.create({
            data: {
                name: 'Sandeep (Admin)',
                phone: phone,
                email: email,
                role: 'admin'
            }
        });
        console.log('Admin user created:', newUser);
    } catch (error: any) {
        if (error.code === 'P2002') {
            // Unique constraint violation on phone
            console.log(`Phone ${phone} already exists. Updating that user to admin...`);
            const userByPhone = await prisma.user.update({
                where: { phone },
                data: {
                    role: 'admin',
                    email: email // update email too if we matched by phone
                }
            });
            console.log('User updated via phone match:', userByPhone);
        } else {
            console.error('Error creating admin:', error);
        }
    }
}


createAdmin()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
