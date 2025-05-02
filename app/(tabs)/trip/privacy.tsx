import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Users, CircleUser as UserCircle, Heart, Globe, Users2 } from 'lucide-react-native';
import { useTripStore } from '@/stores/tripStore';

type TripType = 'solo' | 'friends' | 'couple' | 'family' | 'public';

export default function TripPrivacyScreen() {
  const router = useRouter();
  const { setPrivacyType, setTripType } = useTripStore();
  const [selectedType, setSelectedType] = useState<TripType | null>(null);

  const handleSelection = (type: TripType) => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (!selectedType) return;
    
    if (selectedType === 'public') {
      setPrivacyType('public');
      setTripType(undefined);
    } else {
      setPrivacyType('private');
      setTripType(selectedType);
    }
    router.push('/trip/dates');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
        <Text style={styles.stepCount}>01</Text>
        <Text style={styles.title}>Tell Us Who Is Coming</Text>
        <Text style={styles.subtitle}>Choose Your Companions</Text>
      </View>

      <ScrollView style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.option, selectedType === 'solo' && styles.selectedOption]}
          onPress={() => handleSelection('solo')}
        >
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, selectedType === 'solo' && styles.selectedText]}>Only Me</Text>
            <Text style={[styles.optionDescription, selectedType === 'solo' && styles.selectedText]}>A Solo Traveler In Exploration</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, selectedType === 'friends' && styles.selectedOption]}
          onPress={() => handleSelection('friends')}
        >
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, selectedType === 'friends' && styles.selectedText]}>Friends</Text>
            <Text style={[styles.optionDescription, selectedType === 'friends' && styles.selectedText]}>Go Out With Fun Friends</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, selectedType === 'couple' && styles.selectedOption]}
          onPress={() => handleSelection('couple')}
        >
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, selectedType === 'couple' && styles.selectedText]}>Couple</Text>
            <Text style={[styles.optionDescription, selectedType === 'couple' && styles.selectedText]}>Going On A Honeymoon</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, selectedType === 'family' && styles.selectedOption]}
          onPress={() => handleSelection('family')}
        >
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, selectedType === 'family' && styles.selectedText]}>Family</Text>
            <Text style={[styles.optionDescription, selectedType === 'family' && styles.selectedText]}>A Happy Trip With The Family</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, selectedType === 'public' && styles.selectedOption]}
          onPress={() => handleSelection('public')}
        >
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, selectedType === 'public' && styles.selectedText]}>Public</Text>
            <Text style={[styles.optionDescription, selectedType === 'public' && styles.selectedText]}>Eager To Make New Friends</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        style={[styles.continueButton, !selectedType && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={!selectedType}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
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
    width: '20%',
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
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  option: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  selectedOption: {
    backgroundColor: '#FFD700',
  },
  optionContent: {
    gap: 4,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  selectedText: {
    color: '#111',
  },
  continueButton: {
    backgroundColor: '#111',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});