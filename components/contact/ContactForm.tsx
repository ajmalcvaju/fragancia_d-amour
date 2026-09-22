"use client";

import React, { useState } from "react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { SITE_CONFIG } from "@/lib/config/site";
import { Sparkles } from "lucide-react";

export const ContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    const cleanPhone = SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
    
    let text = `Hello Fragancia D'Amour!\n\nNew Inquiry from Website:\n• Name: ${name.trim()}\n• Phone/WhatsApp: ${phone.trim()}`;
    if (email.trim()) {
      text += `\n• Email: ${email.trim()}`;
    }
    text += `\n\nInquiry Message:\n${message.trim()}`;

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    setSubmitted(true);
    
    // Redirect to WhatsApp in a new window/tab
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-cream-300 shadow-sm space-y-6">
      <div className="space-y-1">
        <h2 className="font-serif text-2xl font-bold text-espresso-900 flex items-center gap-2">
          <span>Send a Message</span>
        </h2>
        <p className="text-xs text-taupe-600 font-light">
          Fill out your details below. Submitting will redirect your inquiry directly to our official WhatsApp.
        </p>
      </div>

      {submitted && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Opening WhatsApp... If it didn&apos;t open automatically, check your browser popup settings.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ananya Nair"
              className="w-full px-4 py-3 bg-cream-100/70 border border-cream-300 rounded-xl text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1">
              Phone / WhatsApp *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 99618 59173"
              className="w-full px-4 py-3 bg-cream-100/70 border border-cream-300 rounded-xl text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1">
            Email Address (Optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full px-4 py-3 bg-cream-100/70 border border-cream-300 rounded-xl text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1">
            Your Message / Inquiry *
          </label>
          <textarea
            rows={4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about the candles you are interested in or custom gifting requirements..."
            className="w-full px-4 py-3 bg-cream-100/70 border border-cream-300 rounded-xl text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-8 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all shadow-md active:scale-95"
        >
          <WhatsAppIcon className="w-5 h-5 fill-white text-white shrink-0" />
          <span>Send via WhatsApp</span>
        </button>
      </form>
    </div>
  );
};
