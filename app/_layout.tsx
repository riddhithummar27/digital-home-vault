import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';
import { LanguageProvider } from '../src/context/LanguageContext';
import { supabase } from '../src/lib/supabase';
import { setupNotifications } from '../src/utils/notifications';
import '../src/i18n';

function RootLayoutInner() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Request notification permissions
    setupNotifications();

    // Listen to Auth State
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // --- AUTHENTICATION TEMPORARILY DISABLED ---
      /*
      const inAuthGroup = segments[0] === '(auth)';
      const isRoot = segments.length === 0;
      
      if (!session && !inAuthGroup && !isRoot) {
        // Redirect to login if not logged in and not in auth screens
        router.replace('/(auth)/login');
      } else if (session && inAuthGroup) {
        // Redirect to home if logged in and trying to access auth screens
        router.replace('/(tabs)/home');
      }
      */
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [segments]);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="appliances/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="vehicles/[id]" options={{ presentation: 'card' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <RootLayoutInner />
      </LanguageProvider>
    </ThemeProvider>
  );
}
