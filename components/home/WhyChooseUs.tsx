import React from "react";
import { Leaf, Flame, Sparkles, Heart } from "lucide-react";

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-20 bg-cream-50 border-b border-cream-300/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-champagne-600 font-semibold flex items-center justify-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-champagne-500 fill-current" />
            <span>Honest Craftsmanship</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-900">
            Why Choose Fragancia D&apos;Amour?
          </h2>
          <p className="text-sm text-taupe-700 font-light leading-relaxed">
            Not all candles are made the same. At Fragancia D&apos;Amour, we choose quality over shortcuts.
          </p>
        </div>

        {/* 3 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* Pillar 1: 100% Soy Wax */}
          <div className="p-8 bg-white rounded-3xl border border-cream-300 shadow-sm hover:shadow-md transition-all duration-300 space-y-6 flex flex-col justify-between">
            <div className="space-y-4 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-800 border border-emerald-100">
                <Leaf className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-emerald-700 font-semibold">
                  Pure Ingredient
                </span>
                <h3 className="font-serif text-2xl font-bold text-espresso-900">
                  100% Soy Wax
                </h3>
              </div>

              <p className="text-xs text-taupe-600 font-light leading-relaxed">
                Made from renewable soybean oil for a clean-burning experience that is better for you and your loved ones.
              </p>

              <ul className="space-y-2.5 pt-2 text-xs text-espresso-900 font-medium text-left">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full shrink-0" />
                  <span><strong>Clean-burning:</strong> Better for indoor air quality</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full shrink-0" />
                  <span><strong>Biodegradable:</strong> Natural choice for a better tomorrow</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full shrink-0" />
                  <span><strong>Plant-based:</strong> 100% renewable soy wax</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full shrink-0" />
                  <span><strong>Less soot:</strong> Cleaner walls, cleaner home</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pillar 2: Hand-Poured in Small Batches */}
          <div className="p-8 bg-white rounded-3xl border border-cream-300 shadow-sm hover:shadow-md transition-all duration-300 space-y-6 flex flex-col justify-between">
            <div className="space-y-4 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-800 border border-amber-100">
                <Flame className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-amber-700 font-semibold">
                  Small-Batch Craft
                </span>
                <h3 className="font-serif text-2xl font-bold text-espresso-900">
                  Hand-Poured Batches
                </h3>
              </div>

              <p className="text-xs text-taupe-600 font-light leading-relaxed">
                Every candle is individually poured with care and intention in Kozhikode, ensuring attention to detail in every jar.
              </p>

              <ul className="space-y-2.5 pt-2 text-xs text-espresso-900 font-medium text-left">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-600 rounded-full shrink-0" />
                  <span><strong>Individual Care:</strong> Poured with intention</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-600 rounded-full shrink-0" />
                  <span><strong>Meticulous Detail:</strong> Precision in every single jar</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-600 rounded-full shrink-0" />
                  <span><strong>No Mass Production:</strong> Honest boutique craftsmanship</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pillar 3: Premium Fragrances */}
          <div className="p-8 bg-white rounded-3xl border border-cream-300 shadow-sm hover:shadow-md transition-all duration-300 space-y-6 flex flex-col justify-between">
            <div className="space-y-4 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-800 border border-rose-100">
                <Sparkles className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-rose-700 font-semibold">
                  Scent Throw
                </span>
                <h3 className="font-serif text-2xl font-bold text-espresso-900">
                  Premium Fragrances
                </h3>
              </div>

              <p className="text-xs text-taupe-600 font-light leading-relaxed">
                Carefully selected high-quality fragrance oils engineered for a strong yet perfectly balanced fragrance throw.
              </p>

              <ul className="space-y-2.5 pt-2 text-xs text-espresso-900 font-medium text-left">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-600 rounded-full shrink-0" />
                  <span><strong>Selected Fragrance Oils:</strong> High-grade perfume oil</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-600 rounded-full shrink-0" />
                  <span><strong>Balanced Fragrance Throw:</strong> Fills room gently</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-600 rounded-full shrink-0" />
                  <span><strong>Memorable Atmosphere:</strong> Designed to elevate your space</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Brand Difference Banner */}
        <div className="p-8 sm:p-10 bg-espresso-950 text-cream-100 rounded-3xl text-center space-y-4 shadow-luxury border border-espresso-800 max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-champagne-400 font-semibold">
            Quality Ingredients • Small-Batch Production • Made With Love
          </p>
          <h3 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-cream-50">
            That&apos;s the Fragancia D&apos;Amour Difference.
          </h3>
          <p className="text-xs text-cream-200/80 font-light max-w-lg mx-auto">
            Thank you for supporting a small business built with passion and love in Kozhikode, Kerala.
          </p>
        </div>

      </div>
    </section>
  );
};
