import { Stack } from 'expo-router';

export default function TripLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Back',
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="plan"
        options={{
          title: 'Plan Your Trip',
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: 'Trip Privacy',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="dates"
        options={{
          title: 'Travel Dates',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="preferences"
        options={{
          title: 'Travel Preferences',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="budget"
        options={{
          title: 'Budget Level',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="summary"
        options={{
          title: 'Trip Summary',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}