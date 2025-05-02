import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { ChevronLeft } from 'lucide-react-native';
import { destinations } from '@/constants/destinations';

interface PublicTrip {
  id: string;
  destination_id: string;
  start_date: string;
  end_date: string;
  user_id: string;
  is_public: boolean;
  profiles: {
    full_name: string;
  };
  trip_participants: {
    profiles: {
      full_name: string;
    };
  }[];
}

interface SupabaseTripResponse {
  id: string;
  destination_id: string;
  start_date: string;
  end_date: string;
  user_id: string;
  is_public: boolean;
  profiles: {
    full_name: string;
  };
}

interface SupabaseParticipantResponse {
  profiles: {
    full_name: string;
  };
}

export default function ExploreScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publicTrips, setPublicTrips] = useState<PublicTrip[]>([]);

  const loadPublicTrips = async () => {
    try {
      // First check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      if (!user) {
        console.error('No authenticated user');
        throw new Error('Not authenticated');
      }

      console.log('Loading public trips for user:', user.id);

      // Simplified query to get public trips
      const { data, error: tripsError } = await supabase
        .from('trips')
        .select(`
          id,
          destination_id,
          start_date,
          end_date,
          user_id,
          is_public,
          profiles:user_id (
            full_name
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (tripsError) {
        console.error('Supabase trips error:', tripsError);
        throw tripsError;
      }

      if (!data) {
        console.log('No data returned from Supabase');
        setPublicTrips([]);
        return;
      }

      console.log('Loaded trips:', data);

      // Get participants for each trip
      const tripsWithParticipants = await Promise.all(
        (data as unknown as SupabaseTripResponse[]).map(async (trip) => {
          const { data: participants } = await supabase
            .from('trip_participants')
            .select(`
              profiles:user_id (
                full_name
              )
            `)
            .eq('trip_id', trip.id);

          return {
            ...trip,
            trip_participants: (participants as unknown as SupabaseParticipantResponse[]) || []
          };
        })
      );

      console.log('Trips with participants:', tripsWithParticipants);
      setPublicTrips(tripsWithParticipants as unknown as PublicTrip[]);
    } catch (err) {
      console.error('Error loading public trips:', err);
      setError(err instanceof Error ? err.message : 'Failed to load public trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublicTrips();
  }, []);

  const handleJoinTrip = async (tripId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      Alert.alert(
        'Join Trip',
        'Are you sure you want to join this trip?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Join',
            onPress: async () => {
              const { error: joinError } = await supabase
                .from('trip_participants')
                .insert({
                  trip_id: tripId,
                  user_id: user.id,
                });

              if (joinError) throw joinError;
              
              Alert.alert('Success', 'You have successfully joined the trip!');
              loadPublicTrips(); // Refresh the list
            },
          },
        ],
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join trip');
    }
  };

  const handleViewTrip = (tripId: string) => {
    router.push(`/trip/${tripId}`);
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
        <Text style={styles.headerTitle}>Public Trips</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {publicTrips.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No public trips available</Text>
          </View>
        ) : (
          <View style={styles.tripsList}>
            {publicTrips.map((trip) => {
              const destination = destinations.find(
                d => d.country === trip.destination_id
              );
              
              return (
                <View key={trip.id} style={styles.tripCard}>
                  <TouchableOpacity onPress={() => handleViewTrip(trip.id)}>
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
                      <Text style={styles.tripUser}>
                        Created by: {trip.profiles?.full_name}
                      </Text>
                      {trip.trip_participants && trip.trip_participants.length > 0 && (
                        <View style={styles.participantsContainer}>
                          <Text style={styles.participantsTitle}>Participants:</Text>
                          {trip.trip_participants.map((participant, index) => (
                            <Text key={index} style={styles.participantName}>
                              • {participant.profiles.full_name}
                            </Text>
                          ))}
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.joinButton}
                    onPress={() => handleJoinTrip(trip.id)}
                  >
                    <Text style={styles.joinButtonText}>Join This Trip</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
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
    marginBottom: 4,
  },
  tripUser: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  participantsContainer: {
    marginTop: 8,
  },
  participantsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  joinButton: {
    backgroundColor: '#FFD700',
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
  },
});