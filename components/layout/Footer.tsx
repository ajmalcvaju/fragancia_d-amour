import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, MapPin, Heart } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { PhoneIcon } from "@/components/ui/PhoneIcon";
import { SITE_CONFIG } from "@/lib/config/site";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-espresso-950 text-cream-200 pt-16 pb-8 border-t border-espresso-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-espresso-800/80">
          
          {/* Brand Info & Verified Address */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0">
                <Image
                  src={SITE_CONFIG.logoUrl}
                  alt={`${SITE_CONFIG.name} Brand Logo`}
                  fill
                  className="object-contain object-center p-1"
                />
              </div>
              <div>
                <h3 className="font-serif text-xl text-cream-50 font-bold tracking-tight">
                  Fragancia D&apos;Amour
                </h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-champagne-400 font-semibold italic">
                  {SITE_CONFIG.slogan}
                </p>
              </div>
            </div>

            <p className="text-sm text-cream-300/80 leading-relaxed font-light">
              Crafting luxury sprayed and scented candles designed to infuse warmth, romance, and elegant fragrance into everyday spaces across Kozhikode, Kerala, and all of India.
            </p>

            <div className="flex items-start text-xs text-champagne-400 gap-2 pt-1 font-light leading-relaxed">
              <MapPin className="w-4 h-4 text-champagne-500 shrink-0 mt-0.5" />
              <span>{SITE_CONFIG.location.fullAddress}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg text-cream-50 font-medium mb-4 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-cream-300/80 font-light">
              <li>
                <Link href="/" className="hover:text-champagne-400 transition-colors">
                  Home Collection
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-champagne-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-champagne-400 transition-colors">
                  Scent Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-champagne-400 transition-colors">
                  Our Story & Craft
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-champagne-400 transition-colors">
                  Contact & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories & Fragrance Notes */}
          <div>
            <h4 className="font-serif text-lg text-cream-50 font-medium mb-4 tracking-wide">
              Fragrance Themes
            </h4>
            <ul className="space-y-2.5 text-sm text-cream-300/80 font-light">
              <li>
                <Link href="/categories/floral-bliss" className="hover:text-champagne-400 transition-colors">
                  Floral Bliss Candles
                </Link>
              </li>
              <li>
                <Link href="/categories/fresh-citrus" className="hover:text-champagne-400 transition-colors">
                  Fresh & Citrus
                </Link>
              </li>
              <li>
                <Link href="/categories/sweet-gourmand" className="hover:text-champagne-400 transition-colors">
                  Vanilla & Gourmand
                </Link>
              </li>
              <li>
                <Link href="/categories/woody-earthy" className="hover:text-champagne-400 transition-colors">
                  Sandalwood & Woody Oud
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-champagne-400 transition-colors font-medium text-champagne-400">
                  View All Collections →
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Instagram */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg text-cream-50 font-medium tracking-wide">
              Connect With Us
            </h4>
            <p className="text-sm text-cream-300/80 font-light">
              Follow our fragrance journey on Instagram for new releases and candle aesthetics.
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-champagne-400 hover:text-champagne-300 border border-champagne-500/40 px-4 py-2.5 rounded-full w-fit transition-all hover:border-champagne-400"
              >
                <Instagram className="w-4 h-4" />
                <span>Follow {SITE_CONFIG.instagramHandle}</span>
              </a>

              <a
                href={`tel:${SITE_CONFIG.phoneNumber}`}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-cream-200 hover:text-champagne-400 font-medium transition-colors"
              >
                <PhoneIcon className="w-4 h-4 text-champagne-400 shrink-0" />
                <span>Call: {SITE_CONFIG.displayPhone}</span>
              </a>

              <a
                href={`https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#25D366] hover:text-[#20bd5a] font-medium"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current text-[#25D366]" />
                <span>Order via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-cream-400 font-light gap-4">
          <p>© {currentYear} {SITE_CONFIG.name}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Handcrafted with <Heart className="w-3.5 h-3.5 text-rose-300 fill-current inline" /> in Kozhikode, Kerala
          </p>
          <div className="flex gap-4">
            <Link href="/admin/login" className="hover:text-cream-200 transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
