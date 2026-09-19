import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Light Brown Wood, Cream, Black Palette
const PALETTE = {
  bg: '#FAF6F0', // Cream
  woodDark: '#4A2F1D', // Dark Wood
  woodLight: '#D4A373', // Light Wood (for cards/borders)
  gold: '#8B5E34', // Medium Wood (Replacing gold variable)
  textDark: '#1A1A1A', // Black text
  textMuted: '#5C4033', // Deep Brown Muted
  white: '#FFFFFF', // Used for pure white cards
};

const FEATURE_MODULES = [
  {
    category: "Tier 1: Core Vault",
    features: [
      { name: "Document Vault", desc: "Encrypted storage for PDFs & receipts", icon: "lock-closed-outline" },
      { name: "AI OCR Intelligence", desc: "Auto-extracts facts from files", icon: "scan-outline" },
      { name: "Asset Management", desc: "Track appliances & electronics", icon: "tv-outline" },
      { name: "Warranty Tracking", desc: "Live expiry dashboards", icon: "shield-checkmark-outline" },
      { name: "Maintenance History", desc: "Timeline of asset upkeep", icon: "build-outline" },
      { name: "Reminder System", desc: "Alerts for renewals & service", icon: "notifications-outline" },
      { name: "Global AI Search", desc: "Search across OCR & tags", icon: "search-outline" },
      { name: "AI Home Assistant", desc: "Conversational household bot", icon: "chatbubbles-outline" },
    ]
  },
  {
    category: "Tier 2: Expansion",
    features: [
      { name: "Bills & Expenses", desc: "Track household spending", icon: "wallet-outline" },
      { name: "Family Permissions", desc: "Role-based vault sharing", icon: "people-outline" },
      { name: "Deep Doc Preview", desc: "Metadata & entity linking", icon: "document-text-outline" },
    ]
  },
  {
    category: "Tier 3: Predictive & Milestones",
    features: [
      { name: "Predictive Intelligence", desc: "Cost-benefit repair analysis", icon: "analytics-outline" },
      { name: "Property Handover", desc: "Transition packet generation", icon: "home-outline" },
      { name: "Emergency Pack", desc: "Curated critical documents", icon: "medkit-outline" },
      { name: "Moving House Mode", desc: "Checklists & utility transfers", icon: "airplane-outline" },
    ]
  },
  {
    category: "Proposed Enhancements",
    features: [
      { name: "Email & WhatsApp Ingest", desc: "Frictionless uploads", icon: "mail-outline" },
      { name: "Human Review Queue", desc: "Verify AI confidence scores", icon: "checkmark-done-outline" },
      { name: "Missing Docs AI", desc: "Proactive completion nudges", icon: "help-buoy-outline" },
      { name: "Claims Assistant", desc: "Auto-assemble warranty claims", icon: "briefcase-outline" },
      { name: "Multi-Property", desc: "Landlord & vacation homes", icon: "business-outline" },
      { name: "Vendor Directory", desc: "Service contacts & history", icon: "call-outline" },
      { name: "Digital Nominee", desc: "Break-glass emergency access", icon: "key-outline" },
      { name: "Recall Watch", desc: "Safety tracking by model #", icon: "warning-outline" },
      { name: "Utility Metering", desc: "Usage charts & anomalies", icon: "speedometer-outline" },
      { name: "Data Portability", desc: "Full JSON/CSV vault export", icon: "download-outline" },
      { name: "Regional Localization", desc: "PAN, RC, PUC & local formats", icon: "earth-outline" },
    ]
  }
];

export default function AllFeaturesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>The Master Vault</Text>
        <Text style={styles.headerSubtitle}>Comprehensive Feature Hub</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Luxury Banner */}
        <LinearGradient colors={[PALETTE.woodDark, PALETTE.woodLight]} style={styles.luxuryBanner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Ionicons name="diamond-outline" size={32} color={PALETTE.gold} style={styles.bannerIcon} />
          <View>
            <Text style={styles.bannerTitle}>Estate Management</Text>
            <Text style={styles.bannerDesc}>All your modules unlocked.</Text>
          </View>
        </LinearGradient>

        {FEATURE_MODULES.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.category}</Text>
            
            <View style={styles.grid}>
              {section.features.map((feature, fIdx) => (
                <TouchableOpacity key={fIdx} style={styles.card} activeOpacity={0.9}>
                  <View style={styles.iconRing}>
                    <Ionicons name={feature.icon as any} size={22} color={PALETTE.woodDark} />
                  </View>
                  <Text style={styles.featureTitle} numberOfLines={1}>{feature.name}</Text>
                  <Text style={styles.featureDesc} numberOfLines={2}>{feature.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.bg },
  header: { paddingTop: 70, paddingHorizontal: 24, paddingBottom: 24, backgroundColor: PALETTE.bg, borderBottomWidth: 1, borderBottomColor: 'rgba(74, 47, 29, 0.1)' },
  headerTitle: { color: PALETTE.textDark, fontSize: 32, fontWeight: 'bold' },
  headerSubtitle: { color: PALETTE.gold, fontSize: 15, marginTop: 4 },
  
  scrollContent: { padding: 20 },
  
  luxuryBanner: {
    flexDirection: 'row', alignItems: 'center', padding: 24, borderRadius: 20, marginBottom: 32,
    shadowColor: PALETTE.woodDark, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 10
  },
  bannerIcon: { marginRight: 16 },
  bannerTitle: { color: PALETTE.bg, fontSize: 18, fontWeight: '700', letterSpacing: 1 },
  bannerDesc: { color: '#FFF', fontSize: 14, marginTop: 4, opacity: 0.9 },

  section: { marginBottom: 32 },
  sectionTitle: { color: PALETTE.textDark, fontSize: 20, fontWeight: 'bold', marginBottom: 16, borderLeftWidth: 3, borderLeftColor: PALETTE.gold, paddingLeft: 12 },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  
  card: {
    width: (width - 56) / 2, // Accounting for padding (20+20) and gap (16)
    backgroundColor: PALETTE.white, padding: 16, borderRadius: 16, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(74, 47, 29, 0.15)', // Wood border
  },
  iconRing: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(74, 47, 29, 0.05)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(74, 47, 29, 0.1)'
  },
  featureTitle: { color: PALETTE.textDark, fontSize: 15, fontWeight: '700', marginBottom: 4 },
  featureDesc: { color: PALETTE.textMuted, fontSize: 12, lineHeight: 16 },
});
