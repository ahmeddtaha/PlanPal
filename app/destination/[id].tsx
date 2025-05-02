import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { destinations } from '@/constants/destinations';
import { useTripStore } from '@/stores/tripStore';
import { ChevronLeft } from 'lucide-react-native';

export default function DestinationScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { setDestinationId } = useTripStore();

  const destination = destinations.find(d => d.id === id);

  if (!destination) {
    return (
      <View style={styles.container}>
        <Text>Destination not found</Text>
      </View>
    );
  }

  const handlePlanTrip = () => {
    setDestinationId(destination.country);
    router.push('/trip/privacy');
  };

  return (
    <View style={styles.container}>
      {/* Hero Image */}
      <Image
        source={{ uri: destination.image }}
        style={[styles.heroImage, { width }]}
      />

      {/* Content Card */}
      <View style={styles.contentCard}>
        <ScrollView style={styles.scrollView}>
          {/* Destination Header */}
          <View style={styles.destinationHeader}>
            <Text style={styles.country}>{destination.country}</Text>
            <View style={styles.locationRow}>
              <Text style={styles.capital}>{destination.capital}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{destination.description}</Text>

          {/* Fun Fact Section */}
          <View style={styles.funFactSection}>
            <Text style={styles.funFactTitle}>Fun Fact</Text>
            <Text style={styles.funFactText}>{destination.funFact}</Text>
          </View>
        </ScrollView>

        {/* Plan Trip Button */}
        <TouchableOpacity
          style={styles.planTripButton}
          onPress={handlePlanTrip}
        >
          <Text style={styles.planTripText}>Plan This Trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  heroImage: {
    height: 300,
    resizeMode: 'cover',
  },
  contentCard: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  scrollView: {
    flex: 1,
    padding: 24,
  },
  destinationHeader: {
    marginBottom: 20,
  },
  country: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  capital: {
    fontSize: 16,
    color: '#666',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 24,
  },
  funFactSection: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  funFactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  funFactText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  planTripButton: {
    backgroundColor: '#FFD700',
    margin: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  planTripText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
});