import { motion } from 'motion/react';
import { ChevronLeft, Package, MapPin, Clock } from 'lucide-react';
import { formatCOP } from '@/utils/formatters';

interface TripHistoryScreenProps {
  onBack: () => void;
}

// Historial de demo — en producción vendría de tu backend
const DEMO_TRIPS = [
  {
    id: 't1',
    date: '24 abr 2026',
    origin: 'Buenaventura',
    destination: 'Bogotá',
    cargoType: 'Electrodomésticos',
    priceCOP: 2_200_000,
    distanceKm: 520,
    status: 'completed',
  },
  {
    id: 't2',
    date: '20 abr 2026',
    origin: 'Cali',
    destination: 'Medellín',
    cargoType: 'Textiles',
    priceCOP: 950_000,
    distanceKm: 415,
    status: 'completed',
  },
  {
    id: 't3',
    date: '15 abr 2026',
    origin: 'Cali',
    destination: 'Bogotá',
    cargoType: 'Alimentos',
    priceCOP: 1_800_000,
    distanceKm: 470,
    status: 'completed',
  },
];

export function TripHistoryScreen({ onBack }: TripHistoryScreenProps) {
  const totalEarned = DEMO_TRIPS.reduce((sum, t) => sum + t.priceCOP, 0);
  const totalKm     = DEMO_TRIPS.reduce((sum, t) => sum + t.distanceKm, 0);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-30 bg-slate-900 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-800">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-800 transition">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-semibold text-lg flex-1">Historial de viajes</h1>
        <Clock className="w-5 h-5 text-slate-400" />
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
          <p className="text-slate-400 text-xs mb-1">Total ganado</p>
          <p className="text-emerald-400 font-bold text-xl">{formatCOP(totalEarned)}</p>
        </div>
        <div className="bg-slate-800 rounded-2xl p-4">
          <p className="text-slate-400 text-xs mb-1">Km recorridos</p>
          <p className="text-white font-bold text-xl">{totalKm.toLocaleString()}</p>
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {DEMO_TRIPS.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <Package className="w-10 h-10 text-slate-600 mb-3" />
            <p className="text-slate-400">Todavía no hiciste ningún viaje</p>
            <p className="text-slate-500 text-sm mt-1">Activá la búsqueda y aceptá tu primera carga</p>
          </div>
        ) : (
          DEMO_TRIPS.map((trip) => (
            <div key={trip.id} className="bg-slate-800 rounded-2xl p-4">
              {/* Ruta */}
              <div className="flex items-start gap-3 mb-3">
                <div className="flex flex-col items-center gap-1 mt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                  <div className="w-0.5 h-6 bg-slate-600" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{trip.origin}</p>
                  <p className="text-slate-400 text-sm mt-3">{trip.destination}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-semibold">{formatCOP(trip.priceCOP)}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{trip.distanceKm} km</p>
                </div>
              </div>

              {/* Detalles */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-700">
                <span className="flex items-center gap-1 text-slate-400 text-xs">
                  <Package className="w-3.5 h-3.5" />
                  {trip.cargoType}
                </span>
                <span className="flex items-center gap-1 text-slate-400 text-xs">
                  <MapPin className="w-3.5 h-3.5" />
                  {trip.distanceKm} km
                </span>
                <span className="ml-auto text-slate-500 text-xs">{trip.date}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
