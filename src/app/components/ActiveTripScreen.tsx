import { MapPin, Navigation } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GoogleMapView } from './GoogleMapView';
import type { Load } from '@/domain/types';
import { formatCOP } from '@/utils/formatters';
import { subscribeToDrivingRoute, type DriverLocation } from '@/services/trackingService';

interface ActiveTripScreenProps {
  load: Load;
  driverId?: string;
  tripId?: string;
  onComplete: () => void;
}

export function ActiveTripScreen({ load, driverId, tripId, onComplete }: ActiveTripScreenProps) {
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null);
  const [routeHistory, setRouteHistory] = useState<DriverLocation[]>([]);

  useEffect(() => {
    if (!tripId) return;

    const unsubscribe = subscribeToDrivingRoute(tripId, (locations) => {
      setRouteHistory(locations);
      if (locations.length > 0) {
        const latest = locations[locations.length - 1];
        setDriverLocation(latest);
      }
    });

    return () => unsubscribe();
  }, [tripId]);

  return (
    <div className="h-full flex flex-col relative">
      {/* Real map showing the active route with live driver position */}
      <GoogleMapView
        driverCity={load.origin}
        destCity={load.destination}
        liveLocation={driverLocation}
        routeHistory={routeHistory}
      />

      {/* Content overlay — z-10 sits above Leaflet's stacking context */}
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="p-4">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-4 border border-emerald-400/30">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <div>
                <div className="text-emerald-400 text-sm">Viaje en Curso</div>
                <div className="text-white text-lg">En camino a {load.destination}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <div className="p-6 bg-slate-900/95 backdrop-blur-xl border-t-2 border-emerald-400/30">
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <div className="flex-1">
                <div className="text-slate-400 text-sm">Desde</div>
                <div className="text-white font-medium">{load.origin}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Navigation className="w-5 h-5 text-yellow-400" />
              <div className="flex-1">
                <div className="text-slate-400 text-sm">Hasta</div>
                <div className="text-white font-medium">{load.destination}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-400/20 rounded-xl p-4 mb-6">
            <div className="text-slate-400 text-sm mb-1">Ganancia del viaje</div>
            <div className="text-white text-3xl font-light">{formatCOP(load.priceCOP)}</div>
          </div>

          <button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-500/25 text-lg"
          >
            Finalizar Viaje
          </button>
        </div>
      </div>
    </div>
  );
}
