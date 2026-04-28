import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLoadHistoryStore, type LoadAction } from '../store/loadHistoryStore';

export default function LoadHistoryScreen() {
  const { history, clearHistory, getStats } = useLoadHistoryStore();
  const stats = useMemo(() => getStats(), [history]);

  const acceptedLoads = history.filter((h) => h.action === 'accepted');
  const rejectedLoads = history.filter((h) => h.action === 'rejected');

  const renderLoadItem = ({ item }: { item: LoadAction }) => {
    const date = new Date(item.timestamp);
    const timeStr = date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const dateStr = date.toLocaleDateString('es-CO');

    const isAccepted = item.action === 'accepted';

    return (
      <View style={[styles.historyCard, isAccepted ? styles.acceptedCard : styles.rejectedCard]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <MaterialIcons
              name={isAccepted ? 'check-circle' : 'cancel'}
              size={20}
              color={isAccepted ? '#10b981' : '#dc2626'}
            />
            <View style={styles.cardTitle}>
              <Text style={styles.actionText}>
                {isAccepted ? 'ACEPTADA' : 'RECHAZADA'}
              </Text>
              <Text style={styles.route}>
                {item.origin} → {item.destination}
              </Text>
            </View>
          </View>
          {isAccepted && (
            <Text style={styles.price}>${(item.priceCOP / 1_000_000).toFixed(1)}M</Text>
          )}
        </View>

        <View style={styles.cardDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Cargo</Text>
            <Text style={styles.detailValue}>{item.cargoType}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Hora</Text>
            <Text style={styles.detailValue}>{timeStr}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Fecha</Text>
            <Text style={styles.detailValue}>{dateStr}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Stats Header */}
      <View style={styles.header}>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <MaterialIcons name="check-circle" size={24} color="#10b981" />
            <Text style={styles.statValue}>{stats.totalAccepted}</Text>
            <Text style={styles.statLabel}>Aceptadas</Text>
          </View>

          <View style={styles.statItem}>
            <MaterialIcons name="cancel" size={24} color="#dc2626" />
            <Text style={styles.statValue}>{stats.totalRejected}</Text>
            <Text style={styles.statLabel}>Rechazadas</Text>
          </View>

          <View style={styles.statItem}>
            <MaterialIcons name="percent" size={24} color="#fbbf24" />
            <Text style={styles.statValue}>{stats.acceptanceRate}%</Text>
            <Text style={styles.statLabel}>Tasa</Text>
          </View>

          <View style={styles.statItem}>
            <MaterialIcons name="trending-up" size={24} color="#3b82f6" />
            <Text style={styles.statValue}>
              ${(stats.totalEarnings / 1_000_000).toFixed(1)}M
            </Text>
            <Text style={styles.statLabel}>Ganancias</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabContent}>
          {/* Accepted Loads */}
          {acceptedLoads.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>
                ✅ Cargas Aceptadas ({acceptedLoads.length})
              </Text>
              <FlatList
                data={acceptedLoads}
                keyExtractor={(item) => item.loadId + item.timestamp}
                renderItem={renderLoadItem}
                scrollEnabled={false}
                style={styles.section}
              />
            </>
          )}

          {/* Rejected Loads */}
          {rejectedLoads.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>
                ❌ Cargas Rechazadas ({rejectedLoads.length})
              </Text>
              <FlatList
                data={rejectedLoads}
                keyExtractor={(item) => item.loadId + item.timestamp}
                renderItem={renderLoadItem}
                scrollEnabled={false}
                style={styles.section}
              />
            </>
          )}

          {/* Empty State */}
          {history.length === 0 && (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="history" size={48} color="#64748b" />
              <Text style={styles.emptyTitle}>Sin historial</Text>
              <Text style={styles.emptySubtext}>
                Cuando aceptes o rechaces cargas aparecerán aquí
              </Text>
            </View>
          )}

          {/* Clear History Button */}
          {history.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                clearHistory();
              }}
            >
              <MaterialIcons name="delete-outline" size={18} color="#dc2626" />
              <Text style={styles.clearText}>Limpiar historial</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    backgroundColor: '#1e293b',
    borderBottomColor: '#334155',
    borderBottomWidth: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    color: '#64748b',
    fontSize: 10,
  },
  tabsContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 16,
  },
  historyCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  acceptedCard: {
    borderLeftColor: '#10b981',
  },
  rejectedCard: {
    borderLeftColor: '#dc2626',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardTitleRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  cardTitle: {
    flex: 1,
  },
  actionText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '700',
  },
  route: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  price: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '700',
  },
  cardDetails: {
    flexDirection: 'row',
    gap: 8,
  },
  detailItem: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 8,
  },
  detailLabel: {
    color: '#64748b',
    fontSize: 10,
  },
  detailValue: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    marginTop: 8,
    textAlign: 'center',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderColor: '#dc2626',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 16,
  },
  clearText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '600',
  },
});
