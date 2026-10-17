"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { CheckoutModal } from "./CheckoutModal";

export function CartBottomSheet() {
  const {
    items,
    isCartOpen,
    closeCart,
    addItem,
    removeItem,
    deleteItem,
    clearCart,
    totalItems,
    subtotal,
    savings,
    deliveryFee,
    total,
  } = useCart();

  // Prevent background scrolling when cart sheet is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const FREE_DELIVERY_THRESHOLD = 25.0;
  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* 1. Backdrop overlay */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* 2. Bottom Slide-over Sheet Panel */}
      <div className="relative w-full max-w-lg mx-auto bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[88vh] z-10 transition-transform duration-300 ease-out animate-in slide-in-from-bottom">
        {/* Top Grab Handle */}
        <div className="w-full flex justify-center pt-3 pb-1" onClick={closeCart}>
          <div className="w-12 h-1.5 bg-stone-300 rounded-full cursor-pointer hover:bg-stone-400 transition-colors" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 leading-tight">My Basket</h2>
              <p className="text-xs text-stone-400 font-medium">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-stone-400 hover:text-rose-600 px-2 py-1 rounded-lg transition-colors font-medium"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              onClick={closeCart}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors active:scale-95"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Free Delivery Banner Progress */}
        {items.length > 0 && (
          <div className="bg-emerald-50/70 border-b border-emerald-100/60 px-5 py-2.5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {amountNeededForFreeDelivery <= 0 ? (
                  <span className="text-emerald-700 font-bold">You unlocked FREE Delivery! 🎉</span>
                ) : (
                  <span>
                    Add <strong className="text-emerald-700">${amountNeededForFreeDelivery.toFixed(2)}</strong> more for FREE delivery
                  </span>
                )}
              </span>
              <span className="text-[11px] font-bold text-emerald-700">
                ${subtotal.toFixed(2)} / ${FREE_DELIVERY_THRESHOLD.toFixed(2)}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-emerald-200/60 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Body: Item List or Empty State */}
        <div className="flex-1 overflow-y-auto px-5 py-3 divide-y divide-stone-100">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-4xl mb-3 shadow-inner">
                🛒
              </div>
              <h3 className="text-base font-bold text-stone-800">Your basket is empty</h3>
              <p className="text-xs text-stone-400 mt-1 max-w-[220px]">
                Explore our fresh aisles and add healthy goodness to your cart.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-emerald-200 active:scale-95"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div key={product._id} className="py-3.5 flex items-center space-x-3.5 first:pt-1 last:pb-1">
                {/* Product thumbnail */}
                <div className="relative w-16 h-16 rounded-2xl bg-stone-100 overflow-hidden flex-shrink-0 border border-stone-200/60">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-stone-900 truncate">{product.name}</h4>
                  <p className="text-xs text-stone-400 font-medium">{product.unit}</p>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <span className="text-sm font-bold text-stone-900">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[11px] text-stone-400 line-through">
                        ${(product.originalPrice * quantity).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-1 bg-stone-100 rounded-xl p-1 border border-stone-200/50">
                  {quantity === 1 ? (
                    <button
                      type="button"
                      onClick={() => deleteItem(product._id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeItem(product._id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  )}

                  <span className="w-6 text-center text-xs font-bold text-stone-800">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => addItem(product)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Bill Summary & Checkout Button */}
        {items.length > 0 && (
          <div className="p-5 border-t border-stone-100 bg-stone-50/70 rounded-b-3xl">
            {/* Bill breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-800">${subtotal.toFixed(2)}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount Savings</span>
                  <span>-${savings.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span className="font-semibold text-emerald-600 uppercase text-[11px]">Free</span>
                ) : (
                  <span className="font-semibold text-stone-800">${deliveryFee.toFixed(2)}</span>
                )}
              </div>
              <div className="pt-2 border-t border-stone-200/80 flex justify-between items-baseline text-stone-900">
                <span className="text-sm font-bold">To Pay</span>
                <span className="text-lg font-extrabold text-emerald-700">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action CTA */}
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all text-white py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-between shadow-lg shadow-emerald-600/25 cursor-pointer"
            >
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[11px] font-medium text-emerald-100">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
                <span className="text-sm font-extrabold">${total.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Trust badge */}
            <div className="flex items-center justify-center space-x-1 text-[11px] text-stone-400 mt-3 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Secure 256-bit Encrypted Checkout</span>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Address & Payment Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
}
