# Dera Market — Ethnic Grocery Delivery App

A DoorDash-style marketplace for ethnic grocery stores, built with React Native + Expo.

## Theme
Mustard (`#E8A020`) · Black (`#111111`) · White (`#FAFAF7`)

## Project Structure

```
ethnic-market-app/
├── App.js                          # Root: navigation + tab bar
├── app.json                        # Expo config
├── package.json
├── babel.config.js
└── src/
    ├── context/
    │   └── CartContext.js          # Global cart state (useReducer)
    ├── data/
    │   └── stores.js               # Store + product data (swap with API later)
    ├── screens/
    │   ├── HomeScreen.js           # Store listing, filters, promo banner
    │   ├── StoreScreen.js          # Store detail, product grid, add to cart
    │   ├── CartScreen.js           # Cart review, order summary, checkout
    │   ├── OrdersScreen.js         # Order history (placeholder)
    │   └── ProfileScreen.js        # User profile (placeholder)
    ├── components/
    │   └── StoreCard.js            # Reusable store card with origin flag ribbon
    └── theme/
        └── colors.js               # Color + font tokens
```

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (iOS or Android)

### Install & Run

```bash
cd ethnic-market-app
npm install
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS).

### Run on simulators
```bash
npx expo start --ios       # Requires Xcode on macOS
npx expo start --android   # Requires Android Studio
```

## Features Built
- [x] Home screen with hero header, search, cuisine filter tabs
- [x] Store cards with diagonal origin-flag ribbon
- [x] Browse by origin (horizontal chip scroll)
- [x] Store detail screen with category tabs + product grid
- [x] Delivery / Pickup toggle per store
- [x] Add to cart, qty controls, floating cart bar
- [x] Cart screen with full order summary + tax/delivery calc
- [x] Global cart state via React Context
- [x] Bottom tab navigation (Home, Explore, Cart, Orders, Profile)
- [x] Mustard × Black × White theme throughout

## Next Steps (Phase 2)
- [ ] User auth (email/phone, social login)
- [ ] Real location-based store discovery (expo-location)
- [ ] Backend (Firebase or Supabase) for stores, products, orders
- [ ] Checkout flow (address, payment with Stripe)
- [ ] Order tracking with real-time updates
- [ ] Push notifications (Expo Notifications)
- [ ] Store admin dashboard (web)
- [ ] Reviews & ratings
- [ ] Nigerian stores + more cuisines

## Adding a New Store
Edit `src/data/stores.js` and add an entry to the `STORES` array following the existing structure.
Eventually this will come from a backend API call.
