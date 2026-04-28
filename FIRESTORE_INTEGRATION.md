# 🔥 Firestore Integration Guide

Guía completa de integración de Firestore en CargoBack Mobile.

---

## 📊 Colecciones Firestore

### `available_loads` (Cargas disponibles)
```javascript
{
  id: "load-456",
  origin: "Girardot",
  destination: "Bogotá",
  priceCOP: 1_800_000,
  distanceKm: 200,
  detourKm: 0,
  clientRating: 4.8,
  cargoType: "Electrodomésticos",
  capacity: 12,
  pickupTime: "Ahora",
  clientName: "Importadora García",
  clientPhone: "+57 301 234 5678",
  
  // Estados
  status: "available" | "reserved" | "completed",
  
  // Si está reservada
  reservedBy: "driver-123",
  reservedAt: Timestamp,
  
  // Si fue rechazada
  rejectedBy: ["driver-123", "driver-456"],
  rejectedAt: [Timestamp, Timestamp]
}
```

### `driver_actions` (Histórico de acciones)
```javascript
{
  id: "action-789",
  driverId: "driver-123",
  loadId: "load-456",
  action: "accepted" | "rejected",
  
  // Load details (copia para referencia)
  origin: "Girardot",
  destination: "Bogotá",
  priceCOP: 1_800_000,
  cargoType: "Electrodomésticos",
  
  timestamp: Timestamp,
  rating: 4.8 // Cliente rating
}
```

### `driver_stats` (Estadísticas por conductor)
```javascript
{
  id: "driver-123",
  driverId: "driver-123",
  totalAccepted: 24,
  totalRejected: 8,
  acceptanceRate: 75,
  totalEarnings: 45_600_000,
  
  lastAction: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🔄 Flujo de Datos Real-Time

### Cuando se abre LoadSelectionScreen

```
1. subscribeToAvailableLoads()
   ↓
2. Firestore listener: WHERE status == 'available'
   ↓
3. rankLoads() ordena por eficiencia + rating
   ↓
4. Muestra 5 primeras en LoadSelectionScreen
   ↓
5. Listener sigue activo → Si llegan nuevas cargas:
   - onSnapshot() dispara
   - playNewLoadNotification() suena
   - Re-renderiza FlatList
```

### Cuando acepta una carga

```
User toca ACEPTAR
   ↓
handleAccept(load)
   ↓
acceptLoad(loadId, driverId)
   ↓
Firestore updateDoc:
   status: 'reserved'
   reservedBy: driverId
   reservedAt: serverTimestamp()
   ↓
addAction() → Guardar en local history
   ↓
playSuccessSound()
   ↓
Elimina de lista local
   ↓
Navega a ActiveTripScreen
```

### Cuando rechaza una carga

```
User toca RECHAZAR
   ↓
handleReject(load)
   ↓
rejectLoad(loadId, driverId)
   ↓
Firestore updateDoc:
   rejectedBy: arrayUnion(driverId)
   rejectedAt: arrayUnion(serverTimestamp())
   ↓
addAction() → Guardar en local history
   ↓
Elimina de lista local
   ↓
Si < 2 cargas, carga nuevas
   ↓
Re-rank y renderiza
```

---

## 🔐 Security Rules

**Producción (aplica a tu Firestore):**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Available loads - public read, only backend writes
    match /available_loads/{document=**} {
      allow read: if true;
      allow create, update, delete: if request.auth.uid == 'backend-uid';
    }
    
    // Driver actions - drivers can write their own
    match /driver_actions/{document=**} {
      allow read: if request.auth.uid == resource.data.driverId;
      allow create: if request.auth.uid == request.resource.data.driverId;
    }
    
    // Driver stats - drivers can read own
    match /driver_stats/{document=**} {
      allow read: if request.auth.uid == resource.data.driverId;
      allow write: if request.auth.uid == 'backend-uid';
    }
  }
}
```

---

## 📱 App Implementation

### LoadSelectionScreen

```typescript
// Subscribe to real-time updates
useEffect(() => {
  const unsubscribe = subscribeToAvailableLoads((newLoads) => {
    setLoads(newLoads);
    
    // Play notification if new loads arrive
    if (newLoads.length > 0) {
      playNewLoadNotification();
    }
  });
  
  return () => unsubscribe();
}, []);

// Accept
const handleAccept = async (load) => {
  await acceptLoad(load.id, driver.id);  // ← Updates Firestore
  playSuccessSound();
  addAction({ /* history entry */ });
  setLoads(prev => prev.filter(l => l.id !== load.id));
};

// Reject
const handleReject = async (load) => {
  await rejectLoad(load.id, driver.id);  // ← Updates Firestore
  addAction({ /* history entry */ });
  setLoads(prev => prev.filter(l => l.id !== load.id));
  
  if (remaining.length < 2) {
    const newLoads = await getAvailableLoads(2);
    setLoads(rankLoads([...prev, ...newLoads]));
  }
};
```

### LoadHistoryScreen

```typescript
// Local store (persists with AsyncStorage)
const { history, getStats } = useLoadHistoryStore();

// Stats calculated on-demand
const stats = useMemo(() => getStats(), [history]);

// Display:
// - Total accepted
// - Total rejected
// - Acceptance rate (%)
// - Total earnings
// - Timeline de todas las acciones
```

---

## 🔊 Audio Integration

```typescript
// En loadService.ts
export async function getAvailableLoads(limit = 5) {
  // Fetch from Firestore...
}

// En LoadSelectionScreen
useEffect(() => {
  const unsubscribe = subscribeToAvailableLoads((newLoads) => {
    setLoads(newLoads);
    if (newLoads.length > 0) {
      playNewLoadNotification();  // ← Firestore listener triggers sound
    }
  });
}, []);

// En handleAccept
await acceptLoad(load.id, driver.id);  // Updates Firestore
playSuccessSound();                      // Sound effect

// En handleReject
await rejectLoad(load.id, driver.id);   // Updates Firestore
// No sound (optional: could add warning beep)
```

---

## 📈 Analytics & Metrics

**Qué se rastrea:**

| Métrica | Origen | Frecuencia |
|---------|--------|-----------|
| Total aceptadas | `load_history` | En tiempo real |
| Total rechazadas | `load_history` | En tiempo real |
| Tasa aceptación | Calculado | Cada acción |
| Ganancias totales | `load_history` | Cada aceptación |
| Última actividad | Timestamp | Cada acción |

**Cálculos en app:**

```typescript
// En useLoadHistoryStore
getStats() {
  const accepted = history.filter(h => h.action === 'accepted').length;
  const rejected = history.filter(h => h.action === 'rejected').length;
  const total = accepted + rejected;
  const earnings = history
    .filter(h => h.action === 'accepted')
    .reduce((sum, h) => sum + h.priceCOP, 0);
  
  return {
    totalAccepted: accepted,
    totalRejected: rejected,
    totalEarnings: earnings,
    acceptanceRate: total > 0 ? Math.round((accepted / total) * 100) : 0,
  };
}
```

---

## 🚀 Deploy Firestore (Production)

### 1. Crea las colecciones

**Firebase Console → Firestore:**

```
+ Start collection
  Name: available_loads
  Add first document:
    id: load-1
    origin: "Girardot"
    destination: "Bogotá"
    ... (resto de campos)
```

### 2. Aplica security rules

```
Firebase Console → Firestore → Rules
Copia/pega las reglas del section anterior
```

### 3. Inicializa datos

```bash
# Opcional: script para cargar datos iniciales
node scripts/seedFirestore.js
```

### 4. Habilita Real-time Sync

Esto ya está en `loadService.ts`:
```typescript
export function subscribeToAvailableLoads(
  onLoads: (loads: Load[]) => void,
  limit: number = 5
): Unsubscribe {
  const q = query(
    collection(db, 'available_loads'),
    where('status', '==', 'available')
  );

  return onSnapshot(q, (snap) => {
    const loads = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Load[];
    
    onLoads(rankLoads(loads.slice(0, limit)));
  });
}
```

---

## 🐛 Debug & Testing

### Ver datos en tiempo real (Firebase Console)

```
1. Firebase Console
2. Firestore Database
3. Click en "available_loads" collection
4. Ve actualizaciones en vivo mientras usas la app
```

### Logs en app

```typescript
// LoadSelectionScreen
console.log('Cargas recibidas:', loads);
console.log('Stats:', stats);

// loadService.ts
console.log('Subscribing to loads...');
console.log('Load accepted:', loadId);
console.log('Load rejected:', loadId);
```

### Testing sin Firestore (demo mode)

```typescript
// loadService.ts detecta error y cae a demo data
try {
  const loads = await getDocs(q);
  if (snap.empty) return DEMO_LOADS;  // ← Fallback
} catch (error) {
  return DEMO_LOADS;  // ← Error fallback
}
```

---

## 📝 Ejemplo Completo: Una Carga Llega

```
1. Backend publica nueva carga en Firestore:
   POST /admin/loads
   {
     origin: "Cali",
     destination: "Bogotá",
     priceCOP: 1_600_000,
     distanceKm: 470,
     ...
   }

2. Firestore guarda con status: 'available'

3. Listener en app (subscribeToAvailableLoads):
   onSnapshot() → Recibe documento nuevo

4. rankLoads() → Ordena con otros
   Eficiencia = 1.6M / 470 = $3,404/km

5. setLoads() → FlatList re-renderiza

6. playNewLoadNotification() → 🔔 BEEP

7. User ve nueva carga en pantalla
   - "Cali → Bogotá"
   - "$1.6M"
   - "470 km"
   - Botones [ACEPTAR] [RECHAZAR]

8. User toca ACEPTAR:
   - acceptLoad(loadId, driverId)
   - Firestore updateDoc: status='reserved'
   - playSuccessSound() → ✅ DING
   - Removed from list
   - Navigate to ActiveTripScreen

9. Otra app/backend ve load reservado:
   - Can't assign to other drivers
   - Shows "Reserved by driver-123"
```

---

## 🎯 Próximas Mejoras

- [ ] Sincronizar con backend real (Firebase Cloud Functions)
- [ ] Notificaciones push (FCM) cuando llega carga
- [ ] Historial sincronizado en la nube
- [ ] Dashboard web para ver aceptados/rechazados
- [ ] Algoritmo de matching backend (no solo frontend rank)
- [ ] Reputación driver basada en actions

---

**Firestore es el source of truth. Siempre.**
