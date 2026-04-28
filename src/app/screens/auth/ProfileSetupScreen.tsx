import { useState } from 'react';
import { motion } from 'motion/react';
import { useAuthStore } from '@/store/authStore';

interface ProfileSetupScreenProps {
  onNavigate: (screen: string) => void;
}

type TruckType = 'general' | 'refrigerated' | 'tanker' | 'flatbed';

const TRUCK_TYPES: Record<TruckType, { label: string; emoji: string }> = {
  general: { label: 'Carga general', emoji: '📦' },
  refrigerated: { label: 'Refrigerado', emoji: '❄️' },
  tanker: { label: 'Cisterna', emoji: '🛢️' },
  flatbed: { label: 'Plataforma', emoji: '🪵' },
};

export function ProfileSetupScreen({ onNavigate }: ProfileSetupScreenProps) {
  const { phone, saveProfile, status, error } = useAuthStore();
  const [name, setName] = useState('');
  const [truckType, setTruckType] = useState<TruckType>('general');
  const [capacity, setCapacity] = useState(10);

  const isValid = name.trim().length > 0;

  const handleSubmit = async () => {
    try {
      await saveProfile({
        name: name.trim(),
        truckType,
        capacityTons: capacity,
      });
      // Animación de success
      setTimeout(() => onNavigate('home'), 500);
    } catch {
      // Error mostrado en el store
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen w-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Ya casi terminamos 👊</h1>
        <p className="text-slate-400">Algunos datos más para personalizar tu experiencia</p>
      </div>

      {/* Contenido */}
      <div className="flex-1 flex flex-col space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-white font-semibold mb-3">¿Cómo te llaman?</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Carlos"
            autoFocus
            className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Tipo de camión */}
        <div>
          <label className="block text-white font-semibold mb-3">¿Qué tipo de camión tenés?</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(TRUCK_TYPES).map(([key, { label, emoji }]) => (
              <button
                key={key}
                onClick={() => setTruckType(key as TruckType)}
                className={`p-4 rounded-lg font-semibold transition ${
                  truckType === key
                    ? 'bg-emerald-500 text-white ring-2 ring-emerald-600'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <div className="text-2xl mb-1">{emoji}</div>
                <div className="text-sm">{label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Capacidad */}
        <div>
          <label className="block text-white font-semibold mb-3">¿Cuántas toneladas carga?</label>
          <div className="space-y-2">
            <input
              type="range"
              min="1"
              max="30"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="text-center">
              <span className="text-2xl font-bold text-emerald-400">{capacity}</span>
              <span className="text-slate-400 ml-2">ton</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-300 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Botón submit */}
      <button
        onClick={handleSubmit}
        disabled={!isValid || status === 'loading'}
        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Guardando...' : 'Empezar a buscar carga →'}
      </button>
    </motion.div>
  );
}
