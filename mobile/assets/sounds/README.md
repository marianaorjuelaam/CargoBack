# 🔊 Notification Sounds

Archivos de audio WAV para notificaciones en CargoBack Mobile.

---

## 📁 Archivos

### `notification.wav` (22 KB)
**Uso**: Cuando llega una nueva carga
**Sonido**: 2 tonos ascendentes (800Hz → 1200Hz)
**Duración**: ~0.25 segundos
**Volumen**: 80% (configurable en notificationService.ts)

```
Tone 1: 800 Hz × 0.1s  ▁▂▃▄▅▆▇█
Tone 2: 1200 Hz × 0.15s  ▁▂▃▄▅▆▇█
```

### `success.wav` (34 KB)
**Uso**: Al aceptar una carga exitosamente
**Sonido**: 3 tonos ascendentes (C5-E5-G5, acordé musical)
**Duración**: ~0.4 segundos
**Volumen**: 60% (configurable)

```
Tone 1: 523 Hz × 0.1s   ▁▂▃▄▅▆▇█  (Do)
Tone 2: 659 Hz × 0.1s   ▁▂▃▄▅▆▇█  (Mi)
Tone 3: 784 Hz × 0.2s   ▁▂▃▄▅▆▇█  (Sol)
```

### `error.wav` (34 KB)
**Uso**: Cuando hay un error
**Sonido**: Buzzer bajo oscilante
**Duración**: ~0.4 segundos
**Volumen**: 50% (configurable)

```
Buzz 1: 400 Hz × 0.1s   ▁▂▃▄▅▆▇█
Buzz 2: 350 Hz × 0.1s   ▁▂▃▄▅▆▇█
(Patrón repetido x2)
```

---

## 🎵 Características

✅ **PCM WAV format** (compatible con iOS/Android)
✅ **44.1 kHz sample rate** (calidad estándar)
✅ **Mono (1 channel)** (archivo pequeño)
✅ **16-bit depth** (buena calidad)
✅ **Sin compresión** (suena limpio)

---

## 🔧 Personalizar Volúmenes

En `services/notificationService.ts`:

```typescript
export async function playNewLoadNotification() {
  await playSound(SOUNDS.newLoad, 0.8);  // ← Cambiar este número
}

export async function playSuccessSound() {
  await playSound(SOUNDS.success, 0.6);  // ← 0.3 = bajo, 1.0 = máximo
}

export async function playErrorSound() {
  await playSound(SOUNDS.error, 0.5);
}
```

**Rango**: 0.0 (mudo) a 1.0 (máximo volumen)

---

## 🎛️ Regenerar Sonidos

Si quieres cambiar las frecuencias, duración o volumen:

```bash
cd mobile
node scripts/generateSounds.js
```

**Edita `scripts/generateSounds.js`** para cambiar:
- Frecuencias (Hz)
- Duraciones (segundos)
- Volúmenes (0.0-1.0)

---

## 🔄 Reemplazar con Tus Propios Sonidos

Si prefieres usar archivos de audio descargados:

1. Descarga sonidos WAV desde:
   - [Freesound.org](https://freesound.org)
   - [Zapsplat.com](https://www.zapsplat.com)
   - [Pixabay Sounds](https://pixabay.com/sound-effects/)

2. Convierte a WAV (si es necesario):
   ```bash
   ffmpeg -i sound.mp3 -c:a pcm_s16le -ar 44100 sound.wav
   ```

3. Reemplaza los archivos:
   ```bash
   cp /ruta/notification.wav assets/sounds/
   cp /ruta/success.wav assets/sounds/
   cp /ruta/error.wav assets/sounds/
   ```

4. Verifica que funcionan en la app

---

## 📝 Metadata WAV

Todos los archivos cumplen con:
- **RIFF** chunk (WAV header)
- **fmt** chunk (audio format)
- **data** chunk (audio samples)
- **PCM encoding** (uncompressed)

---

## 🐛 Troubleshooting

### "No se escucha sonido"
```
✓ Verifica volumen del dispositivo
✓ Check Settings > Sounds
✓ Prueba en otro dispositivo
✓ Revisa logs: console.log en notificationService.ts
```

### "Sonido muy fuerte/débil"
```
Ajusta volumen en notificationService.ts (rango 0.0-1.0)
```

### "Archivo corrupto"
```
Regenera: npm run sounds
```

---

**Generado automáticamente por `scripts/generateSounds.js`**

Last Generated: 2026-04-28
