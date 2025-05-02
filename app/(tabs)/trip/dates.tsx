import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTripStore } from '@/stores/tripStore';
import { Calendar } from 'react-native-calendars';
import { Theme } from 'react-native-calendars/src/types';

export default function TravelDatesScreen() {
  const router = useRouter();
  const { startDate, endDate, setStartDate, setEndDate } = useTripStore();

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCalendarDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getMarkedDates = () => {
    if (!startDate || !endDate) return {};

    const start = formatCalendarDate(startDate);
    const end = formatCalendarDate(endDate);
    const marked: any = {
      [start]: {
        selected: true,
        startingDay: true,
        color: '#FFD700',
      },
      [end]: {
        selected: true,
        endingDay: true,
        color: '#FFD700',
      },
    };

    // Add dates in between
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + 1);
    
    while (currentDate < endDate) {
      const dateString = formatCalendarDate(currentDate);
      marked[dateString] = {
        selected: true,
        color: '#FFE55C',
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return marked;
  };

  const handleDayPress = (day: any) => {
    const selectedDate = new Date(day.timestamp);
    
    if (!startDate || (startDate && endDate && startDate.getTime() !== endDate.getTime())) {
      // First click or starting a new selection after a complete range
      setStartDate(selectedDate);
      setEndDate(selectedDate);
    } else {
      // Second click to complete the range
      if (selectedDate < startDate) {
        // If selected date is before start date, swap them
        setEndDate(startDate);
        setStartDate(selectedDate);
      } else {
        // Normal case - end date is after start date
        setEndDate(selectedDate);
      }
    }
  };

  const calendarTheme: Theme = {
    backgroundColor: '#ffffff',
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#666666',
    selectedDayBackgroundColor: '#FFD700',
    selectedDayTextColor: '#000000',
    todayTextColor: '#000000',
    dayTextColor: '#000000',
    textDisabledColor: '#d9e1e8',
    dotColor: '#FFD700',
    selectedDotColor: '#000000',
    arrowColor: '#000000',
    monthTextColor: '#000000',
    textDayFontWeight: '400',
    textMonthFontWeight: '600',
    textDayHeaderFontWeight: '400',
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 14,
  };

  const canContinue = startDate && endDate && endDate >= startDate;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
        <Text style={styles.stepCount}>02</Text>
        <Text style={styles.title}>When Are You Going</Text>
        <Text style={styles.subtitle}>Choose Your Trip Date</Text>
      </View>

      <Calendar
        current={startDate || new Date()}
        minDate={new Date().toISOString()}
        onDayPress={handleDayPress}
        markingType="period"
        markedDates={getMarkedDates()}
        theme={calendarTheme}
        renderArrow={(direction: 'left' | 'right') => (
          direction === 'left' ? 
            <ChevronLeft size={24} color="#000" /> : 
            <ChevronRight size={24} color="#000" />
        )}
      />

      {startDate && (
        <View style={styles.dateRangeContainer}>
          <View style={styles.dateBox}>
            <CalendarIcon size={20} color="#000" />
            <View>
              <Text style={styles.dateLabel}>{startDate ? formatDisplayDate(startDate) : ''}</Text>
              <Text style={styles.dateSubtext}>Start at</Text>
            </View>
          </View>

          {endDate && (
            <>
              <View style={styles.arrow} />
              <View style={styles.dateBox}>
                <CalendarIcon size={20} color="#000" />
                <View>
                  <Text style={styles.dateLabel}>{endDate ? formatDisplayDate(endDate) : ''}</Text>
                  <Text style={styles.dateSubtext}>Ends at</Text>
                </View>
              </View>
            </>
          )}
        </View>
      )}

      <TouchableOpacity
        style={[styles.continueButton, !canContinue && styles.buttonDisabled]}
        onPress={() => router.push('/trip/preferences')}
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
    width: '40%',
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
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  dateSubtext: {
    fontSize: 12,
    color: '#666',
  },
  arrow: {
    width: 20,
    height: 2,
    backgroundColor: '#666',
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