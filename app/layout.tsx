import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/config/site";
import { AuthProvider } from "@/lib/firebase/auth-context";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} | Scented Candles in Kozhikode, Kerala`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_CONFIG.url,
    title: `${SITE_CONFIG.name} | Scented Candles in Kozhikode, Kerala`,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}${SITE_CONFIG.logoUrl}`,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} ${SITE_CONFIG.slogan} Kozhikode`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} | Scented Candles Kozhikode`,
    description: SITE_CONFIG.description,
    images: [`${SITE_CONFIG.url}${SITE_CONFIG.logoUrl}`],
  },
  icons: {
    icon: SITE_CONFIG.logoUrl,
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": SITE_CONFIG.name,
    "image": `${SITE_CONFIG.url}${SITE_CONFIG.logoUrl}`,
    "description": SITE_CONFIG.description,
    "url": SITE_CONFIG.url,
    "sameAs": [SITE_CONFIG.instagramUrl],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": SITE_CONFIG.location.street,
      "addressLocality": SITE_CONFIG.location.city,
      "addressRegion": SITE_CONFIG.location.state,
      "postalCode": SITE_CONFIG.location.pincode,
      "addressCountry": SITE_CONFIG.location.country,
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": SITE_CONFIG.location.geo.latitude,
      "longitude": SITE_CONFIG.location.geo.longitude,
    },
    "priceRange": "₹649 - ₹1899",
    "areaServed": ["Kozhikode", "Calicut", "Kerala", "India"],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased text-espresso-900 bg-cream-100 min-h-screen flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
