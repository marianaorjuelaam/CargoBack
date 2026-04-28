import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, User, Phone, Truck, Edit2, Check } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useVehicleStore } from '@/store/vehicleStore';

interface ProfileScreenProps {
  onBack: () => void;
  onNavigateVehicle: () => void;
}

const TRUCK_LABELS: Record<string, string> = {
  general:      'Carga general',
  refrigerated: 'Refrigerado',
  flatbed:      'Plataforma',
  tanker:       'Cisterna',
};

export function ProfileScreen({ onBack, onNavigateVehicle }: ProfileScreenProps) {
  const { driver, saveProfile } = useAuthStore();
  const { vehicle } = useVehicleStore();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(driver?.name ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await saveProfile({
        name: name.trim(),
        truckType: driver?.truckType ?? 'general',
        capacityTons: driver?.capacityTons ?? 10,
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
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
        <h1 className="text-white font-semibold text-lg flex-1">Mi perfil</h1>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
          >
            <Edit2 className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Editar</span>
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition disabled:opacity-50"
          >
            <Check className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">{saving ? 'Guardando...' : 'Guardar'}</span>
          </button>
        )}
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Avatar */}
        <div className="flex flex-col items-center py-6">
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-4xl mb-3">
            {driver?.name?.[0]?.toUpperCase() ?? 'C'}
          </div>
          <p className="text-white font-semibold text-xl">{driver?.name ?? 'Conductor'}</p>
          <span className="mt-1 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20">
            🚛 Camionero verificado
          </span>
        </div>

        {/* Campos */}
        <div className="space-y-3">
          {/* Nombre */}
          <div className="bg-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-1">
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 text-xs uppercase tracking-wide">Nombre</span>
            </div>
            {editing ? (
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            ) : (
              <p className="text-white font-medium pl-7">{driver?.name ?? '—'}</p>
            )}
          </div>

          {/* Teléfono */}
          <div className="bg-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-1">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 text-xs uppercase tracking-wide">Teléfono</span>
            </div>
            <p className="text-white font-medium pl-7">{driver?.phone ?? '—'}</p>
            <p className="text-slate-500 text-xs pl-7 mt-0.5">Verificado vía SMS</p>
          </div>

          {/* Tipo de usuario */}
          <div className="bg-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-1">
              <Truck className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 text-xs uppercase tracking-wide">Tipo de usuario</span>
            </div>
            <p className="text-white font-medium pl-7">Camionero independiente</p>
          </div>
        </div>

        {/* Mi vehículo - acceso directo */}
        <div className="mt-4">
          <h2 className="text-slate-400 text-xs uppercase tracking-wide mb-3 px-1">Mi vehículo</h2>
          {vehicle ? (
            <button
              onClick={onNavigateVehicle}
              className="w-full bg-slate-800 hover:bg-slate-700 rounded-2xl p-4 text-left transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">
                    {TRUCK_LABELS[vehicle.type]} · {vehicle.plate}
                  </p>
                  <p className="text-slate-400 text-sm">
                    {vehicle.capacityTons} toneladas
                    {vehicle.isRefrigerated && ' · ❄️ Refrigerado'}
                  </p>
                </div>
                <ChevronLeft className="w-5 h-5 text-slate-600 rotate-180" />
              </div>
            </button>
          ) : (
            <button
              onClick={onNavigateVehicle}
              className="w-full border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-2xl p-4 text-center transition"
            >
              <p className="text-emerald-400 font-medium">+ Registrar mi vehículo</p>
              <p className="text-slate-500 text-sm mt-0.5">Necesario para buscar carga</p>
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-2">
          {[
            { label: 'Viajes', value: '0' },
            { label: 'Rating', value: '—' },
            { label: 'Km totales', value: '0' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-800 rounded-xl p-3 text-center">
              <p className="text-white font-bold text-xl">{value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
