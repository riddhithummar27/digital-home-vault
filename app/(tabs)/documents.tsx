import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/context/ThemeContext';
import { mockDocuments } from '../../src/data/documents';
import { DocumentTypeColors } from '../../src/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

const FILTERS = ['all', 'invoice', 'warranty', 'insurance', 'bill', 'service_record', 'tax', 'other'];

export default function DocumentsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all' ? mockDocuments : mockDocuments.filter(d => d.type === activeFilter);

  const filterLabels: Record<string, string> = {
    all: t('documents.all'), invoice: t('documents.invoices'), warranty: t('documents.warranties'),
    insurance: t('documents.insurance'), bill: t('documents.bills'), service_record: t('documents.service'),
    tax: t('documents.tax'), other: t('documents.other'),
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('documents.title')}</Text>
        <Text style={[styles.count, { color: colors.textSecondary }]}>{mockDocuments.length} {t('documents.title').toLowerCase()}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f} onPress={() => setActiveFilter(f)}
            style={[styles.filterChip, { backgroundColor: activeFilter === f ? colors.primary : colors.surfaceElevated, borderColor: activeFilter === f ? colors.primary : colors.border }]}>
            <Text style={[styles.filterText, { color: activeFilter === f ? '#FFF' : colors.textSecondary }]}>{filterLabels[f] || f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList data={filtered} keyExtractor={d => d.id} contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const typeColor = DocumentTypeColors[item.type] || DocumentTypeColors.other;
          return (
            <TouchableOpacity style={[styles.docCard, { backgroundColor: colors.surface }]} activeOpacity={0.7}>
              <View style={[styles.docIcon, { backgroundColor: typeColor.bg }]}>
                <Ionicons name={item.fileType === 'pdf' ? 'document-text' : 'image'} size={22} color={typeColor.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.docName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
                <View style={styles.docMeta}>
                  <View style={[styles.typeBadge, { backgroundColor: typeColor.bg }]}>
                    <Text style={[styles.typeText, { color: typeColor.text }]}>{item.type.replace('_', ' ')}</Text>
                  </View>
                  {item.linkedEntity && (
                    <Text style={[styles.linkedText, { color: colors.textMuted }]}>→ {item.linkedEntity.name}</Text>
                  )}
                </View>
                <Text style={[styles.dateText, { color: colors.textMuted }]}>{item.uploadDate}</Text>
              </View>
              {item.confidenceScore && (
                <View style={[styles.confidence, { backgroundColor: colors.surfaceElevated }]}>
                  <Text style={[styles.confText, { color: colors.success }]}>{Math.round(item.confidenceScore * 100)}%</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '800' },
  count: { fontSize: 14, marginTop: 4 },
  filterRow: { maxHeight: 48, marginBottom: 8 },
  filterContent: { paddingHorizontal: 16, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 13, fontWeight: '600' },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  docCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, marginBottom: 10, gap: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  docIcon: { width: 46, height: 46, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  docName: { fontSize: 15, fontWeight: '600' },
  docMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  typeText: { fontSize: 10, fontWeight: '700', textTransform: 'capitalize' },
  linkedText: { fontSize: 12 },
  dateText: { fontSize: 11, marginTop: 3 },
  confidence: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  confText: { fontSize: 12, fontWeight: '700' },
});
