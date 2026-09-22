import Link from "next/link";
import { TopBanner } from "@/components/layout/TopBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-cream-100">
      <TopBanner />
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-champagne-600 mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase tracking-[0.25em] text-champagne-600 font-semibold">
            404 — Page Not Found
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900 leading-tight">
            Looks like this fragrance wandered away.
          </h1>

          <p className="text-xs text-taupe-600 font-light leading-relaxed">
            The page or candle product you are looking for may have been moved or is currently out of stock.
          </p>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-cream-100 font-semibold px-8 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all shadow"
          >
            <ArrowLeft className="w-4 h-4 text-champagne-400" />
            <span>Back to Collection</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
