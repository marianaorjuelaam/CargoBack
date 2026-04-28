import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface OTPScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
}

export function OTPScreen({ onNavigate, onBack }: OTPScreenProps) {
  const { phone, verifyOTP, status, error, resetError } = useAuthStore();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(45);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus al montar
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown para reenviar
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-submit cuando se completa el código
  useEffect(() => {
    if (code.every(c => c)) {
      const fullCode = code.join('');
      handleVerify(fullCode);
    }
  }, [code]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    resetError();

    // Auto-focus al siguiente input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (fullCode: string) => {
    try {
      const { isNewUser } = await verifyOTP(fullCode);
      if (isNewUser) {
        onNavigate('profile');
      } else {
        onNavigate('home');
      }
    } catch {
      // Error mostrado en el store
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await useAuthStore.getState().sendOTP(phone);
      setCountdown(45);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch {
      // Error en el store
    }
    setIsResending(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="h-screen w-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition">
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1 flex flex-col">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-3">Revisá tu celular 📱</h1>
          <p className="text-slate-400">
            Enviamos un código al <span className="text-white font-semibold">{phone}</span>
          </p>
        </div>

        {/* OTP Boxes */}
        <div className="mb-12">
          <div className="flex gap-2 mb-4 justify-center">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleBackspace(index, e)}
                className={`w-12 h-12 text-center text-2xl font-bold rounded-lg transition ${
                  error ? 'bg-red-500/20 border-2 border-red-500' : 'bg-slate-700 border-2 border-slate-600'
                } text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-slate-700`}
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-300 text-center text-sm bg-red-500/10 p-2 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Loading */}
        {status === 'loading' && (
          <div className="text-center mb-8">
            <div className="w-6 h-6 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-slate-400 text-sm">Verificando...</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Reenviar */}
          {countdown > 0 ? (
            <p className="text-slate-400 text-center text-sm">Reenviar código ({countdown}s)</p>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="w-full text-emerald-400 hover:text-emerald-300 font-semibold transition disabled:opacity-50"
            >
              {isResending ? 'Reenviando...' : 'Reenviar código'}
            </button>
          )}

          {/* Cambiar número */}
          <button
            onClick={() => {
              resetError();
              onNavigate('phone');
            }}
            className="w-full text-slate-400 hover:text-slate-300 font-semibold transition"
          >
            Probar con otro número
          </button>
        </div>
      </div>
    </motion.div>
  );
}
