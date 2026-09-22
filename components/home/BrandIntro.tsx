import React from "react";
import Image from "next/image";
import { Flame, Heart, Gift, Sparkle, Home } from "lucide-react";

export const BrandIntro: React.FC = () => {
  return (
    <section className="py-20 bg-cream-100 border-b border-cream-300/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Top Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Visual — Authentic Fragancia D'Amour Handcrafted Candle Bouquet */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-luxury border border-cream-300 group bg-cream-200">
              <Image
                src="/brand-bouquet.jpg"
                alt="Fragancia D'Amour Handcrafted Sprayed Floral Candle Bouquet Kozhikode"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/40 via-transparent to-transparent" />
            </div>

            {/* Small Floating Accent Card */}
            <div className="absolute -bottom-6 -right-6 hidden sm:flex bg-white p-5 rounded-2xl shadow-xl border border-cream-300 max-w-xs items-center gap-4">
              <div className="p-3 bg-rose-100 rounded-xl text-champagne-600 shrink-0">
                <Heart className="w-6 h-6 fill-current text-rose-500" />
              </div>
              <div>
                <p className="font-serif text-sm font-semibold text-espresso-900">
                  Made With Love
                </p>
                <p className="text-xs text-taupe-600">
                  Small-batch production in Kozhikode
                </p>
              </div>
            </div>
          </div>

          {/* Right Brand Positioning Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-champagne-600 font-semibold">
              <Flame className="w-4 h-4 text-champagne-500" />
              <span>Where Fragrance Meets Atmosphere</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-espresso-900 leading-tight">
              Boutique Candle Creations Designed for Everyday Moments
            </h2>

            <p className="text-base text-taupe-700 leading-relaxed font-light">
              Fragancia D&apos;Amour is a small business built with passion and love in Kozhikode, Kerala. We choose quality ingredients over shortcuts, crafting 100% natural soy wax candles and intricate sprayed floral candle creations designed to bring visual elegance and soothing aromas into your space.
            </p>

            <div className="p-6 bg-white rounded-3xl border border-cream-300 shadow-sm space-y-2">
              <h3 className="font-serif text-lg font-bold text-espresso-900">
                The Fragancia D&apos;Amour Difference
              </h3>
              <p className="text-xs text-taupe-600 italic font-light">
                &ldquo;Quality ingredients. Small-batch production. Made with love.&rdquo;
              </p>
              <p className="text-xs text-taupe-700 font-light pt-1">
                Thank you for supporting a small business built with passion and love.
              </p>
            </div>
          </div>

        </div>

        {/* More Than A Candle Feature Grid */}
        <div className="pt-8 border-t border-cream-300">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-xs uppercase tracking-widest text-champagne-600 font-semibold flex items-center justify-center gap-1">
              <Gift className="w-3.5 h-3.5" />
              <span>Thoughtful Experience</span>
            </span>
            <h2 className="font-serif text-3xl font-bold text-espresso-900">
              More Than Just a Candle
            </h2>
            <p className="text-xs text-taupe-600 font-light">
              Every Fragancia D&apos;Amour candle is crafted to enhance your daily life and home decor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 bg-white rounded-2xl border border-cream-300 shadow-sm space-y-3 text-center sm:text-left flex flex-col items-center sm:items-start">
              <div className="w-10 h-10 bg-amber-100/70 rounded-xl flex items-center justify-center text-amber-800">
                <Home className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-espresso-900">
                Aesthetic Décor
              </h3>
              <p className="text-xs text-taupe-600 font-light leading-relaxed">
                Clean amber, clear glass jars, and handcrafted floral candle sculptures that blend beautifully with any interior space.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-cream-300 shadow-sm space-y-3 text-center sm:text-left flex flex-col items-center sm:items-start">
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-800">
                <Gift className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-espresso-900">
                Thoughtful Gifting
              </h3>
              <p className="text-xs text-taupe-600 font-light leading-relaxed">
                A memorable option for birthdays, weddings, and celebrations. Includes complimentary &ldquo;Especially for You&rdquo; note options.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-cream-300 shadow-sm space-y-3 text-center sm:text-left flex flex-col items-center sm:items-start">
              <div className="w-10 h-10 bg-emerald-100/70 rounded-xl flex items-center justify-center text-emerald-800">
                <Sparkle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-espresso-900">
                A Little Everyday Luxury
              </h3>
              <p className="text-xs text-taupe-600 font-light leading-relaxed">
                Elevate your everyday rituals, quiet evenings, and self-care moments with soothing fragrance.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
