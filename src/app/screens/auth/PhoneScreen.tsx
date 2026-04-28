import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface PhoneScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
}

const COUNTRY_CODES: Record<string, { code: string; flag: string; name: string }> = {
  CO: { code: '+57', flag: '🇨🇴', name: 'Colombia' },
  MX: { code: '+52', flag: '🇲🇽', name: 'México' },
  BR: { code: '+55', flag: '🇧🇷', name: 'Brasil' },
  AR: { code: '+54', flag: '🇦🇷', name: 'Argentina' },
};

export function PhoneScreen({ onNavigate, onBack }: PhoneScreenProps) {
  const { phone, sendOTP, status, error, resetError } = useAuthStore();
  const [localPhone, setLocalPhone] = useState(phone.slice(3) || ''); // Sin prefijo
  const [country, setCountry] = useState('CO');

  useEffect(() => {
    resetError();
  }, []);

  const countryData = COUNTRY_CODES[country];
  const fullPhone = countryData.code + localPhone;
  const isValidLength = localPhone.length >= 9;

  const handleSubmit = async () => {
    try {
      await sendOTP(fullPhone);
      onNavigate('otp');
    } catch {
      // Error mostrado en el store
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValidLength) handleSubmit();
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
          <h1 className="text-3xl font-bold text-white mb-3">¿Cuál es tu número de celular?</h1>
          <p className="text-slate-400">Te enviamos un código para confirmar que eres tú</p>
        </div>

        {/* Input de teléfono */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {/* Selector de país */}
            <div className="flex gap-2 flex-wrap">
              {Object.entries(COUNTRY_CODES).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => {
                    setCountry(key);
                    resetError();
                  }}
                  className={`px-3 py-2 rounded text-sm font-medium transition ${
                    country === key
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {data.flag} {key}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="flex gap-2 bg-slate-700 rounded-lg p-4">
            <span className="text-slate-300 font-semibold whitespace-nowrap">
              {countryData.code}
            </span>
            <input
              type="tel"
              value={localPhone}
              onChange={(e) => {
                setLocalPhone(e.target.value.replace(/\D/g, '').slice(0, 15));
                resetError();
              }}
              onKeyPress={handleKeyPress}
              placeholder="300 123 4567"
              autoFocus
              className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-lg"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-300 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Botón submit */}
      <button
        onClick={handleSubmit}
        disabled={!isValidLength || status === 'loading'}
        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {status === 'loading' ? 'Enviando...' : 'Recibir código →'}
      </button>

      {/* Info */}
      <p className="text-slate-400 text-xs text-center">
        Recibirás un SMS con un código de 6 dígitos
      </p>
    </motion.div>
  );
}
