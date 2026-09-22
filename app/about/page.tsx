import { TopBanner } from "@/components/layout/TopBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { CandleCareSection } from "@/components/home/CandleCareSection";
import { Metadata } from "next";
import Image from "next/image";
import { Sparkles, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About Our Craft & Story | Fragancia D'Amour Kozhikode",
  description: "Discover why Fragancia D'Amour chooses quality over shortcuts. 100% soy wax candles hand-poured in small batches in Kozhikode, Kerala with official Candle Care Guide.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-cream-100">
      <TopBanner />
      <Navbar />

      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Breadcrumbs items={[{ label: "About Us" }]} />

          {/* Hero Banner */}
          <div className="py-12 text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-champagne-600 font-semibold flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-champagne-500" />
              <span>Crafted With Love</span>
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-espresso-900 leading-tight">
              Hand-Poured 100% Soy Wax Candles
            </h1>
            <p className="text-base text-taupe-700 font-light leading-relaxed">
              Not all candles are made the same. At Fragancia D&apos;Amour, every jar is individually poured in small batches with honest craftsmanship you can feel.
            </p>
          </div>

          {/* Story & Heritage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12 border-t border-b border-cream-300/80">
            <div className="lg:col-span-6 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-luxury border border-cream-300">
              <Image
                src="/brand-bouquet.jpg"
                alt="Fragancia D'Amour Handcrafted Floral Candle Bouquet Kozhikode"
                fill
                priority
                className="object-cover"
              />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <h2 className="font-serif text-3xl font-bold text-espresso-900">
                Crafted in Kozhikode, Shared Across India
              </h2>
              <p className="text-sm text-taupe-700 leading-relaxed font-light">
                Fragancia D&apos;Amour was created out of a deep passion for fragrance, ambiance, and candle aesthetics. Based on Mavoor Road, Kozhikode, Kerala, our studio focuses on creating boutique candles that serve as both visual accents and sensory experiences.
              </p>
              <p className="text-sm text-taupe-700 leading-relaxed font-light">
                Every scent profile—from signature releases like <em>Enchanted</em>, <em>Lost In Paradise</em>, and <em>A Moment For You</em> to classic floral and woody notes—is thoughtfully curated.
              </p>

              <div className="p-5 bg-white rounded-2xl border border-cream-300 space-y-2">
                <h4 className="font-serif font-semibold text-espresso-900 text-base flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-current" />
                  <span>Boutique Gifting & Custom Orders</span>
                </h4>
                <p className="text-xs text-taupe-600 font-light leading-relaxed">
                  We specialize in elegant gifting hampers for weddings, celebrations, corporate tokens, and personal occasions in Kerala and across India. Includes complimentary &ldquo;Especially for You&rdquo; note cards.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Why Choose Fragancia D'Amour? Section */}
        <WhyChooseUs />

        {/* Official Candle Care Guide Section */}
        <CandleCareSection />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
