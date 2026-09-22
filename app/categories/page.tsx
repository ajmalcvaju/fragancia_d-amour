import { getCategories } from "@/lib/firebase/categories";
import { TopBanner } from "@/components/layout/TopBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scent Collections & Categories | Fragancia D'Amour Kozhikode",
  description: "Browse all scented candle categories by Fragancia D'Amour Kozhikode. Explore Floral, Sweet Vanilla, Woody Oud, Fresh Ocean, and Luxury Gift Sets.",
};

export const revalidate = 60;

export default async function CategoriesOverviewPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col min-h-screen bg-cream-100">
      <TopBanner />
      <Navbar />

      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Breadcrumbs items={[{ label: "Categories" }]} />

          {/* Page Header */}
          <div className="py-6 space-y-2 max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-champagne-600 font-semibold">
              Fragrance Themes
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-900">
              Scent Collections
            </h1>
            <p className="text-sm text-taupe-600 font-light leading-relaxed">
              Explore our hand-poured 100% soy wax candles organized by fragrance notes, mood, and occasions.
            </p>
          </div>

          {/* Categories Visual Grid */}
          <CategoryGrid categories={categories} />

        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
