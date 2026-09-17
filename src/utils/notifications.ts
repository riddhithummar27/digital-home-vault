import { Alert } from 'react-native';

// Note: Expo Go SDK 53+ removed support for expo-notifications.
// To use real push notifications, a custom Development Build (EAS Build) is required.
// For testing inside Expo Go, we will fallback to using an in-app Alert.

export async function setupNotifications() {
  // Mocking the permission setup for Expo Go
  return true;
}

export async function triggerNotification(title: string, body: string) {
  // Fallback to a simple Alert for Expo Go testing
  Alert.alert(`🔔 ${title}`, body);
}
