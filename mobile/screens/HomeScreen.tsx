import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { useVehicleStore } from '../store/vehicleStore';

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0c1a2e' }] },
];

const DEMO_LOADS = [
  {
    id: 'load-1',
    origin: 'Buenaventura',
    destination: 'Bogotá',
    cargoType: 'Electrodomésticos',
    priceCOP: 2_200_000,
    distanceKm: 520,
    detourKm: 0,
  },
  {
    id: 'load-2',
    origin: 'Cali',
    destination: 'Bogotá',
    cargoType: 'Alimentos',
    priceCOP: 1_800_000,
    distanceKm: 470,
    detourKm: 8,
  },
];

export default function HomeScreen() {
  const { driver } = useAuthStore();
  const { vehicle } = useVehicleStore();
  const [searching, setSearching] = useState(false);
  const [availableLoads, setAvailableLoads] = useState(DEMO_LOADS);

  const handleActivateSearch = () => {
    if (!vehicle) {
      alert('⚠️ Registra tu camión primero en Perfil');
      return;
    }

    setSearching(true);
    // Simula búsqueda
    setTimeout(() => {
      setSearching(false);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      {/* Mapa de fondo */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 3.88,
          longitude: -77.03,
          latitudeDelta: 8,
          longitudeDelta: 8,
        }}
        customMapStyle={DARK_MAP_STYLE}
      >
        <Marker
          coordinate={{ latitude: 3.88, longitude: -77.03 }}
          title={driver?.name ?? 'Mi ubicación'}
          pinColor="#10b981"
        />
      </MapView>

      {/* Bottom Card */}
      <View style={styles.card}>
        <View style={styles.handle} />

        {!vehicle ? (
          <View style={styles.warningBox}>
            <MaterialIcons name="warning" size={20} color="#fbbf24" />
            <Text style={styles.warningText}>Sin vehículo registrado</Text>
            <Text style={styles.warningSubtext}>
              Registra tu camión para buscar carga
            </Text>
          </View>
        ) : (
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleLabel}>
              {vehicle.type === 'general'
                ? '📦 Carga general'
                : vehicle.type === 'refrigerated'
                ? '❄️ Refrigerado'
                : '🚛 ' + vehicle.type}
            </Text>
            <Text style={styles.vehicleDetail}>
              {vehicle.capacityTons} ton · {vehicle.plate}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.searchBtn,
            !vehicle && { backgroundColor: '#64748b' },
            searching && { opacity: 0.6 },
          ]}
          onPress={handleActivateSearch}
          disabled={!vehicle || searching}
        >
          {searching ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <MaterialIcons name="search" size={20} color="white" />
              <Text style={styles.searchBtnText}>
                {vehicle ? 'Buscar Carga' : 'Registra vehículo primero'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Cargas disponibles */}
        {availableLoads.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Cargas disponibles para tu ruta</Text>
            <FlatList
              data={availableLoads}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.loadCard}>
                  <View style={styles.loadRoute}>
                    <Text style={styles.loadCity}>{item.origin}</Text>
                    <View style={styles.loadDivider} />
                    <Text style={styles.loadCity}>{item.destination}</Text>
                  </View>
                  <View style={styles.loadDetails}>
                    <Text style={styles.loadPrice}>${(item.priceCOP / 1_000_000).toFixed(1)}M</Text>
                    <Text style={styles.loadMeta}>
                      {item.distanceKm} km {item.detourKm > 0 && `(+${item.detourKm} km)`}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  map: {
    flex: 1,
  },
  card: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  handle: {
    width: 48,
    height: 4,
    backgroundColor: '#475569',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  warningBox: {
    backgroundColor: '#854d0e',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningText: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  warningSubtext: {
    color: '#fbbf24',
    fontSize: 12,
    opacity: 0.8,
  },
  vehicleInfo: {
    marginBottom: 12,
  },
  vehicleLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  vehicleDetail: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  searchBtn: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  searchBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  loadCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loadRoute: {
    flex: 1,
  },
  loadCity: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  loadDivider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 4,
  },
  loadDetails: {
    alignItems: 'flex-end',
  },
  loadPrice: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '700',
  },
  loadMeta: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
});
