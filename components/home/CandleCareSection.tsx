import React from "react";
import { Flame, Scissors, Clock, ShieldCheck, Eye, HeartHandshake, AlertCircle, Heart } from "lucide-react";

export const CandleCareSection: React.FC = () => {
  const careSteps = [
    {
      icon: Flame,
      title: "First Burn Matters",
      description: "Allow the wax to melt evenly to the edges (2–4 hours) during the first burn to prevent tunneling.",
    },
    {
      icon: Scissors,
      title: "Trim Before Lighting",
      description: "Keep the wick trimmed to ¼ inch (6 mm) before each use for a cleaner, safer burn and minimal soot.",
    },
    {
      icon: Clock,
      title: "Burn Responsibly",
      description: "Do not burn your candle for more than 4 hours at a time.",
    },
    {
      icon: ShieldCheck,
      title: "Place Safely",
      description: "Always burn on a stable, heat-resistant surface away from curtains, fabrics, and other flammable objects.",
    },
    {
      icon: Eye,
      title: "Never Leave Unattended",
      description: "Always keep your candle within sight while burning.",
    },
    {
      icon: HeartHandshake,
      title: "Keep Away from Children & Pets",
      description: "Place candles in a secure location out of reach of little hands and curious paws.",
    },
  ];

  return (
    <section className="py-20 bg-cream-100 border-b border-cream-300/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Guide Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-champagne-600 font-semibold flex items-center justify-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-champagne-500 fill-current" />
            <span>Crafted with love. Burn with care.</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-900">
            Official Candle Care Guide
          </h2>
          <p className="text-sm text-taupe-700 font-light leading-relaxed">
            Follow these essential tips to maximize the fragrance life and safety of your Fragancia D&apos;Amour 100% soy wax candles.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careSteps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-white rounded-3xl border border-cream-300 shadow-sm hover:shadow-md transition-all duration-300 space-y-3 flex flex-col items-center sm:items-start text-center sm:text-left"
              >
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-champagne-600 border border-rose-100">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-espresso-900">
                  {step.title}
                </h3>
                <p className="text-xs text-taupe-600 font-light leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Know When To Stop Banner */}
        <div className="p-6 sm:p-8 bg-espresso-900 text-cream-100 rounded-3xl text-center space-y-3 shadow-luxury border border-espresso-800 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-champagne-400 font-semibold">
            <AlertCircle className="w-4 h-4" />
            <span>Know When To Stop</span>
          </div>
          <p className="text-sm sm:text-base font-medium text-cream-50">
            Discontinue use when approximately ½ inch (1.3 cm) of wax remains at the bottom of the jar.
          </p>
          <div className="pt-2 text-xs text-champagne-400 italic font-serif">
            With Love, Fragancia D&apos;Amour — Where Fragrance Meets Emotion.
          </div>
        </div>

      </div>
    </section>
  );
};
