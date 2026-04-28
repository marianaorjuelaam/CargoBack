import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import type { Load } from '@/domain/types';
import { formatCOP } from '@/utils/formatters';

interface ValidatingCardProps {
  load: Load;
}

const STEPS = [
  'Contactando al cargador...',
  'Verificando disponibilidad en tiempo real...',
  'Confirmando la reserva...',
];

export function ValidatingCard({ load }: ValidatingCardProps) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-t-[2.5rem] blur-xl" />

      <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-t-[2.5rem] p-6 border-t-2 border-emerald-400/30 shadow-2xl">
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-5" />

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <div>
            <div className="text-white font-medium">Reservando tu carga</div>
            <div className="text-slate-400 text-xs">Validando disponibilidad en tiempo real</div>
          </div>
        </div>

        {/* Load summary */}
        <div className="bg-slate-800/50 rounded-2xl p-4 mb-5 border border-slate-700/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300 text-sm">
              {load.origin} → {load.destination}
            </span>
            <span className="text-emerald-400 font-medium">{formatCOP(load.priceCOP)}</span>
          </div>
          {/* Progress bar animates from 15% to 85% over 1.3s */}
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
              initial={{ width: '15%' }}
              animate={{ width: '85%' }}
              transition={{ duration: 1.3, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* Animated verification steps */}
        <div className="space-y-2.5">
          {STEPS.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.4, duration: 0.3 }}
              className="flex items-center gap-2.5"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.4 + 0.1, type: 'spring', stiffness: 400 }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"
              />
              <span className="text-slate-400 text-sm">{step}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
