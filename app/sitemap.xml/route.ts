import { NextResponse } from "next/server";
import { getProducts } from "@/lib/firebase/products";
import { getCategories } from "@/lib/firebase/categories";
import { SITE_CONFIG } from "@/lib/config/site";

export async function GET() {
  const baseUrl = SITE_CONFIG.url;

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const staticPages = [
    "",
    "/products",
    "/about",
    "/contact",
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
    <url>
      <loc>${baseUrl}${page}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>${page === "" || page === "/products" ? "daily" : "monthly"}</changefreq>
      <priority>${page === "" ? "1.0" : "0.8"}</priority>
    </url>`
    )
    .join("")}
  ${products
    .map(
      (product) => `
    <url>
      <loc>${baseUrl}/products/${product.slug}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
    )
    .join("")}
  ${categories
    .map(
      (cat) => `
    <url>
      <loc>${baseUrl}/categories/${cat.slug}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>`
    )
    .join("")}
</urlset>`;

  return new NextResponse(sitemapXml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
