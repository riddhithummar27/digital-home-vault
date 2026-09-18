import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/context/ThemeContext';
import { WarrantyColors } from '../../src/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { supabase } from '../../src/lib/supabase';

export default function AppliancesScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();

  const [appliances, setAppliances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('appliances')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setAppliances(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.actionBtn, { backgroundColor: colors.surfaceElevated }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{t('appliances.title', 'Appliances')}</Text>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : appliances.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
           <Ionicons name="hardware-chip-outline" size={64} color={colors.border} />
           <Text style={{ color: colors.textSecondary, marginTop: 12 }}>{t('appliances.empty', 'No appliances found in Vault.')}</Text>
        </View>
      ) : (
        <FlatList 
          data={appliances} 
          keyExtractor={a => a.id} 
          numColumns={2} 
          columnWrapperStyle={styles.row} 
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const status = item.status || 'unknown';
            const wc = WarrantyColors[status] || WarrantyColors['unknown'];
            return (
              <TouchableOpacity style={[styles.card, { backgroundColor: colors.surface }]} onPress={() => router.push(`/appliances/\${item.id}`)} activeOpacity={0.7}>
                <Text style={styles.cardIcon}>🔌</Text>
                <Text style={[styles.cardName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
                <Text style={[styles.cardBrand, { color: colors.textSecondary }]}>{item.brand}</Text>
                <View style={[styles.warrantyBadge, { backgroundColor: wc.bg }]}>
                  <Text style={[styles.warrantyText, { color: wc.text }]}>{status.toUpperCase()}</Text>
                </View>
                <Text style={[styles.cardDate, { color: colors.textMuted }]}>{new Date(item.created_at).toLocaleDateString()}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  actionBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
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
