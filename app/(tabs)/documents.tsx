import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, SafeAreaView, ActivityIndicator } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { useTheme } from '../../src/context/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';

export default function DocumentsScreen() {
  const { colors } = useTheme();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code !== '42P01') {
          console.error("Error fetching docs:", error);
        }
      } else {
        setDocuments(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDocuments();
  };

  const renderDoc = ({ item, index }: { item: any, index: number }) => {
    // Parse extracted_data if it's stored as a string or array
    let fields: any[] = [];
    try {
      if (typeof item.extracted_data === 'string') {
        fields = JSON.parse(item.extracted_data);
      } else if (Array.isArray(item.extracted_data)) {
        fields = item.extracted_data;
      }
    } catch (e) {}

    return (
      <Animated.View 
        entering={FadeInUp.delay(index * 100).springify()} 
        layout={Layout.springify()}
        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="document-text" size={24} color={colors.primary} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{item.name || 'Unnamed Document'}</Text>
            <Text style={[styles.subtitle, { color: colors.primary }]}>{item.type || 'Document'}</Text>
          </View>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.surfaceElevated }]}>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {fields.length > 0 && (
          <View style={[styles.dataBox, { backgroundColor: colors.surfaceElevated }]}>
            {fields.map((f: any, i: number) => (
              <View key={i} style={styles.dataRow}>
                <Text style={[styles.dataKey, { color: colors.textSecondary }]}>{f.key}:</Text>
                <Text style={[styles.dataValue, { color: colors.text }]}>{f.value}</Text>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.footer}>
          <Text style={[styles.date, { color: colors.textMuted }]}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
          <Text style={[styles.linked, { color: colors.textSecondary }]}>
            <Ionicons name="link" size={12} /> {item.linked_entity || 'Vault Inbox'}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Vault</Text>
        <Text style={[styles.headerSub, { color: colors.textMuted }]}>All scanned documents & assets</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : documents.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="folder-open-outline" size={64} color={colors.border} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Your vault is empty.</Text>
          <Text style={[styles.emptySub, { color: colors.textMuted }]}>Use the + button to scan your first bill!</Text>
        </View>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderDoc}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { padding: 24, paddingTop: 12 },
  headerTitle: { fontSize: 32, fontWeight: '800', letterSpacing: 0.5 },
  headerSub: { fontSize: 15, marginTop: 4, fontWeight: '500' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 18, fontWeight: '600', marginTop: 16 },
  emptySub: { fontSize: 14, marginTop: 8, textAlign: 'center' },
  list: { padding: 20, paddingBottom: 120, gap: 16 },
  card: { borderRadius: 24, padding: 20, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  headerText: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  subtitle: { fontSize: 13, fontWeight: '600' },
  actionBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  dataBox: { padding: 16, borderRadius: 16, gap: 8, marginBottom: 16 },
  dataRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dataKey: { fontSize: 13, fontWeight: '500' },
  dataValue: { fontSize: 14, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
  date: { fontSize: 12, fontWeight: '500' },
  linked: { fontSize: 12, fontWeight: '600' }
});
