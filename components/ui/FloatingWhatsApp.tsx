"use client";

import React from "react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { SITE_CONFIG } from "@/lib/config/site";

export const FloatingWhatsApp: React.FC<{ productName?: string; price?: number }> = ({
  productName,
  price,
}) => {
  const message = SITE_CONFIG.whatsappMessageTemplate(productName, price);
  const encodedMsg = encodeURIComponent(message);
  const cleanPhone = SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Fragancia D'Amour on WhatsApp"
        className="group flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
      >
        <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-white shrink-0 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline text-xs uppercase tracking-wider font-semibold">
          {productName ? "Quick Order" : "Chat with Us"}
        </span>
      </a>
    </div>
  );
};
