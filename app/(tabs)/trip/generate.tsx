import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTripStore } from '@/stores/tripStore';
import { supabase } from '@/lib/supabase';
import { destinations } from '@/constants/destinations';
import { Calendar } from 'lucide-react-native';
import OpenAI from 'openai';
import { ActivityCard } from '@/components/ActivityCard';
import { LinearGradient } from 'expo-linear-gradient';

let openai: OpenAI | null = null;

try {
  openai = new OpenAI({
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

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

interface Itinerary {
  days: DayPlan[];
}

export default function GenerateScreen() {
  const router = useRouter();
  const trip = useTripStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [tripId, setTripId] = useState<string | null>(null);

  const destination = destinations.find(d => d.country === trip.destinationId);

  const generatePrompt = () => {
    const days = Math.ceil(
      (trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (!destination) {
      throw new Error('Destination not found');
    }

    // Format the start date for the prompt
    const startDateStr = trip.startDate.toISOString().split('T')[0];

    return `Create a ${days}-day travel itinerary for a trip to ${destination.country} (${destination.capital}) starting on ${startDateStr}. 
    Trip details:
    - Trip type: ${trip.privacyType === 'public' ? 'Public Journey' : `Private ${trip.tripType} Trip`}
    - Cultural preference: ${trip.culturePreference}
    - Nature preference: ${trip.naturePreference}
    - Food preference: ${trip.foodPreference}
    - Entertainment preference: ${trip.entertainmentPreference}
    - Budget level: ${trip.budgetLevel}

    Format the response as a JSON object with the following structure:
    {
      "days": [
        {
          "activities": [
            {
              "time": "HH:MM",
              "title": "Activity name",
              "description": "Brief description",
              "location": "Location name or address"
            }
          ]
        }
      ]
    }

    Include 4-6 activities per day, with specific times, locations, and brief descriptions.
    Consider the selected preferences and budget level when suggesting activities.`;
  };

  const generateItinerary = async () => {
    if (!openai) {
      setError('OpenAI API key is not configured. Please check your environment variables.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a knowledgeable travel planner. Create detailed, realistic itineraries based on user preferences.',
          },
          {
            role: 'user',
            content: generatePrompt(),
          },
        ],
        response_format: { type: 'json_object' },
      });

      const generatedItinerary = JSON.parse(completion.choices[0].message.content);
      
      // Add the correct dates to each day
      const startDate = new Date(trip.startDate);
      const daysWithDates = generatedItinerary.days.map((day: any, index: number) => {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + index);
        return {
          ...day,
          date: currentDate.toISOString().split('T')[0]
        };
      });

      setItinerary({ days: daysWithDates });

      // Save to database
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (tripError) throw tripError;
      setTripId(tripData.id);

      const { error: itineraryError } = await supabase
        .from('itineraries')
        .insert({
          trip_id: tripData.id,
          content: { days: daysWithDates } as any,
        });

      if (itineraryError) throw itineraryError;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate itinerary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openai) {
      generateItinerary();
    }
  }, []);

  const handleSave = async () => {
    router.replace('/(tabs)/trips');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFF00" />
        <Text style={styles.loadingText}>Generating Your Perfect Itinerary...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={generateItinerary}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!itinerary) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Your AI Generated Itinerary</Text>
          <Text style={styles.subtitle}>
            {destination?.country} - {destination?.capital}
          </Text>
        </View>

        {itinerary.days.map((day, dayIndex) => (
          <View key={day.date} style={styles.dayContainer}>
            <View style={styles.dayHeader}>
              <View style={styles.dayHeaderLeft}>
                <Calendar size={24} color="#FFFF00" />
                <Text style={styles.dayTitle}>Day {dayIndex + 1}</Text>
              </View>
              <Text style={styles.dayDate}>
                {new Date(day.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>

            <View style={styles.activitiesGrid}>
              {day.activities.map((activity, activityIndex) => (
                <ActivityCard
                  key={activityIndex}
                  time={activity.time}
                  title={activity.title}
                  description={activity.description}
                  location={activity.location}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <LinearGradient
        colors={['transparent', 'rgba(255,255,255,0.9)', '#fff']}
        style={styles.buttonGradient}
      >
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>View All Trips</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#FFFF00',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  dayContainer: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  dayDate: {
    fontSize: 16,
    color: '#666',
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  buttonGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    paddingTop: 20,
  },
  saveButton: {
    backgroundColor: '#111',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});