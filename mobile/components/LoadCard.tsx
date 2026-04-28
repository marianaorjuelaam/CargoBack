import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { Load } from '../services/loadService';

interface LoadCardProps {
  load: Load;
  isRecommended?: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export function LoadCard({ load, isRecommended, onAccept, onReject }: LoadCardProps) {
  const [chatOpen, setChatOpen] = useState(false);

  const totalDistance = load.distanceKm + load.detourKm;
  const pricePerKm = Math.round(load.priceCOP / totalDistance);

  return (
    <>
      <View style={[styles.card, isRecommended && styles.recommendedCard]}>
        {isRecommended && (
          <View style={styles.recommendedBadge}>
            <MaterialIcons name="star" size={12} color="#fbbf24" />
            <Text style={styles.badgeText}>Recomendado</Text>
          </View>
        )}

        {/* Price Header */}
        <View style={styles.priceSection}>
          <Text style={styles.price}>${(load.priceCOP / 1_000_000).toFixed(1)}M</Text>
          <Text style={styles.pricePerKm}>${pricePerKm.toLocaleString()}/km</Text>
        </View>

        {/* Route */}
        <View style={styles.routeSection}>
          <View style={styles.routePoint}>
            <MaterialIcons name="location-on" size={16} color="#10b981" />
            <View style={styles.routeText}>
              <Text style={styles.label}>Origen</Text>
              <Text style={styles.city}>{load.origin}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.routePoint}>
            <MaterialIcons name="location-on" size={16} color="#fbbf24" />
            <View style={styles.routeText}>
              <Text style={styles.label}>Destino</Text>
              <Text style={styles.city}>{load.destination}</Text>
            </View>
          </View>
        </View>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Distancia</Text>
            <Text style={styles.detailValue}>{load.distanceKm} km</Text>
          </View>

          {load.detourKm > 0 && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Desvío</Text>
              <Text style={styles.detailValue}>+{load.detourKm} km</Text>
            </View>
          )}

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Cargo</Text>
            <Text style={styles.detailValue}>{load.cargoType}</Text>
          </View>

          <View style={styles.detailItem}>
            <MaterialIcons name="star" size={14} color="#fbbf24" />
            <Text style={styles.detailValue}>{load.clientRating}</Text>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.clientSection}>
          <MaterialIcons name="person" size={16} color="#94a3b8" />
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>{load.clientName}</Text>
            <Text style={styles.clientPickup}>{load.pickupTime}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setChatOpen(true)}
            style={styles.chatButton}
          >
            <MaterialIcons name="message" size={18} color="#10b981" />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={onReject}
          >
            <MaterialIcons name="close" size={20} color="#dc2626" />
            <Text style={styles.rejectText}>Rechazar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={onAccept}
          >
            <MaterialIcons name="check-circle" size={20} color="white" />
            <Text style={styles.acceptText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Client Chat Modal */}
      <Modal
        visible={chatOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setChatOpen(false)}
      >
        <ClientChatModal
          load={load}
          onClose={() => setChatOpen(false)}
        />
      </Modal>
    </>
  );
}

interface ClientChatModalProps {
  load: Load;
  onClose: () => void;
}

function ClientChatModal({ load, onClose }: ClientChatModalProps) {
  const [message, setMessage] = React.useState('');

  return (
    <View style={styles.chatContainer}>
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={onClose}>
          <MaterialIcons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.chatTitle}>{load.clientName}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.chatMessages}>
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>
            Hola, tengo una carga de {load.cargoType} desde {load.origin} hasta {load.destination}
          </Text>
          <Text style={styles.messageTime}>Hace 2 min</Text>
        </View>

        <View style={[styles.messageBubble, styles.myMessage]}>
          <Text style={styles.messageText}>¿A qué hora es el recogida?</Text>
          <Text style={styles.messageTime}>Ahora</Text>
        </View>

        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>
            {load.pickupTime}. ¿Puedes hacerlo?
          </Text>
          <Text style={styles.messageTime}>Hace 1 min</Text>
        </View>
      </View>

      <View style={styles.chatInput}>
        <TextInput
          style={styles.inputField}
          placeholder="Escribe tu mensaje..."
          placeholderTextColor="#64748b"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          onPress={() => {
            if (message.trim()) {
              setMessage('');
            }
          }}
          style={styles.sendBtn}
        >
          <MaterialIcons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

import { TextInput } from 'react-native';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  recommendedCard: {
    borderLeftColor: '#fbbf24',
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#fbbf24',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
    gap: 4,
  },
  badgeText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '600',
  },
  priceSection: {
    marginBottom: 12,
  },
  price: {
    color: '#10b981',
    fontSize: 24,
    fontWeight: '700',
  },
  pricePerKm: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  routeSection: {
    marginBottom: 12,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  routeText: {
    flex: 1,
  },
  label: {
    color: '#94a3b8',
    fontSize: 11,
  },
  city: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: 12,
    width: 1,
    backgroundColor: '#334155',
    marginLeft: 7,
    marginVertical: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailLabel: {
    color: '#64748b',
    fontSize: 11,
  },
  detailValue: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  clientSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    gap: 10,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  clientPickup: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  chatButton: {
    padding: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 10,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  rejectButton: {
    borderWidth: 1.5,
    borderColor: '#dc2626',
  },
  rejectText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '600',
  },
  acceptButton: {
    backgroundColor: '#10b981',
  },
  acceptText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingTop: 16,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomColor: '#1e293b',
    borderBottomWidth: 1,
  },
  chatTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  chatMessages: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 10,
    alignSelf: 'flex-start',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#10b981',
  },
  messageText: {
    color: 'white',
    fontSize: 13,
  },
  messageTime: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 4,
  },
  chatInput: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderTopColor: '#1e293b',
    borderTopWidth: 1,
  },
  inputField: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: 'white',
    fontSize: 13,
    maxHeight: 60,
  },
  sendBtn: {
    backgroundColor: '#10b981',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
