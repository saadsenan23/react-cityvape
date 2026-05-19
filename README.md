# City Vape – Premium React Application

A high-end, production-ready React e-commerce application for City Vape Damascus.

## Tech Stack

- **React 18** + **Vite**
- **TailwindCSS** – utility-first styling
- **Framer Motion** – smooth animations
- **React Router v6** – client-side routing
- **Zustand** – global state management

## Setup & Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

- 🌙 **Dark / Light mode** with localStorage persistence
- 🌐 **English / Arabic** with full RTL support
- 📱 **Fully responsive** – mobile, tablet, desktop
- 🔍 **Search + Filter** by category
- 💬 **WhatsApp ordering** – pre-filled messages
- 🛡️ **Age gate** verification
- ✨ **Smooth animations** with Framer Motion
- 📦 **287 products** across 5 categories

## Product Images

Place all product images in `/public/images/`.
Image filenames are used exactly as extracted from the original HTML.

## WhatsApp Integration

When a user clicks "Buy Now", the app opens:
```
https://wa.me/963998067029?text=Hello, I want to order: [PRODUCT NAME] - Price: [PRICE]
```

## Project Structure

```
src/
  assets/        – products.js (all 287 products)
  components/    – Layout, Sidebar, Navbar, ProductCard, ProductModal, AgeGate, Footer, Logo
  hooks/         – useTranslation
  i18n/          – translations.js (EN + AR)
  pages/         – HomePage, ProductsPage, ContactPage
  store/         – useAppStore (Zustand)
  utils/         – whatsapp.js
```

## Copyright

© 2026 City Vape – Powered by SaadSenan
