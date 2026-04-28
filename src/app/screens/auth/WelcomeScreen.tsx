import { motion } from 'motion/react';
import { useAuthStore } from '@/store/authStore';

interface WelcomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
  const { phone, sendOTP, status, error, resetError } = useAuthStore();

  const handlePhoneAuth = () => {
    onNavigate('phone');
    resetError();
  };

  const handleGoogleAuth = () => {
    // TODO: Implementar Google Sign-In
    alert('Google Sign-In próximamente');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4"
    >
      {/* Logo */}
      <div className="mb-8 text-6xl">🚛</div>

      {/* Título */}
      <h1 className="text-3xl font-bold text-white mb-2 text-center">CargoBack</h1>

      {/* Descripción */}
      <p className="text-slate-300 text-center mb-12 max-w-xs text-lg leading-relaxed">
        Encuentra carga para tu viaje de regreso
      </p>

      {/* Botones */}
      <div className="w-full max-w-xs space-y-3 mb-8">
        {/* Teléfono */}
        <button
          onClick={handlePhoneAuth}
          disabled={status === 'loading'}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Cargando...' : 'Entrar con mi teléfono'}
        </button>

        {/* Google */}
        <button
          onClick={handleGoogleAuth}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2"
        >
          <span>G</span>
          <span>Entrar con Google</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="w-full max-w-xs bg-red-500/10 border border-red-500 text-red-300 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Términos */}
      <p className="text-slate-400 text-xs text-center">
        Al continuar aceptás nuestros{' '}
        <a href="#" className="text-emerald-400 hover:underline">
          Términos de uso
        </a>
      </p>
    </motion.div>
  );
}
