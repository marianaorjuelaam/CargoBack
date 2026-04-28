import { Audio } from 'expo-av';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const SOUNDS: Record<string, number> = {
  newLoad: require('../assets/sounds/notification.wav'),
  success: require('../assets/sounds/success.wav'),
  error: require('../assets/sounds/error.wav'),
};

let currentSound: Audio.Sound | null = null;
let audioReady = false;

export async function initializeAudio(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    audioReady = true;
  } catch (error) {
    console.error('Error initializing audio:', error);
  }
}

async function playSound(soundKey: string, volume: number = 1.0): Promise<void> {
  if (!audioReady) return;

  try {
    // Detener y descargar el sonido anterior
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      currentSound = null;
    }

    const { sound } = await Audio.Sound.createAsync(SOUNDS[soundKey]);
    currentSound = sound;
    await sound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
    await sound.playAsync();

    // Auto-descargar cuando termina
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
        if (currentSound === sound) {
          currentSound = null;
        }
      }
    });
  } catch (error) {
    console.error(`Error playing sound "${soundKey}":`, error);
  }
}

export async function playNewLoadNotification(): Promise<void> {
  await playSound('newLoad', 0.8);
}

export async function playSuccessSound(): Promise<void> {
  await playSound('success', 0.6);
}

export async function playErrorSound(): Promise<void> {
  await playSound('error', 0.5);
}

export async function cleanup(): Promise<void> {
  if (currentSound) {
    try {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      currentSound = null;
    } catch (error) {
      console.error('Error cleaning up sound:', error);
    }
  }
  audioReady = false;
}
