"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, Compass, MapPin, Heart, Flame } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config/site";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-espresso-950 text-cream-100">
      
      {/* High-Definition Visible Candle Background with Slow Ken Burns Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=2000"
          alt="Fragancia D'Amour Scented Candles Ambient Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-75 scale-105 transition-transform duration-[10000ms] ease-out hover:scale-110"
        />
        
        {/* Soft Vignette & Radial Light Overlay to enhance text contrast while keeping image bright */}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-espresso-950/35 to-espresso-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso-950/70 via-transparent to-espresso-950/70" />
      </div>

      {/* Floating Animated Ambient Glow Effect behind headline */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-champagne-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-3000" />
      <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Content Layer */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        
        {/* Animated Brand Emblem Badge */}
        <div className="mb-6 p-2 bg-espresso-950/80 backdrop-blur-md rounded-full border border-champagne-500/50 shadow-soft-glow animate-fade-in flex items-center gap-3 pr-6 hover:border-champagne-400 transition-all duration-300 transform hover:-translate-y-0.5">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-champagne-400 shrink-0 bg-white shadow">
            <Image
              src={SITE_CONFIG.logoUrl}
              alt="Fragancia D'Amour Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-[0.25em] text-champagne-400 font-bold">
              Fragancia D&apos;Amour
            </span>
            <span className="text-xs uppercase tracking-[0.15em] text-cream-200 font-serif italic">
              {SITE_CONFIG.slogan}
            </span>
          </div>
        </div>

        {/* Headline with Gold Gradient Accent */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-cream-50 leading-[1.1] mb-6 max-w-4xl drop-shadow-md">
          Fragrance That Sets <br className="hidden sm:block" />
          <span className="italic font-normal font-display text-transparent bg-clip-text bg-gradient-to-r from-champagne-400 via-champagne-300 to-amber-200">
            the Perfect Mood
          </span>
        </h1>

        {/* Subtitle Copy */}
        <p className="text-base sm:text-xl text-cream-100 font-light max-w-2xl leading-relaxed mb-6 drop-shadow">
          Handcrafted 100% soy wax candles designed to infuse warmth, romance, and visual elegance into everyday spaces.
        </p>

        {/* Address & Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <div className="flex items-center gap-2 bg-espresso-900/80 backdrop-blur-md border border-cream-300/30 text-cream-100 text-xs px-4 py-2 rounded-full shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-champagne-400 shrink-0" />
            <span>U K S Road, Mavoor Road, Kozhikode, Kerala</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-espresso-900/80 backdrop-blur-md border border-champagne-500/30 text-champagne-300 text-xs px-4 py-2 rounded-full shadow-sm">
            <Flame className="w-3.5 h-3.5 text-champagne-400 shrink-0" />
            <span>100% Soy Wax • Small Batch</span>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/products"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-champagne-500 to-amber-500 hover:from-champagne-400 hover:to-amber-400 text-espresso-950 font-bold px-8 py-4 rounded-full text-xs uppercase tracking-widest shadow-luxury hover:shadow-soft-glow transition-all duration-300 transform hover:-translate-y-1"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/products#categories"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-espresso-950/70 hover:bg-espresso-900 text-cream-100 border border-cream-200/40 hover:border-champagne-400 font-medium px-8 py-4 rounded-full text-xs uppercase tracking-widest backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Compass className="w-4 h-4 text-champagne-400" />
            <span>Shop Categories</span>
          </Link>
        </div>

        {/* Animated Scroll Indicator */}
        <div className="mt-14 text-cream-300/80 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-light">
          <span>Scroll to Discover</span>
          <div className="w-0.5 h-7 bg-gradient-to-b from-champagne-400 via-champagne-500 to-transparent animate-bounce rounded-full" />
        </div>

      </div>
    </section>
  );
};
