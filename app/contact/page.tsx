import { TopBanner } from "@/components/layout/TopBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { ContactForm } from "@/components/contact/ContactForm";
import { Metadata } from "next";
import { MapPin, Instagram, Mail, Navigation } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { PhoneIcon } from "@/components/ui/PhoneIcon";
import { SITE_CONFIG } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Contact Us & Location | Fragancia D'Amour Kozhikode",
  description: "Visit or contact Fragancia D'Amour on Mavoor Road, Kozhikode, Kerala. Inquire about custom fragrance candles, bulk order availability, and shipping across India.",
};

export default function ContactPage() {
  const cleanPhone = SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    SITE_CONFIG.whatsappMessageTemplate()
  )}`;

  return (
    <div className="flex flex-col min-h-screen bg-cream-100">
      <TopBanner />
      <Navbar />

      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Breadcrumbs items={[{ label: "Contact Us" }]} />

          {/* Page Title */}
          <div className="py-6 space-y-2 max-w-2xl text-center sm:text-left flex flex-col items-center sm:items-start">
            <span className="text-xs uppercase tracking-[0.25em] text-champagne-600 font-semibold">
              Get In Touch
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-900">
              We&apos;d Love to Hear From You
            </h1>
            <p className="text-sm text-taupe-600 font-light leading-relaxed">
              Have questions about our scented candles, custom fragrances, or gift hampers in Kozhikode? Connect with us via WhatsApp or Instagram, or visit us on Mavoor Road.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-8">
            
            {/* Left Contact Cards */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Verified Address Card */}
              <div className="p-6 bg-white rounded-3xl border border-cream-300 shadow-sm space-y-4 flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-champagne-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-espresso-900">
                  Brand Studio Address
                </h3>
                <p className="text-xs text-taupe-700 leading-relaxed font-light">
                  <strong className="text-espresso-900 font-medium">Fragancia D&apos;Amour</strong><br />
                  {SITE_CONFIG.location.street}<br />
                  {SITE_CONFIG.location.city} - {SITE_CONFIG.location.pincode}, {SITE_CONFIG.location.state}, {SITE_CONFIG.location.country}
                </p>
                <div className="pt-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${SITE_CONFIG.location.geo.latitude},${SITE_CONFIG.location.geo.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-champagne-600 hover:text-champagne-700 border-b border-champagne-500 pb-0.5"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions on Google Maps</span>
                  </a>
                </div>
              </div>

              {/* Direct Phone Call Card */}
              <div className="p-6 bg-white rounded-3xl border border-cream-300 shadow-sm space-y-4 flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="w-10 h-10 bg-amber-100/80 rounded-xl flex items-center justify-center text-espresso-900">
                  <PhoneIcon className="w-5 h-5 text-espresso-900" />
                </div>
                <h3 className="font-serif text-xl font-bold text-espresso-900">
                  Call Studio Directly
                </h3>
                <p className="text-xs text-taupe-600 font-light leading-relaxed">
                  Speak directly with our Kozhikode candle studio team for custom inquiries & bulk orders:
                </p>
                <a
                  href={`tel:${SITE_CONFIG.phoneNumber}`}
                  className="inline-flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-cream-100 text-xs font-semibold px-5 py-3 rounded-full transition-all shadow"
                >
                  <PhoneIcon className="w-4 h-4 text-champagne-400" />
                  <span>Call {SITE_CONFIG.displayPhone}</span>
                </a>
              </div>

              {/* WhatsApp Direct Order Card */}
              <div className="p-6 bg-white rounded-3xl border border-cream-300 shadow-sm space-y-4 flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-[#25D366]">
                  <WhatsAppIcon className="w-5 h-5 fill-current" />
                </div>
                <h3 className="font-serif text-xl font-bold text-espresso-900">
                  WhatsApp Direct Order
                </h3>
                <p className="text-xs text-taupe-600 font-light leading-relaxed">
                  For immediate order inquiries, availability checks, or custom candle requests:
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold px-5 py-3 rounded-full transition-all shadow"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white text-white" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {/* Email Support Card */}
              <div className="p-6 bg-white rounded-3xl border border-cream-300 shadow-sm space-y-4 flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-espresso-900">
                  Email Studio
                </h3>
                <p className="text-xs text-taupe-600 font-light leading-relaxed">
                  Send us an email for corporate gifting, partnerships, or official inquiries:
                </p>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="inline-flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-cream-100 text-xs font-semibold px-5 py-3 rounded-full transition-all shadow"
                >
                  <Mail className="w-4 h-4 text-champagne-400" />
                  <span>{SITE_CONFIG.email}</span>
                </a>
              </div>

            </div>

            {/* Right Message Form & Embedded Map */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Message Form with WhatsApp Redirect */}
              <ContactForm />

              {/* Embedded Google Map Section */}
              <div className="bg-white p-4 rounded-3xl border border-cream-300 shadow-sm space-y-3">
                <div className="flex items-center justify-between px-2 pt-2">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-espresso-900">
                      Find Us in Kozhikode
                    </h3>
                    <p className="text-xs text-taupe-600 font-light">
                      Near KSRTC Bus Stand, Mavoor Road, Kozhikode
                    </p>
                  </div>
                </div>
                
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-cream-200">
                  <iframe
                    src={SITE_CONFIG.googleMapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="Fragancia D'Amour Location Map Kozhikode"
                  />
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
