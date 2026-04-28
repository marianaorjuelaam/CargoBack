# 🚛 Sistema de Selección de Cargas

Guía completa del sistema de matching de cargas en CargoBack Mobile.

---

## 📋 Concepto

El conductor ve **múltiples cargas sugeridas** en tiempo real y puede:
- ✅ **Aceptar** → Se bloquea la carga y comienza el viaje
- ❌ **Rechazar** → Se elimina y se carga otra automáticamente

**Filosofía**: Control total del conductor, sin complejidad.

---

## 🧠 Lógica de Negocio

### Generación de Cargas Sugeridas

**1. Fuente de datos:**
```javascript
// Firestore collection: available_loads
{
  id: "load-123",
  origin: "Girardot",
  destination: "Bogotá",
  priceCOP: 1_800_000,
  distanceKm: 200,
  detourKm: 0,
  cargoType: "Electrodomésticos",
  clientRating: 4.8,
  pickupTime: "Ahora"
}
```

**2. Filtrado inicial:**
- Solo cargas que encajen con el vehículo del conductor
- Capacidad: `cargaToneladas ≤ vehiculoCapacidad`
- Refrigeración: Si es necesaria, el vehículo debe tenerla
- Pickup: Dentro de próximas 4 horas

### Ranking: Algoritmo de Recomendación

**Fórmula principal:**
```javascript
efficiency = priceCOP / (distanceKm + detourKm)
```

**Orden de prioridad:**
1. **Eficiencia** (ganancia por km) — Mayor a menor
2. **Rating del cliente** — Mayor a menor
3. **Tiempo de pickup** — Antes a después

**Ejemplo:**
```
Carga A: $1.8M / 200km = $9,000/km | Rating 4.8
Carga B: $2.1M / 450km = $4,667/km | Rating 4.5
Carga C: $1.5M / 470km = $3,191/km | Rating 4.2

Orden: A (Recomendado) → B → C
```

**Visualización en UI:**
```
┌─────────────────────────────────┐
│ ⭐ Recomendado                   │  ← Badge amarillo en primera carga
├─────────────────────────────────┤
│ Carga A: $1.8M                  │
│ Girardot → Bogotá               │
│ 200 km                          │
├─────────────────────────────────┤
│ Carga B: $2.1M                  │
│ Medellín → Bogotá               │
│ 450 km + 25 km desvío           │
├─────────────────────────────────┤
│ Carga C: $1.5M                  │
│ Cali → Bogotá                   │
│ 470 km + 15 km desvío           │
└─────────────────────────────────┘
```

---

## 📊 Datos Mostrados (UI Minimalista)

### Obligatorios (siempre visible)
| Campo | Ejemplo | Por qué |
|-------|---------|--------|
| **Precio** | $1.8M | Decisión principal |
| **Origen** | Girardot | Punto de partida |
| **Destino** | Bogotá | Destino final |
| **Rating** | ⭐ 4.8 | Confianza en cliente |
| **Distancia** | 200 km | Tiempo estimado |

### Opcionales (si aplica)
| Campo | Ejemplo | Cuándo |
|-------|---------|--------|
| **Desvío** | +25 km | Si > 0 |
| **Cargo** | Electrodomésticos | Contexto |
| **Pickup** | Ahora / En 2h | Timing |

---

## 👆 Interacción & Estados

### Estado: Sin Cargas
```
┌─────────────────────────────────┐
│   📭 No hay cargas disponibles  │
│                                 │
│   Vuelve a intentar en unos     │
│   minutos                       │
│                                 │
│   [ 🔄 ACTUALIZAR ]             │
└─────────────────────────────────┘
```

### Estado: Cargando
```
┌─────────────────────────────────┐
│           ⏳ Buscando cargas...   │
└─────────────────────────────────┘
```

### Estado: Normal (3-5 cargas visibles)
```
┌─────────────────────────────────┐
│ 👋 Hola Juan                    │
│ 3 cargas disponibles            │
└─────────────────────────────────┘

[ Carga 1 con badge "Recomendado" ]
[ Carga 2 ]
[ Carga 3 ]

Cargar más al scroll...
```

### Flujo de Aceptación
```
User toca [ ACEPTAR ]
    ↓
acceptLoad(loadId)  → Firestore
    ↓
- Marca como "reserved"
- Bloquea 2 minutos para otros conductores
- Retorna tripId
    ↓
setSelectedLoad(load)
    ↓
Navega a ActiveTripScreen
```

### Flujo de Rechazo
```
User toca [ RECHAZAR ]
    ↓
rejectLoad(loadId)  → Firestore
    ↓
- Marca como "rejected_by_driver_123"
- Elimina de lista local
    ↓
Carga nueva automáticamente si < 2 cargas
    ↓
Re-rank y muestra
```

---

## 💻 Arquitectura (React Native)

### Estructura de Componentes
```
LoadSelectionScreen (pantalla principal)
├── Header (nombre, contador)
├── FlatList
│   ├── LoadCard (componente reutilizable)
│   │   ├── PriceSection
│   │   ├── RouteSection
│   │   ├── DetailsGrid
│   │   ├── ClientSection
│   │   ├── ButtonRow
│   │   │   ├── [ RECHAZAR ]
│   │   │   └── [ ACEPTAR ]
│   │   └── ClientChatModal (on demand)
│   │       ├── ChatMessages
│   │       └── TextInput + Send
│   └── TipBox (al pie)
```

### Flujo de Estado
```typescript
const [loads, setLoads] = useState<Load[]>([]);
const [loading, setLoading] = useState(false);
const [refreshing, setRefreshing] = useState(false);
const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);

// Cargar inicial
useEffect(() => {
  loadMoreLoads();
}, []);

// Aceptar carga
const handleAccept = async (load) => {
  await acceptLoad(load.id);
  setSelectedLoad(load);
  setLoads(prev => prev.filter(l => l.id !== load.id));
  // → Navigate to ActiveTripScreen
};

// Rechazar carga
const handleReject = async (load) => {
  await rejectLoad(load.id);
  setLoads(prev => prev.filter(l => l.id !== load.id));
  
  if (remaining.length < 2) {
    const newLoads = await getAvailableLoads(2);
    setLoads(prev => rankLoads([...prev, ...newLoads]));
  }
};
```

---

## 💬 Chat Genérico con Cliente

### Implementación Minimalista
```typescript
// En LoadCard.tsx
const [chatOpen, setChatOpen] = useState(false);

// Trigger: botón de mensaje en ClientSection
<TouchableOpacity onPress={() => setChatOpen(true)}>
  <MaterialIcons name="message" size={18} color="#10b981" />
</TouchableOpacity>

// Modal simple con 3 mensajes demo
<Modal visible={chatOpen} transparent>
  <ClientChatModal load={load} onClose={() => setChatOpen(false)} />
</Modal>
```

### Contenido del Chat
```javascript
// Mensaje 1: Cliente
"Hola, tengo una carga de [cargoType] desde [origin] hasta [destination]"

// Mensaje 2: Driver
"¿A qué hora es la recogida?"

// Mensaje 3: Cliente
"[pickupTime]. ¿Puedes hacerlo?"

// Input: Driver puede escribir respuesta
"Sí, claro! Llego en 30 minutos"
```

**Notas:**
- Solo **lectura** (no guardar mensajes)
- Mensajes **hardcodeados** con datos del load
- **IF simple**: Si `detourKm > 0`, mostrar "incluye desvío"
- Input de texto **no persistente** (para demo)

---

## 🎨 Estilos & Animaciones

### Colores Base
```javascript
backgroundColor: '#0F172A'  // Fondo app
cardBackground: '#1e293b'   // Tarjeta
acceptColor: '#10b981'      // Verde (aceptar)
rejectColor: '#dc2626'      // Rojo (rechazar)
recommendedColor: '#fbbf24' // Amarillo (badge)
```

### Animaciones
```javascript
// Sin efectos complejos, solo:
- Fade in al cargar cargas
- Scale en tap de botón (active:scale-95)
- Slide up en modal chat
```

---

## 🔄 Casos de Uso

### Caso 1: Conductor aceptable
```
1. Abre app
2. Ve 3 cargas
3. Toca ACEPTAR en primera (recomendada)
4. Se bloquea
5. Ve modal "Carga confirmada, en 3... 2... 1..."
6. Navega a ActiveTripScreen
7. Inicia GPS tracking
```

### Caso 2: Conductor rechaza la primera
```
1. Ve 3 cargas
2. Toca RECHAZAR en primera
3. Desaparece
4. Reaparece nueva carga al pie
5. Vuelve a rankear
6. Toca ACEPTAR en nueva primera
```

### Caso 3: Sin cargas disponibles
```
1. Abre app
2. Ve "No hay cargas disponibles"
3. Toca [ ACTUALIZAR ]
4. Espera "Buscando cargas..."
5. Se cargan nuevas o sigue sin haber
```

---

## 📱 Integración en App.tsx

```typescript
import LoadSelectionScreen from './screens/LoadSelectionScreen';
import HomeScreen from './screens/HomeScreen';

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}  // Wrapper que llama LoadSelectionScreen
        />
        <Tab.Screen
          name="Trip"
          component={ActiveTripScreen}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

---

## 🔧 Próximas Mejoras

1. **Real-time updates**
   - Usar Firestore listener para cargas nuevas
   - Notificación sonora cuando llega carga

2. **Filtros inteligentes**
   - Permitir rechazar tipo de cargo por X tiempo
   - "No aceptar cargas con desvío > 20km"

3. **Predicción de earnings**
   - Mostrar ganancia estimada / viaje
   - Proyección de ingresos diarios

4. **Chat real**
   - Integrar con Firestore chats
   - Historial de conversaciones por cliente

5. **Rating y reputación**
   - Mostrar más detalles del cliente
   - Reseñas anteriores

---

## 🎯 Métricas de Éxito

| Métrica | Meta |
|---------|------|
| Aceptación (acceptance rate) | > 40% |
| Tiempo decisión | < 30 seg |
| Churn (abandono sin aceptar) | < 20% |
| Rating promedio conductor | > 4.5 |

---

**Construido para camioneros reales. Simple. Directo. Eficiente.**
