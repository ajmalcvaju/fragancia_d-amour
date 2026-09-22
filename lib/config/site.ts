export const SITE_CONFIG = {
  name: "Fragancia D'Amour",
  shortName: "Fragancia D'Amour",
  slogan: "Scented Love Stories",
  tagline: "Scented Love Stories • Fragrance That Sets the Mood",
  description: "Boutique fragrance and sprayed candle studio based in Kozhikode, Kerala. Crafting luxury scented candles designed to infuse warmth, elegance, and romantic ambience into everyday spaces.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://fraganciadamour.com",
  logoUrl: "/logo.jpg",
  
  // Official Verified Location, Address & Geo Coordinates
  location: {
    street: "U K S Road, Near K S R T C Bus Stand, Mavoor Road",
    city: "Kozhikode",
    alternateCity: "Calicut",
    state: "Kerala",
    pincode: "673004",
    country: "India",
    fullAddress: "U K S Road, Near K S R T C Bus Stand, Mavoor Road, Kozhikode - 673004, Kerala, India",
    displayLocation: "U K S Road, Mavoor Road, Kozhikode, Kerala",
    geo: {
      latitude: 11.2565361,
      longitude: 75.7922111,
    },
  },
  
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3913.0662603522005!2d75.7922111!3d11.256536100000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTHCsDE1JzIzLjUiTiA3NcKwNDcnMzIuMCJF!5e0!3m2!1sen!2sin!4v1789970227814!5m2!1sen!2sin",
  
  // Contact Phone & WhatsApp Configuration
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+919961859173",
  phoneNumber: process.env.NEXT_PUBLIC_PHONE_NUMBER || "+919961859173",
  displayPhone: "+91 99618 59173",
  whatsappMessageTemplate: (productName?: string, price?: number) => {
    if (productName && price) {
      return `Hello Fragancia D'Amour! I am interested in purchasing "${productName}" (₹${price}). Please share availability and ordering details.`;
    }
    if (productName) {
      return `Hello Fragancia D'Amour! I am interested in "${productName}". Please share pricing and ordering details.`;
    }
    return `Hello Fragancia D'Amour! I would like to inquire about your scented candles collection and custom fragrance orders.`;
  },
  
  // Social Media Links
  instagramUrl: "https://www.instagram.com/fragancia_d_amour/",
  instagramHandle: "@fragancia_d_amour",
  
  // Contact Info
  email: "fraganciadamour@gmail.com",

  // Keywords for Local SEO & Schema.org
  keywords: [
    "scented candles in Kozhikode",
    "scented candles Kozhikode",
    "scented candle shop Mavoor Road Kozhikode",
    "scented candle shop Calicut",
    "scented candles Kerala",
    "fragrance candles Kerala",
    "candles for gifting Kozhikode",
    "luxury scented candles Kerala",
    "handmade candles Kozhikode",
    "decorative scented candles Kerala",
    "candle gifts Calicut",
    "Fragancia D'Amour candles",
    "sprayed candles Kerala",
  ],
};
