import { motion } from 'motion/react';
import { CheckCircle, MapPin, DollarSign } from 'lucide-react';

interface ConfirmationScreenProps {
  origin: string;
  destination: string;
  price: string;
  onStart: () => void;
}

export function ConfirmationScreen({ origin, destination, price, onStart }: ConfirmationScreenProps) {
  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="text-center"
        >
          <div className="relative inline-flex mb-8">
            <CheckCircle className="w-24 h-24 text-emerald-400" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="absolute inset-0 bg-emerald-400/20 rounded-full blur-2xl"
            />
          </div>

          <h1 className="text-white text-3xl mb-3">¡Carga Asignada!</h1>
          <p className="text-slate-400 mb-8">Tu nueva ruta está confirmada</p>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 mb-8 text-left">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-slate-400 text-sm">Origen</div>
                <div className="text-white text-lg">{origin}</div>
              </div>
            </div>

            <div className="h-px bg-slate-700 my-4" />

            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-slate-400 text-sm">Destino</div>
                <div className="text-white text-lg">{destination}</div>
              </div>
            </div>

            <div className="h-px bg-slate-700 my-4" />

            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-slate-400 text-sm">Ganancia Total</div>
                <div className="text-white text-2xl">{price}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="p-6">
        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-500/25 text-lg"
        >
          Iniciar Viaje
        </button>
      </div>
    </div>
  );
}
