import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    icon: v.string(), // Emoji or icon name
    order: v.number(),
  }).index("by_slug", ["slug"]),

  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    unit: v.string(), // e.g. "each", "kg", "pack", "500g"
    categorySlug: v.string(),
    imageUrl: v.string(),
    inStock: v.boolean(),
    stockCount: v.number(),
    tags: v.array(v.string()), // e.g. ["Organic", "Sale"]
    isFeatured: v.boolean(),
  })
    .index("by_category", ["categorySlug"])
    .index("by_featured", ["isFeatured"]),

  orders: defineTable({
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
    paymentMethod: v.string(), // "cod" | "card"
    status: v.string(), // "pending" | "confirmed" | "delivered"
  }).index("by_status", ["status"]),
});
