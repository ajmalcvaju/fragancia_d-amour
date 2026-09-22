import { Suspense } from "react";
import { getProducts } from "@/lib/firebase/products";
import { getCategories } from "@/lib/firebase/categories";
import { TopBanner } from "@/components/layout/TopBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { Metadata } from "next";
import ProductsClientView from "./ProductsClientView";

export const metadata: Metadata = {
  title: "All Scented Candles Collection | Fragancia D'Amour Kozhikode",
  description: "Browse our complete collection of handcrafted sprayed and scented candles in Kozhikode, Kerala. Explore floral, vanilla, oud, and fresh aquatic fragrance notes.",
};

export const revalidate = 60;

export default async function AllProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-cream-100">
      <TopBanner />
      <Navbar />

      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Breadcrumbs items={[{ label: "Products" }]} />

          {/* Page Header */}
          <div className="py-6 border-b border-cream-300/80 mb-8 space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-champagne-600 font-semibold">
              Boutique Collection
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-900">
              All Scented Candles
            </h1>
            <p className="text-sm text-taupe-600 font-light max-w-2xl">
              Explore our full range of scented candles designed to infuse fragrance, warmth, and visual character into your home.
            </p>
          </div>

          {/* Interactive Products Grid View */}
          <Suspense fallback={<div className="py-12 text-center text-taupe-600 italic">Loading candle collection...</div>}>
            <ProductsClientView initialProducts={products} categories={categories} />
          </Suspense>

        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
