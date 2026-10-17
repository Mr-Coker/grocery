import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
  handler: async (ctx) => {
    // Check if we already have categories to prevent duplicate seeding
    const existingCategories = await ctx.db.query("categories").collect();
    if (existingCategories.length > 0) {
      return "Database is already seeded!";
    }

    // 1. Insert Categories
    const categories = [
      { name: "Fresh Fruits", slug: "fruits", icon: "🍎", order: 1 },
      { name: "Vegetables", slug: "vegetables", icon: "🥦", order: 2 },
      { name: "Dairy & Eggs", slug: "dairy", icon: "🥛", order: 3 },
      { name: "Bakery", slug: "bakery", icon: "🥖", order: 4 },
      
    ];

    for (const cat of categories) {
      await ctx.db.insert("categories", cat);
    }

    // 2. Insert Realistic Grocery Products with Unsplash imagery
    const products = [
      {
        name: "Organic Bananas",
        description: "Naturally sweet and potassium-rich ripe organic bananas.",
        price: 1.49,
        originalPrice: 1.99,
        unit: "per bunch",
        categorySlug: "fruits",
        imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80",
        inStock: true,
        stockCount: 50,
        tags: ["Organic", "Bestseller"],
        isFeatured: true,
      },
      {
        name: "Crisp Honeycrisp Apples",
        description: "Crisp, sweet, and juicy hand-picked red Honeycrisp apples.",
        price: 3.29,
        originalPrice: 3.99,
        unit: "per kg",
        categorySlug: "fruits",
        imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80",
        inStock: true,
        stockCount: 35,
        tags: ["Fresh Pick"],
        isFeatured: true,
      },
      {
        name: "Fresh Hass Avocados",
        description: "Creamy Hass avocados, perfect for salads and homemade guacamole.",
        price: 2.99,
        originalPrice: 3.49,
        unit: "pack of 2",
        categorySlug: "fruits",
        imageUrl: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80",
        inStock: true,
        stockCount: 40,
        tags: ["Popular"],
        isFeatured: true,
      },
      {
        name: "Organic Baby Spinach",
        description: "Tender, pre-washed organic baby spinach leaves.",
        price: 2.49,
        unit: "200g bag",
        categorySlug: "vegetables",
        imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80",
        inStock: true,
        stockCount: 25,
        tags: ["Organic"],
        isFeatured: true,
      },
      {
        name: "Farm Fresh Broccoli",
        description: "Vibrant green broccoli florets packed with fiber and vitamins.",
        price: 1.89,
        originalPrice: 2.29,
        unit: "per head",
        categorySlug: "vegetables",
        imageUrl: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&auto=format&fit=crop&q=80",
        inStock: true,
        stockCount: 30,
        tags: ["Farm Fresh"],
        isFeatured: false,
      },
      {
        name: "Whole Farm Whole Milk",
        description: "Pure, pasteurized farm fresh whole milk, rich in calcium.",
        price: 3.89,
        unit: "1 Gallon",
        categorySlug: "dairy",
        imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
        inStock: true,
        stockCount: 20,
        tags: ["Essential"],
        isFeatured: true,
      },
      {
        name: "Free-Range Large Brown Eggs",
        description: "Grade A free-range eggs with deep golden yolks.",
        price: 4.29,
        originalPrice: 4.99,
        unit: "carton of 12",
        categorySlug: "dairy",
        imageUrl: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&auto=format&fit=crop&q=80",
        inStock: true,
        stockCount: 45,
        tags: ["Free-Range", "Bestseller"],
        isFeatured: true,
      },
      {
        name: "Artisan Sourdough Loaf",
        description: "Slow-fermented crusty sourdough bread baked fresh this morning.",
        price: 4.50,
        unit: "500g loaf",
        categorySlug: "bakery",
        imageUrl: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80",
        inStock: true,
        stockCount: 15,
        tags: ["Baked Today"],
        isFeatured: true,
      },
      {
        name: "Cold-Pressed Fresh Orange Juice",
        description: "100% freshly squeezed Valencia orange juice without added sugars.",
        price: 3.99,
        unit: "750ml bottle",
        categorySlug: "beverages",
        imageUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80",
        inStock: true,
        stockCount: 20,
        tags: ["No Added Sugar"],
        isFeatured: true,
      },
    ];

    for (const prod of products) {
      await ctx.db.insert("products", prod);
    }

    return "Successfully seeded categories and products!";
  },
});
