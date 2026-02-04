import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to get random item from array
function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to get random int
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to get random date in past X months
function getRandomDate(monthsBack: number): Date {
  const date = new Date();
  const past = new Date();
  past.setMonth(date.getMonth() - monthsBack);
  return new Date(past.getTime() + Math.random() * (date.getTime() - past.getTime()));
}

async function main() {
  console.log('Start seeding ...');

  // 1. Cleanup
  console.log('Cleaning up existing data...');
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ');

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  } catch (error) {
    console.log({ error });
  }

  // 2. Locations (Hyderabad)
  console.log('Seeding Locations...');
  const locationsData = [
    { name: 'Banjara Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500034', address: 'Road No 12' },
    { name: 'Jubilee Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500033', address: 'Road No 36' },
    { name: 'Gachibowli', city: 'Hyderabad', state: 'Telangana', pincode: '500032', address: 'DLF Cyber City area' },
    { name: 'Madhapur', city: 'Hyderabad', state: 'Telangana', pincode: '500081', address: 'Hitech City Main Rd' },
    { name: 'Kondapur', city: 'Hyderabad', state: 'Telangana', pincode: '500084', address: 'Botanical Garden Rd' },
    { name: 'Kukatpally', city: 'Hyderabad', state: 'Telangana', pincode: '500072', address: 'KPHB Colony' },
    { name: 'Manikonda', city: 'Hyderabad', state: 'Telangana', pincode: '500089', address: 'Lanco Hills Rd' },
    { name: 'Miyapur', city: 'Hyderabad', state: 'Telangana', pincode: '500049', address: 'Bollaram Rd' },
    { name: 'Begumpet', city: 'Hyderabad', state: 'Telangana', pincode: '500016', address: 'SP Road' },
    { name: 'Secunderabad', city: 'Hyderabad', state: 'Telangana', pincode: '500003', address: 'MG Road' },
  ];

  const createdLocations = [];
  for (const loc of locationsData) {
    const l = await prisma.location.create({ data: { ...loc, isActive: true } });
    createdLocations.push(l);
  }

  // 3. Categories
  console.log('Seeding Categories...');
  const categories = [
    { name: 'Chicken', slug: 'chicken', image: '/images/chicken.png' },
    { name: 'Mutton', slug: 'mutton', image: '/images/mutton.png' },
    { name: 'Seafood', slug: 'seafood', image: '/images/seafood.png' },
    { name: 'Ready to Cook', slug: 'ready-to-cook', image: '/images/sell-1.png' },
    { name: 'Eggs', slug: 'eggs', image: '/images/offerfood.png' },
    { name: 'Cold Cuts', slug: 'cold-cuts', image: '/images/sell-2.png' },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const c = await prisma.category.create({
      data: { name: cat.name, slug: cat.slug, imageUrl: cat.image },
    });
    createdCategories[cat.slug] = c.id;
  }

  // 4. Products
  console.log('Seeding Products...');
  const productData = [
    // --- CHICKEN ---
    {
      categorySlug: 'chicken',
      name: 'Chicken Curry Cut (Small Pieces)',
      slug: 'chicken-curry-cut-small',
      description: 'Bone-in | Small cuts | Skinless. Perfect for curries.',
      freshnessNotes: 'Freshly cut today. Antibiotics free.',
      imageUrl: '/images/chicken.png',
      weights: [
        { weight: '500gms', price: 169, discountPrice: 149 },
        { weight: '1kg', price: 329, discountPrice: 289 },
      ],
    },
    {
      categorySlug: 'chicken',
      name: 'Chicken Breast (Boneless)',
      slug: 'chicken-breast-boneless',
      description: 'Tender, boneless fillets of chicken breast. High protein.',
      freshnessNotes: 'Cleaned and vacuum packed.',
      imageUrl: '/images/boneless-chick.png',
      weights: [
        { weight: '450gms', price: 285, discountPrice: 249 },
        { weight: '900gms', price: 550, discountPrice: 489 },
      ],
    },
    {
      categorySlug: 'chicken',
      name: 'Chicken Thigh (Boneless)',
      slug: 'chicken-thigh-boneless',
      description: 'Juicy and flavorful boneless chicken thighs. Perfect for grills.',
      imageUrl: '/images/chicken.png',
      weights: [
        { weight: '450gms', price: 310, discountPrice: 279 },
        { weight: '900gms', price: 600, discountPrice: 539 },
      ],
    },
    {
      categorySlug: 'chicken',
      name: 'Chicken Drumsticks',
      slug: 'chicken-drumsticks',
      description: 'Juicy bone-in drumsticks. Ideal for tandoori or frying.',
      imageUrl: '/images/chicken-or.png',
      weights: [
        { weight: '500gms', price: 239, discountPrice: 199 },
        { weight: '1kg', price: 450, discountPrice: 389 },
      ],
    },
    // --- MUTTON ---
    {
      categorySlug: 'mutton',
      name: 'Mutton Curry Cut (Rich)',
      slug: 'mutton-curry-cut',
      description: 'Mix of bone-in and boneless pieces from shoulder and leg.',
      freshnessNotes: 'Farm fresh goat meat.',
      imageUrl: '/images/mutton.png',
      weights: [
        { weight: '500gms', price: 590, discountPrice: 549 },
        { weight: '1kg', price: 1150, discountPrice: 1049 },
      ],
    },
    {
      categorySlug: 'mutton',
      name: 'Mutton Boneless',
      slug: 'mutton-boneless',
      description: 'Tender boneless cubes. Ideal for pan-frying or slow cooking.',
      imageUrl: '/images/boneless-mutton.png',
      weights: [
        { weight: '500gms', price: 690, discountPrice: 649 },
        { weight: '1kg', price: 1350, discountPrice: 1249 },
      ],
    },
    {
      categorySlug: 'mutton',
      name: 'Mutton Keema',
      slug: 'mutton-keema',
      description: 'Finely minced goat meat.',
      imageUrl: '/images/mutton-list-img.png',
      weights: [
        { weight: '500gms', price: 650, discountPrice: 599 },
        { weight: '1kg', price: 1250, discountPrice: 1199 },
      ],
    },
    // --- SEAFOOD ---
    {
      categorySlug: 'seafood',
      name: 'Rohu Fish (Bengali Cut)',
      slug: 'rohu-fish-cut',
      description: 'Fresh freshwater fish, cut into round pieces with head.',
      imageUrl: '/images/fish.png',
      weights: [
        { weight: '500gms', price: 249, discountPrice: 219 },
        { weight: '1kg', price: 480, discountPrice: 420 },
      ],
    },
    {
      categorySlug: 'seafood',
      name: 'Seer Fish / Vanjaram (Steaks)',
      slug: 'seer-fish-steaks',
      description: 'Premium seawater fish steaks. Firm texture, single bone.',
      imageUrl: '/images/seafood.png',
      weights: [
        { weight: '500gms', price: 890, discountPrice: 799 },
        { weight: '1kg', price: 1750, discountPrice: 1550 },
      ],
    },
    {
      categorySlug: 'seafood',
      name: 'Prawns (Tiger)',
      slug: 'prawns-tiger',
      description: 'Fresh Tiger Prawns, cleaned and deveined.',
      imageUrl: '/images/seafood.png',
      weights: [
        { weight: '250gms', price: 450, discountPrice: 399 },
        { weight: '500gms', price: 850, discountPrice: 799 },
      ],
    },
    // --- READY TO COOK ---
    {
      categorySlug: 'ready-to-cook',
      name: 'Chicken Nuggets',
      slug: 'chicken-nuggets',
      description: 'Classic chicken nuggets, ready to fry.',
      imageUrl: '/images/sell-1.png',
      weights: [
        { weight: '250gms', price: 199, discountPrice: 179 },
        { weight: '500gms', price: 349, discountPrice: 299 },
      ]
    }
  ];

  const allProductWeights: any[] = [];
  const allProducts: any[] = [];

  for (const prod of productData) {
    const categoryId = createdCategories[prod.categorySlug];

    // Assign random locations to product
    const productLocations = createdLocations
      .sort(() => 0.5 - Math.random())
      .slice(0, getRandomInt(3, createdLocations.length))
      .map(l => ({ id: l.id }));

    const product = await prisma.product.create({
      data: {
        categoryId,
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        freshnessNotes: prod.freshnessNotes,
        cutTypes: 'Standard',
        isActive: true,
        stockQuantity: getRandomInt(20, 100),
        productImages: {
          create: [{ imageUrl: prod.imageUrl, isPrimary: true }],
        },
        productWeights: {
          create: prod.weights.map((w) => ({
            weight: w.weight,
            price: w.price,
            discountPrice: w.discountPrice,
            isActive: true,
          })),
        },
        locations: {
          connect: productLocations
        }
      },
      include: { productWeights: true },
    });

    allProducts.push(product);
    allProductWeights.push(...product.productWeights);
    console.log(`Created product: ${prod.name}`);
  }

  // 5. Users
  console.log('Seeding Users...');
  const userNames = [
    'Sandeep Kumar', 'Rahul Reddy', 'Priya Sharma', 'Anjali Rao', 'Vikram Singh',
    'Karthik Raju', 'Sneha Gupta', 'Amit Patel', 'Deepa Krishnan', 'Arjun Mehta',
    'Neha Verm', 'Varun Dhawan', 'Divya Nair', 'Rohan Das', 'Kavya Reddy'
  ];

  const users = [];
  for (let i = 0; i < userNames.length; i++) {
    const name = userNames[i];
    const phone = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
    const email = `${name.toLowerCase().replace(' ', '.')}@example.com`;

    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          role: 'customer'
        }
      });

      // Add addresses
      const loc = getRandom(locationsData);
      await prisma.address.create({
        data: {
          userId: user.id,
          street: `${getRandomInt(1, 100)}, ${loc.address}`,
          city: loc.city,
          state: loc.state,
          pincode: loc.pincode,
          type: Math.random() > 0.5 ? 'Home' : 'Work',
          isDefault: true
        }
      });

      users.push(user);
    } catch (e) {
      console.log(`Skipping duplicate user: ${name}`);
    }
  }

  // 6. Orders
  console.log('Seeding Orders...');
  const statuses = ['delivered', 'delivered', 'delivered', 'pending', 'processing', 'cancelled'];
  const paymentMethods = ['UPI', 'COD', 'Card'];

  for (let i = 0; i < 60; i++) {
    const user = getRandom(users);
    const status = getRandom(statuses);
    const createdAt = getRandomDate(6); // Last 6 months

    // Random items incart
    const numItems = getRandomInt(1, 4);
    const orderItemsData = [];
    let totalAmount = 0;

    for (let j = 0; j < numItems; j++) {
      const weight = getRandom(allProductWeights);
      const quantity = getRandomInt(1, 2);
      const price = weight.discountPrice ? Number(weight.discountPrice) : Number(weight.price);
      const lineTotal = price * quantity;

      totalAmount += lineTotal;
      orderItemsData.push({
        productId: weight.productId,
        weightId: weight.id,
        quantity,
        unitPrice: price,
        totalPrice: lineTotal
      });
    }

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderNumber: `ORD-${Date.now().toString().slice(-6)}-${getRandomInt(100, 999)}`,
        totalAmount,
        status,
        paymentMethod: getRandom(paymentMethods),
        paymentStatus: status === 'delivered' ? 'completed' : (status === 'cancelled' ? 'failed' : 'pending'),
        createdAt,
        updatedAt: createdAt,
        orderItems: {
          create: orderItemsData
        }
      }
    });
  }

  // Create one Admin user
  try {
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'admin@meatkart.com',
        phone: '9999999999',
        role: 'super_admin'
      }
    });
    console.log('Created Super Admin (admin@meatkart.com / 9999999999)');
  } catch (e) { }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
