import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Light Brown Wood, Cream, Black Theme
const PALETTE = {
  bg: '#FAF6F0', 
  woodDark: '#4A2F1D', 
  woodMedium: '#8B5E34', 
  woodLight: '#D4A373', 
  textBlack: '#1A1A1A', 
  textMuted: '#5C4033',
  white: '#FFFFFF', 
};

// Vault Categories (Wood tones instead of neon colors)
const VAULT_CATEGORIES = [
  { id: '1', name: 'Identity & Passports', count: 8, icon: 'id-card', color: ['#8B5E34', '#4A2F1D'] as const },
  { id: '2', name: 'Property Deeds', count: 3, icon: 'home', color: ['#D4A373', '#8B5E34'] as const },
  { id: '3', name: 'Vehicles & Insurance', count: 4, icon: 'car-sport', color: ['#6F4E37', '#4A2F1D'] as const },
  { id: '4', name: 'Medical Records', count: 12, icon: 'medkit', color: ['#A67B5B', '#6F4E37'] as const },
  { id: '5', name: 'Warranties', count: 15, icon: 'shield-checkmark', color: ['#8B5E34', '#4A2F1D'] as const },
  { id: '6', name: 'Tax Receipts', count: 24, icon: 'receipt', color: ['#D4A373', '#8B5E34'] as const },
];

const RECENT_DOCUMENTS = [
  { id: 'd1', name: 'Daikin AC Invoice_2025.pdf', category: 'Appliance', date: 'Today, 10:42 AM', size: '2.4 MB', aiTag: 'Verified Match' },
  { id: 'd2', name: 'Honda City Insurance.jpg', category: 'Vehicle', date: 'Yesterday', size: '1.1 MB', aiTag: 'Expiring Soon' },
  { id: 'd3', name: 'Property Tax_2024.pdf', category: 'Tax', date: '12 Sep 2024', size: '840 KB', aiTag: 'Processed' },
];

export default function VaultDocumentsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Digital Vault</Text>
        <Text style={styles.headerSubtitle}>Bank-grade encrypted storage</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Search Bar (Wood Carved style) */}
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={PALETTE.woodDark} />
            <Text style={styles.searchText}>Search OCR across all documents...</Text>
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <LinearGradient colors={['#A67B5B', '#6F4E37', '#4A2F1D']} style={styles.filterGradient}>
              <Ionicons name="options" size={20} color="#FFF8DC" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Vault Categories</Text>
        
        {/* 3D Masonry Grid */}
        <View style={styles.gridContainer}>
          {VAULT_CATEGORIES.map((cat, index) => (
            <TouchableOpacity key={cat.id} style={styles.categoryCardWrapper} activeOpacity={0.9}>
              <View style={styles.categoryCardShadow}>
                <LinearGradient colors={cat.color} style={styles.categoryGradient}>
                  <View style={styles.innerWoodBorder}>
                    <Ionicons name={cat.icon as any} size={32} color="#FFF8DC" style={styles.woodIconShadow} />
                    <View style={styles.badgeContainer}>
                      <Text style={styles.badgeText}>{cat.count}</Text>
                    </View>
                    <Text style={styles.categoryName} numberOfLines={2}>{cat.name}</Text>
                  </View>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>Recent Uploads</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* List of Documents */}
        <View style={styles.recentList}>
          {RECENT_DOCUMENTS.map((doc, index) => (
            <TouchableOpacity key={doc.id} style={styles.docRow} activeOpacity={0.7}>
              <View style={styles.docIconBox}>
                <Ionicons name={doc.name.includes('.pdf') ? 'document-text' : 'image'} size={24} color={PALETTE.woodDark} />
              </View>
              <View style={styles.docInfo}>
                <Text style={styles.docName} numberOfLines={1}>{doc.name}</Text>
                <View style={styles.docMeta}>
                  <Text style={styles.docMetaText}>{doc.date} • {doc.size}</Text>
                </View>
              </View>
              <View style={[styles.aiBadge, doc.aiTag.includes('Expiring') && { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                <Text style={[styles.aiBadgeText, doc.aiTag.includes('Expiring') && { color: '#DC2626' }]}>
                  {doc.aiTag}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PALETTE.bg },
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16, backgroundColor: PALETTE.bg, borderBottomWidth: 1, borderBottomColor: 'rgba(74, 47, 29, 0.1)' },
  headerTitle: { color: PALETTE.textBlack, fontSize: 32, fontWeight: '900', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  headerSubtitle: { color: PALETTE.woodMedium, fontSize: 15, marginTop: 4, fontWeight: '600' },
  
  scrollContent: { padding: 24, paddingBottom: 100 },
  
  searchBarContainer: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: PALETTE.white, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: 'rgba(74, 47, 29, 0.2)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  searchText: { color: PALETTE.textMuted, marginLeft: 10, fontSize: 15, fontWeight: '500' },
  
  filterBtn: { borderRadius: 16, overflow: 'hidden', shadowColor: '#4A2F1D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  filterGradient: { width: 52, height: 52, justifyContent: 'center', alignItems: 'center' },

  sectionTitle: { color: PALETTE.textBlack, fontSize: 22, fontWeight: '800', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', marginBottom: 20 },
  
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 32 },
  categoryCardWrapper: { width: (width - 48 - 16) / 2, marginBottom: 16 },
  categoryCardShadow: { borderRadius: 20, shadowColor: '#4A2F1D', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 8 },
  categoryGradient: { borderRadius: 20, padding: 4 },
  innerWoodBorder: { flex: 1, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 16, padding: 16, minHeight: 120, justifyContent: 'space-between' },
  
  woodIconShadow: { textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4 },
  
  badgeContainer: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255, 248, 220, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  badgeText: { color: '#FFF8DC', fontSize: 12, fontWeight: 'bold' },
  
  categoryName: { color: '#FFF8DC', fontSize: 15, fontWeight: '700', marginTop: 16, letterSpacing: 0.5, textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 2 },
  
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  seeAllText: { color: PALETTE.woodMedium, fontSize: 15, fontWeight: '700' },
  
  recentList: { gap: 12 },
  docRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: PALETTE.white, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(74, 47, 29, 0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  docIconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(139, 94, 52, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  docInfo: { flex: 1 },
  docName: { color: PALETTE.textBlack, fontSize: 15, fontWeight: '700', marginBottom: 4 },
  docMeta: { flexDirection: 'row', alignItems: 'center' },
  docMetaText: { color: PALETTE.textMuted, fontSize: 12, fontWeight: '500' },
  
  aiBadge: { backgroundColor: 'rgba(139, 94, 52, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(74, 47, 29, 0.1)' },
  aiBadgeText: { color: PALETTE.woodMedium, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
});
