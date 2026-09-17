import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  StatusBar,
  ScrollView,
  Platform
} from 'react-native';
import { WebView } from 'react-native-webview';
import Animated, { 
  FadeInUp, 
  FadeOutDown, 
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';
import { 
  Lock, 
  Unlock, 
  Home as HomeIcon,
  Car,
  Users,
  Wallet,
  Bell,
  Box,
  Settings,
  ChevronRight,
  ShieldCheck
} from 'lucide-react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/lib/supabase';

const { width, height } = Dimensions.get('window');

// 3D Spline Background
const SPLINE_HTML = `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <style>
      body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #07090F; overflow: hidden; }
      spline-viewer { width: 100%; height: 100%; }
    </style>
    <script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.5/build/spline-viewer.js"></script>
  </head>
  <body>
    <!-- Default public 3D keyboard interactive scene as placeholder -->
    <spline-viewer id="spline" url="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"></spline-viewer>
  </body>
</html>
`;

const FEATURES = [
  { id: 'property', title: 'Properties', icon: HomeIcon, color: '#38BDF8', route: '/property' },
  { id: 'family', title: 'Family', icon: Users, color: '#A78BFA', route: '/family' },
  { id: 'vehicles', title: 'Vehicles', icon: Car, color: '#10B981', route: '/vehicles' },
  { id: 'appliances', title: 'Appliances', icon: Box, color: '#F59E0B', route: '/appliances' },
  { id: 'reminders', title: 'Reminders', icon: Bell, color: '#F43F5E', route: '/reminders' },
  { id: 'expenses', title: 'Expenses', icon: Wallet, color: '#14B8A6', route: '/expenses' },
];

export default function HomeInteractiveVault() {
  const router = useRouter();
  const webviewRef = useRef<WebView>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const scrollY = useSharedValue(0);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => {
    router.push('/auth');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 3D Interactive Background */}
      <View style={styles.splineContainer}>
        <WebView
          ref={webviewRef}
          originWhitelist={['*']}
          source={{ html: SPLINE_HTML }}
          style={styles.splineCanvas}
          scrollEnabled={false}
          bounces={false}
        />
        {/* Dark overlay that brightens when logged in */}
        <View style={[styles.darkOverlay, { opacity: isLoggedIn ? 0.3 : 0.8 }]} pointerEvents="none" />
      </View>

      {/* Top Header */}
      <Animated.View entering={FadeInUp.duration(800).delay(200)} style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoBox}>
            <ShieldCheck color="#FFF" size={24} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Digital Home</Text>
            <Text style={styles.headerSubtitle}>
              {isLoggedIn ? 'Vault Unlocked • Secure Mode' : 'Vault Locked • Authentication Required'}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.authBadge, isLoggedIn ? styles.authActive : styles.authLocked]}
          onPress={isLoggedIn ? handleLogout : handleLogin}
        >
          {isLoggedIn ? <Unlock color="#10B981" size={16} /> : <Lock color="#94A3B8" size={16} />}
        </TouchableOpacity>
      </Animated.View>

      {/* Logged Out State */}
      {!isLoggedIn && (
        <Animated.View entering={FadeInUp.duration(600)} exiting={FadeOutDown.duration(400)} style={styles.loggedOutContainer}>
          <View style={styles.glassCardBig}>
            <View style={styles.lockIconContainer}>
              <Lock color="#38BDF8" size={42} strokeWidth={1.5} />
            </View>
            <Text style={styles.loginTitle}>Access Your Vault</Text>
            <Text style={styles.loginDesc}>
              Unlock to manage your properties, vehicles, appliances, and family documents in full 3D interactive mode.
            </Text>
            
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.8}>
              <Text style={styles.loginBtnText}>Authenticate with Face ID</Text>
              <Ionicons name="scan-outline" size={20} color="#FFF" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Logged In Dashboard */}
      {isLoggedIn && (
        <Animated.ScrollView 
          entering={FadeInUp.duration(800).springify()}
          style={styles.dashboardScroll}
          contentContainerStyle={styles.dashboardContent}
          showsVerticalScrollIndicator={false}
          onScroll={(e) => { scrollY.value = e.nativeEvent.contentOffset.y; }}
          scrollEventThrottle={16}
        >
          {/* Main Stats Card */}
          <View style={styles.statsCard}>
            <Text style={styles.statsGreeting}>Welcome back, Boss</Text>
            <Text style={styles.statsValue}>All Systems Online</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Active Assets</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>2</Text>
                <Text style={styles.statLabel}>Alerts</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>100%</Text>
                <Text style={styles.statLabel}>Protected</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Vault Modules</Text>

          {/* Feature Grid with 3D-like styling */}
          <View style={styles.grid}>
            {FEATURES.map((feat, index) => (
              <Animated.View 
                key={feat.id} 
                entering={FadeInUp.duration(600).delay(index * 100)}
                style={styles.gridItemWrapper}
              >
                <TouchableOpacity 
                  style={styles.gridItem} 
                  activeOpacity={0.7}
                  onPress={() => router.push(feat.route as any)}
                >
                  <View style={[styles.iconCircle, { backgroundColor: feat.color + '20' }]}>
                    <feat.icon color={feat.color} size={28} strokeWidth={1.5} />
                  </View>
                  <Text style={styles.gridItemTitle}>{feat.title}</Text>
                  <ChevronRight color="rgba(255,255,255,0.2)" size={20} style={styles.chevron} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* 3D Asset Highlight */}
          <Text style={styles.sectionTitle}>3D Asset Highlight</Text>
          <View style={styles.highlightCard}>
            <View style={styles.highlightTextCol}>
              <Text style={styles.highlightTitle}>LG DualCool AC</Text>
              <Text style={styles.highlightSub}>Warranty active until 2027</Text>
              <TouchableOpacity style={styles.highlightBtn}>
                <Text style={styles.highlightBtnText}>View 3D Model</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.highlightIconCol}>
              <Box color="#38BDF8" size={60} strokeWidth={1} />
            </View>
          </View>

        </Animated.ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07090F' },
  splineContainer: { ...StyleSheet.absoluteFillObject },
  splineCanvas: { flex: 1, backgroundColor: 'transparent' },
  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000' },
  
  header: { 
    position: 'absolute', top: 50, left: 20, right: 20, zIndex: 100, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    padding: 16, borderRadius: 24, 
    backgroundColor: 'rgba(15, 23, 42, 0.6)', 
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoBox: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#38BDF8', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
  headerSubtitle: { color: '#94A3B8', fontSize: 12, marginTop: 2, fontWeight: '500' },
  authBadge: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  authLocked: { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
  authActive: { backgroundColor: 'rgba(16, 185, 129, 0.15)' },

  loggedOutContainer: { flex: 1, justifyContent: 'flex-end', padding: 20, paddingBottom: 120 },
  glassCardBig: {
    padding: 32, borderRadius: 32, alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.7)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#38BDF8', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 30
  },
  lockIconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(56, 189, 248, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.3)' },
  loginTitle: { color: '#FFF', fontSize: 28, fontWeight: '800', marginBottom: 12, letterSpacing: 0.5 },
  loginDesc: { color: '#94A3B8', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 32, paddingHorizontal: 10 },
  loginBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#38BDF8', paddingHorizontal: 32, paddingVertical: 18, borderRadius: 20, width: '100%', justifyContent: 'center', shadowColor: '#38BDF8', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16 },
  loginBtnText: { color: '#0F172A', fontSize: 16, fontWeight: '700' },

  dashboardScroll: { flex: 1, marginTop: 120 },
  dashboardContent: { padding: 20, paddingBottom: 100 },
  
  statsCard: { 
    padding: 24, borderRadius: 28, marginBottom: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.03)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.4, shadowRadius: 30
  },
  statsGreeting: { color: '#94A3B8', fontSize: 14, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  statsValue: { color: '#FFF', fontSize: 28, fontWeight: '300', marginTop: 4, marginBottom: 24, letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statBox: { alignItems: 'center' },
  statNumber: { color: '#FFF', fontSize: 24, fontWeight: '700' },
  statLabel: { color: '#64748B', fontSize: 12, marginTop: 4, fontWeight: '500' },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.1)' },

  sectionTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginBottom: 16, marginLeft: 4, letterSpacing: 0.5 },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16, marginBottom: 32 },
  gridItemWrapper: { width: '47%' },
  gridItem: { 
    backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: 20, borderRadius: 24,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)',
    aspectRatio: 1, justifyContent: 'center', alignItems: 'flex-start'
  },
  iconCircle: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  gridItemTitle: { color: '#FFF', fontSize: 16, fontWeight: '600', letterSpacing: 0.3 },
  chevron: { position: 'absolute', bottom: 20, right: 20 },

  highlightCard: { 
    flexDirection: 'row', padding: 24, borderRadius: 28, alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.1)', borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.3)'
  },
  highlightTextCol: { flex: 1 },
  highlightTitle: { color: '#FFF', fontSize: 20, fontWeight: '700', marginBottom: 4 },
  highlightSub: { color: '#94A3B8', fontSize: 14, marginBottom: 16 },
  highlightBtn: { backgroundColor: '#38BDF8', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  highlightBtnText: { color: '#0F172A', fontWeight: '700', fontSize: 13 },
  highlightIconCol: { width: 80, height: 80, justifyContent: 'center', alignItems: 'center' }
});
