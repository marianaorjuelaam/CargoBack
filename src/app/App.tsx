import { useReducer, useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { AuthLayout } from './screens/auth/AuthLayout';
import { ProfileScreen } from './screens/ProfileScreen';
import { VehicleScreen } from './screens/VehicleScreen';
import { TripHistoryScreen } from './screens/TripHistoryScreen';
import { SideDrawer } from './components/SideDrawer';
import { Header } from './components/Header';
import { GoogleMapView } from './components/GoogleMapView';
import { IdleCard } from './components/IdleCard';
import { SearchingCard } from './components/SearchingCard';
import { LoadCard } from './components/LoadCard';
import { ValidatingCard } from './components/ValidatingCard';
import { ActiveTripScreen } from './components/ActiveTripScreen';
import { CompletedScreen } from './components/CompletedScreen';
import { NoMatchCard } from './components/NoMatchCard';
import { appReducer, initialState } from '@/store/appReducer';
import { findBestLoad } from '@/services/matchingService';
import { MOCK_DRIVER } from '@/data/mockLoads';

type ModalScreen = 'profile' | 'vehicle' | 'history' | null;

export default function App() {
  const { driver } = useAuthStore();
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Navegación de pantallas secundarias
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [modalScreen, setModalScreen]   = useState<ModalScreen>(null);

  // Si no está autenticado, mostrar flujo de auth
  if (!driver) {
    return (
      <>
        <AuthLayout />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  // ── Matching ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (state.status !== 'searching') return;
    const rejectedIds = state.rejectedIds;

    const timer = setTimeout(() => {
      const load = findBestLoad(MOCK_DRIVER, rejectedIds);
      if (load) {
        dispatch({ type: 'MATCH_FOUND', load, rejectedIds });
      } else {
        dispatch({ type: 'NO_MATCH_FOUND' });
      }
    }, 2500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  // ── Race-condition simulation ─────────────────────────────────────────────
  useEffect(() => {
    if (state.status !== 'validating') return;

    const timer = setTimeout(() => {
      const wasTaken = Math.random() < 0.2;
      if (wasTaken) {
        toast.error('Esta carga ya fue tomada por otro conductor', {
          description: 'Buscando otra carga disponible en tu ruta...',
          duration: 3500,
        });
        dispatch({ type: 'LOAD_TAKEN' });
      } else {
        dispatch({ type: 'CONFIRM_ACCEPT' });
      }
    }, 1500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  // ── Derived values ────────────────────────────────────────────────────────
  const headerLocation =
    state.status === 'active' || state.status === 'completed'
      ? state.load.origin
      : MOCK_DRIVER.currentCity;

  const mapDestCity =
    state.status === 'match' || state.status === 'validating'
      ? state.load.destination
      : undefined;

  // ── Modal screens (profile, vehicle, history) ─────────────────────────────
  const modalScreenNode = modalScreen === 'profile' ? (
    <ProfileScreen
      onBack={() => setModalScreen(null)}
      onNavigateVehicle={() => setModalScreen('vehicle')}
    />
  ) : modalScreen === 'vehicle' ? (
    <VehicleScreen onBack={() => setModalScreen(null)} />
  ) : modalScreen === 'history' ? (
    <TripHistoryScreen onBack={() => setModalScreen(null)} />
  ) : null;

  // ── Full-screen layouts (active / completed) ──────────────────────────────
  if (state.status === 'active') {
    return (
      <div className="h-screen w-full bg-slate-900 overflow-hidden">
        <Toaster position="top-center" richColors />
        <Header
          location={headerLocation}
          onMenuOpen={() => setDrawerOpen(true)}
          onProfileOpen={() => setModalScreen('profile')}
        />
        <SideDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onNavigate={(s) => setModalScreen(s)}
        />
        <AnimatePresence>{modalScreenNode}</AnimatePresence>
        <div className="h-[calc(100vh-64px)]">
          <ActiveTripScreen
            load={state.load}
            onComplete={() => dispatch({ type: 'COMPLETE_TRIP' })}
          />
        </div>
      </div>
    );
  }

  if (state.status === 'completed') {
    return (
      <div className="h-screen w-full bg-slate-900 overflow-hidden">
        <Toaster position="top-center" richColors />
        <CompletedScreen
          load={state.load}
          onNewSearch={() => dispatch({ type: 'SEARCH_AGAIN' })}
        />
      </div>
    );
  }

  // ── Map + bottom-sheet layout ─────────────────────────────────────────────
  return (
    <div className="h-screen w-full bg-slate-900 overflow-hidden">
      <Toaster position="top-center" richColors />

      {/* Drawer lateral */}
      <SideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={(s) => setModalScreen(s)}
      />

      {/* Pantallas secundarias (sobre todo lo demás) */}
      <AnimatePresence>{modalScreenNode}</AnimatePresence>

      <Header
        location={headerLocation}
        onMenuOpen={() => setDrawerOpen(true)}
        onProfileOpen={() => setModalScreen('profile')}
      />

      <div className="h-[calc(100vh-64px)] relative">
        <GoogleMapView
          driverCity={MOCK_DRIVER.currentCity}
          destCity={mapDestCity}
        />

        <div className="absolute inset-0 flex flex-col justify-end pointer-events-none z-10">
          <div className="pointer-events-auto">
            <AnimatePresence mode="wait">
              {state.status === 'idle' && (
                <IdleCard
                  key="idle"
                  onActivate={() => dispatch({ type: 'ACTIVATE_SEARCH' })}
                  onRegisterVehicle={() => setModalScreen('vehicle')}
                />
              )}

              {state.status === 'searching' && (
                <SearchingCard key="searching" />
              )}

              {state.status === 'match' && (
                <LoadCard
                  key={`match-${state.load.id}`}
                  load={state.load}
                  onAccept={() => dispatch({ type: 'ACCEPT_LOAD' })}
                  onReject={() => dispatch({ type: 'REJECT_LOAD' })}
                  onTimerExpired={() => dispatch({ type: 'TIMER_EXPIRED' })}
                />
              )}

              {state.status === 'validating' && (
                <ValidatingCard key="validating" load={state.load} />
              )}

              {state.status === 'no_match' && (
                <NoMatchCard
                  key="no_match"
                  onRetry={() => dispatch({ type: 'ACTIVATE_SEARCH' })}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
