import { getProductBySlug, getProducts } from "@/lib/firebase/products";
import { TopBanner } from "@/components/layout/TopBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductCard } from "@/components/products/ProductCard";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { CandleCareSection } from "@/components/home/CandleCareSection";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductGallery from "./ProductGallery";
import { formatPrice } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/config/site";
import { Flame, Sparkles, ShieldCheck, Truck, Gift, Heart } from "lucide-react";

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return {
      title: "Product Not Found | Fragancia D'Amour",
    };
  }

  return {
    title: `${product.name} | Fragancia D'Amour Kozhikode`,
    description: `${product.shortDescription || product.description} Handcrafted 100% soy wax candle available in Kozhikode, Kerala.`,
    openGraph: {
      title: `${product.name} | Fragancia D'Amour Scented Candle`,
      description: product.shortDescription,
      images: product.images.length > 0 ? [{ url: product.images[0] }] : [],
    },
  };
}

export const revalidate = 60;

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 3);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description || product.shortDescription,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": product.price,
      "availability": product.availability
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": SITE_CONFIG.name,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <TopBanner />
      <Navbar />

      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Breadcrumbs
            items={[
              { label: "Products", href: "/products" },
              { label: product.categoryName, href: `/categories/${product.categoryId}` },
              { label: product.name },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-6">
            
            {/* Left Multi-Image Gallery */}
            <div className="lg:col-span-7">
              <ProductGallery images={product.images} productName={product.name} />
            </div>

            {/* Right Product Meta & Ordering */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Category & Status Badges */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-champagne-600 font-semibold bg-rose-100 px-3 py-1 rounded-full">
                  {product.categoryName}
                </span>

                {product.availability ? (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    In Stock
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    Currently Unavailable
                  </span>
                )}
              </div>

              {/* Title & Price */}
              <div className="space-y-2">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900 leading-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="font-serif text-2xl font-bold text-espresso-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-taupe-600 line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
                  <span className="text-xs text-taupe-600 font-light">Taxes included</span>
                </div>
              </div>

              {/* Fragrance Note Banner */}
              {product.fragrance && (
                <div className="p-4 bg-white rounded-2xl border border-cream-300 shadow-sm flex items-center gap-3">
                  <div className="p-2.5 bg-rose-100 rounded-xl text-champagne-600">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-taupe-600 font-medium">
                      Fragrance Profile
                    </p>
                    <p className="font-serif text-sm font-semibold text-espresso-900">
                      {product.fragrance}
                    </p>
                  </div>
                </div>
              )}

              {/* Size & Soy Wax Badge */}
              <div className="flex items-center gap-4 text-xs text-taupe-700 font-medium bg-cream-50 p-3 rounded-xl border border-cream-200">
                <div className="flex items-center gap-1 text-emerald-800">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span><strong>100% Soy Wax</strong></span>
                </div>
                {product.size && (
                  <span>Net Weight: <strong className="text-espresso-900">{product.size}</strong></span>
                )}
              </div>

              {/* Short & Full Description */}
              <div className="space-y-3 pt-2 text-sm text-taupe-700 leading-relaxed font-light">
                <p className="font-medium text-espresso-900">{product.shortDescription}</p>
                <p>{product.description}</p>
              </div>

              {/* Gifting Note Badge */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center gap-2 text-xs text-amber-900">
                <Gift className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Complimentary <strong>&ldquo;Especially for You&rdquo;</strong> gift card included upon request.</span>
              </div>

              {/* Primary WhatsApp Order CTA */}
              <div className="pt-4 border-t border-cream-300 space-y-3">
                <WhatsAppButton
                  productName={product.name}
                  price={product.price}
                  variant="primary"
                  className="w-full text-base font-semibold py-4 shadow-lg"
                  label="Order / Enquire on WhatsApp"
                />
                <p className="text-[11px] text-center text-taupe-600 font-light">
                  Direct inquiry with Fragancia D&apos;Amour Kozhikode • Fast response on availability & shipping.
                </p>
              </div>

              {/* Service Highlights */}
              <div className="grid grid-cols-2 gap-3 pt-4 text-xs text-taupe-700">
                <div className="flex items-center gap-2 p-3 bg-white/70 rounded-xl border border-cream-300/60">
                  <Truck className="w-4 h-4 text-champagne-600" />
                  <span>Safe Pan-India Shipping</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white/70 rounded-xl border border-cream-300/60">
                  <ShieldCheck className="w-4 h-4 text-champagne-600" />
                  <span>Boutique Quality Guaranteed</span>
                </div>
              </div>

            </div>

          </div>

          {/* Official Candle Care Guide */}
          <div className="mt-16 pt-12 border-t border-cream-300">
            <CandleCareSection />
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-cream-300">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-8">
                You May Also Love
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {relatedProducts.map((relProduct) => (
                  <ProductCard key={relProduct.id} product={relProduct} />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
      <FloatingWhatsApp productName={product.name} price={product.price} />
    </div>
  );
}
