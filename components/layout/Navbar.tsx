"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Instagram } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { PhoneIcon } from "@/components/ui/PhoneIcon";
import { SITE_CONFIG } from "@/lib/config/site";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const cleanPhone = SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    SITE_CONFIG.whatsappMessageTemplate()
  )}`;

  return (
    <header className="sticky top-0 z-40 bg-cream-100/95 backdrop-blur-md border-b border-cream-300/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 sm:h-28">
          
          {/* Official Brand Logo Container */}
          <Link href="/" className="flex items-center gap-3.5 group py-2">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-cream-300/80 shadow-md shrink-0 group-hover:scale-105 transition-transform bg-white">
              <Image
                src={SITE_CONFIG.logoUrl}
                alt={`${SITE_CONFIG.name} Official Logo`}
                fill
                className="object-contain object-center p-0.5"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-espresso-900 group-hover:text-champagne-600 transition-colors uppercase">
                Fragancia D&apos;Amour
              </span>
              <span className="text-[9.5px] tracking-[0.2em] uppercase text-champagne-600 font-semibold italic -mt-0.5">
                {SITE_CONFIG.slogan}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs uppercase tracking-widest transition-colors font-medium relative py-1 ${
                  isActive(link.href)
                    ? "text-champagne-600 font-semibold"
                    : "text-espresso-900/80 hover:text-champagne-600"
                }`}
              >
                {link.name}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-champagne-500 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`tel:${SITE_CONFIG.phoneNumber}`}
              aria-label="Call Fragancia D'Amour"
              className="p-2 text-espresso-900 hover:text-champagne-600 transition-colors hidden sm:block"
              title={`Call Studio: ${SITE_CONFIG.displayPhone}`}
            >
              <PhoneIcon className="w-5 h-5 text-espresso-900 hover:text-champagne-600" />
            </a>

            <a
              href={SITE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Fragancia D'Amour on Instagram"
              className="p-2 text-espresso-900 hover:text-champagne-600 transition-colors hidden sm:block"
              title="Follow us on Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 group"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white text-white shrink-0 group-hover:scale-110 transition-transform" />
              <span>Enquire Now</span>
            </a>

            {/* Mobile Hamburger Menu Button (Right Side) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl text-espresso-900 hover:text-champagne-600 hover:bg-cream-200/80 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-cream-50 border-b border-cream-300 animate-fade-in px-6 pt-5 pb-8 space-y-6 shadow-xl">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-base font-medium py-3 px-4 rounded-xl tracking-wider transition-all flex items-center justify-between ${
                  isActive(link.href)
                    ? "bg-espresso-950 text-cream-100 font-semibold shadow-sm"
                    : "text-espresso-900 hover:bg-cream-200/80"
                }`}
              >
                <span>{link.name}</span>
                {isActive(link.href) && (
                  <span className="w-2 h-2 rounded-full bg-champagne-400" />
                )}
              </Link>
            ))}
          </nav>

          <div className="pt-5 border-t border-cream-300/80 space-y-3">
            <a
              href={`tel:${SITE_CONFIG.phoneNumber}`}
              className="w-full flex items-center justify-center gap-2.5 bg-espresso-900 hover:bg-espresso-800 text-cream-100 text-xs font-bold uppercase tracking-widest py-3.5 px-6 rounded-full shadow-md active:scale-95 transition-all"
            >
              <PhoneIcon className="w-5 h-5 text-champagne-400 shrink-0" />
              <span>Call Us ({SITE_CONFIG.displayPhone})</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-widest py-3.5 px-6 rounded-full shadow-md active:scale-95 transition-all"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white text-white shrink-0" />
              <span>WhatsApp Us</span>
            </a>

            <div className="flex items-center justify-center gap-2 pt-2">
              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-espresso-900 hover:text-champagne-600 font-semibold transition-colors"
              >
                <Instagram className="w-4 h-4 text-champagne-600" />
                <span>{SITE_CONFIG.instagramHandle}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
