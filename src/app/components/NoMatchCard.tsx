import { motion } from 'motion/react';
import { SearchX, Bell } from 'lucide-react';
import { toast } from 'sonner';

interface NoMatchCardProps {
  onRetry: () => void;
}

export function NoMatchCard({ onRetry }: NoMatchCardProps) {
  const handleNotifyMe = () => {
    toast.success('¡Listo! Te avisamos cuando haya carga en tu ruta.', {
      duration: 4000,
    });
  };

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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full mb-4">
          <SearchX className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-white text-lg mb-2">No encontramos carga</h3>
        <p className="text-slate-400 text-sm">
          No hay cargas disponibles en tu ruta en este momento.
        </p>
        <p className="text-slate-500 text-sm mt-1">
          Activa las notificaciones y te avisamos cuando aparezca una.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onRetry}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-500/25"
        >
          Intentar de nuevo
        </button>
        <button
          onClick={handleNotifyMe}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-4 rounded-2xl transition-all active:scale-95 border border-slate-700 flex items-center justify-center gap-2"
        >
          <Bell className="w-4 h-4" />
          Activar notificaciones
        </button>
      </div>
    </motion.div>
  );
}
