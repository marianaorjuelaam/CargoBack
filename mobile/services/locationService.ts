import * as Location from 'expo-location';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

let locationSubscription: Location.LocationSubscription | null = null;

export async function startLocationTracking(driverId: string, tripId: string) {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permiso de ubicación denegado');
    }

    await Location.requestBackgroundPermissionsAsync();

    locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 8000, // 8 segundos — equilibrio batería/precisión
        distanceInterval: 50, // O si se mueve > 50 metros
      },
      async (location) => {
        try {
          await setDoc(
            doc(db, 'driver_locations', driverId),
            {
              userId: driverId,
              tripId,
              lat: location.coords.latitude,
              lng: location.coords.longitude,
              heading: location.coords.heading,
              speed: location.coords.speed,
              timestamp: Date.now(),
            },
            { merge: true }
          );
        } catch (error) {
          console.error('Error guardando ubicación:', error);
        }
      }
    );

    console.log('✓ Tracking iniciado');
  } catch (error) {
    console.error('Error en tracking:', error);
    throw error;
  }
}

export function stopLocationTracking() {
  if (locationSubscription) {
    locationSubscription.remove();
    locationSubscription = null;
    console.log('✓ Tracking detenido');
  }
}

export async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') throw new Error('Permiso denegado');

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    lat: location.coords.latitude,
    lng: location.coords.longitude,
  };
}
