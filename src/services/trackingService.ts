import { collection, query, where, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';

export interface DriverLocation {
  userId: string;
  tripId: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  timestamp: number;
  id?: string;
}

export function subscribeToDriverLocation(
  driverId: string,
  onLocation: (location: DriverLocation | null) => void
): Unsubscribe {
  const q = query(
    collection(db, 'driver_locations'),
    where('userId', '==', driverId)
  );

  return onSnapshot(
    q,
    (snap) => {
      if (!snap.empty) {
        const doc = snap.docs[0];
        onLocation({
          id: doc.id,
          ...doc.data(),
        } as DriverLocation);
      } else {
        onLocation(null);
      }
    },
    (error) => {
      console.error('Error subscribing to driver location:', error);
      onLocation(null);
    }
  );
}

export function subscribeToDrivingRoute(
  tripId: string,
  onLocations: (locations: DriverLocation[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'driver_locations'),
    where('tripId', '==', tripId)
  );

  return onSnapshot(
    q,
    (snap) => {
      const locations = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DriverLocation[];
      onLocations(locations);
    },
    (error) => {
      console.error('Error subscribing to trip route:', error);
      onLocations([]);
    }
  );
}
