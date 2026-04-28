import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Truck, Check } from 'lucide-react';
import { useVehicleStore, type Vehicle } from '@/store/vehicleStore';
import type { TruckType } from '@/domain/types';

interface VehicleScreenProps {
  onBack: () => void;
}

const TRUCK_TYPES: { type: TruckType; label: string; emoji: string; desc: string }[] = [
  { type: 'general',      label: 'Carga general',  emoji: '📦', desc: 'Todo tipo de carga seca' },
  { type: 'refrigerated', label: 'Refrigerado',    emoji: '❄️', desc: 'Alimentos, medicamentos' },
  { type: 'flatbed',      label: 'Plataforma',     emoji: '🪵', desc: 'Madera, maquinaria' },
  { type: 'tanker',       label: 'Cisterna',       emoji: '🛢️', desc: 'Líquidos, combustible' },
];

export function VehicleScreen({ onBack }: VehicleScreenProps) {
  const { vehicle, saveVehicle } = useVehicleStore();

  const [type, setType]           = useState<TruckType>(vehicle?.type ?? 'general');
  const [capacity, setCapacity]   = useState(vehicle?.capacityTons ?? 10);
  const [plate, setPlate]         = useState(vehicle?.plate ?? '');
  const [isRefrig, setIsRefrig]   = useState(vehicle?.isRefrigerated ?? false);
  const [saved, setSaved]         = useState(false);
  const [plateError, setPlateError] = useState('');

  const validatePlate = (value: string) => {
    const normalized = value.toUpperCase().trim();
    // Formato Colombia: ABC123 o ABC-123
    const valid = /^[A-Z]{3}-?\d{3}$/.test(normalized);
    setPlateError(valid || !normalized ? '' : 'Formato: ABC123');
    return valid;
  };

  const handleSave = () => {
    if (!plate.trim()) {
      setPlateError('Ingresá la placa del camión');
      return;
    }
    if (!validatePlate(plate)) return;

    const newVehicle: Vehicle = {
      type,
      capacityTons: capacity,
      plate: plate.toUpperCase().replace('-', ''),
      isRefrigerated: type === 'refrigerated' ? true : isRefrig,
    };
    saveVehicle(newVehicle);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onBack();
    }, 1200);
  };

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
        <div className="flex-1">
          <h1 className="text-white font-semibold text-lg">Mi vehículo</h1>
          {vehicle && <p className="text-slate-400 text-xs">Guardado · {vehicle.plate}</p>}
        </div>
        <Truck className="w-5 h-5 text-emerald-400" />
      </div>

      {/* Formulario */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">

        {/* Tipo de camión */}
        <div>
          <label className="text-slate-300 text-sm font-medium mb-3 block">
            Tipo de camión
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TRUCK_TYPES.map(({ type: t, label, emoji, desc }) => (
              <button
                key={t}
                onClick={() => {
                  setType(t);
                  if (t === 'refrigerated') setIsRefrig(true);
                  else setIsRefrig(false);
                }}
                className={`p-3 rounded-xl border-2 text-left transition ${
                  type === t
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="text-2xl mb-1">{emoji}</div>
                <div className="text-white text-sm font-medium">{label}</div>
                <div className="text-slate-500 text-xs mt-0.5">{desc}</div>
                {type === t && (
                  <div className="flex justify-end mt-1">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Capacidad */}
        <div>
          <label className="text-slate-300 text-sm font-medium mb-1 block">
            Capacidad de carga
          </label>
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-sm">1 ton</span>
              <div className="text-center">
                <span className="text-3xl font-bold text-emerald-400">{capacity}</span>
                <span className="text-slate-400 text-sm ml-1">toneladas</span>
              </div>
              <span className="text-slate-400 text-sm">30 ton</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>

        {/* Placa */}
        <div>
          <label className="text-slate-300 text-sm font-medium mb-1 block">
            Placa del vehículo
          </label>
          <input
            type="text"
            value={plate}
            onChange={(e) => {
              const val = e.target.value.toUpperCase().slice(0, 7);
              setPlate(val);
              if (val.length >= 6) validatePlate(val);
              else setPlateError('');
            }}
            placeholder="ABC123"
            maxLength={7}
            className={`w-full bg-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition ${
              plateError ? 'ring-2 ring-red-500' : 'focus:ring-emerald-500'
            }`}
          />
          {plateError && (
            <p className="text-red-400 text-xs mt-1 px-1">{plateError}</p>
          )}
        </div>

        {/* Refrigerado (solo si no es ya refrigerated) */}
        {type !== 'refrigerated' && (
          <div className="bg-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">¿Tiene sistema de frío?</p>
              <p className="text-slate-400 text-sm">Refrigeración adicional</p>
            </div>
            <button
              onClick={() => setIsRefrig(!isRefrig)}
              className={`w-14 h-7 rounded-full transition-colors relative ${
                isRefrig ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  isRefrig ? 'translate-x-7' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Botón guardar */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleSave}
          disabled={saved}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all active:scale-95 ${
            saved
              ? 'bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25'
          }`}
        >
          {saved ? '✓ Vehículo guardado' : 'Guardar vehículo'}
        </button>
      </div>
    </motion.div>
  );
}
