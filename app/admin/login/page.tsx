"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import { Lock, Mail, Sparkles, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      router.push("/admin/products");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Invalid admin credentials. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-cream-300 shadow-luxury space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-champagne-600 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-champagne-500" />
          <span>Admin Access</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-espresso-900">
          Fragancia D&apos;Amour
        </h1>
        <p className="text-xs text-taupe-600 font-light">
          Sign in to manage products and collections.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1">
            Admin Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-taupe-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@fraganciadamour.com"
              className="w-full pl-10 pr-4 py-3 bg-cream-100/70 border border-cream-300 rounded-xl text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-taupe-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-3 bg-cream-100/70 border border-cream-300 rounded-xl text-xs text-espresso-900 focus:outline-none focus:ring-2 focus:ring-champagne-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-espresso-900 hover:bg-espresso-800 disabled:bg-espresso-900/50 text-cream-100 font-semibold py-3.5 rounded-full text-xs uppercase tracking-widest transition-all shadow-md"
        >
          {submitting ? "Signing in..." : "Login to Dashboard"}
        </button>
      </form>

      <div className="pt-4 border-t border-cream-200 text-center">
        <p className="text-[11px] text-taupe-500 font-light">
          Protected route • Authorized administrators only
        </p>
      </div>

    </div>
  );
}
