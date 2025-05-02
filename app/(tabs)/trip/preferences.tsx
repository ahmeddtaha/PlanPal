import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { PREFERENCE_OPTIONS } from '@/types/trip';
import { useTripStore } from '@/stores/tripStore';

export default function PreferencesScreen() {
  const router = useRouter();
  const {
    culturePreference,
    naturePreference,
    foodPreference,
    entertainmentPreference,
    setCulturePreference,
    setNaturePreference,
    setFoodPreference,
    setEntertainmentPreference,
  } = useTripStore();

  const renderPreferenceSection = (
    title: string,
    options: typeof PREFERENCE_OPTIONS[keyof typeof PREFERENCE_OPTIONS],
    selected: string | undefined,
    onSelect: (value: any) => void
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionsGrid}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              selected === option.value && styles.optionSelected,
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text style={styles.optionEmoji}>{option.emoji}</Text>
            <Text style={[
              styles.optionLabel,
              selected === option.value && styles.optionLabelSelected,
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const canContinue = culturePreference && naturePreference && 
                     foodPreference && entertainmentPreference;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
        <Text style={styles.stepCount}>03</Text>
        <Text style={styles.title}>What Do You Enjoy</Text>
        <Text style={styles.subtitle}>Choose Your Preferences</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {renderPreferenceSection(
          'Cultural Activities',
          PREFERENCE_OPTIONS.culture,
          culturePreference,
          setCulturePreference
        )}

        {renderPreferenceSection(
          'Nature And Wellness',
          PREFERENCE_OPTIONS.nature,
          naturePreference,
          setNaturePreference
        )}

        {renderPreferenceSection(
          'Food Experience',
          PREFERENCE_OPTIONS.food,
          foodPreference,
          setFoodPreference
        )}

        {renderPreferenceSection(
          'Entertainment',
          PREFERENCE_OPTIONS.entertainment,
          entertainmentPreference,
          setEntertainmentPreference
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.continueButton, !canContinue && styles.buttonDisabled]}
        onPress={() => router.push('/trip/budget')}
        disabled={!canContinue}
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
    width: '60%',
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  option: {
    width: '48%',
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  optionSelected: {
    backgroundColor: '#FFD700',
  },
  optionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#111',
  },
  optionLabelSelected: {
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