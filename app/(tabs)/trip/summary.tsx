import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTripStore } from '@/stores/tripStore';
import { PREFERENCE_OPTIONS } from '@/types/trip';
import { supabase } from '@/lib/supabase'; 
import { destinations } from '@/constants/destinations';
import { MapPin, Calendar, Heart, DollarSign, Utensils, Palmtree } from 'lucide-react-native';

export default function SummaryScreen() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const trip = useTripStore();
  
  const selectedDestination = destinations.find(
    (dest) => dest.country === trip.destinationId
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getPreferenceLabel = (
    category: keyof typeof PREFERENCE_OPTIONS,
    value: string
  ) => {
    return PREFERENCE_OPTIONS[category].find(
      (option) => option.value === value
    )?.label;
  };

  const handleGenerateItinerary = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error: tripError } = await supabase.from('trips').insert({
        user_id: user.id,
        destination_id: trip.destinationId,
        privacy_type: trip.privacyType,
        trip_type: trip.tripType,
        start_date: trip.startDate.toISOString(),
        end_date: trip.endDate.toISOString(),
        culture_preference: trip.culturePreference,
        nature_preference: trip.naturePreference,
        food_preference: trip.foodPreference,
        entertainment_preference: trip.entertainmentPreference,
        budget_level: trip.budgetLevel,
        is_public: trip.privacyType === 'public',
      });

      if (tripError) throw tripError;

      router.push('/trip/generate');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
        <Text style={styles.stepCount}>05</Text>
        <Text style={styles.title}>Your Trip's Summary</Text>
        <Text style={styles.subtitle}>Review Your Trip</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardLabel}>
            <MapPin size={16} color="#111" style={styles.icon} /> Destination
          </Text>
          <View style={styles.destinationInfo}>
            <Text style={styles.flag}>{selectedDestination?.flag || ''}</Text>
            <Text style={styles.cardValue}>
              {selectedDestination ? `${selectedDestination.country}, ${selectedDestination.capital}` : 'Not selected'}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>
            <Heart size={16} color="#111" style={styles.icon} /> Trip Type
          </Text>
          <Text style={styles.cardValue}>
            {trip.tripType 
              ? trip.tripType.charAt(0).toUpperCase() + trip.tripType.slice(1)
              : 'Not selected'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>
            <Calendar size={16} color="#111" style={styles.icon} /> Travel Dates
          </Text>
          <Text style={styles.cardValue}>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>
            <Palmtree size={16} color="#111" style={styles.icon} /> Travel Preferences
          </Text>
          <View style={styles.preferencesContainer}>
            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>Cultural Activities</Text>
              <Text style={styles.preferenceValue}>
                {getPreferenceLabel('culture', trip.culturePreference!) || 'Not selected'}
              </Text>
            </View>
            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>Nature & Wellness</Text>
              <Text style={styles.preferenceValue}>
                {getPreferenceLabel('nature', trip.naturePreference!) || 'Not selected'}
              </Text>
            </View>
            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>Food Experience</Text>
              <Text style={styles.preferenceValue}>
                {getPreferenceLabel('food', trip.foodPreference!) || 'Not selected'}
              </Text>
            </View>
            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>Entertainment</Text>
              <Text style={styles.preferenceValue}>
                {getPreferenceLabel('entertainment', trip.entertainmentPreference!) || 'Not selected'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>
            <DollarSign size={16} color="#111" style={styles.icon} /> Budget Level
          </Text>
          <Text style={styles.cardValue}>
            {trip.budgetLevel 
              ? trip.budgetLevel.charAt(0).toUpperCase() + trip.budgetLevel.slice(1)
              : 'Not selected'}
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.generateButton, loading && styles.buttonDisabled]}
        onPress={handleGenerateItinerary}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.generateButtonText}>
            Generate Itinerary with AI
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    marginBottom: 20,
  },
  progressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  stepCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111',
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardValue: {
    fontSize: 14,
    color: '#666',
  },
  destinationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flag: {
    fontSize: 24,
  },
  icon: {
    marginRight: 4,
  },
  preferencesContainer: {
    gap: 8,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#111',
  },
  preferenceValue: {
    fontSize: 14,
    color: '#666',
  },
  generateButton: {
    backgroundColor: '#111',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});