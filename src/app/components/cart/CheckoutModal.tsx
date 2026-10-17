"use client";

import React, { useState } from "react";
import { X, CheckCircle2, MapPin, Phone, User, CreditCard, Banknote, Loader2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCart } from "../../context/CartContext";
import { OrderTrackingModal } from "../tracking/OrderTrackingModal";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, subtotal, deliveryFee, total, clearCart, closeCart } = useCart();
  const createOrder = useMutation(api.orders.createOrder);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);


  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      alert("Please fill in your delivery details.");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Prepare items payload matching Convex schema
      const formattedItems = items.map((item) => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl,
      }));

      // 2. Call the Convex mutation
      const orderId = await createOrder({
        customerName: name,
        phone,
        address,
        items: formattedItems,
        subtotal,
        deliveryFee,
        total,
        paymentMethod,
      });

      // 3. Set confirmation and clear the cart
      setConfirmedOrderId(orderId);
      clearCart();
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setConfirmedOrderId(null);
    onClose();
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={confirmedOrderId ? handleFinish : onClose}
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        
        {/* Success Screen */}
        {confirmedOrderId ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-stone-900">Order Confirmed! 🎉</h3>
            <p className="text-xs text-stone-500 mt-2 max-w-xs">
              Thank you, <strong>{name}</strong>! Your groceries are being picked fresh and packed.
            </p>
            <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-3 my-4 w-full text-xs text-stone-600">
              <p className="font-semibold text-stone-800">Order Reference</p>
              <p className="font-mono text-emerald-700 text-sm mt-0.5">{confirmedOrderId}</p>
              <p className="text-[11px] text-stone-400 mt-1">Delivery to: {address}</p>
            </div>
            <div className="space-y-2 w-full">
              <button
                type="button"
                onClick={() => setIsTrackingOpen(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-md shadow-emerald-200 cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>🛵 Track Live Delivery</span>
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-3 rounded-2xl text-sm transition-all cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <>
            <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-stone-900">Delivery & Payment</h3>
                <p className="text-xs text-stone-400 font-medium">Complete your order</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
              {/* Recipient Details */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Contact Information
                </label>
                
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>

                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number (e.g., +1 234 567 890)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>

                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <textarea
                    required
                    rows={2}
                    placeholder="Delivery Address, Apt / Suite number"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-3 rounded-xl border flex items-center space-x-2 text-xs font-semibold transition-all cursor-pointer ${
                      paymentMethod === "cod"
                        ? "border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-500/20"
                        : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Cash on Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-3 rounded-xl border flex items-center space-x-2 text-xs font-semibold transition-all cursor-pointer ${
                      paymentMethod === "card"
                        ? "border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-500/20"
                        : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Pay with Card</span>
                  </button>
                </div>
              </div>

              {/* Order total footer & action */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-400 block">Total Amount</span>
                  <span className="text-lg font-black text-stone-900">${total.toFixed(2)}</span>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-emerald-200 flex items-center space-x-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <span>Place Order</span>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Live Order Tracking Modal */}
      {isTrackingOpen && confirmedOrderId && (
        <OrderTrackingModal
          orderId={confirmedOrderId}
          onClose={() => {
            setIsTrackingOpen(false);
            handleFinish();
          }}
        />
      )}
    </div>
  );
}
