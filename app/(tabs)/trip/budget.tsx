import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BUDGET_LEVELS } from '@/types/trip';
import { useTripStore } from '@/stores/tripStore';

export default function BudgetScreen() {
  const router = useRouter();
  const { budgetLevel, setBudgetLevel } = useTripStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
        <Text style={styles.stepCount}>04</Text>
        <Text style={styles.title}>What Is Your Budget</Text>
        <Text style={styles.subtitle}>Choose Your Budget</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.options}>
          {BUDGET_LEVELS.map((level) => (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.option,
                budgetLevel === level.value && styles.optionSelected,
              ]}
              onPress={() => setBudgetLevel(level.value)}
            >
              <Text style={[
                styles.optionTitle,
                budgetLevel === level.value && styles.optionTitleSelected,
              ]}>
                {level.label}
              </Text>
              <Text style={[
                styles.optionDescription,
                budgetLevel === level.value && styles.optionDescriptionSelected,
              ]}>
                {level.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.continueButton, !budgetLevel && styles.buttonDisabled]}
        onPress={() => router.push('/trip/summary')}
        disabled={!budgetLevel}
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
    width: '80%',
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
  options: {
    gap: 12,
  },
  option: {
    padding: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  optionSelected: {
    backgroundColor: '#FFD700',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  optionTitleSelected: {
    color: '#111',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  optionDescriptionSelected: {
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