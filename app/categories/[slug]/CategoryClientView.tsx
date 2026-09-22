"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Search, Sparkles, ArrowRight, PackageX } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { SITE_CONFIG } from "@/lib/config/site";

interface CategoryClientViewProps {
  slug: string;
  initialCategory: Category | null;
  initialProducts: Product[];
  allCategories: Category[];
}

export default function CategoryClientView({
  slug,
  initialCategory,
  initialProducts,
  allCategories: initialAllCategories,
}: CategoryClientViewProps) {
  const [category, setCategory] = useState<Category | null>(initialCategory);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categoriesList, setCategoriesList] = useState<Category[]>(initialAllCategories);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync live client dataset on mount
  useEffect(() => {
    async function syncClientData() {
      try {
        const { getCategories, getCategoryBySlug } = await import("@/lib/firebase/categories");
        const { getProductsByCategory } = await import("@/lib/firebase/products");

        const [cats, catObj, prods] = await Promise.all([
          getCategories(),
          getCategoryBySlug(slug),
          getProductsByCategory(slug),
        ]);

        if (cats && cats.length > 0) setCategoriesList(cats);
        if (catObj) setCategory(catObj);
        if (prods) setProducts(prods);
      } catch (err) {
        console.warn("Error syncing category page client data:", err);
      }
    }
    syncClientData();
  }, [slug]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(q);
      const fragranceMatch = p.fragrance?.toLowerCase().includes(q);
      const descMatch = p.shortDescription?.toLowerCase().includes(q);
      return nameMatch || fragranceMatch || descMatch;
    });
  }, [products, searchQuery]);

  const categoryTitle = category ? category.name : slug.replace(/-/g, " ").toUpperCase();
  const categoryDesc =
    category?.description ||
    `Explore handcrafted ${categoryTitle} sprayed and scented candles by Fragancia D'Amour Kozhikode.`;
  const bgImage =
    category?.image ||
    "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1200";

  return (
    <div className="space-y-8 py-6">
      
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "Products", href: "/products" },
          { label: "Categories", href: "/categories" },
          { label: categoryTitle },
        ]}
      />

      {/* Category Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-espresso-950 text-cream-50 p-8 sm:p-14 shadow-luxury border border-espresso-800">
        <Image
          src={bgImage}
          alt={`Fragancia D'Amour ${categoryTitle} - Kozhikode`}
          fill
          priority
          className="object-cover opacity-25"
        />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-champagne-500/20 text-champagne-400 border border-champagne-500/30 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scent Theme • {products.length} Candles Available</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            {categoryTitle}
          </h1>
          <p className="text-sm sm:text-base text-cream-200/90 font-light leading-relaxed">
            {categoryDesc}
          </p>
        </div>
      </div>

      {/* Category Switcher & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-cream-300 shadow-sm">
        
        {/* Category Pills Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-grow">
          <Link
            href="/products"
            className="px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider bg-cream-100 text-espresso-900 hover:bg-cream-200 transition-all whitespace-nowrap"
          >
            All Products
          </Link>
          {categoriesList.map((cat) => {
            const isActive = cat.slug === slug || cat.id === slug;
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug || cat.id}`}
                className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-espresso-950 text-cream-100 font-semibold shadow-sm"
                    : "bg-white text-espresso-900 hover:bg-cream-200 border border-cream-300"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>

        {/* Search within Category */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="w-4 h-4 text-taupe-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search in ${categoryTitle}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-cream-100/70 border border-cream-300 rounded-full text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500"
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pt-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-cream-300 space-y-5 max-w-md mx-auto my-8">
          <div className="w-14 h-14 bg-amber-50 text-champagne-600 rounded-full flex items-center justify-center mx-auto border border-champagne-200">
            <PackageX className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-bold text-espresso-900">
              No Candles Found
            </h3>
            <p className="text-xs text-taupe-600 font-light max-w-xs mx-auto">
              {searchQuery
                ? `No products matched "${searchQuery}" in ${categoryTitle}.`
                : `We are currently crafting new candle releases for the ${categoryTitle} collection.`}
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-cream-100 text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-full shadow"
            >
              <span>View All Candles</span>
              <ArrowRight className="w-4 h-4 text-champagne-400" />
            </Link>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                `Hello Fragancia D'Amour! I am inquiring about custom candles in the ${categoryTitle} collection.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-full shadow"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white text-white" />
              <span>Custom Order via WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
