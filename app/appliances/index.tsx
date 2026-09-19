import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform, ActivityIndicator } from 'react-native';
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

// Fallback styling for backend assets
const getWoodGradient = (index: number) => {
  const gradients = [
    ['#8B5E34', '#4A2F1D'],
    ['#6F4E37', '#4A2F1D'],
    ['#A67B5B', '#6F4E37'],
    ['#D4A373', '#8B5E34']
  ];
  return gradients[index % gradients.length];
};

const getIcon = (category: string) => {
  if (!category) return 'cube';
  const cat = category.toLowerCase();
  if (cat.includes('climate') || cat.includes('ac')) return 'snow';
  if (cat.includes('vehicle') || cat.includes('car')) return 'car-sport';
  if (cat.includes('entertainment') || cat.includes('tv')) return 'tv';
  if (cat.includes('appliance') || cat.includes('machine')) return 'water';
  return 'cube';
};

export default function AssetHubScreen() {
  const router = useRouter();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      // Fetching from the Express backend on port 5000
      // Use standard localhost for emulator, or standard local IP if physical device
      // 10.0.2.2 is used for Android Emulator to hit host machine's localhost
      const hostUrl = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
      
      const response = await fetch(`${hostUrl}/api/assets`);
      if (!response.ok) throw new Error('Failed to fetch assets from backend');
      
      const data = await response.json();
      setAssets(data);
    } catch (err: any) {
      console.warn("Backend fetch failed, ensure server is running on :5000", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Asset List (Fetched from Backend) */}
        {loading ? (
          <ActivityIndicator size="large" color={PALETTE.woodDark} style={{ marginTop: 40 }} />
        ) : error ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
             <Ionicons name="cloud-offline" size={48} color={PALETTE.woodMedium} />
             <Text style={{ color: PALETTE.textMuted, marginTop: 10 }}>Could not connect to Express Backend.</Text>
             <Text style={{ color: PALETTE.textMuted }}>Make sure backend is running on port 5000.</Text>
          </View>
        ) : (
          <View style={styles.assetList}>
            {assets.map((asset, index) => (
              <TouchableOpacity key={asset.id || index} style={styles.assetCard} activeOpacity={0.8}>
                <View style={styles.assetCardShadow}>
                  <LinearGradient colors={getWoodGradient(index) as any} style={styles.iconGradient}>
                    <View style={styles.innerWoodBorder}>
                      <Ionicons name={getIcon(asset.category) as any} size={28} color="#FFF8DC" style={styles.woodIconShadow} />
                    </View>
                  </LinearGradient>
                </View>
                
                <View style={styles.assetInfo}>
                  <Text style={styles.assetName} numberOfLines={1}>{asset.name}</Text>
                  <Text style={styles.assetBrand}>{asset.brand || 'Unknown'} • {asset.category}</Text>
                  
                  <View style={styles.priceRow}>
                    <Text style={styles.assetPrice}>{asset.price}</Text>
                    
                    {asset.warranty_status === 'active' && (
                      <View style={[styles.statusBadge, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                        <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                        <Text style={[styles.statusText, { color: '#10B981' }]}>Active</Text>
                      </View>
                    )}
                    {(asset.warranty_status === 'expiring_soon' || !asset.warranty_status) && (
                      <View style={[styles.statusBadge, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                        <Ionicons name="time" size={12} color="#D97706" />
                        <Text style={[styles.statusText, { color: '#D97706' }]}>Expiring Soon</Text>
                      </View>
                    )}
                    {asset.warranty_status === 'expired' && (
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
        )}

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
