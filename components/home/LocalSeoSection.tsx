import React from "react";
import { MapPin, Truck, Gift, Navigation } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config/site";

export const LocalSeoSection: React.FC = () => {
  return (
    <section className="py-16 bg-cream-200/60 border-b border-cream-300/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          <div className="p-6 bg-white rounded-3xl border border-cream-300/70 shadow-sm flex flex-col items-center md:items-start justify-between space-y-4">
            <div className="flex flex-col items-center md:items-start">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-champagne-600 mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-espresso-900 mb-2">
                Located on Mavoor Road, Kozhikode
              </h3>
              <p className="text-xs text-taupe-700 leading-relaxed font-light">
                {SITE_CONFIG.location.fullAddress}
              </p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${SITE_CONFIG.location.geo.latitude},${SITE_CONFIG.location.geo.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-champagne-600 hover:text-champagne-700 uppercase tracking-wider"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>View Map Directions</span>
            </a>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-cream-300/70 shadow-sm flex flex-col items-center md:items-start justify-between space-y-4">
            <div className="flex flex-col items-center md:items-start">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-champagne-600 mb-4">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-espresso-900 mb-2">
                Memorable Candle Gifting
              </h3>
              <p className="text-xs text-taupe-700 leading-relaxed font-light">
                Looking for elegant gifts for celebrations, weddings, or corporate gestures in Kerala? Explore our custom curated fragrance sets.
              </p>
            </div>
            <span className="text-xs uppercase tracking-widest text-champagne-600 font-semibold">
              Boutique Hampers
            </span>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-cream-300/70 shadow-sm flex flex-col items-center md:items-start justify-between space-y-4">
            <div className="flex flex-col items-center md:items-start">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-champagne-600 mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-espresso-900 mb-2">
                Delivery Across India
              </h3>
              <p className="text-xs text-taupe-700 leading-relaxed font-light">
                We carefully pack and ship all candles to reach your doorstep safely anywhere across Kozhikode, Kerala, and all major Indian cities.
              </p>
            </div>
            <span className="text-xs uppercase tracking-widest text-champagne-600 font-semibold">
              Pan-India Shipping
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
