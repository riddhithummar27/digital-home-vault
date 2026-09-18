import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const VAULT_CATEGORIES = [
  { id: '1', name: 'Identity & Passports', count: 8, icon: 'id-card-outline', color: ['#8B5CF6', '#7C3AED'] },
  { id: '2', name: 'Property Deeds', count: 3, icon: 'home-outline', color: ['#10B981', '#059669'] },
  { id: '3', name: 'Vehicle RCs & Insurance', count: 4, icon: 'car-sport-outline', color: ['#F59E0B', '#D97706'] },
  { id: '4', name: 'Medical Records', count: 12, icon: 'medkit-outline', color: ['#EF4444', '#DC2626'] },
  { id: '5', name: 'Appliance Warranties', count: 15, icon: 'document-text-outline', color: ['#3B82F6', '#2563EB'] },
  { id: '6', name: 'Tax Receipts', count: 24, icon: 'receipt-outline', color: ['#6366F1', '#4F46E5'] },
];

const RECENT_DOCUMENTS = [
  { id: 'd1', name: 'Daikin AC Invoice_2025.pdf', category: 'Appliance', date: 'Today, 10:42 AM', size: '2.4 MB', aiTag: 'Verified Match' },
  { id: 'd2', name: 'Honda City Insurance.jpg', category: 'Vehicle', date: 'Yesterday', size: '1.1 MB', aiTag: 'Expiring Soon' },
  { id: 'd3', name: 'Property Tax_2024.pdf', category: 'Tax', date: '12 Sep 2024', size: '840 KB', aiTag: 'Processed' },
];

export default function VaultDocumentsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Digital Vault</Text>
        <Text style={styles.headerSubtitle}>Bank-grade encrypted storage</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Global Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <Text style={styles.searchText}>Search OCR across all documents...</Text>
          <View style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color="#FFF" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Vault Categories</Text>
        
        {/* 3D Masonry Grid */}
        <View style={styles.gridContainer}>
          {VAULT_CATEGORIES.map((cat, index) => (
            <TouchableOpacity key={cat.id} style={styles.categoryCard} activeOpacity={0.8}>
              <LinearGradient colors={cat.color as any} style={styles.categoryGradient}>
                <Ionicons name={cat.icon as any} size={28} color="#FFF" />
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeCount}>{cat.count}</Text>
                </View>
              </LinearGradient>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>Recently Processed</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        {RECENT_DOCUMENTS.map((doc) => (
          <View key={doc.id} style={styles.docRow}>
            <View style={styles.docIconBox}>
              <Ionicons name={doc.name.endsWith('pdf') ? 'document-text' : 'image'} size={24} color="#38BDF8" />
            </View>
            <View style={styles.docInfo}>
              <Text style={styles.docName}>{doc.name}</Text>
              <Text style={styles.docMeta}>{doc.category} • {doc.date} • {doc.size}</Text>
            </View>
            <View style={styles.aiBadge}>
              <Ionicons name="sparkles" size={12} color="#10B981" />
              <Text style={styles.aiBadgeText}>{doc.aiTag}</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Upload Button */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
        <LinearGradient colors={['#38BDF8', '#0284C7']} style={styles.fabGradient}>
          <Ionicons name="scan" size={24} color="#FFF" />
          <Text style={styles.fabText}>Scan Document</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07090F' },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20, backgroundColor: 'rgba(7, 9, 15, 0.9)' },
  headerTitle: { color: '#FFF', fontSize: 32, fontWeight: '800', letterSpacing: 0.5 },
  headerSubtitle: { color: '#10B981', fontSize: 14, fontWeight: '600', marginTop: 4 },
  
  scrollContent: { padding: 24 },
  
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, paddingLeft: 16, marginBottom: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  searchText: { flex: 1, color: '#64748B', fontSize: 15, marginLeft: 12 },
  filterBtn: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderTopRightRadius: 16, borderBottomRightRadius: 16 },

  sectionTitle: { color: '#FFF', fontSize: 20, fontWeight: '800', marginBottom: 16 },
  
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16, marginBottom: 32 },
  categoryCard: { width: (width - 64) / 2, marginBottom: 8 },
  categoryGradient: { height: 100, borderRadius: 24, padding: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12 },
  badgeContainer: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeCount: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  categoryName: { color: '#E2E8F0', fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 12 },

  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  seeAll: { color: '#38BDF8', fontSize: 14, fontWeight: '600' },
  
  docRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: 16, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  docIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(56, 189, 248, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  docInfo: { flex: 1 },
  docName: { color: '#FFF', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  docMeta: { color: '#64748B', fontSize: 12 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
  aiBadgeText: { color: '#10B981', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },

  fab: { position: 'absolute', bottom: 100, left: '20%', right: '20%', shadowColor: '#38BDF8', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 12 },
  fabGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 32, gap: 8 },
  fabText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});
