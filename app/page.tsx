import { getFeaturedProducts } from "@/lib/firebase/products";
import { getCategories } from "@/lib/firebase/categories";
import { TopBanner } from "@/components/layout/TopBanner";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { BrandIntro } from "@/components/home/BrandIntro";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductCard } from "@/components/products/ProductCard";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { LocalSeoSection } from "@/components/home/LocalSeoSection";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { FeaturedProductsGrid } from "@/components/home/FeaturedProductsGrid";

export const revalidate = 60;

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-cream-100">
      <TopBanner />
      <Navbar />

      <main className="flex-grow">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Brand Introduction */}
        <BrandIntro />

        {/* 3. Why Choose Us? (100% Soy Wax & Small Batch Craftsmanship) */}
        <WhyChooseUs />

        {/* 4. Featured Candles Collection */}
        <section id="featured" className="py-20 bg-cream-100 border-b border-cream-300/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.25em] text-champagne-600 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-champagne-500" />
                  <span>Curated Favorites</span>
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900">
                  Featured Candles Collection
                </h2>
              </div>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-espresso-900 hover:text-champagne-600 font-semibold transition-colors border-b border-espresso-900 hover:border-champagne-600 pb-1 w-fit"
              >
                <span>View All Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <FeaturedProductsGrid initialProducts={featuredProducts} />
          </div>
        </section>

        {/* 5. Shop By Category (Max 4 on Home Page) */}
        <CategoryGrid categories={categories} limit={4} />

        {/* 6. Local Kozhikode & Kerala Relevance */}
        <LocalSeoSection />

        {/* 7. Instagram Showcase */}
        <InstagramGallery />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
