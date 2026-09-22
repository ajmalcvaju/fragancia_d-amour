"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images = [], productName }: ProductGalleryProps) {
  const safeImages = Array.isArray(images) && images.length > 0 ? images : [];
  const defaultImage = safeImages.length > 0
    ? safeImages[0]
    : "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1000";

  const [selectedImage, setSelectedImage] = useState<string>(defaultImage);

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-white border border-cream-300 shadow-sm">
        <Image
          src={selectedImage}
          alt={`Fragancia D'Amour Scented Candle - ${productName}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover object-center transition-all duration-500"
        />
      </div>

      {/* Thumbnails list */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`relative w-20 aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                selectedImage === img
                  ? "border-champagne-500 scale-95 shadow"
                  : "border-cream-300 hover:border-cream-400 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
