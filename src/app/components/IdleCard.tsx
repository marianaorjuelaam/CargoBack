import { motion } from 'motion/react';
import { Truck, TrendingUp, AlertCircle } from 'lucide-react';
import { useVehicleStore } from '@/store/vehicleStore';
import { getEstimatedPrice } from '@/services/pricingService';

interface IdleCardProps {
  onActivate: () => void;
  onRegisterVehicle: () => void;
}

export function IdleCard({ onActivate, onRegisterVehicle }: IdleCardProps) {
  const { vehicle } = useVehicleStore();

  const estimatedPrice = vehicle
    ? getEstimatedPrice(vehicle.type, vehicle.capacityTons)
    : null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="bg-slate-900/95 backdrop-blur-xl rounded-t-[2.5rem] p-8 border-t-2 border-slate-700/50"
    >
      <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-8" />

      {/* Sin vehículo registrado */}
      {!vehicle && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-amber-300 font-medium text-sm">Sin vehículo registrado</p>
            <p className="text-amber-400/70 text-xs mt-0.5">
              Registrá tu camión para buscar carga.
            </p>
            <button
              onClick={onRegisterVehicle}
              className="mt-2 text-amber-400 text-xs font-semibold underline underline-offset-2"
            >
              Registrar ahora →
            </button>
          </div>
        </motion.div>
      )}

      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
          <Truck className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-white text-lg mb-2">Listo para encontrar carga de regreso</h3>
        <p className="text-slate-400 text-sm">
          Activa la búsqueda y te encontramos la mejor carga en tu ruta.
        </p>
      </div>

      {/* Precio estimado */}
      {estimatedPrice && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-5 bg-slate-800 rounded-2xl p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-slate-400 text-xs">Precio estimado para tu ruta</p>
            <p className="text-emerald-400 font-bold text-xl">{estimatedPrice}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-500 text-xs">{vehicle?.capacityTons} ton</p>
            <p className="text-slate-500 text-xs capitalize">{vehicle?.type}</p>
          </div>
        </motion.div>
      )}

      <button
        onClick={vehicle ? onActivate : onRegisterVehicle}
        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-500/25 text-lg"
      >
        {vehicle ? 'Activar Búsqueda' : 'Registrar mi camión primero'}
      </button>
    </motion.div>
  );
}
