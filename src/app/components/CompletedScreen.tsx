import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Star } from 'lucide-react';
import type { Load } from '@/domain/types';
import { formatCOP } from '@/utils/formatters';

interface CompletedScreenProps {
  load: Load;
  onNewSearch: () => void;
}

export function CompletedScreen({ load, onNewSearch }: CompletedScreenProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleRate = (star: number) => {
    setRating(star);
    setSubmitted(true);
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="relative mb-6"
      >
        <CheckCircle2 className="w-24 h-24 text-emerald-400" />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ delay: 0.3, duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
          className="absolute inset-0 bg-emerald-400/20 rounded-full blur-3xl"
        />
      </motion.div>

      <h1 className="text-white text-3xl mb-1">¡Viaje Completado!</h1>
      <p className="text-slate-400 mb-6">
        {load.origin} → {load.destination}
      </p>

      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 mb-6 w-full max-w-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)]" />
        <div className="relative text-center">
          <div className="text-emerald-100 text-sm mb-1">Ganancia Total</div>
          <div className="text-white text-5xl font-light mb-1">{formatCOP(load.priceCOP)}</div>
          <div className="text-emerald-100 text-sm">Agregado a tus ganancias</div>
        </div>
      </div>

      {/* Interactive rating */}
      <div className="mb-8 text-center">
        {submitted ? (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-slate-300 text-sm"
          >
            {rating >= 4 ? '¡Gracias! Nos alegra que haya salido bien.' : 'Gracias por tu calificación.'}
          </motion.p>
        ) : (
          <>
            <p className="text-slate-400 text-sm mb-3">¿Cómo fue el cargador?</p>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3 + star * 0.08, type: 'spring' }}
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    className={`w-9 h-9 transition-colors duration-150 ${
                      star <= (hovered || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-slate-600'
                    }`}
                  />
                </motion.button>
              ))}
            </div>
          </>
        )}
      </div>

      <button
        onClick={onNewSearch}
        className="w-full max-w-sm bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-500/25 text-lg"
      >
        Buscar Nueva Carga
      </button>
    </div>
  );
}
