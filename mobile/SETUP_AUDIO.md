# 🔊 Setup de Notificaciones de Audio

Guía para configurar los sonidos de notificación en la app mobile.

---

## 📥 Instalación

Ya está incluido en `package.json`:
```json
{
  "expo-av": "^14.0.0"
}
```

Asegúrate de que esté instalado:
```bash
cd mobile
npm install expo-av
```

---

## 🎵 Agregar Archivos de Audio

### Opción 1: Usar Sonidos Predefinidos (Recomendado)

Crea la estructura:
```
mobile/
├── assets/
│   └── sounds/
│       ├── notification.wav
│       ├── success.wav
│       └── error.wav
└── screens/
```

### Opción 2: Descargar Sonidos Libres

**Sitios recomendados (CC0/Libre):**
- [Freesound.org](https://freesound.org)
- [Zapsplat.com](https://www.zapsplat.com)
- [Pixabay Sounds](https://pixabay.com/sound-effects/)

**Sonidos específicos a buscar:**

| Sonido | Búsqueda | Duración |
|--------|----------|----------|
| `notification.wav` | "notification alert bell" | 0.5-1s |
| `success.wav` | "success chime ding" | 0.3-0.8s |
| `error.wav` | "error buzz wrong" | 0.4-1s |

**Pasos:**
1. Descarga en formato WAV o MP3
2. Guarda en `mobile/assets/sounds/`
3. Renombra con los nombres exactos arriba

---

## 🔧 Uso en Código

### Importar y Usar

```typescript
import {
  playNewLoadNotification,
  playSuccessSound,
  playErrorSound,
  initializeAudio,
  cleanup,
} from '../services/notificationService';

// En componente
useEffect(() => {
  initializeAudio();
  return () => cleanup();
}, []);

// Trigger sonido cuando llega carga
const newLoads = await getAvailableLoads();
if (newLoads.length > 0) {
  playNewLoadNotification();
}

// Al aceptar
await acceptLoad(load.id);
playSuccessSound();

// En error
playErrorSound();
```

### Volúmenes Actuales

```typescript
// En notificationService.ts
playNewLoadNotification();      // 80% volumen
playSuccessSound();             // 60% volumen
playErrorSound();               // 50% volumen
```

**Para ajustar, edita `notificationService.ts`:**
```typescript
await playSound(SOUNDS.newLoad, 0.8);  // Cambiar 0.8 a 0.3-1.0
```

---

## 🎛️ Comportamiento

### Android
- ✅ Respeta configuración de volumen del sistema
- ✅ Suena incluso en silencio (si está habilitado)
- ✅ Se detiene al aceptar otra carga

### iOS
- ✅ Suena incluso en modo silencio
- ✅ Usa volumen de notificaciones
- ✅ Compatible con Siri

---

## 🔇 Configuración de Audio

Actual en `notificationService.ts`:
```typescript
await Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: true,    // ← Sigue sonando en background
  playsInSilentModeIOS: true,       // ← Suena en silencio (iOS)
  shouldDuckAndroid: true,          // ← Baja otras apps (Android)
  playThroughEarpieceAndroid: false,// ← Usa speaker, no micrófono
});
```

**Para cambiar:**
- Desactivar silencio: `playsInSilentModeIOS: false`
- Deshabilitar background: `staysActiveInBackground: false`

---

## 🐛 Troubleshooting

### "Audio not playing"
```
✓ Verifica que los archivos existan en assets/sounds/
✓ Revisa los nombres exactos (case-sensitive)
✓ En simulador iOS: check Settings > Sounds
✓ En simulador Android: check media volumen
```

### "Too loud / Too quiet"
```
Edita volúmenes en notificationService.ts:
playNewLoadNotification()  → 0.8
playSuccessSound()         → 0.6
playErrorSound()           → 0.5

Rango: 0.0 (mudo) a 1.0 (máximo)
```

### "Error loading audio"
```typescript
// Verifica la ruta en notificationService.ts:
const SOUNDS = {
  newLoad: require('../assets/sounds/notification.wav'),
  //       ↑ Ruta correcta relativa a notificationService.ts
  ...
};
```

---

## 📝 Archivos de Sonido Recomendados

### Gratuitos listos para descargar:
- **Notification**: [Zapsplat - Bell notification](https://www.zapsplat.com/music/bell-notification-alert/)
- **Success**: [Freesound - Retro success sound](https://freesound.org/search/?q=success+chime)
- **Error**: [Zapsplat - Wrong/error buzzer](https://www.zapsplat.com/music/wrong-error-buzzer/)

---

## 🎯 Sonidos Integrados

**LoadSelectionScreen:**
- 🔔 `playNewLoadNotification()` → Cuando se cargan nuevas cargas
- ✅ `playSuccessSound()` → Al aceptar una carga
- ❌ `playErrorSound()` → Si hay error

**Flujo actual:**
```
App abre
  ↓
Loads llegan → 🔔 BEEP (notificación)
  ↓
Usuario toca ACEPTAR
  ↓
acceptLoad() → ✅ DING (éxito)
  ↓
Load se acepta
```

---

**¡Listo! Los sonidos están integrados y funcionan. Solo agrega los archivos WAV.**
