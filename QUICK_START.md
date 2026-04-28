# 🚀 Quick Start Guide - CargoBack

Guía rápida para empezar a usar CargoBack Mobile.

---

## 📱 1. Instalar y Ejecutar

```bash
# Ir a carpeta mobile
cd mobile

# Instalar dependencias
npm install

# Ejecutar app
npx expo start

# En la terminal:
# Presiona 'a' para Android emulator
# Presiona 'i' para iOS simulator
# O escanea QR con Expo Go app
```

---

## ✅ 2. Los Sonidos Ya Están Listos

✨ **Buenas noticias:**
- 🔔 notification.wav ✅ Generado
- ✅ success.wav ✅ Generado  
- ❌ error.wav ✅ Generado

Están en: `mobile/assets/sounds/`

**NO necesitas hacer nada.** Los sonidos funcionan automáticamente.

---

## 📊 3. Probar Cada Feature

### 🔍 Tab: Buscar (Home)
```
1. Abre app
2. Ve a tab "Buscar" (primera tab)
3. Ves 3 cargas rankeadas
4. Tap "Recomendado" badge en primera → es la mejor
5. Tap ACEPTAR → 🔔 suena, se elimina
6. Tap RECHAZAR → carga nueva aparece
7. Tap 💬 en carga → abre chat con cliente
```

### 🚗 Tab: Viaje (Trip)
```
1. Tab "Viaje"
2. Tap "Simular viaje para demo"
3. Ve mapa con origen/destino
4. Chat en vivo con cliente
5. Presiona "Finalizar viaje"
```

### 📊 Tab: Historial (NEW!)
```
1. Tab "Historial"
2. Ve todas tus acciones (aceptadas/rechazadas)
3. Stats: aceptadas, rechazadas, % rate, ganancias
4. Timeline con hora/fecha
5. Botón "Limpiar historial"
```

### 👤 Tab: Perfil
```
1. Tab "Perfil"
2. Ve tu nombre, teléfono
3. Registra vehículo (tipo, capacidad)
4. Ver detalles vehículo
5. Botón Cerrar sesión
```

---

## 🔊 4. Escuchar Sonidos

### Cuando suena cada sonido:

**🔔 Notificación** → Cuando llega carga nueva
```
LoadSelectionScreen se abre
↓
Cargas llegan desde Firestore
↓
playNewLoadNotification() 🔔
```

**✅ Éxito** → Al aceptar carga
```
User tapa ACEPTAR
↓
acceptLoad() guarda en Firestore
↓
playSuccessSound() ✅
```

**❌ Error** → Si hay fallo
```
Error en conexión/Firestore/otra
↓
playErrorSound() ❌
```

---

## 🔥 5. Firestore (Opcional)

### Si quieres datos reales en lugar de demo:

1. Ve a Firebase Console
2. Crea colección `available_loads`
3. Agrega documentos:
```javascript
{
  origin: "Girardot",
  destination: "Bogotá",
  priceCOP: 1800000,
  distanceKm: 200,
  detourKm: 0,
  clientRating: 4.8,
  cargoType: "Electrodomésticos",
  capacity: 12,
  pickupTime: "Ahora",
  clientName: "Importadora García",
  clientPhone: "+57 301 234 5678",
  status: "available"
}
```

4. App autodetecta y sincroniza en tiempo real

---

## 📝 6. Personalizar Sonidos

### Cambiar volumen:

En `mobile/services/notificationService.ts`:
```typescript
await playSound(SOUNDS.newLoad, 0.8);   // ← Cambiar 0.8
await playSound(SOUNDS.success, 0.6);   // ← Rango: 0.0 a 1.0
await playSound(SOUNDS.error, 0.5);
```

### Regenerar sonidos:
```bash
npm run sounds
```

Edita `mobile/scripts/generateSounds.js` para cambiar frecuencias/duraciones.

---

## 📂 7. Estructura de Carpetas

```
CargoBack/
├── mobile/                    ← Tu app
│   ├── screens/
│   │   ├── LoadSelectionScreen.tsx    (Nueva pantalla cargas)
│   │   ├── LoadHistoryScreen.tsx      (Nueva pantalla historial)
│   │   ├── HomeScreen.tsx             (Wrapper)
│   │   ├── ActiveTripScreen.tsx       (Tracking + chat)
│   │   └── ProfileScreen.tsx          (Perfil)
│   ├── components/
│   │   └── LoadCard.tsx               (Card + chat modal)
│   ├── services/
│   │   ├── loadService.ts             (Ranking + Firestore)
│   │   └── notificationService.ts     (Audio)
│   ├── store/
│   │   └── loadHistoryStore.ts        (Historial local)
│   ├── assets/
│   │   └── sounds/
│   │       ├── notification.wav ✅
│   │       ├── success.wav ✅
│   │       └── error.wav ✅
│   ├── App.tsx                        (4 tabs)
│   └── package.json                   (Dependencias)
├── src/                       ← Web app
├── LOAD_SELECTION.md
├── SETUP_AUDIO.md
├── FIRESTORE_INTEGRATION.md
├── CHANGELOG.md
└── SOUNDS_GENERATED.md
```

---

## 🎯 8. Flujo Completo Usuario

```
1. Abre app
2. Login (demo: OTP = 123456)
3. Registra vehículo
4. Va a Home → ve cargas rankeadas
5. Lee ratings/precios
6. Tapa ACEPTAR en mejor carga
7. 🔔 Suena notificación de éxito
8. ✅ Navega a Trip
9. Ve mapa en vivo con ruta
10. Chatea con cliente
11. Completa viaje
12. Historial registra acción
13. Va a Historial → ve stats
```

---

## 🆘 9. Troubleshooting

| Problema | Solución |
|----------|----------|
| No se escucha sonido | Sube volumen del teléfono |
| App no inicia | `npm install` en carpeta mobile |
| Cargas no aparecen | Demo data funciona automático |
| Chat no carga | Modal genérico, funciona sin Firestore |
| Error en Firestore | Falls back a demo, no crash |

---

## 📚 10. Documentación Completa

| Documento | Qué contiene |
|-----------|-------------|
| LOAD_SELECTION.md | Lógica ranking, UI, interacción |
| SETUP_AUDIO.md | Cómo personalizar sonidos |
| FIRESTORE_INTEGRATION.md | Colecciones, security rules, sync |
| CHANGELOG.md | Checklist de todo implementado |
| SOUNDS_GENERATED.md | Descripción de cada sonido |

---

## ✨ ¡Listo!

Todo está configurado:
- ✅ Sonidos generados
- ✅ Código integrado
- ✅ Demo data lista
- ✅ Documentación completa

**Solo ejecuta la app y diviértete** 🚀

```bash
cd mobile
npx expo start
```

---

Preguntas? Ver documentación en la carpeta raíz.

Happy hacking! 🎉
