import { Stack } from 'expo-router';

export default function DestinationLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: 'About the Country',
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerShadowVisible: false,
      }}
    />
  );
}