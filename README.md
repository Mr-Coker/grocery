🛒 FreshMart — Grocery Delivery App
A mobile-first grocery ordering app with real-time order tracking. Browse products by category, fill a cart, check out, and watch your rider move toward you on a live map.

Built with Next.js, Convex (reactive backend), Tailwind CSS, and Leaflet.
Features
Storefront — product grid with category pills, live search (name, description, tags), sale prices, and stock status
Cart — slide-up bottom sheet with quantity controls and a free-delivery progress bar
Checkout — name, phone, and address form with a choice of cash on delivery or card
Live order tracking — a Leaflet map shows the store, the destination, and a moving rider, with ETA and a four-step status timeline (confirmed → packing → out for delivery → delivered)
Real-time updates — Convex queries are reactive, so the UI updates the moment the data changes, with no polling or manual refresh
Installable PWA — web app manifest with standalone display mode and a green theme
Tech Stack
Layer
Technology
Framework
Next.js 16 (App Router), React 19
Language
TypeScript
Backend/DB
Convex
Styling
Tailwind CSS 4
Maps
Leaflet with OpenStreetMap tiles
Icons
lucide-react

Getting Started
Prerequisites
Node.js 20 or later
A free Convex account
1. Clone and install
git clone https://github.com/Mr-Coker/grocery.git
cd grocery
npm install
2. Start the Convex backend
In a terminal, run:

npx convex dev

The first run prompts you to log in and create a project. It pushes the schema and functions in convex/ and writes NEXT_PUBLIC_CONVEX_URL to .env.local. Keep this process running while you develop.
3. Seed the database
In a second terminal, load the sample categories and products:

npx convex run seed:seedDatabase

The seed does nothing if categories already exist, so it is safe to run twice.
4. Start the app
npm run dev

Open http://localhost:3000. The layout is designed for phones, so use your browser's device toolbar for the best view.
Environment Variables
Variable
Description
NEXT_PUBLIC_CONVEX_URL
URL of your Convex deployment. Written to .env.local by npx convex dev.


.env* files are git-ignored. For production hosting, set this variable in your host's dashboard.
Scripts
Command
Description
npm run dev
Start the Next.js dev server
npm run build
Create a production build
npm start
Serve the production build
npm run lint
Run ESLint
npx convex dev
Run and sync the Convex backend

Project Structure
.
├── convex/                  # Backend
│   ├── schema.ts            # Tables: categories, products, orders
│   ├── products.ts          # Queries: categories, products, featured
│   ├── orders.ts            # createOrder, getOrderById, status/rider updates
│   └── seed.ts              # Sample data
├── src/app/
│   ├── page.tsx             # Home / storefront
│   ├── layout.tsx           # Providers, fonts, viewport
│   ├── manifest.ts          # PWA manifest
│   ├── context/
│   │   └── CartContext.tsx  # Cart state, totals, delivery fee
│   └── components/
│       ├── layout/          # Header, BottomNav
│       ├── grocery/         # ProductGrid, ProductCard, CategoryPills
│       ├── cart/            # CartBottomSheet, CheckoutModal
│       ├── tracking/        # OrderTrackingModal, LiveTrackingMap
│       └── providers/       # Convex client provider
└── public/                  # Static assets
Data Model
categories — name, slug, icon, order
products — name, description, price, originalPrice?, unit, categorySlug, imageUrl, inStock, stockCount, tags[], isFeatured
orders — customer details, line items, subtotal, deliveryFee, total, paymentMethod, status, plus tracking fields (rider, riderLocation, storeLocation, destinationLocation, estimatedMinutes)
How It Works
The home page subscribes to products.getProducts and re-renders whenever product data changes.
Checkout calls orders.createOrder, which saves the order with status confirmed and attaches a rider, the store location, and a destination.
The tracking modal subscribes to orders.getOrderById, so any change to the order's rider position or status shows up on the map immediately.
Current Limitations
This is a demo, and a few parts are intentionally simplified:

Rider movement is simulated. The tracking modal moves the rider along a straight line in 8 steps, driven by the client. There is no real driver app or routing.
Rider, store, and destination are hard-coded in convex/orders.ts (a sample location in San Francisco).
No payments. The card option is only a selection; nothing is charged.
No authentication. Anyone can create orders or call the order update mutations.
Delivery fee: $2.99, waived above $30 subtotal (see CartContext.tsx).
Roadmap Ideas
Real payments (e.g. Stripe or Paystack)
User accounts and order history
Admin dashboard for products and orders
Real rider assignment and GPS updates
Address autocomplete and geocoding for real delivery destinations
Deployment
The app deploys well to Vercel. Deploy your Convex backend to production with npx convex deploy, then set NEXT_PUBLIC_CONVEX_URL in your Vercel project to the production deployment URL.
Acknowledgments
Map data © OpenStreetMap contributors
Product photos from Unsplash
