import Link from 'next/link';
import { prisma } from "@/lib/prisma";
import { products as initialProducts } from "@/lib/products";
import ClientHome from "@/components/ClientHome";

export const dynamic = 'force-dynamic';

// Standard Server Component
export default async function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {

  // 1. Check for Auto-Seeding
  const productCount = await prisma.product.count();
  if (productCount === 0) {
    console.log("Seeding initial products...");
    // Seed sequentially to avoid race conditions in SQLite sometimes
    for (const p of initialProducts) {
      await prisma.product.create({
        data: {
          name: p.name,
          category: p.category,
          image: p.image,
          stock: 10 // Default stock
        }
      });
    }
  }

  // 2. Fetch from DB
  const allProducts = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const { category } = await searchParams;

  const filteredProducts = category && category !== 'All Items'
    ? allProducts.filter(p => p.category === category)
    : allProducts;

  const categories = ['All Items', ...Array.from(new Set(allProducts.map(p => p.category)))];

  return (
    <ClientHome
      products={filteredProducts}
      categories={categories}
      activeCategory={category || 'All Items'}
    />
  );
}
