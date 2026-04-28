import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
  Auth,
} from 'firebase/auth';
import { auth } from '@/config/firebaseConfig';
import type { Driver } from '@/store/authStore';

interface VerifyResult {
  isNewUser: boolean;
  driver: Driver;
  token: string;
}

// Demo mode: si Firebase no funciona, usa datos simulados
const DEMO_MODE = import.meta.env.VITE_AUTH_DEMO === 'true';
let demoOTP = '123456'; // OTP para testing

export const authService = {
  /**
   * Envía OTP por SMS al teléfono
   * En demo mode: acepta cualquier número
   */
  async sendOTP(phone: string): Promise<string> {
    console.log(`[AUTH] Enviando OTP a ${phone}`);

    if (DEMO_MODE) {
      console.log(`[DEMO] OTP es: ${demoOTP}`);
      return 'demo-verification-id';
    }

    try {
      // Configurar reCAPTCHA invisible
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });

      const confirmationResult = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
      return confirmationResult.verificationId;
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.code === 'auth/invalid-phone-number') {
        throw new Error('Ese número no parece correcto. ¿Le falta algún dígito?');
      }
      if (err.code === 'auth/too-many-requests') {
        throw new Error('Muchos intentos. Esperá unos minutos antes de intentar de nuevo.');
      }
      throw new Error('No pudimos enviar el código. Revisá tu conexión a internet.');
    }
  },

  /**
   * Verifica el OTP y obtiene/crea el usuario
   */
  async verifyOTP(phone: string, code: string, verificationId: string): Promise<VerifyResult> {
    console.log(`[AUTH] Verificando OTP para ${phone}`);

    if (DEMO_MODE) {
      if (code !== demoOTP) {
        throw new Error('Ese código no es. Intentá de nuevo.');
      }
      // Simula usuario existente o nuevo
      const isNewUser = Math.random() > 0.7;
      const driver: Driver = {
        id: 'driver-demo-' + phone.replace(/\D/g, ''),
        phone,
        name: 'Carlos Demo',
        truckType: 'general',
        capacityTons: 10,
      };
      return {
        isNewUser,
        driver,
        token: 'demo-token-' + Date.now(),
      };
    }

    try {
      // Aquí iría el código real de Firebase
      // const credential = PhoneAuthProvider.credential(verificationId, code);
      // const userCredential = await signInWithCredential(auth, credential);
      throw new Error('Firebase no configurado. Usa VITE_AUTH_DEMO=true');
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.code === 'auth/invalid-verification-code') {
        throw new Error('Ese código no es. Intentá de nuevo.');
      }
      if (err.code === 'auth/code-expired') {
        throw new Error('El código venció. Te mandamos uno nuevo.');
      }
      throw error;
    }
  },

  /**
   * Guarda/actualiza perfil del conductor
   */
  async saveProfile(
    phone: string,
    data: Omit<Driver, 'id' | 'phone'>
  ): Promise<Driver> {
    console.log(`[AUTH] Guardando perfil de ${phone}`);

    if (DEMO_MODE) {
      const driver: Driver = {
        id: 'driver-' + phone.replace(/\D/g, ''),
        phone,
        ...data,
      };
      // Simula guardar en backend
      await new Promise((r) => setTimeout(r, 1000));
      return driver;
    }

    try {
      // Aquí iría el llamado a tu backend para guardar en Firestore
      // const response = await fetch('/api/driver/profile', {
      //   method: 'POST',
      //   body: JSON.stringify({ phone, ...data }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // return response.json();
      throw new Error('Backend no configurado');
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  /**
   * Cierra sesión
   */
  async logout(): Promise<void> {
    if (DEMO_MODE) return;
    await signOut(auth);
  },

  /**
   * Hook para escuchar cambios de autenticación
   */
  onAuthStateChanged(callback: (user: Driver | null) => void) {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        // Aquí parsearías los datos del usuario desde Firestore
        callback(null); // TODO: fetch driver data
      } else {
        callback(null);
      }
    });
  },
};
