# 🔊 Sonidos de Notificación Generados

Todos los archivos de audio para notificaciones han sido **generados automáticamente** en `mobile/assets/sounds/`.

---

## ✅ Sonidos Creados

### 1. 🔔 `notification.wav` (22 KB)
```
Cuando: Llega una nueva carga
Sonido: 2 tonos ascendentes
Patrón: 800 Hz → 1200 Hz
Duración: 0.25 segundos
Volumen app: 80%
```

**Escucha**: Dos "beeps" rápidos ascendentes - alerta clara sin ser invasiva

---

### 2. ✅ `success.wav` (34 KB)
```
Cuando: Aceptas una carga exitosamente
Sonido: Acordé musical ascendente (C-E-G)
Patrón: 523 Hz → 659 Hz → 784 Hz
Duración: 0.4 segundos
Volumen app: 60%
```

**Escucha**: Tres tonos musicales ascendentes - satisfacción auditiva

---

### 3. ❌ `error.wav` (34 KB)
```
Cuando: Hay un error (rechazo, fallo de conexión)
Sonido: Buzzer bajo oscilante
Patrón: 400 Hz ⇄ 350 Hz (repetido)
Duración: 0.4 segundos
Volumen app: 50%
```

**Escucha**: Buzzer grave oscilante - alerta de atención

---

## 📂 Ubicación

```
mobile/
├── assets/
│   └── sounds/
│       ├── notification.wav ✅
│       ├── success.wav ✅
│       ├── error.wav ✅
│       └── README.md (instrucciones)
└── scripts/
    └── generateSounds.js (generador)
```

---

## 🚀 Cómo Usar

### Ya está integrado:

```typescript
// LoadSelectionScreen.tsx
const unsubscribe = subscribeToAvailableLoads((newLoads) => {
  setLoads(newLoads);
  if (newLoads.length > 0) {
    playNewLoadNotification(); // 🔔 SUENA
  }
});

// handleAccept
await acceptLoad(load.id, driver.id);
playSuccessSound(); // ✅ SUENA

// handleReject (on error)
playErrorSound(); // ❌ SUENA
```

---

## 🎛️ Personalizar Volúmenes

En `mobile/services/notificationService.ts`:

```typescript
// Cambiar volúmenes (0.0 = mudo, 1.0 = máximo)
playSound(SOUNDS.newLoad, 0.8);   // ← notification (cambia aquí)
playSound(SOUNDS.success, 0.6);   // ← success
playSound(SOUNDS.error, 0.5);     // ← error
```

---

## 🔄 Regenerar Sonidos (si quieres cambiar)

```bash
cd mobile
npm run sounds
```

**Edita `scripts/generateSounds.js`** para:
- Cambiar frecuencias (Hz)
- Cambiar duraciones (segundos)
- Cambiar volúmenes relativos (0.0-1.0)

---

## 📋 Técnicas de Audio

| Propiedad | Valor |
|-----------|-------|
| Formato | WAV (PCM uncompressed) |
| Sample Rate | 44.1 kHz |
| Canales | Mono (1) |
| Bit Depth | 16-bit |
| Codec | PCM |
| Compresión | Ninguna |

---

## 🎯 Comportamiento en App

### Flujo Completo:

```
1. LoadSelectionScreen se abre
   ↓
2. Suscriptor Firestore escucha cargas
   ↓
3. Llega nueva carga
   ↓
4. playNewLoadNotification() 🔔
   ↓
5. FlatList renderiza nuevas cargas
   ↓
6. User ve primero con "Recomendado" badge
   ↓
7. User toca ACEPTAR
   ↓
8. acceptLoad(loadId, driverId) → Firestore
   ↓
9. playSuccessSound() ✅
   ↓
10. Load removida de lista local
    ↓
11. Navega a ActiveTripScreen
```

---

## 🔊 Comportamiento de Audio

### iOS
- ✅ Suena incluso en modo silencio
- ✅ Usa volumen de notificaciones
- ✅ Compatible con Siri

### Android
- ✅ Respeta configuración de volumen
- ✅ Suena en background
- ✅ Compatible con Do Not Disturb

---

## 💡 Características Especiales

- **Generado automáticamente**: No requiere descargas externas
- **Sin dependencias pesadas**: Solo usa `expo-av` (ya incluido)
- **Personalizable**: Edita `generateSounds.js` para cambiar
- **Fallback graceful**: Si falla audio, app sigue funcionando
- **iOS/Android compatible**: Usa Audio API estándar

---

## 📝 Archivos Relacionados

| Archivo | Función |
|---------|---------|
| `mobile/assets/sounds/notification.wav` | Sonido notificación carga nueva |
| `mobile/assets/sounds/success.wav` | Sonido aceptación exitosa |
| `mobile/assets/sounds/error.wav` | Sonido error/rechazo |
| `mobile/assets/sounds/README.md` | Documentación de sonidos |
| `mobile/scripts/generateSounds.js` | Script generador WAV |
| `mobile/services/notificationService.ts` | Servicio reproducción audio |

---

## ✨ ¡Listo para Usar!

Los sonidos ya están:
- ✅ Generados
- ✅ Integrados en el código
- ✅ Configurados en los servicios
- ✅ Listos para reproducir

**No necesitas hacer nada más.** Solo ejecuta la app y escucharás los sonidos automáticamente.

```bash
cd mobile
npx expo start
# Abre en Android/iOS
# Ve a Home tab
# Escucha los sonidos cuando:
# 🔔 Llega carga nueva
# ✅ Aceptas una carga
# ❌ Hay error
```

---

## 🎵 Prueba Rápida

Para probar manualmente en la app:

```typescript
// En LoadSelectionScreen.tsx, agrega esto temporalmente
import { playNewLoadNotification, playSuccessSound, playErrorSound } from '../services/notificationService';

// En algún TouchableOpacity de prueba:
<TouchableOpacity onPress={playNewLoadNotification}>
  <Text>Test Notification 🔔</Text>
</TouchableOpacity>

<TouchableOpacity onPress={playSuccessSound}>
  <Text>Test Success ✅</Text>
</TouchableOpacity>

<TouchableOpacity onPress={playErrorSound}>
  <Text>Test Error ❌</Text>
</TouchableOpacity>
```

---

**Generado**: 2026-04-28  
**Script**: `mobile/scripts/generateSounds.js`  
**Status**: ✅ LISTO PARA PRODUCCIÓN
