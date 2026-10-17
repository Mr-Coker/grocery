import { query } from "./_generated/server";
import { v } from "convex/values";

// 1. Get all categories sorted by order
export const getCategories = query({
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

// 2. Get products, optionally filtered by category
export const getProducts = query({
  args: {
    categorySlug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.categorySlug && args.categorySlug !== "all") {
      return await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("categorySlug", args.categorySlug!))
        .collect();
    }
    return await ctx.db.query("products").collect();
  },
});

// 3. Get featured products for the home screen hero
export const getFeaturedProducts = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .withIndex("by_featured", (q) => q.eq("isFeatured", true))
      .collect();
  },
});
