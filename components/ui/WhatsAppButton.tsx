"use client";

import React from "react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { SITE_CONFIG } from "@/lib/config/site";

interface WhatsAppButtonProps {
  productName?: string;
  price?: number;
  variant?: "primary" | "secondary" | "outline" | "compact";
  className?: string;
  label?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  productName,
  price,
  variant = "primary",
  className = "",
  label,
}) => {
  const message = SITE_CONFIG.whatsappMessageTemplate(productName, price);
  const encodedMsg = encodeURIComponent(message);
  const cleanPhone = SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md hover:shadow-lg px-6 py-3 text-sm tracking-wide",
    secondary: "bg-espresso-900 hover:bg-espresso-800 text-cream-100 px-6 py-3 text-sm tracking-wide",
    outline: "border border-espresso-900 text-espresso-900 hover:bg-espresso-900 hover:text-cream-100 px-5 py-2.5 text-xs uppercase tracking-wider",
    compact: "bg-[#25D366] text-white p-2.5 text-xs rounded-full hover:scale-105 transition-transform",
  };

  const textLabel = label || (productName ? "Order on WhatsApp" : "Enquire on WhatsApp");

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order on WhatsApp"
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <WhatsAppIcon className="w-4 h-4 mr-2.5 fill-current shrink-0" />
      <span>{textLabel}</span>
    </a>
  );
};
