"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Category } from "@/types/category";

interface CategoryGridProps {
  categories: Category[];
  limit?: number;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories: initialCategories, limit }) => {
  const [categoriesList, setCategoriesList] = useState<Category[]>(initialCategories || []);

  useEffect(() => {
    async function syncCategories() {
      try {
        const { getCategories } = await import("@/lib/firebase/categories");
        const cats = await getCategories();
        if (cats && cats.length > 0) {
          setCategoriesList(cats);
        }
      } catch (err) {
        console.warn("Could not sync categories in CategoryGrid:", err);
      }
    }
    syncCategories();
  }, []);

  const displayCategories = limit ? categoriesList.slice(0, limit) : categoriesList;

  if (!displayCategories || displayCategories.length === 0) {
    return (
      <section id="categories" className="py-16 bg-cream-50 text-center">
        <p className="text-taupe-600 font-light italic">Collections coming soon.</p>
      </section>
    );
  }

  return (
    <section id="categories" className="py-20 bg-cream-50 border-b border-cream-300/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-champagne-600 font-semibold">
            Scent Collections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900">
            Shop By Fragrance Category
          </h2>
          <p className="text-sm text-taupe-600 font-light">
            Discover fragrances tailored for every mood, space, and occasion.
          </p>
        </div>

        {/* Dynamic Category Cards Grid (4 per row on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map((category) => {
            const bgImage = category.image || "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800";
            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative aspect-[4/5] rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-cream-300/80 flex flex-col justify-end p-6"
              >
                {/* Image */}
                <Image
                  src={bgImage}
                  alt={`Fragancia D'Amour ${category.name} - Kozhikode`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/90 via-espresso-950/40 to-transparent group-hover:from-espresso-950/95 transition-colors duration-500" />

                {/* Content Overlay */}
                <div className="relative z-10 space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-cream-50 group-hover:text-champagne-400 transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs text-cream-200/80 line-clamp-2 font-light">
                      {category.description}
                    </p>
                  )}
                  <div className="pt-2 flex items-center text-xs uppercase tracking-widest text-champagne-400 font-semibold group-hover:translate-x-1 transition-transform">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};
