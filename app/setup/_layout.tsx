import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function SetupLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
    </>
  );
}
