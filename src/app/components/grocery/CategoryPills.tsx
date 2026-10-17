"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Sparkles } from "lucide-react";

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export function CategoryPills({
  selectedCategory,
  onSelectCategory,
}: CategoryPillsProps) {
  const categories = useQuery(api.products.getCategories);

  return (
    <div className="py-2.5 px-4 overflow-x-auto no-scrollbar flex items-center gap-2 -mx-0">
      {/* "All" Pill */}
      <button
        type="button"
        onClick={() => onSelectCategory("all")}
        className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 shadow-2xs ${
          selectedCategory === "all"
            ? "bg-emerald-600 text-white shadow-emerald-200"
            : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/80"
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        All Items
      </button>

      {/* Loading Skeletons while Convex loads */}
      {!categories && (
        <>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="shrink-0 w-24 h-8 bg-stone-200/70 rounded-full animate-pulse"
            />
          ))}
        </>
      )}

      {/* Dynamic Categories from Convex */}
      {categories?.map((cat) => {
        const isSelected = selectedCategory === cat.slug;
        return (
          <button
            key={cat._id}
            type="button"
            onClick={() => onSelectCategory(cat.slug)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 shadow-2xs ${
              isSelected
                ? "bg-emerald-600 text-white shadow-emerald-200"
                : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/80"
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
