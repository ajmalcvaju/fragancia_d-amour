"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/config/site";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const mainImage = product.images[0] || "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800";
  
  const cleanPhone = SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappMsg = SITE_CONFIG.whatsappMessageTemplate(product.name, product.price);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-cream-300/70 shadow-sm hover:shadow-card-hover transition-all duration-500 flex flex-col h-full">
      
      {/* Top Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream-200">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={mainImage}
            alt={`Fragancia D'Amour ${product.name} - Scented Candle in Kozhikode`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Featured / Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.featured && (
            <span className="inline-flex items-center gap-1 bg-espresso-900/90 backdrop-blur-md text-champagne-400 text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full border border-champagne-500/30">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}
        </div>

        {!product.availability && (
          <div className="absolute inset-0 bg-espresso-950/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-cream-100 text-espresso-900 text-xs uppercase tracking-widest font-semibold px-4 py-1.5 rounded-full shadow">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick View Hover overlay button */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <Link
            href={`/products/${product.slug}`}
            className="bg-cream-100/90 hover:bg-white text-espresso-900 p-2.5 rounded-full shadow-lg backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110"
            title="View Details"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Category & Fragrance */}
          <div className="flex items-center justify-between text-xs text-taupe-600 mb-1.5">
            <span className="uppercase tracking-wider font-medium text-champagne-600">
              {product.categoryName}
            </span>
            {product.size && <span>{product.size}</span>}
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-lg font-semibold text-espresso-900 group-hover:text-champagne-600 transition-colors line-clamp-1 mb-1">
            <Link href={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </h3>

          {/* Scent Note */}
          {product.fragrance && (
            <p className="text-xs text-taupe-600 italic line-clamp-1 mb-3">
              Note: {product.fragrance}
            </p>
          )}
        </div>

        {/* Price & WhatsApp CTA */}
        <div className="pt-3 border-t border-cream-200 flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-lg font-bold text-espresso-900">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-taupe-600 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {product.availability ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-cream-100 hover:bg-[#25D366] text-espresso-900 hover:text-white border border-cream-300 hover:border-[#25D366] text-xs font-medium uppercase tracking-wider px-3 py-1.5 rounded-full transition-all duration-300"
              title="Order on WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
              <span>Order</span>
            </a>
          ) : (
            <span className="text-xs text-taupe-600 uppercase tracking-wider italic">
              Unavailable
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
