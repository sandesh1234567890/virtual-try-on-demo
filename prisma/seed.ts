const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const products = [
    { name: "Navy Business Suit", category: "Suit", image: "https://i.imgur.com/KOABTTx.png" },
    { name: "White Polo Shirt", category: "Shirt", image: "https://i.imgur.com/5d2S6zC.png" },
    { name: "Black Casual T-Shirt", category: "T-Shirt", image: "https://i.imgur.com/pl349pM.png" },
    { name: "Beige Summer Dress", category: "Dress", image: "https://plus.unsplash.com/premium_photo-1673822185703-a4f6d498188b?q=80&w=2070&auto=format&fit=crop" },
    { name: "Denim Jacket", category: "Jacket", image: "https://images.unsplash.com/photo-1576905355168-31998e36ed42?q=80&w=2070&auto=format&fit=crop" }
];

async function main() {
    console.log('Cleaning existing products...');
    await prisma.product.deleteMany({});

    console.log('Seeding demo data...');
    for (const p of products) {
        await prisma.product.create({
            data: {
                ...p,
                stock: 10
            }
        });
    }
    console.log('Seed successful!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
