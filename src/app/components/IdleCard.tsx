import { motion } from 'motion/react';
import { Truck } from 'lucide-react';

interface IdleCardProps {
  onActivate: () => void;
}

export function IdleCard({ onActivate }: IdleCardProps) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="bg-slate-900/95 backdrop-blur-xl rounded-t-[2.5rem] p-8 border-t-2 border-slate-700/50"
    >
      <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-8" />

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
          <Truck className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-white text-lg mb-2">Listo para encontrar carga de regreso</h3>
        <p className="text-slate-400 text-sm">
          Activa la búsqueda y te encontramos la mejor carga en tu ruta.
        </p>
      </div>

      <button
        onClick={onActivate}
        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-500/25 text-lg"
      >
        Activar Búsqueda
      </button>
    </motion.div>
  );
}
