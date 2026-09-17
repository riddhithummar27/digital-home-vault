import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/context/ThemeContext';
import { mockAppliances } from '../../src/data/appliances';
import { WarrantyColors } from '../../src/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function AppliancesScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{t('appliances.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList data={mockAppliances} keyExtractor={a => a.id} numColumns={2} columnWrapperStyle={styles.row} contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const wc = WarrantyColors[item.warrantyStatus];
          return (
            <TouchableOpacity style={[styles.card, { backgroundColor: colors.surface }]} onPress={() => router.push(`/appliances/${item.id}`)} activeOpacity={0.7}>
              <Text style={styles.cardIcon}>{item.icon}</Text>
              <Text style={[styles.cardName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
              <Text style={[styles.cardBrand, { color: colors.textSecondary }]}>{item.brand}</Text>
              <View style={[styles.warrantyBadge, { backgroundColor: wc.bg }]}>
                <Text style={[styles.warrantyText, { color: wc.text }]}>{t(`warranty.${item.warrantyStatus}`)}</Text>
              </View>
              <Text style={[styles.cardDate, { color: colors.textMuted }]}>{item.purchaseDate}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { fontSize: 22, fontWeight: '800' },
  list: { padding: 12, paddingBottom: 100 },
  row: { gap: 12 },
  card: { flex: 1, borderRadius: 18, padding: 16, marginBottom: 12, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
  cardIcon: { fontSize: 36, marginBottom: 8 },
  cardName: { fontSize: 15, fontWeight: '700', textAlign: 'center' },
  cardBrand: { fontSize: 12, marginTop: 2 },
  warrantyBadge: { marginTop: 10, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  warrantyText: { fontSize: 11, fontWeight: '700' },
  cardDate: { fontSize: 10, marginTop: 6 },
});
