import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Load {
  id: string;
  origin: string;
  destination: string;
  priceCOP: number;
  distanceKm: number;
  detourKm: number;
  clientRating: number;
  cargoType: string;
  capacity: number;
  pickupTime: string;
  clientName: string;
  clientPhone: string;
  status?: 'available' | 'reserved' | 'completed';
  reservedBy?: string;
  reservedAt?: Timestamp;
}

const DEMO_LOADS: Load[] = [
  {
    id: 'load-1',
    origin: 'Girardot',
    destination: 'Bogotá',
    priceCOP: 1_800_000,
    distanceKm: 200,
    detourKm: 0,
    clientRating: 4.8,
    cargoType: 'Electrodomésticos',
    capacity: 12,
    pickupTime: 'Ahora',
    clientName: 'Importadora García',
    clientPhone: '+57 301 234 5678',
    status: 'available',
  },
  {
    id: 'load-2',
    origin: 'Medellín',
    destination: 'Bogotá',
    priceCOP: 2_100_000,
    distanceKm: 450,
    detourKm: 25,
    clientRating: 4.5,
    cargoType: 'Alimentos',
    capacity: 8,
    pickupTime: 'En 2 horas',
    clientName: 'Distribuidora Norte',
    clientPhone: '+57 302 345 6789',
    status: 'available',
  },
  {
    id: 'load-3',
    origin: 'Cali',
    destination: 'Bogotá',
    priceCOP: 1_500_000,
    distanceKm: 470,
    detourKm: 15,
    clientRating: 4.2,
    cargoType: 'Textiles',
    capacity: 10,
    pickupTime: 'Mañana',
    clientName: 'Textiles del Pacífico',
    clientPhone: '+57 303 456 7890',
    status: 'available',
  },
];

export function rankLoads(loads: Load[]): Load[] {
  return [...loads].sort((a, b) => {
    const efficiencyA = a.priceCOP / (a.distanceKm + a.detourKm);
    const efficiencyB = b.priceCOP / (b.distanceKm + b.detourKm);

    if (efficiencyB !== efficiencyA) {
      return efficiencyB - efficiencyA;
    }
    return b.clientRating - a.clientRating;
  });
}

// Fetch from Firestore (with fallback to demo data)
export async function getAvailableLoads(limit: number = 5): Promise<Load[]> {
  try {
    const q = query(
      collection(db, 'available_loads'),
      where('status', '==', 'available')
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      // Fallback to demo data if no Firestore data
      const shuffled = DEMO_LOADS.sort(() => Math.random() - 0.5);
      return rankLoads(shuffled.slice(0, limit));
    }

    const loads = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Load[];

    return rankLoads(loads.slice(0, limit));
  } catch (error) {
    console.error('Error fetching loads from Firestore:', error);
    // Fallback to demo on error
    const shuffled = DEMO_LOADS.sort(() => Math.random() - 0.5);
    return rankLoads(shuffled.slice(0, limit));
  }
}

// Mark load as reserved by driver
export async function acceptLoad(loadId: string, driverId: string): Promise<void> {
  try {
    const loadRef = doc(db, 'available_loads', loadId);
    await updateDoc(loadRef, {
      status: 'reserved',
      reservedBy: driverId,
      reservedAt: serverTimestamp(),
    });
    console.log(`✓ Load ${loadId} accepted by ${driverId}`);
  } catch (error) {
    console.error('Error accepting load:', error);
    throw error;
  }
}

// Mark load as rejected by driver (Firestore tracks rejections)
export async function rejectLoad(loadId: string, driverId: string): Promise<void> {
  try {
    const loadRef = doc(db, 'available_loads', loadId);
    await updateDoc(loadRef, {
      rejectedBy: driverId,
      rejectedAt: serverTimestamp(),
    });
    console.log(`✗ Load ${loadId} rejected by ${driverId}`);
  } catch (error) {
    console.error('Error rejecting load:', error);
    throw error;
  }
}

// Real-time listener for available loads
export function subscribeToAvailableLoads(
  onLoads: (loads: Load[]) => void,
  limit: number = 5
): Unsubscribe {
  const q = query(
    collection(db, 'available_loads'),
    where('status', '==', 'available')
  );

  return onSnapshot(
    q,
    (snap) => {
      const loads = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Load[];

      onLoads(rankLoads(loads.slice(0, limit)));
    },
    (error) => {
      console.error('Error subscribing to loads:', error);
      // Fallback
      const shuffled = DEMO_LOADS.sort(() => Math.random() - 0.5);
      onLoads(rankLoads(shuffled.slice(0, limit)));
    }
  );
}
