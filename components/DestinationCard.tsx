import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

interface DestinationCardProps {
  destination: {
    id: string;
    country: string;
    capital: string;
    flag: string;
    image: string;
    description: string;
    funFact: string;
    majorAttraction: string;
  };
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = CARD_WIDTH * 0.7;

export default function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/destination/${destination.id}`)}
    >
      <Image
        source={{ uri: destination.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.country}>{destination.country} {destination.flag}</Text>
          <Text style={styles.capital}>{destination.capital}</Text>
        </View>
        <Text style={styles.majorAttraction}>✨ {destination.majorAttraction}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {destination.description}
        </Text>
        <Text style={styles.funFact} numberOfLines={1}>
          💡 {destination.funFact}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  country: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  capital: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
  },
  majorAttraction: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
    lineHeight: 20,
  },
  funFact: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    fontStyle: 'italic',
  },
});