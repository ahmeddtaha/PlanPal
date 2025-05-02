import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { Calendar, Share2, Trash2 } from 'lucide-react-native';

interface TripCardProps {
  trip: {
    destination_id: string;
    start_date: string;
    end_date: string;
  };
  destination?: {
    country: string;
    image: string;
  };
  onPress: () => void;
  onShare: () => void;
  onDelete: () => void;
}

export function TripCard({
  trip,
  destination,
  onPress,
  onShare,
  onDelete,
}: TripCardProps) {
  const { width } = useWindowDimensions();
  const cardWidth = width > 768 ? (width - 64) / 2 : width - 32;

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: destination?.image }}
          style={styles.image}
        />
        
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text style={styles.destination}>
              {destination?.country || trip.destination_id}
            </Text>
            
            <View style={styles.dateContainer}>
              <Calendar size={16} color="#fff" />
              <Text style={styles.dates}>
                {new Date(trip.start_date).toLocaleDateString()} -
                {new Date(trip.end_date).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onShare}
        >
          <Share2 size={20} color="#007AFF" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={onDelete}
        >
          <Trash2 size={20} color="#DC2626" />
          <Text style={[styles.actionText, styles.deleteText]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  content: {
    padding: 16,
  },
  destination: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dates: {
    fontSize: 14,
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  deleteButton: {
    borderLeftWidth: 1,
    borderLeftColor: '#f0f0f0',
  },
  deleteText: {
    color: '#DC2626',
  },
});