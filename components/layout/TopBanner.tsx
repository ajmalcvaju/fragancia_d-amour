import React from "react";
import { Sparkles } from "lucide-react";

export const TopBanner: React.FC = () => {
  return (
    <div className="hidden sm:flex bg-espresso-900 text-cream-100 py-2.5 px-4 text-xs font-medium text-center tracking-wider items-center justify-center gap-2 border-b border-espresso-800">
      <Sparkles className="w-3.5 h-3.5 text-champagne-500 animate-pulse" />
      <span>Handcrafted Luxury Candles • Kozhikode, Kerala • Delivery Across India</span>
      <Sparkles className="w-3.5 h-3.5 text-champagne-500 animate-pulse hidden sm:inline" />
    </div>
  );
};
