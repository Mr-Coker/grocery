"use client";

import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { useCart } from "../../context/CartContext";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  unit: string;
  categorySlug: string;
  imageUrl: string;
  inStock: boolean;
  stockCount: number;
  tags: string[];
  isFeatured: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { getItemQuantity, addItem, removeItem } = useCart();
  const quantity = getItemQuantity(product._id);

  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : null;

  return (
    <div className="bg-white rounded-3xl p-3 border border-stone-200/70 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative group">
      {/* Top badges: Discount or Tag */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 items-start">
        {discountPercent && (
          <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
            {discountPercent}% OFF
          </span>
        )}
        {product.tags && product.tags.length > 0 && (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {product.tags[0]}
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="relative w-full h-36 mb-2 rounded-2xl overflow-hidden bg-stone-100 flex items-center justify-center">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Unit */}
        <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide">
          {product.unit}
        </span>

        {/* Name */}
        <h3 className="font-bold text-stone-800 text-sm leading-snug line-clamp-2 my-1">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="flex items-baseline gap-1.5 mt-auto pt-2">
          <span className="font-extrabold text-emerald-700 text-base">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-stone-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Quick Add Button / Stepper connected to CartContext */}
      <div className="mt-3 pt-2 border-t border-stone-100">
        {quantity === 0 ? (
          <button
            type="button"
            onClick={() => addItem(product)}
            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300/80 rounded-xl py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Add
          </button>
        ) : (
          <div className="w-full bg-emerald-600 text-white rounded-xl py-1.5 px-2 flex items-center justify-between shadow-xs shadow-emerald-200">
            <button
              type="button"
              onClick={() => removeItem(product._id)}
              className="w-6 h-6 rounded-lg bg-emerald-700/80 hover:bg-emerald-800 flex items-center justify-center active:scale-90 transition-transform"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-extrabold">{quantity}</span>
            <button
              type="button"
              onClick={() => addItem(product)}
              className="w-6 h-6 rounded-lg bg-emerald-700/80 hover:bg-emerald-800 flex items-center justify-center active:scale-90 transition-transform"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
