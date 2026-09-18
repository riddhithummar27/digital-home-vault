import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

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
    icon: 'snow-outline',
    color: ['#0284C7', '#0369A1'], // Blue gradient
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
    icon: 'car-sport-outline',
    color: ['#EA580C', '#C2410C'], // Orange gradient
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
    icon: 'tv-outline',
    color: ['#7C3AED', '#6D28D9'], // Purple gradient
  },
  {
    id: '4',
    name: 'LG 8kg Front Load Washing Machine',
    category: 'Appliance',
    brand: 'LG',
    purchaseDate: '22 Mar 2026',
    price: '₹34,500',
    warrantyStatus: 'active',
    warrantyExpiry: '22 Mar 2028',
    icon: 'water-outline',
    color: ['#059669', '#047857'], // Green gradient
  }
];

export default function AssetManagementScreen() {
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return { bg: 'rgba(16, 185, 129, 0.2)', text: '#10B981', label: 'Active Warranty' };
      case 'expiring_soon': return { bg: 'rgba(245, 158, 11, 0.2)', text: '#F59E0B', label: 'Expiring Soon' };
      case 'expired': return { bg: 'rgba(239, 68, 68, 0.2)', text: '#EF4444', label: 'Warranty Expired' };
      default: return { bg: 'rgba(255,255,255,0.1)', text: '#FFF', label: 'Unknown' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Asset Intelligence</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Intelligence Summary 3D Card */}
        <View style={styles.summary3DCard}>
          <LinearGradient colors={['rgba(56, 189, 248, 0.15)', 'rgba(139, 92, 246, 0.05)']} style={styles.summaryGradient}>
            <Text style={styles.summaryTitle}>AI Predictive Insights</Text>
            <View style={styles.insightRow}>
              <Ionicons name="warning-outline" size={20} color="#F59E0B" />
              <Text style={styles.insightText}>Honda City insurance & PUC expires in <Text style={{fontWeight:'bold', color:'#FFF'}}>14 days</Text>. Book renewal now to avoid fines.</Text>
            </View>
            <View style={styles.insightRow}>
              <Ionicons name="trending-down-outline" size={20} color="#38BDF8" />
              <Text style={styles.insightText}>Your Samsung TV warranty expired. Based on repair history, consider an extended protection plan.</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.filterRow}>
          {['All Assets', 'Appliances', 'Vehicles', 'Electronics'].map((f, i) => (
            <TouchableOpacity key={i} style={[styles.filterChip, i === 0 && styles.filterChipActive]}>
              <Text style={[styles.filterText, i === 0 && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Household Inventory ({DUMMY_ASSETS.length})</Text>

        {DUMMY_ASSETS.map((asset) => {
          const badge = getStatusBadge(asset.warrantyStatus);
          return (
            <TouchableOpacity key={asset.id} style={styles.assetCard} activeOpacity={0.8}>
              <LinearGradient colors={asset.color as any} style={styles.assetIconBox}>
                <Ionicons name={asset.icon as any} size={28} color="#FFF" />
              </LinearGradient>
              
              <View style={styles.assetInfo}>
                <Text style={styles.assetName}>{asset.name}</Text>
                <Text style={styles.assetBrand}>{asset.category} • {asset.brand}</Text>
                
                <View style={styles.metaRow}>
                  <Text style={styles.assetPrice}>{asset.price}</Text>
                  <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07090F' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20, backgroundColor: 'rgba(7, 9, 15, 0.9)' },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '800' },
  addBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#38BDF8', justifyContent: 'center', alignItems: 'center', shadowColor: '#38BDF8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
  
  scrollContent: { padding: 24 },
  
  summary3DCard: { 
    borderRadius: 24, 
    borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.3)', 
    overflow: 'hidden', marginBottom: 24,
    transform: [{ perspective: 1000 }, { rotateX: '2deg' }],
    shadowColor: '#38BDF8', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20,
    elevation: 10
  },
  summaryGradient: { padding: 24 },
  summaryTitle: { color: '#FFF', fontSize: 18, fontWeight: '800', marginBottom: 16 },
  insightRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12, backgroundColor: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 12 },
  insightText: { color: '#94A3B8', fontSize: 13, lineHeight: 20, flex: 1 },

  filterRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  filterChipActive: { backgroundColor: 'rgba(56, 189, 248, 0.15)', borderColor: '#38BDF8' },
  filterText: { color: '#94A3B8', fontSize: 14, fontWeight: '600' },
  filterTextActive: { color: '#38BDF8' },

  sectionTitle: { color: '#FFF', fontSize: 20, fontWeight: '800', marginBottom: 16 },

  assetCard: { 
    flexDirection: 'row', alignItems: 'center', padding: 16, marginBottom: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 24,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8
  },
  assetIconBox: { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  assetInfo: { flex: 1 },
  assetName: { color: '#FFF', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  assetBrand: { color: '#64748B', fontSize: 13, marginBottom: 12 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  assetPrice: { color: '#E2E8F0', fontSize: 15, fontWeight: '800' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
});
