import { Stack } from 'expo-router';

export default function TripLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Trip Itinerary',
          headerTitleStyle: {
            fontSize: 18,
          },
        }}
      />
    </Stack>
  );
} 