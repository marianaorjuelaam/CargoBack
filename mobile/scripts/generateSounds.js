#!/usr/bin/env node

/**
 * Script para generar archivos de sonido WAV para notificaciones
 * Requiere: npm install wav
 *
 * Usa: node scripts/generateSounds.js
 */

const fs = require('fs');
const path = require('path');

// Crear directorio si no existe
const soundsDir = path.join(__dirname, '../assets/sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
  console.log(`✓ Creado directorio: ${soundsDir}`);
}

// Función para crear tono WAV simple
function createToneWAV(frequency, duration, volume = 0.3) {
  const sampleRate = 44100;
  const samples = Math.floor(sampleRate * duration);
  const buffer = Buffer.alloc(samples * 2);

  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    const angle = 2 * Math.PI * frequency * t;
    const sample = Math.sin(angle) * volume * 32767;

    buffer.writeInt16LE(Math.round(sample), i * 2);
  }

  return buffer;
}

// Función para crear WAV file
function createWAVFile(filename, audioData, sampleRate = 44100) {
  const channels = 1;
  const bitDepth = 16;
  const byteRate = sampleRate * channels * bitDepth / 8;
  const blockAlign = channels * bitDepth / 8;

  // WAV header
  const header = Buffer.alloc(44);
  let pos = 0;

  // "RIFF" chunk
  header.write('RIFF', pos); pos += 4;
  header.writeUInt32LE(36 + audioData.length, pos); pos += 4;
  header.write('WAVE', pos); pos += 4;

  // "fmt " chunk
  header.write('fmt ', pos); pos += 4;
  header.writeUInt32LE(16, pos); pos += 4; // subchunk1Size
  header.writeUInt16LE(1, pos); pos += 2; // audioFormat (PCM)
  header.writeUInt16LE(channels, pos); pos += 2;
  header.writeUInt32LE(sampleRate, pos); pos += 4;
  header.writeUInt32LE(byteRate, pos); pos += 4;
  header.writeUInt16LE(blockAlign, pos); pos += 2;
  header.writeUInt16LE(bitDepth, pos); pos += 2;

  // "data" chunk
  header.write('data', pos); pos += 4;
  header.writeUInt32LE(audioData.length, pos); pos += 4;

  const wavFile = Buffer.concat([header, audioData]);
  fs.writeFileSync(path.join(soundsDir, filename), wavFile);
  console.log(`✓ Creado: ${filename}`);
}

// Sonido 1: Notificación (2 tonos ascendentes rápidos)
// Frecuencia 1: 800Hz, Duración: 0.1s
// Frecuencia 2: 1200Hz, Duración: 0.1s
console.log('\n🔔 Generando notification.wav...');
const notif1 = createToneWAV(800, 0.1, 0.25);
const notif2 = createToneWAV(1200, 0.15, 0.25);
const notificationAudio = Buffer.concat([notif1, notif2]);
createWAVFile('notification.wav', notificationAudio);

// Sonido 2: Éxito (3 tonos ascendentes)
// Patrón: 523Hz (C5) → 659Hz (E5) → 784Hz (G5)
// Cada uno 0.1s con pequeño gap
console.log('✅ Generando success.wav...');
const success1 = createToneWAV(523, 0.1, 0.3);
const success2 = createToneWAV(659, 0.1, 0.3);
const success3 = createToneWAV(784, 0.2, 0.3);
const successAudio = Buffer.concat([success1, success2, success3]);
createWAVFile('success.wav', successAudio);

// Sonido 3: Error (buzzer bajo)
// Frecuencia: 400Hz oscilando
// Duración: 0.4s con variación de tono
console.log('❌ Generando error.wav...');
const errorPart1 = createToneWAV(400, 0.1, 0.3);
const errorPart2 = createToneWAV(350, 0.1, 0.3);
const errorPart3 = createToneWAV(400, 0.1, 0.3);
const errorPart4 = createToneWAV(350, 0.1, 0.3);
const errorAudio = Buffer.concat([errorPart1, errorPart2, errorPart3, errorPart4]);
createWAVFile('error.wav', errorAudio);

console.log('\n✨ ¡Sonidos generados exitosamente!');
console.log(`📁 Ubicación: ${soundsDir}\n`);
