import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Message {
  id: string;
  chatId: string;
  sender: 'driver' | 'client';
  message: string;
  timestamp: Timestamp | number;
}

export function subscribeToChat(tripId: string, onMessage: (msgs: Message[]) => void) {
  const q = query(
    collection(db, 'chats', tripId, 'messages'),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(
    q,
    (snap) => {
      const msgs = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Message[];
      onMessage(msgs);
    },
    (error) => console.error('Error en chat:', error)
  );
}

export async function sendMessage(
  tripId: string,
  sender: 'driver' | 'client',
  text: string
) {
  try {
    await addDoc(collection(db, 'chats', tripId, 'messages'), {
      chatId: tripId,
      sender,
      message: text,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error enviando mensaje:', error);
    throw error;
  }
}
