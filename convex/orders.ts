import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createOrder = mutation({
  // 1. Define arguments that the frontend must provide
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
  // 2. The handler executes inside a database transaction
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
      status: "confirmed", // Default initial status
    });

    return orderId;
  },
});

// Optional query to fetch a single order by ID for the confirmation page later
export const getOrderById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});
