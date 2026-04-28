import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LoadCard } from '../components/LoadCard';
import {
  getAvailableLoads,
  acceptLoad,
  rejectLoad,
  rankLoads,
  subscribeToAvailableLoads,
  type Load,
} from '../services/loadService';
import {
  playNewLoadNotification,
  playSuccessSound,
  playErrorSound,
  initializeAudio,
} from '../services/notificationService';
import { useAuthStore } from '../store/authStore';
import { useLoadHistoryStore } from '../store/loadHistoryStore';

export default function LoadSelectionScreen() {
  const { driver } = useAuthStore();
  const { addAction } = useLoadHistoryStore();
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const isFirstLoad = useRef(true);
  const prevLoadIds = useRef<Set<string>>(new Set());

  // Initialize audio on mount
  useEffect(() => {
    initializeAudio();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToAvailableLoads((newLoads) => {
      setLoads(newLoads);
      setLoading(false);

      // Solo suena si llegaron cargas NUEVAS (no en la carga inicial)
      if (!isFirstLoad.current) {
        const hasNewLoad = newLoads.some((l) => !prevLoadIds.current.has(l.id));
        if (hasNewLoad) {
          playNewLoadNotification();
        }
      }

      isFirstLoad.current = false;
      prevLoadIds.current = new Set(newLoads.map((l) => l.id));
    });

    return () => unsubscribe();
  }, []);

  const loadMoreLoads = async () => {
    setLoading(true);
    try {
      const newLoads = await getAvailableLoads(5);
      setLoads(newLoads);
    } catch (error) {
      console.error('Error loading loads:', error);
      playErrorSound();
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (load: Load) => {
    try {
      await acceptLoad(load.id, driver?.id ?? 'driver-demo');
      playSuccessSound();

      // Record in history
      addAction({
        loadId: load.id,
        origin: load.origin,
        destination: load.destination,
        priceCOP: load.priceCOP,
        action: 'accepted',
        timestamp: Date.now(),
        cargoType: load.cargoType,
      });

      setSelectedLoad(load);
      // Remove accepted load and show next ones
      setLoads((prev) => prev.filter((l) => l.id !== load.id));
    } catch (error) {
      console.error('Error accepting load:', error);
      playErrorSound();
    }
  };

  const handleReject = async (load: Load) => {
    try {
      await rejectLoad(load.id, driver?.id ?? 'driver-demo');

      // Record in history
      addAction({
        loadId: load.id,
        origin: load.origin,
        destination: load.destination,
        priceCOP: load.priceCOP,
        action: 'rejected',
        timestamp: Date.now(),
        cargoType: load.cargoType,
      });

      const remaining = loads.filter((l) => l.id !== load.id);
      setLoads(remaining);

      // Load new pedido if needed
      if (remaining.length < 2) {
        const newLoads = await getAvailableLoads(2);
        setLoads((prev) => {
          const combined = [...prev, ...newLoads];
          const uniqueLoads = Array.from(
            new Map(combined.map((l) => [l.id, l])).values()
          );
          return rankLoads(uniqueLoads);
        });
      }
    } catch (error) {
      console.error('Error rejecting load:', error);
      playErrorSound();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMoreLoads();
    setRefreshing(false);
  };

  if (loading && loads.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Buscando cargas...</Text>
      </View>
    );
  }

  if (loads.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <MaterialIcons name="inbox" size={48} color="#64748b" />
        <Text style={styles.emptyTitle}>No hay cargas disponibles</Text>
        <Text style={styles.emptySubtext}>
          Vuelve a intentar en unos minutos
        </Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadMoreLoads}>
          <MaterialIcons name="refresh" size={20} color="white" />
          <Text style={styles.refreshText}>Actualizar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>👋 Hola {driver?.name?.split(' ')[0]}</Text>
          <Text style={styles.subtitle}>
            {loads.length} carga{loads.length !== 1 ? 's' : ''} disponible{loads.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity onPress={loadMoreLoads}>
          <MaterialIcons name="refresh" size={24} color="#10b981" />
        </TouchableOpacity>
      </View>

      {/* Loads List */}
      <FlatList
        data={loads}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <LoadCard
            load={item}
            isRecommended={index === 0}
            onAccept={() => handleAccept(item)}
            onReject={() => handleReject(item)}
          />
        )}
        scrollEnabled
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#10b981"
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Quick Tips */}
      {loads.length > 0 && (
        <View style={styles.tipBox}>
          <MaterialIcons name="lightbulb" size={16} color="#fbbf24" />
          <Text style={styles.tipText}>
            El primer pedido es el más rentable para tu ruta
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomColor: '#1e293b',
    borderBottomWidth: 1,
  },
  greeting: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
  },
  listContent: {
    paddingVertical: 12,
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 12,
  },
  emptyTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    backgroundColor: '#10b981',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 20,
    gap: 8,
    alignItems: 'center',
  },
  refreshText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  tipBox: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#854d0e',
    borderRadius: 10,
    padding: 12,
    gap: 10,
    alignItems: 'center',
  },
  tipText: {
    color: '#fbbf24',
    fontSize: 12,
    flex: 1,
  },
});
