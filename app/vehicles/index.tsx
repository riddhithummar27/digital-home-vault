import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { mockVehicles } from '../../src/data/vehicles';
import { Vehicle } from '../../src/types';

export default function VehiclesScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const renderVehicleCard = ({ item }: { item: Vehicle }) => {
    const isInsuranceExpiringSoon = item.insuranceExpiry && (new Date(item.insuranceExpiry).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000);

    return (
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
            <Text style={styles.icon}>{item.icon}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.brand, { color: colors.textSecondary }]}>{item.brand} • {item.year}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </View>

        <View style={[styles.detailsGrid, { borderTopColor: colors.border }]}>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Registration</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{item.registrationNumber}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Fuel</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{item.fuelType}</Text>
          </View>
        </View>

        <View style={[styles.statusRow, { backgroundColor: isInsuranceExpiringSoon ? colors.warning + '15' : colors.success + '15' }]}>
          <Ionicons name="shield-checkmark" size={16} color={isInsuranceExpiringSoon ? colors.warning : colors.success} />
          <Text style={[styles.statusText, { color: isInsuranceExpiringSoon ? colors.warning : colors.success }]}>
            Insurance: {item.insuranceExpiry ? new Date(item.insuranceExpiry).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>My Vehicles</Text>
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.primary }]}>
          <Ionicons name="add" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockVehicles}
        keyExtractor={item => item.id}
        renderItem={renderVehicleCard}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 60, borderBottomWidth: 1 },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontWeight: '700' },
  addBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 20, paddingBottom: 100 },
  card: { borderRadius: 20, padding: 20, marginBottom: 16, elevation: 3, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconBox: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  icon: { fontSize: 24 },
  headerText: { flex: 1 },
  name: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  brand: { fontSize: 14, fontWeight: '500' },
  detailsGrid: { flexDirection: 'row', paddingTop: 16, borderTopWidth: 1, marginBottom: 16 },
  detailItem: { flex: 1 },
  detailLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { fontSize: 15, fontWeight: '700' },
  statusRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, gap: 8 },
  statusText: { fontSize: 13, fontWeight: '600' },
});
