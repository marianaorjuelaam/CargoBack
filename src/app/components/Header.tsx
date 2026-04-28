import { Menu, MapPin, User } from 'lucide-react';

interface HeaderProps {
  location: string;
}

export function Header({ location }: HeaderProps) {
  return (
    <div className="relative z-20 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
      <div className="flex items-center justify-between p-4">
        <button className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 rounded-xl transition-colors">
          <Menu className="w-6 h-6 text-white" />
        </button>

        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-400" />
          <span className="text-white">{location}, Colombia</span>
        </div>

        <button className="w-10 h-10 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 rounded-full transition-colors">
          <User className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
