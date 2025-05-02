import { Stack } from 'expo-router';

export default function ChecklistLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="documents"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="clothing"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="toiletries"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="electronics"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
} 