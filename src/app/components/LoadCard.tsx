import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MapPin, Package, TrendingUp, Sparkles } from 'lucide-react';
import type { Load } from '@/domain/types';
import { formatCOP } from '@/utils/formatters';

interface LoadCardProps {
  load: Load;
  onAccept: () => void;
  onReject: () => void;
  onTimerExpired: () => void;
}

const COUNTDOWN_SECONDS = 30;

function CountdownRing({ seconds }: { seconds: number }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - seconds / COUNTDOWN_SECONDS);
  const isUrgent = seconds <= 10;

  return (
    <div className="relative w-12 h-12 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
        <circle
          cx="20" cy="20" r={radius}
          fill="none" strokeWidth="3"
          stroke="currentColor" className="text-slate-700"
        />
        <circle
          cx="20" cy="20" r={radius}
          fill="none" strokeWidth="3" strokeLinecap="round"
          stroke="currentColor"
          className={isUrgent ? 'text-red-400' : 'text-emerald-400'}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s ease' }}
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${isUrgent ? 'text-red-400' : 'text-white'}`}>
        {seconds}
      </div>
    </div>
  );
}

export function LoadCard({ load, onAccept, onReject, onTimerExpired }: LoadCardProps) {
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const onExpiredRef = useRef(onTimerExpired);
  onExpiredRef.current = onTimerExpired;

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          onExpiredRef.current();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isUrgent = secondsLeft <= 10;

  return (
    <motion.div
      initial={{ y: 400, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-yellow-500/20 rounded-t-[2.5rem] blur-xl" />

      <div className={`relative bg-slate-900/95 backdrop-blur-xl rounded-t-[2.5rem] p-6 border-t-2 shadow-2xl transition-colors duration-300 ${isUrgent ? 'border-red-400/60' : 'border-emerald-400/30'}`}>
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4" />

        {/* Header row: label + countdown */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-slate-400 text-xs uppercase tracking-wider">Carga encontrada</div>
            {isUrgent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-xs mt-0.5 animate-pulse"
              >
                ¡Acepta antes de que expire!
              </motion.div>
            )}
          </div>
          <CountdownRing seconds={secondsLeft} />
        </div>

        {/* Route */}
        <div className="mb-5">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-slate-400 text-xs mb-0.5">Origen</div>
              <div className="text-white text-base font-medium">{load.origin}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-8 my-2">
            <div className="flex-1 h-px bg-gradient-to-r from-emerald-400 to-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-slate-400 text-xs mb-0.5">Destino</div>
              <div className="text-white text-base font-medium">{load.destination}</div>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 mb-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)]" />
          <div className="relative">
            <div className="text-emerald-100 text-xs mb-0.5">Ganancia estimada</div>
            <div className="text-white text-4xl font-light tracking-tight">{formatCOP(load.priceCOP)}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-yellow-400" />
              <div className="text-slate-400 text-xs">Desvío</div>
            </div>
            <div className="text-white text-base">
              {load.detourKm === 0 ? 'Sin desvío' : `+${load.detourKm} km`}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-emerald-400" />
              <div className="text-slate-400 text-xs">Tipo de carga</div>
            </div>
            <div className="text-white text-base">{load.cargoType}</div>
          </div>
        </div>

        {/* Smart explanation */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-3 mb-5 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-slate-300 text-sm leading-relaxed">{load.explanation}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onReject}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl transition-all active:scale-95 border border-slate-700 text-sm"
          >
            Rechazar
          </button>
          <button
            onClick={onAccept}
            className="flex-[2] bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-500/25 text-sm font-medium"
          >
            Aceptar Carga
          </button>
        </div>
      </div>
    </motion.div>
  );
}
