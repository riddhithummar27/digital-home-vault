import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function VehicleDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Vehicle Profile</Text>
        <View style={{ width: 32 }} />
      </View>
      <View style={styles.content}>
        <Ionicons name="car-sport" size={64} color={colors.primary} style={{ marginBottom: 20 }} />
        <Text style={[styles.heading, { color: colors.text }]}>Vehicle ID: {id}</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 10 }}>This profile view is under construction.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 60, borderBottomWidth: 1 },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontWeight: '700' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  heading: { fontSize: 22, fontWeight: 'bold' },
});
