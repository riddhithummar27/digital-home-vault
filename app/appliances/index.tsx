import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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

const DUMMY_ASSETS = [
  {
    id: '1',
    name: 'Daikin 1.5 Ton Split AC',
    category: 'Climate Control',
    brand: 'Daikin',
    purchaseDate: '12 Aug 2025',
    price: '₹45,000',
    warrantyStatus: 'active',
    warrantyExpiry: '12 Aug 2027',
    icon: 'snow',
    color: ['#8B5E34', '#4A2F1D'], // Wood gradient
  },
  {
    id: '2',
    name: 'Honda City ZX Automatic',
    category: 'Vehicle',
    brand: 'Honda',
    purchaseDate: '05 Oct 2023',
    price: '₹15,40,000',
    warrantyStatus: 'expiring_soon',
    warrantyExpiry: '05 Oct 2026',
    icon: 'car-sport',
    color: ['#6F4E37', '#4A2F1D'], // Darker Wood
  },
  {
    id: '3',
    name: 'Samsung 65" OLED 4K TV',
    category: 'Entertainment',
    brand: 'Samsung',
    purchaseDate: '10 Jan 2023',
    price: '₹1,20,000',
    warrantyStatus: 'expired',
    warrantyExpiry: '10 Jan 2025',
    icon: 'tv',
    color: ['#A67B5B', '#6F4E37'], // Lighter Wood
  },
  {
    id: '4',
    name: 'LG 8kg Front Load Washing Machine',
    category: 'Appliance',
    brand: 'LG',
    purchaseDate: '22 Mar 2026',
    price: '₹38,500',
    warrantyStatus: 'active',
    warrantyExpiry: '22 Mar 2028',
    icon: 'water',
    color: ['#D4A373', '#8B5E34'], // Caramel Wood
  }
];

export default function AssetHubScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={PALETTE.textBlack} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Asset Intelligence</Text>
          <Text style={styles.headerSubtitle}>Monitor warranties & lifecycle</Text>
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={24} color="#FFF8DC" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Insight Banner */}
        <View style={styles.insightBannerShadow}>
          <LinearGradient colors={['#A67B5B', '#6F4E37', '#4A2F1D']} style={styles.insightBanner}>
            <View style={styles.insightIconBox}>
              <Ionicons name="warning" size={24} color="#FFF8DC" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.insightTitle}>Action Required</Text>
              <Text style={styles.insightDesc}>Your Honda City insurance and warranty expires in 15 days.</Text>
            </View>
            <TouchableOpacity style={styles.insightAction}>
              <Text style={styles.insightActionText}>Renew</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Filters */}
        <View style={styles.filterScroll}>
          {['All Assets', 'Appliances', 'Vehicles', 'Electronics'].map((filter, i) => (
            <TouchableOpacity key={i} style={[styles.filterChip, i === 0 && styles.filterChipActive]}>
              <Text style={[styles.filterText, i === 0 && styles.filterTextActive]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Asset List */}
        <View style={styles.assetList}>
          {DUMMY_ASSETS.map((asset) => (
            <TouchableOpacity key={asset.id} style={styles.assetCard} activeOpacity={0.8}>
              <View style={styles.assetCardShadow}>
                <LinearGradient colors={asset.color as any} style={styles.iconGradient}>
                  <View style={styles.innerWoodBorder}>
                    <Ionicons name={asset.icon as any} size={28} color="#FFF8DC" style={styles.woodIconShadow} />
                  </View>
                </LinearGradient>
              </View>
              
              <View style={styles.assetInfo}>
                <Text style={styles.assetName} numberOfLines={1}>{asset.name}</Text>
                <Text style={styles.assetBrand}>{asset.brand} • {asset.category}</Text>
                
                <View style={styles.priceRow}>
                  <Text style={styles.assetPrice}>{asset.price}</Text>
                  
                  {asset.warrantyStatus === 'active' && (
                    <View style={[styles.statusBadge, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                      <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                      <Text style={[styles.statusText, { color: '#10B981' }]}>Active</Text>
                    </View>
                  )}
                  {asset.warrantyStatus === 'expiring_soon' && (
                    <View style={[styles.statusBadge, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                      <Ionicons name="time" size={12} color="#D97706" />
                      <Text style={[styles.statusText, { color: '#D97706' }]}>Expiring Soon</Text>
                    </View>
                  )}
                  {asset.warrantyStatus === 'expired' && (
                    <View style={[styles.statusBadge, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                      <Ionicons name="alert-circle" size={12} color="#DC2626" />
                      <Text style={[styles.statusText, { color: '#DC2626' }]}>Expired</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 16, backgroundColor: PALETTE.bg, borderBottomWidth: 1, borderBottomColor: 'rgba(74, 47, 29, 0.1)' },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: PALETTE.white, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2, borderWidth: 1, borderColor: 'rgba(74, 47, 29, 0.1)' },
  headerTitle: { color: PALETTE.textBlack, fontSize: 22, fontWeight: '900', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  headerSubtitle: { color: PALETTE.woodMedium, fontSize: 13, fontWeight: '600', marginTop: 2 },
  addBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: PALETTE.woodDark, justifyContent: 'center', alignItems: 'center', shadowColor: '#4A2F1D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  
  scrollContent: { padding: 24, paddingBottom: 100 },
  
  insightBannerShadow: { borderRadius: 20, shadowColor: '#4A2F1D', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8, marginBottom: 32 },
  insightBanner: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, gap: 16 },
  insightIconBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  insightTitle: { color: '#FFF8DC', fontSize: 16, fontWeight: '800', marginBottom: 4 },
  insightDesc: { color: '#E5D3B3', fontSize: 13, lineHeight: 18 },
  insightAction: { backgroundColor: '#FFF8DC', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2 },
  insightActionText: { color: PALETTE.woodDark, fontSize: 14, fontWeight: '800' },

  filterScroll: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  filterChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: PALETTE.white, borderWidth: 1, borderColor: 'rgba(74, 47, 29, 0.2)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  filterChipActive: { backgroundColor: PALETTE.woodMedium, borderColor: PALETTE.woodDark },
  filterText: { color: PALETTE.textMuted, fontSize: 14, fontWeight: '600' },
  filterTextActive: { color: '#FFF8DC', fontWeight: '800' },

  assetList: { gap: 16 },
  assetCard: { flexDirection: 'row', backgroundColor: PALETTE.white, padding: 16, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(74, 47, 29, 0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  assetCardShadow: { borderRadius: 16, shadowColor: '#4A2F1D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4, marginRight: 16 },
  iconGradient: { width: 80, height: 80, borderRadius: 16, padding: 3 },
  innerWoodBorder: { flex: 1, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  woodIconShadow: { textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4 },
  
  assetInfo: { flex: 1, justifyContent: 'center' },
  assetName: { color: PALETTE.textBlack, fontSize: 16, fontWeight: '800', marginBottom: 4 },
  assetBrand: { color: PALETTE.textMuted, fontSize: 13, fontWeight: '500', marginBottom: 12 },
  
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  assetPrice: { color: PALETTE.textBlack, fontSize: 15, fontWeight: '800' },
  
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
});
