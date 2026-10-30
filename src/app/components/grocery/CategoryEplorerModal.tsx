"use client";

import React from "react";
import { X, Sparkles, LayoutGrid, ChevronRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface CategoryExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

// Visual themes for categories based on slug
const CATEGORY_THEMES: Record<string, { bg: string; border: string; text: string }> = {
  all: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800" },
  fruits: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-800" },
  vegetables: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800" },
  dairy: { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-800" },
  bakery: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800" },
};

export function CategoryExplorerModal({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
}: CategoryExplorerModalProps) {
  const categories = useQuery(api.products.getCategories);
  const allProducts = useQuery(api.products.getProducts, {});

  if (!isOpen) return null;

  // Calculate product counts per category
  const getProductCount = (slug: string) => {
    if (!allProducts) return 0;
    if (slug === "all") return allProducts.length;
    return allProducts.filter((p) => p.categorySlug === slug).length;
  };

  const handleSelect = (slug: string) => {
    onSelectCategory(slug);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Sheet / Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 overflow-hidden max-h-[88vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        
        {/* Top Handle for mobile */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden" onClick={onClose}>
          <div className="w-12 h-1.5 bg-stone-300 rounded-full cursor-pointer" />
        </div>

        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-stone-900 leading-tight">
                Explore Departments
              </h3>
              <p className="text-xs text-stone-400 font-medium">
                Browse our fresh grocery aisles
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Grid */}
        <div className="overflow-y-auto p-5 space-y-3">
          {/* 1. "All Departments" Banner Card */}
          <button
            type="button"
            onClick={() => handleSelect("all")}
            className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between active:scale-[0.99] cursor-pointer ${
              selectedCategory === "all"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                : "bg-stone-50 hover:bg-stone-100 border-stone-200/80 text-stone-900"
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  selectedCategory === "all" ? "bg-white/20" : "bg-white shadow-xs"
                }`}
              >
                🛒
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-sm">All Groceries</span>
                  {selectedCategory === "all" && (
                    <span className="bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs mt-0.5 ${
                    selectedCategory === "all" ? "text-emerald-100" : "text-stone-400"
                  }`}
                >
                  {getProductCount("all")} items in store
                </p>
              </div>
            </div>
            <ChevronRight
              className={`w-5 h-5 ${
                selectedCategory === "all" ? "text-white" : "text-stone-400"
              }`}
            />
          </button>

          {/* 2. Grid of specific categories */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {categories?.map((cat) => {
              const theme = CATEGORY_THEMES[cat.slug] || {
                bg: "bg-stone-50",
                border: "border-stone-200",
                text: "text-stone-800",
              };
              const isSelected = selectedCategory === cat.slug;
              const count = getProductCount(cat.slug);

              return (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => handleSelect(cat.slug)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between active:scale-95 cursor-pointer relative overflow-hidden min-h-[110px] ${
                    isSelected
                      ? "ring-2 ring-emerald-600 border-emerald-500 bg-emerald-50/60 shadow-sm"
                      : `${theme.bg} ${theme.border} hover:shadow-xs`
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-3xl">{cat.icon}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    )}
                  </div>

                  <div className="mt-3">
                    <h4 className="font-bold text-sm text-stone-900 leading-tight">
                      {cat.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                      {count} {count === 1 ? "item" : "items"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-400 flex items-center justify-center gap-1.5 font-medium">
            100% farm-fresh quality guaranteed on all departments
          </p>
        </div>
      </div>
    </div>
  );
}
