import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Share,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import {
  Trash2,
  Share2,
  ChevronLeft,
  Copy,
  MessageCircle,
  Download,
} from 'lucide-react-native';
import { destinations } from '../../constants/destinations';
import { DeleteConfirmationDialog } from '../../components/DeleteConfirmationDialog';

interface Trip {
  id: string;
  destination_id: string;
  start_date: string;
  end_date: string;
  privacy_type: string;
  trip_type: string;
  itinerary?: {
    id: string;
    content: any;
  };
}

export default function TripsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const loadTrips = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: tripsError } = await supabase
        .from('trips')
        .select(`
          id,
          destination_id,
          start_date,
          end_date,
          privacy_type,
          trip_type,
          itineraries (
            id,
            content
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (tripsError) throw tripsError;
      setTrips(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleDeleteTrip = async (tripId: string) => {
    setTripToDelete(tripId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!tripToDelete) return;

    try {
      const { error: deleteError } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripToDelete);

      if (deleteError) throw deleteError;
      setTrips(trips.filter(trip => trip.id !== tripToDelete));
      setShowDeleteDialog(false);
      setTripToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete trip');
    }
  };

  const handleShare = async (trip: Trip) => {
    const destination = destinations.find(d => d.country === trip.destination_id);
    const tripDates = `${new Date(trip.start_date).toLocaleDateString()} - ${new Date(trip.end_date).toLocaleDateString()}`;
    const shareUrl = `https://your-app-domain.com/trips/${trip.id}`;

    const shareOptions = [
      {
        label: 'Copy Link',
        icon: <Copy size={24} color="#333" />,
        onPress: async () => {
          await navigator.clipboard.writeText(shareUrl);
          Alert.alert('Success', 'Link copied to clipboard!');
        },
      },
      {
        label: 'Share via WhatsApp',
        icon: <MessageCircle size={24} color="#25D366" />,
        onPress: () => {
          const message = `Check out my trip to ${destination?.country}! ${tripDates}\n${shareUrl}`;
          const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
        },
      },
      {
        label: 'Download PDF',
        icon: <Download size={24} color="#333" />,
        onPress: () => {
          // Implement PDF download functionality
          Alert.alert('Coming Soon', 'PDF download will be available soon!');
        },
      },
    ];

    if (Platform.OS === 'web') {
      return Alert.alert(
        'Share Trip',
        'Choose how you want to share this trip:',
        shareOptions.map(option => ({
          text: option.label,
          onPress: option.onPress,
        }))
      );
    } else {
      try {
        await Share.share({
          title: `My Trip to ${destination?.country}`,
          message: `Check out my trip to ${destination?.country}! ${tripDates}\n${shareUrl}`,
          url: shareUrl,
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to share trip');
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Trips</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        {trips.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No trips planned yet</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={styles.createButtonText}>Plan a Trip</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.tripsList}>
            {trips.map((trip) => {
              const destination = destinations.find(
                d => d.country === trip.destination_id
              );
              
              return (
                <View key={trip.id} style={styles.tripCard}>
                  <TouchableOpacity
                    onPress={() => router.push(`/trip/${trip.id}`)}
                    activeOpacity={0.9}
                  >
                    <Image
                      source={{ uri: destination?.image }}
                      style={styles.tripImage}
                    />
                    <View style={styles.tripInfo}>
                      <Text style={styles.tripDestination}>
                        {destination?.country || trip.destination_id}
                      </Text>
                      <Text style={styles.tripDates}>
                        {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.tripActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleShare(trip)}
                    >
                      <Share2 size={20} color="#000" />
                      <Text style={styles.actionText}>Share</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDeleteTrip(trip.id)}
                    >
                      <Trash2 size={20} color="#000" />
                      <Text style={styles.actionText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <DeleteConfirmationDialog
        visible={showDeleteDialog}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTripToDelete(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripsList: {
    gap: 16,
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  tripImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  tripInfo: {
    padding: 16,
  },
  tripDestination: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  tripDates: {
    fontSize: 14,
    color: '#666666',
  },
  tripActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 8,
    backgroundColor: '#FFD700',
  },
  deleteButton: {
    borderLeftWidth: 1,
    borderLeftColor: '#E5E5E5',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  errorContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});