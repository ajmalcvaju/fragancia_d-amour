"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { ProductCard } from "@/components/products/ProductCard";
import { Search, SlidersHorizontal, PackageX } from "lucide-react";

interface ProductsClientViewProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductsClientView({
  initialProducts,
  categories: initialCategories,
}: ProductsClientViewProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [categoriesList, setCategoriesList] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Sync live products and categories from database / localStorage on client mount
  useEffect(() => {
    async function syncData() {
      try {
        const { getProducts } = await import("@/lib/firebase/products");
        const { getCategories } = await import("@/lib/firebase/categories");
        const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
        if (prods && prods.length > 0) setProductsList(prods);
        if (cats && cats.length > 0) setCategoriesList(cats);
      } catch (err) {
        console.warn("Could not sync products client data:", err);
      }
    }
    syncData();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const filteredProducts = useMemo(() => {
    return productsList
      .filter((product) => {
        // Category Filter
        if (selectedCategory !== "all") {
          const target = selectedCategory.toLowerCase().trim();
          const matchId = (product.categoryId || "").toLowerCase().trim() === target;
          const matchName = (product.categoryName || "").toLowerCase().trim() === target;
          const matchSlug =
            (product.categoryName || "").toLowerCase().trim().replace(/\s+/g, "-") === target ||
            (product.categoryName || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") === target;
          if (!matchId && !matchName && !matchSlug) return false;
        }

        // Search Filter
        if (searchQuery.trim() !== "") {
          const query = searchQuery.toLowerCase();
          const nameMatch = product.name.toLowerCase().includes(query);
          const fragranceMatch = product.fragrance?.toLowerCase().includes(query);
          const categoryMatch = product.categoryName.toLowerCase().includes(query);
          if (!nameMatch && !fragranceMatch && !categoryMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "featured") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        return a.displayOrder - b.displayOrder;
      });
  }, [productsList, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-8">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 rounded-2xl border border-cream-300 shadow-sm">
        
        {/* Search Input */}
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-taupe-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, scent notes, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-cream-100/70 border border-cream-300 rounded-full text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500 transition"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-taupe-600 hidden sm:inline" />
          <span className="text-xs text-taupe-600 font-medium hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-cream-100/70 border border-cream-300 rounded-full text-xs font-medium text-espresso-900 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-champagne-500"
          >
            <option value="featured">Featured First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all ${
            selectedCategory === "all"
              ? "bg-espresso-900 text-cream-100 shadow"
              : "bg-white text-espresso-900 hover:bg-cream-200 border border-cream-300"
          }`}
        >
          All Scents ({productsList.length})
        </button>

        {categoriesList.map((cat) => {
          const isActive =
            selectedCategory === cat.id ||
            selectedCategory === cat.slug ||
            selectedCategory === cat.name.toLowerCase().replace(/\s+/g, "-");
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all ${
                isActive
                  ? "bg-espresso-950 text-cream-100 font-semibold shadow"
                  : "bg-white text-espresso-900 hover:bg-cream-200 border border-cream-300"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-cream-300 space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-champagne-600 mx-auto">
            <PackageX className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-espresso-900">
            No candles available
          </h3>
          <p className="text-xs text-taupe-600 font-light">
            No products match your current search or category filter. Try clearing your search query.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="inline-flex items-center text-xs uppercase tracking-widest text-champagne-600 font-semibold border-b border-champagne-600 pb-0.5"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
