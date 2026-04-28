import { motion, AnimatePresence } from 'motion/react';
import { X, User, Truck, Clock, HeadphonesIcon, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useVehicleStore } from '@/store/vehicleStore';

type Screen = 'profile' | 'vehicle' | 'history';

interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (screen: Screen) => void;
}

const MENU_ITEMS = [
  { id: 'profile',  icon: User,            label: 'Mi perfil',          sub: 'Editar datos personales' },
  { id: 'vehicle',  icon: Truck,           label: 'Mi vehículo',        sub: 'Camión y capacidad' },
  { id: 'history',  icon: Clock,           label: 'Historial de viajes', sub: 'Ver todos los viajes' },
  { id: 'support',  icon: HeadphonesIcon,  label: 'Soporte',            sub: 'WhatsApp o llamada' },
] as const;

export function SideDrawer({ open, onClose, onNavigate }: SideDrawerProps) {
  const { driver, logout } = useAuthStore();
  const { vehicle } = useVehicleStore();

  const handleSupport = () => {
    window.open('https://wa.me/573000000000?text=Hola%20CargoBack%2C%20necesito%20ayuda', '_blank');
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-[300px] bg-slate-900 border-r border-slate-800 z-50 flex flex-col"
          >
            {/* Header del drawer */}
            <div className="p-6 border-b border-slate-800 bg-gradient-to-br from-emerald-500/10 to-slate-900">
              <div className="flex items-center justify-between mb-4">
                <span className="text-emerald-400 font-bold text-lg">CargoBack</span>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Info del conductor */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {driver?.name?.[0]?.toUpperCase() ?? 'C'}
                </div>
                <div>
                  <p className="text-white font-semibold">{driver?.name ?? 'Conductor'}</p>
                  <p className="text-slate-400 text-sm">{driver?.phone ?? ''}</p>
                  {vehicle && (
                    <p className="text-emerald-400 text-xs mt-0.5">
                      🚛 {vehicle.plate} · {vehicle.capacityTons} ton
                    </p>
                  )}
                  {!vehicle && (
                    <p className="text-amber-400 text-xs mt-0.5">⚠️ Sin vehículo registrado</p>
                  )}
                </div>
              </div>
            </div>

            {/* Menú */}
            <nav className="flex-1 py-4 overflow-y-auto">
              {MENU_ITEMS.map(({ id, icon: Icon, label, sub }) => (
                <button
                  key={id}
                  onClick={() => {
                    if (id === 'support') {
                      handleSupport();
                    } else {
                      onNavigate(id as Screen);
                      onClose();
                    }
                  }}
                  className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-800 transition group"
                >
                  <div className="w-10 h-10 bg-slate-800 group-hover:bg-emerald-500/10 rounded-xl flex items-center justify-center transition">
                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium">{label}</p>
                    <p className="text-slate-500 text-xs">{sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition" />
                </button>
              ))}
            </nav>

            {/* Cerrar sesión */}
            <div className="p-4 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition group"
              >
                <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-400 transition" />
                <span className="text-slate-400 group-hover:text-red-400 transition font-medium">
                  Cerrar sesión
                </span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
