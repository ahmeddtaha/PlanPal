import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { destinations } from '@/constants/destinations';
import { Calendar, MapPin, Clock } from 'lucide-react-native';

interface Activity {
  time: string;
  title: string;
  description: string;
  location?: string;
}

interface DayPlan {
  date: string;
  activities: Activity[];
}

interface Trip {
  id: string;
  destination_id: string;
  start_date: string;
  end_date: string;
  itineraries?: {
    content: {
      days: DayPlan[];
    };
  }[];
}

export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    const loadTripDetails = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error: tripError } = await supabase
          .from('trips')
          .select(`
            id,
            destination_id,
            start_date,
            end_date,
            itineraries (
              content
            )
          `)
          .eq('id', id)
          .single();

        if (tripError) throw tripError;
        setTrip(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load trip details');
      } finally {
        setLoading(false);
      }
    };

    loadTripDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !trip || !trip.itineraries?.[0]) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || 'No itinerary found for this trip'}
        </Text>
      </View>
    );
  }

  const destination = destinations.find(d => d.country === trip.destination_id);
  const itinerary = trip.itineraries[0].content;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Your Trip Itinerary</Text>
        <Text style={styles.subtitle}>
          {destination?.country} - {destination?.capital}
        </Text>

        {itinerary.days.map((day, dayIndex) => (
          <View key={day.date} style={styles.dayContainer}>
            <View style={styles.dayHeader}>
              <Calendar size={24} color="#007AFF" />
              <Text style={styles.dayTitle}>Day {dayIndex + 1}</Text>
              <Text style={styles.dayDate}>{new Date(day.date).toLocaleDateString()}</Text>
            </View>

            {day.activities.map((activity, activityIndex) => (
              <View key={activityIndex} style={styles.activityContainer}>
                <View style={styles.activityHeader}>
                  <Clock size={16} color="#666" />
                  <Text style={styles.activityTime}>{activity.time}</Text>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                </View>

                <Text style={styles.activityDescription}>{activity.description}</Text>

                {activity.location && (
                  <View style={styles.locationContainer}>
                    <MapPin size={16} color="#666" />
                    <Text style={styles.locationText}>{activity.location}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  dayContainer: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  dayDate: {
    fontSize: 16,
    color: '#666',
    marginLeft: 'auto',
  },
  activityContainer: {
    marginBottom: 16,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#E5E5E5',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    color: '#666',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  activityDescription: {
    fontSize: 14,
    color: '#333',
    marginLeft: 24,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 24,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
}); 