import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

async function main() {
    const targetEmail = 'sandeep@webenrich.com';
    const superAdminRole = 'super_admin';

    console.log(`--- Admin User Cleanup ---`);
    console.log(`Target Super Admin: ${targetEmail}`);

    // 1. Ensure target user is super_admin
    const user = await prisma.user.findFirst({
        where: { 
            OR: [
                { email: targetEmail },
                { email: 'sandpeep@webenrich.com' } // Handle the typo case just in case
            ]
        }
    });

    if (user) {
        console.log(`User found: ${user.email} (ID: ${user.id}). Updating to ${superAdminRole}...`);
        await prisma.user.update({
            where: { id: user.id },
            data: { 
                role: superAdminRole,
                email: targetEmail // ensure email is correct (no typo)
            }
        });
        console.log(`User ${targetEmail} is now a ${superAdminRole}.`);
    } else {
        console.log(`User ${targetEmail} not found in database. Creating now...`);
        // Using a dummy phone that is unlikely to collide, they can change it later if they login via social/phone
        try {
            const newUser = await prisma.user.create({
                data: {
                    email: targetEmail,
                    name: 'Sandeep Super Admin',
                    phone: '0000000000', // Placeholder
                    role: superAdminRole
                }
            });
            console.log(`Created new Super Admin: ${newUser.email}`);
        } catch (error: any) {
            if (error.code === 'P2002') {
                console.log(`Could not create user with phone 0000000000 (already exists).`);
                // Try to find who has this phone and update them? 
                // Or just error out and ask user for their phone.
                // Let's try to update the user with that email if they exist but weren't found by findFirst (unlikely)
            }
            throw error;
        }
    }

    // 2. Delete all other admin users
    console.log(`Cleaning up other administrative users...`);
    const adminRoles = ['admin', 'manager', 'editor', 'super_admin'];
    
    // We want to delete anyone who HAS an admin role but IS NOT our target email
    const deleted = await prisma.user.deleteMany({
        where: {
            role: { in: adminRoles },
            email: { not: targetEmail }
        }
    });

    console.log(`Successfully deleted ${deleted.count} other administrative users.`);
    
    // 3. Verify
    const currentAdmins = await prisma.user.findMany({
        where: { role: { in: adminRoles } }
    });
    
    console.log(`Current administrative users in DB:`);
    console.log(JSON.stringify(currentAdmins, null, 2));
    
    console.log(`--- Cleanup Complete ---`);
}

main()
    .catch((e) => {
        console.error('Error during cleanup:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
