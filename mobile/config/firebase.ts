import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDEMO_reemplaza_con_tu_key',
  authDomain: 'cargoback-demo.firebaseapp.com',
  projectId: 'cargoback-demo',
  storageBucket: 'cargoback-demo.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef123456',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
