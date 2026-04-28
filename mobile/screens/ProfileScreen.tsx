import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { useVehicleStore } from '../store/vehicleStore';

export default function ProfileScreen() {
  const { driver, logout } = useAuthStore();
  const { vehicle } = useVehicleStore();

  const handleLogout = () => {
    logout();
    alert('Sesión cerrada');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{driver?.name?.[0]?.toUpperCase() ?? 'C'}</Text>
        </View>
        <Text style={styles.name}>{driver?.name ?? 'Conductor'}</Text>
        <Text style={styles.phone}>{driver?.phone}</Text>
      </View>

      {/* Mi vehículo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚛 Mi vehículo</Text>
        {vehicle ? (
          <View style={styles.vehicleCard}>
            <View style={styles.vehicleRow}>
              <Text style={styles.vehicleLabel}>Tipo</Text>
              <Text style={styles.vehicleValue}>
                {vehicle.type === 'general'
                  ? 'Carga general'
                  : vehicle.type === 'refrigerated'
                  ? 'Refrigerado'
                  : vehicle.type}
              </Text>
            </View>
            <View style={styles.vehicleRow}>
              <Text style={styles.vehicleLabel}>Placa</Text>
              <Text style={styles.vehicleValue}>{vehicle.plate}</Text>
            </View>
            <View style={styles.vehicleRow}>
              <Text style={styles.vehicleLabel}>Capacidad</Text>
              <Text style={styles.vehicleValue}>{vehicle.capacityTons} toneladas</Text>
            </View>
            {vehicle.isRefrigerated && (
              <View style={styles.vehicleRow}>
                <Text style={styles.vehicleLabel}>Refrigeración</Text>
                <Text style={styles.vehicleValue}>❄️ Sí</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <MaterialIcons name="info" size={24} color="#fbbf24" />
            <Text style={styles.emptyText}>Sin vehículo registrado</Text>
            <Text style={styles.emptySubtext}>
              Registra tu camión para buscar carga
            </Text>
          </View>
        )}
      </View>

      {/* Estadísticas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Estadísticas</Text>
        <View style={styles.statsGrid}>
          {[
            { label: 'Viajes', value: '0', icon: '📍' },
            { label: 'Rating', value: '—', icon: '⭐' },
            { label: 'Km totales', value: '0', icon: '🛣️' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Ayuda */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ Ayuda</Text>
        <TouchableOpacity style={styles.actionBtn}>
          <MaterialIcons name="headphones" size={20} color="#10b981" />
          <Text style={styles.actionBtnText}>Contactar soporte (WhatsApp)</Text>
        </TouchableOpacity>
      </View>

      {/* Cerrar sesión */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <MaterialIcons name="logout" size={20} color="white" />
        <Text style={styles.logoutBtnText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomColor: '#1e293b',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  phone: {
    color: '#94a3b8',
    fontSize: 13,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  vehicleCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
  },
  vehicleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomColor: '#0F172A',
    borderBottomWidth: 1,
  },
  vehicleLabel: {
    color: '#94a3b8',
    fontSize: 13,
  },
  vehicleValue: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  emptySubtext: {
    color: '#fbbf24',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 2,
  },
  actionBtn: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  actionBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoutBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
