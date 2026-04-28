# 🚛 CargoBack — Full Stack Logistics Platform

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Expo](https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**CargoBack** is a real-time logistics platform connecting drivers with cargo opportunities. The system features live location tracking, instant messaging, and intelligent pricing—all synced seamlessly between a React web app and a React Native mobile app via Firestore.

---

## ✨ Key Features

### Web App (Driver Portal)
- 📍 **Real-time Driver Tracking**: Watch drivers' live locations and route history on Google Maps
- 🔍 **Cargo Marketplace**: Browse available loads with pricing and distance
- 💳 **Smart Pricing**: AI-driven pricing based on demand, cargo type, and truck capacity
- 👤 **Driver Profiles**: Complete vehicle registration with capacity/refrigeration details
- 📊 **Trip Analytics**: Earnings dashboard, trip history, and KPIs
- 💬 **Live Chat**: Real-time messaging with clients (integration ready)

### Mobile App (Driver App)
- 🗺️ **GPS Tracking**: Automatic background location tracking (8-sec intervals, battery-optimized)
- 🚛 **Active Trip Management**: Real-time route display with destination markers
- 💬 **Instant Chat**: Quick-reply buttons for common messages
- 📦 **Load Discovery**: Search available cargo with map preview
- ⭐ **Rating System**: Driver stats and performance metrics

### Real-Time Sync
- 🔄 **Firestore Integration**: Bi-directional data sync without polling
- 📡 **Live Location Updates**: Driver position updates every 8 seconds
- 💫 **Route History**: Visual trail of driver's journey
- ⚡ **Instant Notifications**: Ready for push notification integration

---

## 🛠️ Tech Stack

### Web App
- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **State**: Zustand + localStorage persistence
- **Maps**: Google Maps API with real-time overlays
- **Database**: Firestore (real-time listeners)
- **Auth**: Firebase SMS OTP

### Mobile App
- **Framework**: React Native (Expo)
- **Navigation**: React Navigation (bottom tabs)
- **Location**: expo-location (geolocation)
- **Maps**: react-native-maps
- **State**: Zustand + AsyncStorage persistence
- **Database**: Firestore (real-time sync)
- **Chat**: Firestore collections

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn
- Expo CLI: `npm install -g expo-cli`
- Firebase project with Firestore
- Google Maps API key

### Environment Setup

Create `.env` in project root:
```env
VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
VITE_AUTH_DEMO=true
```

Update Firebase credentials:
- Web: `src/config/firebaseConfig.ts`
- Mobile: `mobile/config/firebase.ts`

---

## 💻 Running the Web App

```bash
npm install
npm run dev
# Opens http://localhost:5173
```

### Demo Login
- **Phone**: Any 10-digit number
- **OTP**: `123456`
- **Vehicle**: Register 1-30 ton truck (general, refrigerated, tanker, or flatbed)

### Features Demo
1. Search for cargo loads (with real pricing)
2. Accept a load to see live driver tracking
3. Watch driver location update in real-time
4. View route history as blue polyline
5. Open side menu for profile/vehicle/stats

---

## 📱 Running the Mobile App

```bash
cd mobile
npm install
npx expo start

# Scan QR code with Expo Go app, or:
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
```

### Usage Flow
1. **Home Tab**: Browse available cargo loads on map
2. **Trip Tab**: Start trip to enable location tracking
3. **Profile Tab**: View/edit driver info and vehicle details

---

## 🔄 Real-Time Architecture

### Location Tracking
```
Mobile Driver
    ↓ (expo-location, 8-sec intervals)
Firestore: driver_locations collection
    ↓ (onSnapshot listener)
Web App: GoogleMapView component
    ↓ (re-renders with live position)
Google Maps: Shows green marker + route history
```

### Chat Integration
```
Mobile Driver: sends message
    ↓
Firestore: chats/{tripId}/messages
    ↓ (onSnapshot listener)
Web App: (future) receives in real-time
```

### Data Flow Example
**Mobile sends location every 8 seconds:**
```javascript
{
  userId: "driver-123",
  tripId: "trip-456",
  lat: 4.71,
  lng: -74.07,
  heading: 45,
  speed: 52.3,
  timestamp: 1714419600000
}
```

**Web app subscribes and displays instantly:**
- Green marker at (4.71, -74.07)
- Rotation based on heading (45°)
- Speed displayed as tooltip
- Blue polyline shows complete route history

---

## 📊 Firestore Collections

### `driver_locations`
Real-time GPS tracking data
```javascript
{
  userId: string,
  tripId: string,
  lat: number,
  lng: number,
  heading?: number,     // 0-360 degrees
  speed?: number,       // km/h
  timestamp: number
}
```

### `chats/{tripId}/messages`
Live messaging
```javascript
{
  chatId: string,
  sender: "driver" | "client",
  message: string,
  timestamp: Timestamp
}
```

### `users`
Driver profiles
```javascript
{
  id: string,
  name: string,
  phone: string,
  rating: number,
  trips: number,
  totalKm: number
}
```

### `vehicles`
Truck information
```javascript
{
  driverId: string,
  type: "general" | "refrigerated" | "tanker" | "flatbed",
  capacityTons: number,
  plate: string,
  isRefrigerated: boolean
}
```

---

## 💰 Pricing Algorithm

**Formula**: `price = baseRate × distance × cargoFactor × demandFactor × capacityBonus`

**Example Calculation** (Buenaventura → Bogotá, 520km)
- Base rate (general): 1,800 COP/km
- Distance: 520 km
- Cargo (electronics): ×1.15
- Demand (morning peak): ×1.15
- Capacity bonus (≥20 tons): ×1.10
- **Result: 2,200,000 COP**

**Cargo Types**: Electronics (×1.15), Food (×1.05), Textiles (×1.0), Raw Materials (×0.95)
**Demand**: Peak 6-10 AM (×1.15), Evening 6-10 PM (×1.05), Night (×0.90)

---

## 📂 Project Structure

```
CargoBack/
├── src/                          # Web app (Vite + React)
│   ├── app/
│   │   ├── components/          # ActiveTripScreen, GoogleMapView, etc.
│   │   ├── screens/             # ProfileScreen, VehicleScreen, TripHistoryScreen
│   │   └── App.tsx              # Main routing & state management
│   ├── services/
│   │   ├── authService.ts       # SMS OTP authentication
│   │   ├── pricingService.ts    # Pricing calculation
│   │   └── trackingService.ts   # Real-time location listeners
│   ├── store/                   # Zustand stores (auth, vehicle, app state)
│   ├── config/                  # Firebase initialization
│   └── domain/                  # TypeScript types
│
├── mobile/                       # React Native Expo app
│   ├── screens/
│   │   ├── HomeScreen.tsx       # Cargo search + map
│   │   ├── ActiveTripScreen.tsx # Trip tracking + chat
│   │   └── ProfileScreen.tsx    # Driver profile
│   ├── services/
│   │   ├── locationService.ts   # GPS tracking
│   │   └── chatService.ts       # Real-time messaging
│   ├── store/                   # Zustand stores (mobile versions)
│   ├── config/                  # Firebase for mobile
│   ├── App.tsx                  # Tab navigation
│   └── app.json                 # Expo configuration
│
└── README.md
```

---

## 🔐 Security (Development vs Production)

**Current (Development)**:
- ✅ Demo OTP: `123456` for testing
- ✅ No authentication checks
- ✅ Public Firestore access (for hackathon)

**For Production**:
- ⚠️ Implement Firebase Security Rules
- ⚠️ Enable SMS OTP verification
- ⚠️ Add API key restrictions
- ⚠️ Implement user session management
- ⚠️ Enable data encryption at rest

---

## ⚡ Performance Features

- **Location Tracking**: 8-sec intervals + 50m movement threshold (optimized for battery)
- **Real-time Sync**: Firestore onSnapshot (native subscriptions, zero polling)
- **State Persistence**: Zustand with localStorage (web) / AsyncStorage (mobile)
- **Lazy Loading**: Components load on-demand
- **Map Optimization**: Markers and polylines efficiently rendered

---

## 🚧 Roadmap

- [ ] Push notifications for cargo offers
- [ ] Driver ratings & reviews system
- [ ] Payment integration (Stripe)
- [ ] Vehicle photo upload
- [ ] Offline mode support
- [ ] SMS/WhatsApp notifications
- [ ] Advanced trip analytics
- [ ] Multi-language support

---

## 📝 License

Hackathon Project — All Rights Reserved

---

<p align="center">Built with ❤️ for real-time logistics</p>