import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/context/ThemeContext';
import { mockAppliances } from '../../src/data/appliances';
import { WarrantyColors } from '../../src/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ApplianceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const appliance = mockAppliances.find(a => a.id === id);
  if (!appliance) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Not found</Text></View>;

  const wc = WarrantyColors[appliance.warrantyStatus];
  const totalSpent = appliance.serviceHistory.reduce((sum, s) => sum + s.cost, 0) + appliance.purchasePrice;

  const details = [
    { label: t('appliances.brand'), value: appliance.brand },
    { label: t('appliances.model'), value: appliance.model },
    { label: t('appliances.serialNumber'), value: appliance.serialNumber || '—' },
    { label: t('appliances.purchaseDate'), value: appliance.purchaseDate },
    { label: t('appliances.purchasePrice'), value: `₹${appliance.purchasePrice.toLocaleString('en-IN')}` },
    { label: t('appliances.seller'), value: appliance.seller || '—' },
    { label: t('appliances.warrantyPeriod'), value: appliance.warrantyPeriod },
    { label: t('appliances.warrantyExpiry'), value: appliance.warrantyExpiry },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.hero, { backgroundColor: colors.primary }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.heroEmoji}>{appliance.icon}</Text>
          <Text style={styles.heroName}>{appliance.name}</Text>
          <Text style={styles.heroBrand}>{appliance.brand} • {appliance.model}</Text>
          <View style={[styles.heroBadge, { backgroundColor: wc.bg }]}>
            <Text style={[styles.heroBadgeText, { color: wc.text }]}>{t(`warranty.${appliance.warrantyStatus}`)}</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>₹{totalSpent.toLocaleString('en-IN')}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('appliances.totalSpent')}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>{appliance.serviceHistory.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('appliances.servicesCount')}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>{appliance.documents.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('documents.title')}</Text>
          </View>
        </View>

        {/* Details */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('appliances.overview')}</Text>
          {details.map((d, i) => (
            <View key={i} style={[styles.detailRow, i < details.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{d.label}</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{d.value}</Text>
            </View>
          ))}
        </View>

        {/* Service History */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('appliances.serviceHistory')}</Text>
          {appliance.serviceHistory.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>No service records yet</Text>
          ) : (
            appliance.serviceHistory.map((s, i) => (
              <View key={s.id} style={[styles.serviceItem, i < appliance.serviceHistory.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
                <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.serviceDesc, { color: colors.text }]}>{s.description}</Text>
                  <Text style={[styles.serviceMeta, { color: colors.textMuted }]}>{s.provider} • {s.date}</Text>
                  {s.partsReplaced && <Text style={[styles.serviceParts, { color: colors.textSecondary }]}>Parts: {s.partsReplaced.join(', ')}</Text>}
                </View>
                <Text style={[styles.serviceCost, { color: s.cost === 0 ? colors.success : colors.text }]}>
                  {s.cost === 0 ? 'Free' : `₹${s.cost.toLocaleString('en-IN')}`}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  hero: { paddingTop: 60, paddingBottom: 30, alignItems: 'center', borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  backBtn: { position: 'absolute', top: 50, left: 20, width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  heroEmoji: { fontSize: 56, marginBottom: 8 },
  heroName: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  heroBrand: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  heroBadge: { marginTop: 12, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12 },
  heroBadgeText: { fontSize: 13, fontWeight: '700' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 16, gap: 10 },
  statCard: { flex: 1, borderRadius: 16, padding: 14, alignItems: 'center', elevation: 2 },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 11, marginTop: 2, fontWeight: '500' },
  section: { margin: 16, borderRadius: 18, padding: 18, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  detailLabel: { fontSize: 14 },
  detailValue: { fontSize: 14, fontWeight: '600' },
  serviceItem: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 14, gap: 12 },
  timelineDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  serviceDesc: { fontSize: 14, fontWeight: '600' },
  serviceMeta: { fontSize: 12, marginTop: 2 },
  serviceParts: { fontSize: 12, marginTop: 2, fontStyle: 'italic' },
  serviceCost: { fontSize: 15, fontWeight: '700' },
  emptyText: { fontSize: 14, textAlign: 'center', paddingVertical: 20 },
});
