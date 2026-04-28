import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Reemplaza con tus credenciales de Firebase
// Ve a https://console.firebase.google.com → Crear proyecto → Configuración del proyecto
const firebaseConfig = {
  apiKey: 'AIzaSyDEMO_reemplaza_con_tu_key',
  authDomain: 'cargoback-demo.firebaseapp.com',
  projectId: 'cargoback-demo',
  storageBucket: 'cargoback-demo.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef123456',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

// Para desarrollo: usa emulador local
if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  // connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
}
