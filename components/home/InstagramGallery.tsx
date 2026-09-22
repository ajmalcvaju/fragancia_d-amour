"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Instagram, Heart, MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config/site";
import { InstagramPost } from "@/types/instagram";
import { INITIAL_INSTAGRAM_POSTS } from "@/lib/firebase/instagram";

export const InstagramGallery: React.FC = () => {
  const [postsList, setPostsList] = useState<InstagramPost[]>(INITIAL_INSTAGRAM_POSTS);

  useEffect(() => {
    async function syncInstagram() {
      try {
        const { getInstagramPosts } = await import("@/lib/firebase/instagram");
        const posts = await getInstagramPosts();
        if (posts) {
          setPostsList(posts);
        }
      } catch (err) {
        console.warn("Could not sync instagram posts:", err);
      }
    }
    syncInstagram();
  }, []);

  const displayPosts = postsList.slice(0, 4);

  return (
    <section className="py-20 bg-cream-100 border-b border-cream-300/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
          <div className="text-center sm:text-left space-y-1">
            <span className="text-xs uppercase tracking-[0.25em] text-champagne-600 font-semibold flex items-center justify-center sm:justify-start gap-1.5">
              <Instagram className="w-4 h-4" />
              <span>Follow Our Journey</span>
            </span>
            <h2 className="font-serif text-3xl font-bold text-espresso-900">
              @fragancia_d_amour
            </h2>
          </div>

          <a
            href={SITE_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-cream-100 px-6 py-3 rounded-full text-xs uppercase tracking-widest font-medium transition-all shadow-sm"
          >
            <Instagram className="w-4 h-4 text-champagne-400" />
            <span>Visit Instagram</span>
          </a>
        </div>

        {/* Gallery Grid (Maximum 4 Cards per Row) */}
        {displayPosts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            {displayPosts.map((post) => {
              const targetUrl = post.postUrl || SITE_CONFIG.instagramUrl;
              return (
                <a
                  key={post.id}
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-cream-300 bg-espresso-950"
                >
                  <Image
                    src={post.image || "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800"}
                    alt={`Fragancia D'Amour Instagram Kozhikode - ${post.caption}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* Hover Overlay - Exact Match to Requested Format */}
                  <div className="absolute inset-0 bg-espresso-950/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
                    <Instagram className="w-5 h-5 text-champagne-400 self-end" />
                    <p className="text-xs font-light line-clamp-3 leading-relaxed">
                      {post.caption || "Visit our Instagram profile"}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-cream-200/90 font-medium">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-300 fill-current" />
                        {post.likes || "142"}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        Comment
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-cream-300 space-y-3 max-w-md mx-auto">
            <p className="text-xs text-taupe-600 font-light italic">
              No Instagram posts added yet. Add posts in the Admin Panel to feature them here.
            </p>
            <a
              href={SITE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-champagne-600 font-semibold border-b border-champagne-600 pb-0.5"
            >
              <span>Follow @fragancia_d_amour</span>
            </a>
          </div>
        )}

      </div>
    </section>
  );
};
