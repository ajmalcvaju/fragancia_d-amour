"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";

interface FeaturedProductsGridProps {
  initialProducts: Product[];
}

export const FeaturedProductsGrid: React.FC<FeaturedProductsGridProps> = ({
  initialProducts,
}) => {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts || []);

  useEffect(() => {
    async function syncFeatured() {
      try {
        const { getProducts } = await import("@/lib/firebase/products");
        const allProds = await getProducts();
        if (allProds && allProds.length > 0) {
          const featured = allProds.filter((p) => p.featured && p.availability);
          setProductsList(featured.length > 0 ? featured : allProds);
        }
      } catch (err) {
        console.warn("Could not sync featured products:", err);
      }
    }
    syncFeatured();
  }, []);

  if (!productsList || productsList.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-cream-300">
        <p className="text-taupe-600 font-light italic">No featured candles available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {productsList.slice(0, 4).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
