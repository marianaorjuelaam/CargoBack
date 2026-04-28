import { useEffect, useRef, useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker, Polyline } from '@react-google-maps/api';
import { CITY_COORDS } from '@/services/matchingService';

interface GoogleMapViewProps {
  driverCity: string;
  destCity?: string;
}

const DARK_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#cbd5e1' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#334155' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1e3a5f' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1d4ed8' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#60a5fa' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0c1a2e' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#1e3a5f' }] },
];

const DRIVER_SVG = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26">' +
  '<circle cx="13" cy="13" r="15" fill="#3b82f6" opacity="0.18"/>' +
  '<circle cx="13" cy="13" r="8" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2.5"/>' +
  '</svg>'
)}`;

const DEST_SVG = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22">' +
  '<circle cx="11" cy="11" r="8" fill="#fbbf24" stroke="#b45309" stroke-width="2.5"/>' +
  '</svg>'
)}`;

export function GoogleMapView({ driverCity, destCity }: GoogleMapViewProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '',
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  const driverCoords = CITY_COORDS[driverCity];
  const destCoords = destCity ? CITY_COORDS[destCity] : undefined;

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // Request a real driving route whenever origin/destination changes
  useEffect(() => {
    if (!isLoaded || !driverCoords || !destCoords) {
      setDirections(null);
      setUseFallback(false);
      return;
    }

    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: { lat: driverCoords.lat, lng: driverCoords.lng },
        destination: { lat: destCoords.lat, lng: destCoords.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
          setUseFallback(false);
        } else {
          // API key absent or quota hit — fall back to straight polyline
          setUseFallback(true);
          setDirections(null);
        }
      }
    );
  }, [isLoaded, driverCity, destCity]);

  // Fit map viewport to show driver + destination
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoaded) return;

    if (directions?.routes[0]?.bounds) {
      map.fitBounds(directions.routes[0].bounds, 80);
      return;
    }

    if (driverCoords && destCoords) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend({ lat: driverCoords.lat, lng: driverCoords.lng });
      bounds.extend({ lat: destCoords.lat, lng: destCoords.lng });
      map.fitBounds(bounds, 80);
    } else if (driverCoords) {
      map.panTo({ lat: driverCoords.lat, lng: driverCoords.lng });
      map.setZoom(7);
    }
  }, [directions, isLoaded, driverCity, destCity]);

  if (!isLoaded) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: '#0f172a' }}
      >
        <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  const driverIcon: google.maps.Icon = {
    url: DRIVER_SVG,
    scaledSize: new window.google.maps.Size(26, 26),
    anchor: new window.google.maps.Point(13, 13),
  };

  const destIcon: google.maps.Icon = {
    url: DEST_SVG,
    scaledSize: new window.google.maps.Size(22, 22),
    anchor: new window.google.maps.Point(11, 11),
  };

  return (
    <div className="absolute inset-0" style={{ isolation: 'isolate' }}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={
          driverCoords
            ? { lat: driverCoords.lat, lng: driverCoords.lng }
            : { lat: 5.5, lng: -74.5 }
        }
        zoom={6}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: DARK_MAP_STYLES,
          disableDefaultUI: true,
          gestureHandling: 'greedy',
          clickableIcons: false,
        }}
      >
        {/* Driver position — always visible */}
        {driverCoords && (
          <Marker
            position={{ lat: driverCoords.lat, lng: driverCoords.lng }}
            icon={driverIcon}
            zIndex={10}
          />
        )}

        {/* Destination marker */}
        {destCoords && (
          <Marker
            position={{ lat: destCoords.lat, lng: destCoords.lng }}
            icon={destIcon}
            zIndex={10}
          />
        )}

        {/* Real driving route from Directions API */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#10b981',
                strokeWeight: 3.5,
                strokeOpacity: 0.9,
              },
            }}
          />
        )}

        {/* Fallback straight line when Directions API is unavailable */}
        {useFallback && driverCoords && destCoords && (
          <Polyline
            path={[
              { lat: driverCoords.lat, lng: driverCoords.lng },
              { lat: destCoords.lat, lng: destCoords.lng },
            ]}
            options={{
              strokeColor: '#10b981',
              strokeWeight: 2.5,
              strokeOpacity: 0.75,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
