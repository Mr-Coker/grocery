"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Header } from "./components/layout/Header";
import { BottomNav } from "./components/layout/BottomNav";
import { CategoryPills } from "./components/grocery/CategoryPills";
import { ProductGrid } from "./components/grocery/ProductGrid";
import { Product } from "./components/grocery/ProductCard";
import { Sparkles} from "lucide-react";
import { useCart } from "./context/CartContext";


export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { totalItems } = useCart();


  // 1. Fetch products from Convex reactive backend
  const allProducts = useQuery(api.products.getProducts, {
    categorySlug: selectedCategory,
  });

  // 2. Filter products live by search query
  const filteredProducts = allProducts?.filter((product) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.tags?.some((t) => t.toLowerCase().includes(query))
    );
  }) as Product[] | undefined;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col pb-24">
      {/* 1. Sticky Mobile Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="max-w-md md:max-w-4xl mx-auto w-full flex-1">
        {/* 2. Fresh Grocery Hero Promo Banner (hidden while actively searching) */}
        {!searchQuery && (
          <div className="px-4 pt-3 pb-1">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4.5 shadow-md shadow-emerald-900/10">
              <div className="relative z-10 max-w-[70%]">
                <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-xs text-[11px] font-bold px-2 py-0.5 rounded-full mb-2">
                  <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                  Weekend Special
                </span>
                <h2 className="text-lg font-extrabold leading-tight tracking-tight">
                  Fresh Organic Produce up to 30% Off
                </h2>
                <p className="text-xs text-emerald-100 mt-1 font-medium">
                  Farm-to-door in 20 minutes
                </p>
              </div>
              <div className="absolute right-[-10px] bottom-[-15px] text-7xl select-none opacity-90 transform rotate-12">
                🥑
              </div>
            </div>
          </div>
        )}

        {/* 3. Category Horizontal Pills */}
        <section className="pt-2">
          <CategoryPills
            selectedCategory={selectedCategory}
            onSelectCategory={(slug) => {
              setSelectedCategory(slug);
              setSearchQuery(""); // Clear search when switching categories
            }}
          />
        </section>

        {/* 4. Section Title */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-stone-900 capitalize">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : selectedCategory === "all"
                ? "Popular Groceries"
                : selectedCategory}
            </h2>
            <p className="text-xs text-stone-400 font-medium">
              {filteredProducts ? `${filteredProducts.length} items available` : "Loading items..."}
            </p>
          </div>
        </div>

        {/* 5. Product Grid (2 columns on mobile) */}
        <section>
          <ProductGrid products={filteredProducts} />
        </section>
      </main>

      {/* 6. Sticky Mobile Bottom Navigation */}
      <BottomNav cartItemCount={totalItems} />

    </div>
  );
}
