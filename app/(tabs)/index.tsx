import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Plane } from 'lucide-react-native';
import { destinations } from '@/constants/destinations';

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDestinations = destinations.filter(destination => 
    destination.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    destination.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
    destination.majorAttraction.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Plane size={40} color="#FFFFFF" />
          <Text style={styles.logo}>PlanPal</Text>
        </View>
        <View style={styles.searchContainer}>
          <Search size={20} color="#71717A" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Destination"
            placeholderTextColor="#71717A"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredDestinations.map((destination) => (
          <TouchableOpacity
            key={destination.id}
            style={styles.destinationCard}
            onPress={() => router.push(`/destination/${destination.id}`)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: destination.image }}
              style={styles.destinationImage}
            />
            <View style={styles.destinationOverlay}>
              <View>
                <Text style={styles.destinationName}>
                  {destination.country} {destination.flag}
                </Text>
                <Text style={styles.destinationCapital}>
                  {destination.capital}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFD700',
    gap: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logo: {
    fontSize: 40,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#18181B',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  destinationCard: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  destinationImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  destinationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 16,
    paddingBottom: 20,
    backgroundColor: 'transparent',
    backgroundImage: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))',
  },
  destinationName: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
  destinationCapital: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  destinationFlag: {
    fontSize: 24,
  },
});