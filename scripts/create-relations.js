const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Creating _LocationToProduct table...');
    try {
        // Create the implicit many-to-many join table
        await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "_LocationToProduct" (
          "A" UUID NOT NULL,
          "B" UUID NOT NULL,
          
          CONSTRAINT "_LocationToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT "_LocationToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `;

        // Create required indexes
        await prisma.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "_LocationToProduct_AB_unique" ON "_LocationToProduct"("A", "B");
      `;

        await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "_LocationToProduct_B_index" ON "_LocationToProduct"("B");
      `;

        console.log('_LocationToProduct table created successfully.');

    } catch (e) {
        console.error('Failed to create table:', e);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
