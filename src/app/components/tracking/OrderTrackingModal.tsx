"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { X, Phone, MessageSquare, ShieldCheck, Play, CheckCircle2, PackageCheck, Bike, Sparkles } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

// Dynamically import Leaflet map to prevent SSR window reference errors
const LiveTrackingMap = dynamic(() => import("./LiveTrackingMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[340px] rounded-3xl bg-stone-100 flex items-center justify-center text-stone-400 text-xs font-semibold animate-pulse">
      Loading Live Map...
    </div>
  ),
});

interface OrderTrackingModalProps {
  orderId: string | null;
  onClose: () => void;
}

export function OrderTrackingModal({ orderId, onClose }: OrderTrackingModalProps) {
  const [isSimulating, setIsSimulating] = useState(false);

  // 1. Reactive query: Automatically re-renders whenever Convex updates this order!
  const order = useQuery(
    api.orders.getOrderById,
    orderId ? { orderId: orderId as Id<"orders"> } : "skip"
  );

  const updateRiderLocation = useMutation(api.orders.updateRiderLocation);
  const updateOrderStatus = useMutation(api.orders.updateOrderStatus);

  if (!orderId || !order) return null;

  // 2. Rider simulation loop
  const startSimulation = async () => {
    if (isSimulating || !order.storeLocation || !order.destinationLocation) return;
    setIsSimulating(true);

    const start = order.storeLocation;
    const end = order.destinationLocation;
    const STEPS = 8;

    // Change status to out for delivery
    await updateOrderStatus({
      orderId: order._id,
      status: "out_for_delivery",
    });

    for (let i = 1; i <= STEPS; i++) {
      await new Promise((r) => setTimeout(r, 2200));

      const ratio = i / STEPS;
      // Interpolate coordinates
      const currentLat = start.lat + (end.lat - start.lat) * ratio;
      const currentLng = start.lng + (end.lng - start.lng) * ratio;

      // Calculate bearing / heading in degrees
      const dLng = end.lng - start.lng;
      const dLat = end.lat - start.lat;
      const heading = (Math.atan2(dLng, dLat) * 180) / Math.PI;

      const remainingMins = Math.max(1, Math.round((1 - ratio) * 14));
      const newStatus = i === STEPS ? "delivered" : "out_for_delivery";

      await updateRiderLocation({
        orderId: order._id,
        lat: currentLat,
        lng: currentLng,
        heading: Math.round(heading),
        estimatedMinutes: i === STEPS ? 0 : remainingMins,
        status: newStatus,
      });
    }

    setIsSimulating(false);
  };

  const getStatusStepIndex = (status: string) => {
    switch (status) {
      case "confirmed":
        return 0;
      case "packing":
        return 1;
      case "out_for_delivery":
        return 2;
      case "delivered":
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getStatusStepIndex(order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Main Container */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-1.5">
              Live Delivery Status
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-xs text-stone-400 font-mono">Order #{order._id.slice(-6)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 space-y-4">
          {/* Estimated Time Card */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-4 shadow-md shadow-emerald-900/10 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider">
                Estimated Arrival
              </p>
              <h2 className="text-xl font-black mt-0.5">
                {order.status === "delivered"
                  ? "Arrived at Doorstep! 🎉"
                  : `${order.estimatedMinutes ?? 14} minutes`}
              </h2>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                {order.status === "delivered"
                  ? "Enjoy your fresh groceries!"
                  : "Your rider is en route with fresh groceries"}
              </p>
            </div>

            {/* Simulation trigger button */}
            {order.status !== "delivered" && (
              <button
                type="button"
                onClick={startSimulation}
                disabled={isSimulating}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isSimulating ? "Moving..." : "Simulate Rider"}</span>
              </button>
            )}
          </div>

          {/* Interactive Live Map */}
          {order.storeLocation && order.destinationLocation && (
            <div className="h-[280px] w-full">
              <LiveTrackingMap
                storeLocation={order.storeLocation}
                destinationLocation={order.destinationLocation}
                riderLocation={order.riderLocation}
                status={order.status}
              />
            </div>
          )}

          {/* Status Step Indicator */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: "Confirmed", icon: CheckCircle2 },
                { label: "Packing", icon: PackageCheck },
                { label: "On the way", icon: Bike },
                { label: "Delivered", icon: Sparkles },
              ].map((step, idx) => {
                const Icon = step.icon;
                const isPassed = currentStep >= idx;
                const isCurrent = currentStep === idx;

                return (
                  <div key={step.label} className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors mb-1.5 ${
                        isCurrent
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                          : isPassed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-stone-200 text-stone-400"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[10px] font-bold leading-tight ${
                        isPassed ? "text-stone-800" : "text-stone-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rider Profile Card */}
          {order.rider && (
            <div className="bg-white border border-stone-200 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-3">
                <img
                  src={order.rider.avatarUrl}
                  alt={order.rider.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                />
                <div>
                  <h4 className="text-sm font-bold text-stone-900 leading-tight">
                    {order.rider.name}
                  </h4>
                  <p className="text-xs text-stone-500 font-medium">
                    {order.rider.vehicle} • ⭐ {order.rider.rating}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={`tel:${order.rider.phone}`}
                  className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                  title="Call Rider"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => alert(`Messaging ${order.rider?.name}`)}
                  className="w-9 h-9 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 flex items-center justify-center transition-colors"
                  title="Message Rider"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Delivery Address & Details */}
          <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-100 text-xs space-y-1">
            <p className="font-semibold text-stone-800">Delivering to:</p>
            <p className="text-stone-600">{order.address}</p>
            <p className="text-stone-400 text-[11px] pt-1 border-t border-stone-200/50 mt-1">
              Recipient: {order.customerName} ({order.phone})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
