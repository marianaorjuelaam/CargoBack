import { Menu, MapPin, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface HeaderProps {
  location: string;
  onMenuOpen: () => void;
  onProfileOpen: () => void;
}

export function Header({ location, onMenuOpen, onProfileOpen }: HeaderProps) {
  const { driver } = useAuthStore();
  const initial = driver?.name?.[0]?.toUpperCase() ?? 'C';

  return (
    <div className="relative z-20 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={onMenuOpen}
          className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 rounded-xl transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>

        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-400" />
          <span className="text-white">{location}, Colombia</span>
        </div>

        <button
          onClick={onProfileOpen}
          className="w-10 h-10 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 rounded-full transition-colors"
          aria-label="Ver perfil"
        >
          <span className="text-white font-bold text-sm">{initial}</span>
        </button>
      </div>
    </div>
  );
}
