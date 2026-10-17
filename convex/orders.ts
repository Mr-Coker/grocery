import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Default coordinates for a lively demo (e.g. San Francisco or Central Park area)
const STORE_LOCATION = {
  lat: 37.7749,
  lng: -122.4194,
  name: "FreshMart Flagship Hub",
};

// Destination offset slightly for a realistic 1.5 - 2 km delivery route
const DEFAULT_DESTINATION = {
  lat: 37.7858,
  lng: -122.4065,
};

export const createOrder = mutation({
  args: {
    customerName: v.string(),
    phone: v.string(),
    address: v.string(),
    items: v.array(
      v.object({
        productId: v.string(),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
        imageUrl: v.string(),
      })
    ),
    subtotal: v.number(),
    deliveryFee: v.number(),
    total: v.number(),
    paymentMethod: v.string(),
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      customerName: args.customerName,
      phone: args.phone,
      address: args.address,
      items: args.items,
      subtotal: args.subtotal,
      deliveryFee: args.deliveryFee,
      total: args.total,
      paymentMethod: args.paymentMethod,
      status: "confirmed", // Starts confirmed
      // Rider details
      rider: {
        name: "Alex Miller",
        phone: "+1 (555) 382-9912",
        vehicle: "Electric Delivery E-Bike",
        rating: 4.95,
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      storeLocation: STORE_LOCATION,
      riderLocation: {
        lat: STORE_LOCATION.lat,
        lng: STORE_LOCATION.lng,
        heading: 45,
      },
      destinationLocation: DEFAULT_DESTINATION,
      estimatedMinutes: 14,
    });

    return orderId;
  },
});

// Query to get live order updates reactive in real-time
export const getOrderById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

// Mutation to advance rider position along the route
export const updateRiderLocation = mutation({
  args: {
    orderId: v.id("orders"),
    lat: v.number(),
    lng: v.number(),
    heading: v.number(),
    estimatedMinutes: v.number(),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patch: Record<string, unknown> = {
      riderLocation: {
        lat: args.lat,
        lng: args.lng,
        heading: args.heading,
      },
      estimatedMinutes: args.estimatedMinutes,
    };

    if (args.status) {
      patch.status = args.status;
    }

    await ctx.db.patch(args.orderId, patch);
  },
});

// Mutation to update general order status
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: args.status,
    });
  },
});
