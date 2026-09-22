"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import { Package, FolderTree, LogOut, Sparkles, Instagram } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, loading, logout } = useAuth();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !isAdmin && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [isAdmin, loading, isLoginPage, router]);

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
        {children}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-champagne-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-taupe-600 uppercase tracking-widest font-medium">
            Verifying Admin Session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-espresso-950 text-cream-100 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-espresso-800 shrink-0">
        <div className="space-y-8">
          {/* Admin Header Logo */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-champagne-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">
                Admin Portal
              </span>
            </div>
            <h2 className="font-serif text-xl font-bold tracking-tight text-cream-50">
              Fragancia D&apos;Amour
            </h2>
          </div>

          {/* Admin Navigation */}
          <nav className="space-y-2">
            <Link
              href="/admin/products"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-medium transition-all ${
                pathname.startsWith("/admin/products")
                  ? "bg-champagne-500 text-espresso-950 font-semibold shadow"
                  : "text-cream-300 hover:bg-espresso-900 hover:text-cream-50"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products</span>
            </Link>

            <Link
              href="/admin/categories"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-medium transition-all ${
                pathname.startsWith("/admin/categories")
                  ? "bg-champagne-500 text-espresso-950 font-semibold shadow"
                  : "text-cream-300 hover:bg-espresso-900 hover:text-cream-50"
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Categories</span>
            </Link>

            <Link
              href="/admin/instagram"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-medium transition-all ${
                pathname.startsWith("/admin/instagram")
                  ? "bg-champagne-500 text-espresso-950 font-semibold shadow"
                  : "text-cream-300 hover:bg-espresso-900 hover:text-cream-50"
              }`}
            >
              <Instagram className="w-4 h-4" />
              <span>Instagram Feed</span>
            </Link>
          </nav>
        </div>

        {/* Logout Button */}
        <div className="pt-6 border-t border-espresso-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-medium text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors"
          >
            <span>Logout</span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <main className="flex-grow p-6 sm:p-10 overflow-x-hidden">
        {children}
      </main>

    </div>
  );
}
