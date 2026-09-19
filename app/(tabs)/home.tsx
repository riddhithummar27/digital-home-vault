import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  StatusBar,
  ScrollView,
  Image,
  Alert,
  Platform
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { 
  Lock, 
  Unlock, 
  Fan,
  ThermometerSnowflake,
  Lightbulb,
  ShieldCheck,
  FolderOpen
} from 'lucide-react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

const bgBefore = require('../../assets/before log in image.jpeg');
const bgAfter = require('../../assets/after log in image.jpeg');

export default function HomeInteractiveVault() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Device States
  const [acState, setAcState] = useState(false);
  const [fanState, setFanState] = useState(false);
  const [lightState, setLightState] = useState(false);

  const bgVideoSource = require('../../assets/3D-frontend video.mp4');
  const player = useVideoPlayer(bgVideoSource, player => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  useEffect(() => {
    const checkAuth = async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const isMockAuth = await AsyncStorage.getItem('mock_auth');
      
      if (isMockAuth !== 'true') {
        router.replace('/auth');
      } else {
        setIsLoggedIn(true);
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    await AsyncStorage.removeItem('mock_auth');
    setIsLoggedIn(false);
    router.replace('/auth');
  };
  
  const showDeviceDetails = (device: string, isOn: boolean, toggle: () => void) => {
    Alert.alert(
      `${device} Control`,
      `The ${device} is currently ${isOn ? 'ON' : 'OFF'}. You can view the warranty, purchase bill, and service records in your Vault.\n\nWould you like to toggle the power?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: `Turn ${isOn ? 'OFF' : 'ON'}`, onPress: toggle, style: isOn ? 'destructive' : 'default' },
        { text: 'View Documents', onPress: () => router.push('/documents') }
      ]
    );
  };

  if (loading) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {isLoggedIn ? (
          <VideoView 
            player={player} 
            style={styles.bgMedia} 
            nativeControls={false}
            contentFit="cover"
            pointerEvents="none"
          />
        ) : (
          <Image source={bgBefore} style={styles.bgMedia} resizeMode="cover" />
        )}
      </View>

      {/* Dim the background slightly so UI is readable, but keep it mostly clear for the image */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.1)' }]} pointerEvents="none" />

      {/* Top Header */}
      <View style={styles.header} pointerEvents="box-none">
        <View style={styles.brandRow}>
          <View style={styles.logoBox}>
            <ShieldCheck color="#FFF" size={24} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Digital Home</Text>
            <Text style={styles.headerSubtitle}>
              {isLoggedIn ? t('home.myVault', 'Vault Unlocked • Secure Mode') : t('home.vaultLocked', 'Vault Locked')}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.authBadge}
          onPress={handleLogout}
        >
          <Unlock color="#10B981" size={16} />
        </TouchableOpacity>
      </View>

      {/* Logged In Dashboard (Moved to bottom so it doesn't block the image) */}
      {isLoggedIn && (
        <View style={styles.bottomDashboardContainer}>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {/* Ceiling Fan */}
            <TouchableOpacity 
              style={[styles.deviceCard, fanState && styles.deviceCardActive]} 
              activeOpacity={0.8}
              onPress={() => showDeviceDetails('Ceiling Fan', fanState, () => setFanState(!fanState))}
            >
              <View style={[styles.deviceIconBox, fanState && styles.deviceIconBoxActive]}>
                <Fan color={fanState ? '#10B981' : '#94A3B8'} size={24} />
              </View>
              <Text style={styles.deviceName}>Ceiling Fan</Text>
              <Text style={[styles.deviceStatus, { color: fanState ? '#10B981' : '#64748B' }]}>{fanState ? 'Running' : 'Off'}</Text>
            </TouchableOpacity>

            {/* Living Room AC */}
            <TouchableOpacity 
              style={[styles.deviceCard, acState && styles.deviceCardActive]} 
              activeOpacity={0.8}
              onPress={() => showDeviceDetails('Living Room AC', acState, () => setAcState(!acState))}
            >
              <View style={[styles.deviceIconBox, acState && styles.deviceIconBoxActive]}>
                <ThermometerSnowflake color={acState ? '#38BDF8' : '#94A3B8'} size={24} />
              </View>
              <Text style={styles.deviceName}>Daikin AC</Text>
              <Text style={[styles.deviceStatus, { color: acState ? '#38BDF8' : '#64748B' }]}>{acState ? '22°C • Cool' : 'Off'}</Text>
            </TouchableOpacity>

            {/* Smart Lights */}
            <TouchableOpacity 
              style={[styles.deviceCard, lightState && styles.deviceCardActive]} 
              activeOpacity={0.8}
              onPress={() => showDeviceDetails('Smart Lights', lightState, () => setLightState(!lightState))}
            >
              <View style={[styles.deviceIconBox, lightState && styles.deviceIconBoxActive]}>
                <Lightbulb color={lightState ? '#F59E0B' : '#94A3B8'} size={24} />
              </View>
              <Text style={styles.deviceName}>Smart Lights</Text>
              <Text style={[styles.deviceStatus, { color: lightState ? '#F59E0B' : '#64748B' }]}>{lightState ? '100% • Warm' : 'Off'}</Text>
            </TouchableOpacity>

            {/* Vault Documents */}
            <TouchableOpacity 
              style={styles.deviceCard} 
              activeOpacity={0.8}
              onPress={() => router.push('/documents')}
            >
              <View style={[styles.deviceIconBox, { backgroundColor: '#F9F6F0' }]}>
                <FolderOpen color="#4E342E" size={24} />
              </View>
              <Text style={styles.deviceName}>My Documents</Text>
              <Text style={[styles.deviceStatus, { color: '#795548' }]}>Vault Storage</Text>
            </TouchableOpacity>

            {/* Master Hub (Menu) */}
            <TouchableOpacity 
              style={styles.deviceCard} 
              activeOpacity={0.8}
              onPress={() => router.push('/menu')}
            >
              <View style={[styles.deviceIconBox, { backgroundColor: '#F9F6F0' }]}>
                <Ionicons name="grid-outline" color="#D4AF37" size={24} />
              </View>
              <Text style={styles.deviceName}>All Features</Text>
              <Text style={[styles.deviceStatus, { color: '#795548' }]}>Master Vault Hub</Text>
            </TouchableOpacity>

            {/* Family Members */}
            <TouchableOpacity 
              style={styles.deviceCard} 
              activeOpacity={0.8}
              onPress={() => Alert.alert('Family Vault', 'Manage family member identities, passports, and medical records.')}
            >
              <View style={[styles.deviceIconBox, { backgroundColor: '#F9F6F0' }]}>
                <Ionicons name="people-outline" color="#4E342E" size={24} />
              </View>
              <Text style={styles.deviceName}>Family Members</Text>
              <Text style={[styles.deviceStatus, { color: '#795548' }]}>4 Profiles</Text>
            </TouchableOpacity>

            {/* Vehicles */}
            <TouchableOpacity 
              style={styles.deviceCard} 
              activeOpacity={0.8}
              onPress={() => router.push('/appliances')}
            >
              <View style={[styles.deviceIconBox, { backgroundColor: '#F9F6F0' }]}>
                <Ionicons name="car-sport-outline" color="#4E342E" size={24} />
              </View>
              <Text style={styles.deviceName}>Vehicles</Text>
              <Text style={[styles.deviceStatus, { color: '#795548' }]}>2 Registered</Text>
            </TouchableOpacity>

            {/* Property */}
            <TouchableOpacity 
              style={styles.deviceCard} 
              activeOpacity={0.8}
              onPress={() => router.push('/appliances')}
            >
              <View style={[styles.deviceIconBox, { backgroundColor: '#F9F6F0' }]}>
                <Ionicons name="home-outline" color="#4E342E" size={24} />
              </View>
              <Text style={styles.deviceName}>Property Specs</Text>
              <Text style={[styles.deviceStatus, { color: '#795548' }]}>Ownership Docs</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* INVISIBLE TOUCH ZONES PLACED AT VERY END TO GUARANTEE THEY ARE ON TOP */}
      {isLoggedIn && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {/* AC Touch Zone (Left Wall) */}
          <TouchableOpacity 
            style={styles.acTouchZone} 
            activeOpacity={0.2}
            onPress={() => showDeviceDetails('Living Room AC', acState, () => setAcState(!acState))}
          >
            {/* Visual feedback layer for development, hidden normally */}
            <View style={{ flex: 1, backgroundColor: 'rgba(212, 175, 55, 0.1)' }} />
          </TouchableOpacity>
          
          {/* Fan Touch Zone (Top Right Ceiling) */}
          <TouchableOpacity 
            style={styles.fanTouchZone} 
            activeOpacity={0.2}
            onPress={() => showDeviceDetails('Ceiling Fan', fanState, () => setFanState(!fanState))}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(212, 175, 55, 0.1)' }} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2D1B15' },
  bgMedia: { width: '100%', height: '100%' },
  darkOverlay: { ...StyleSheet.absoluteFill, backgroundColor: '#000' },
  
  /* Touch Zones for the physical image mapping */
  acTouchZone: { position: 'absolute', top: '25%', left: '0%', width: '50%', height: '35%', zIndex: 999, elevation: 999 },
  fanTouchZone: { position: 'absolute', top: '0%', right: '0%', width: '55%', height: '40%', zIndex: 999, elevation: 999 },

  header: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24,
    backgroundColor: 'rgba(45, 27, 21, 0.85)', // Wood dark overlay
    borderBottomWidth: 1, borderBottomColor: 'rgba(212, 175, 55, 0.2)',
    zIndex: 20
  },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  logoBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#D4AF37', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  headerSubtitle: { color: '#D4AF37', fontSize: 13, marginTop: 2 },
  authBadge: { backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)' },

  bottomDashboardContainer: {
    position: 'absolute', bottom: 100, left: 0, right: 0,
    zIndex: 20
  },
  dashboardTitle: { color: '#FFF', fontSize: 20, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', fontWeight: 'bold', marginLeft: 24, marginBottom: 16, textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4 },
  horizontalScroll: { paddingHorizontal: 24, gap: 12 },
  
  deviceCard: { 
    width: 140, padding: 16, borderRadius: 20, 
    backgroundColor: 'rgba(78, 52, 46, 0.9)', // Wood Light
    borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)', // Gold border
    marginRight: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12
  },
  deviceCardActive: {
    backgroundColor: 'rgba(62, 39, 35, 0.95)',
    borderColor: 'rgba(212, 175, 55, 0.6)',
  },
  deviceIconBoxActive: { backgroundColor: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.3)" }, deviceIconBox: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  deviceName: { color: '#FFF', fontSize: 15, fontWeight: '600', marginBottom: 4 },
  deviceStatus: { fontSize: 12, fontWeight: '500' }
});
