"use client";

import { Product, ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[] | undefined;
}

export function ProductGrid({ products }: ProductGridProps) {
  // 1. Loading Skeleton state while Convex fetches products
  if (products === undefined) {
    return (
      <div className="grid grid-cols-2 gap-3.5 px-4 py-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-3xl p-3 border border-stone-200/60 shadow-xs flex flex-col justify-between h-64 animate-pulse"
          >
            <div className="w-full h-32 bg-stone-200 rounded-2xl mb-2" />
            <div className="h-3 w-12 bg-stone-200 rounded mb-1.5" />
            <div className="h-4 w-full bg-stone-200 rounded mb-2" />
            <div className="h-5 w-16 bg-stone-200 rounded mt-auto" />
            <div className="h-8 w-full bg-stone-200 rounded-xl mt-3" />
          </div>
        ))}
      </div>
    );
  }

  // 2. Empty state when search or filter returns 0 products
  if (products.length === 0) {
    return (
      <div className="py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-3 bg-stone-100 rounded-full flex items-center justify-center text-2xl">
          🔍
        </div>
        <h3 className="font-bold text-stone-800 text-base mb-1">
          No groceries found
        </h3>
        <p className="text-xs text-stone-500 max-w-xs mx-auto">
          We couldn&apos;t find items matching your filter. Try searching for something else!
        </p>
      </div>
    );
  }

  // 3. Render 2-column mobile grid (expands to 3-4 columns on tablet/desktop)
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 px-4 py-2">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
