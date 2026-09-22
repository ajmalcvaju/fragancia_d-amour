import { getCategoryBySlug, getCategories } from "@/lib/firebase/categories";
import { getProductsByCategory } from "@/lib/firebase/products";
import { TopBanner } from "@/components/layout/TopBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { Metadata } from "next";
import CategoryClientView from "./CategoryClientView";

interface CategoryPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  const name = category ? category.name : params.slug.replace(/-/g, " ").toUpperCase();

  return {
    title: `${name} Scented Candles | Fragancia D'Amour Kozhikode`,
    description: category?.description || `Explore ${name} sprayed and scented candles from Fragancia D'Amour Kozhikode, Kerala.`,
  };
}

export const revalidate = 60;

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const [category, allCategories, initialProducts] = await Promise.all([
    getCategoryBySlug(params.slug),
    getCategories(),
    getProductsByCategory(params.slug),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-cream-100">
      <TopBanner />
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryClientView
            slug={params.slug}
            initialCategory={category}
            initialProducts={initialProducts}
            allCategories={allCategories}
          />
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
