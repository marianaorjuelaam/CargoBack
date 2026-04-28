import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ScrollView,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { startLocationTracking, stopLocationTracking } from '../services/locationService';
import { subscribeToChat, sendMessage, Message } from '../services/chatService';
import { useAuthStore } from '../store/authStore';

const DEMO_TRIP = {
  id: 'trip-123',
  origin: { lat: 3.88, lng: -77.03 },
  destination: { lat: 4.71, lng: -74.07 },
  cargoType: 'Electrodomésticos',
  distanceKm: 520,
  status: 'active',
};

const QUICK_REPLIES = [
  '🚛 Voy en camino',
  '📍 Llegué al punto',
  '❓ ¿Dónde descargo?',
  '✅ Completé entrega',
];

export default function ActiveTripScreen() {
  const { driver } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [tripActive, setTripActive] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToChat(DEMO_TRIP.id, (msgs) => {
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  const handleStartTrip = async () => {
    try {
      await startLocationTracking(driver?.id ?? 'driver-demo', DEMO_TRIP.id);
      setTripActive(true);
      await sendMessage(DEMO_TRIP.id, 'driver', '🚛 Iniciando viaje...');
    } catch (error) {
      alert('Error: ' + (error instanceof Error ? error.message : 'Desconocido'));
    }
  };

  const handleEndTrip = () => {
    stopLocationTracking();
    setTripActive(false);
    sendMessage(DEMO_TRIP.id, 'driver', '✅ Viaje completado');
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    try {
      await sendMessage(DEMO_TRIP.id, 'driver', input);
      setInput('');
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  };

  if (!tripActive) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="info" size={48} color="#64748b" />
        <Text style={styles.emptyTitle}>Sin viaje activo</Text>
        <Text style={styles.emptyText}>
          Busca y acepta una carga para activar el tracking y chat
        </Text>
        <TouchableOpacity style={styles.startBtn} onPress={handleStartTrip}>
          <Text style={styles.startBtnText}>Simular viaje para demo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={80}
    >
      {/* Mapa */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: (DEMO_TRIP.origin.lat + DEMO_TRIP.destination.lat) / 2,
            longitude: (DEMO_TRIP.origin.lng + DEMO_TRIP.destination.lng) / 2,
            latitudeDelta: 4,
            longitudeDelta: 4,
          }}
        >
          <Marker coordinate={DEMO_TRIP.origin} title="Origen" pinColor="blue" />
          <Marker coordinate={DEMO_TRIP.destination} title="Destino" pinColor="#10b981" />
          <Polyline
            coordinates={[DEMO_TRIP.origin, DEMO_TRIP.destination]}
            strokeColor="#10b981"
            strokeWidth={3}
          />
        </MapView>

        {/* Info overlay */}
        <View style={styles.infoOverlay}>
          <MaterialIcons name="navigation" size={20} color="#10b981" />
          <Text style={styles.distanceText}>{DEMO_TRIP.distanceKm} km</Text>
        </View>
      </View>

      {/* Chat */}
      <View style={styles.chatContainer}>
        <Text style={styles.chatTitle}>💬 Chat con cliente</Text>

        {/* Mensajes */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === 'driver' ? styles.myBubble : styles.theirBubble,
              ]}
            >
              <Text style={styles.messageText}>{item.message}</Text>
            </View>
          )}
          scrollEnabled
          nestedScrollEnabled
          style={{ maxHeight: 200 }}
          ListEmptyComponent={
            <Text style={styles.emptyChat}>Inicia una conversación...</Text>
          }
        />

        {/* Respuestas rápidas */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickReplies}>
          {QUICK_REPLIES.map((reply) => (
            <TouchableOpacity
              key={reply}
              style={styles.quickReplyBtn}
              onPress={() => {
                setInput(reply);
              }}
            >
              <Text style={styles.quickReplyText}>{reply}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Escribí un mensaje..."
            placeholderTextColor="#64748b"
            style={styles.textInput}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && { opacity: 0.5 }]}
            onPress={handleSendMessage}
            disabled={!input.trim()}
          >
            <MaterialIcons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Control buttons */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.btn, styles.endBtn]}
          onPress={handleEndTrip}
        >
          <MaterialIcons name="stop-circle" size={20} color="white" />
          <Text style={styles.btnText}>Finalizar viaje</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  startBtn: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  startBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  mapContainer: {
    height: 200,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  distanceText: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '600',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chatTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  messageBubble: {
    marginVertical: 4,
    maxWidth: '80%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  myBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#10b981',
  },
  theirBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#1e293b',
  },
  messageText: {
    color: 'white',
    fontSize: 13,
  },
  emptyChat: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 20,
  },
  quickReplies: {
    marginVertical: 8,
    maxHeight: 50,
  },
  quickReplyBtn: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 6,
  },
  quickReplyText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  textInput: {
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
    borderRadius: 8,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  endBtn: {
    backgroundColor: '#dc2626',
  },
  btnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
