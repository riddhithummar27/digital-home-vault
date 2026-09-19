import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

// Light Brown Wood, Cream, Black Theme
const PALETTE = {
  bg: '#FAF6F0', // Cream
  woodDark: '#4A2F1D', // Dark Wood
  woodMedium: '#8B5E34', // Medium Wood
  woodLight: '#D4A373', // Light Wood
  textBlack: '#1A1A1A', // Black
  textMuted: '#5C4033', // Deep Brown Muted
};

const slides = [
  { key: '1', titleKey: 'onboarding.title1', descKey: 'onboarding.desc1', icon: 'home' },
  { key: '2', titleKey: 'onboarding.title2', descKey: 'onboarding.desc2', icon: 'hardware-chip' },
  { key: '3', titleKey: 'onboarding.title3', descKey: 'onboarding.desc3', icon: 'notifications' },
];

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
      setActiveIndex(activeIndex + 1);
    } else {
      router.push('/auth'); 
    }
  };

  const renderSlide = ({ item }: { item: typeof slides[0] }) => (
    <View style={[styles.slide, { width }]}>
      
      {/* Top Graphic Area (Cream with Wooden Carved Element) */}
      <View style={styles.graphicArea}>
        <View style={styles.woodCarvingBlock}>
          <LinearGradient 
            colors={[PALETTE.woodMedium, PALETTE.woodDark]} 
            style={styles.woodTexture}
          >
            <View style={styles.innerCarve}>
              <Ionicons name={item.icon as any} size={64} color="#FFF8DC" style={styles.woodIcon} />
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* Text Area */}
      <View style={styles.contentArea}>
        <Text style={styles.title}>{t(item.titleKey)}</Text>
        <Text style={styles.description}>{t(item.descKey)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
        keyExtractor={(item) => item.key}
      />

      <View style={styles.bottomArea}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: i === activeIndex ? PALETTE.woodDark : '#E5D3B3' }]} />
          ))}
        </View>

        {/* Real Wood Textured Button */}
        <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.9}>
          <LinearGradient 
            colors={['#A67B5B', '#6F4E37', '#4A2F1D']} 
            locations={[0, 0.5, 1]}
            style={styles.woodButtonGradient}
          >
            <View style={styles.woodButtonInner}>
              <Text style={styles.buttonText}>
                {activeIndex === slides.length - 1 ? t('onboarding.getStarted') : t('common.next')}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {activeIndex < slides.length - 1 && (
          <TouchableOpacity onPress={() => router.push('/auth')} style={styles.skipButton}>
            <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.bg },
  slide: { flex: 1 },
  
  graphicArea: { height: height * 0.45, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20 },
  woodCarvingBlock: {
    width: 160, height: 160, borderRadius: 32,
    backgroundColor: PALETTE.woodMedium,
    shadowColor: '#000', shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 15,
    borderWidth: 2, borderColor: '#3E2723',
    transform: [{ rotate: '45deg' }] // Diamond shape
  },
  woodTexture: { flex: 1, borderRadius: 30, justifyContent: 'center', alignItems: 'center', padding: 8 },
  innerCarve: { flex: 1, width: '100%', borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.1)', borderWidth: 1, borderColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  woodIcon: { transform: [{ rotate: '-45deg' }], textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4 },
  
  contentArea: { flex: 1, paddingHorizontal: 32, paddingTop: 40, alignItems: 'center' },
  title: { color: PALETTE.textBlack, fontSize: 30, fontWeight: '900', textAlign: 'center', marginBottom: 16 },
  description: { color: PALETTE.textMuted, fontSize: 17, textAlign: 'center', lineHeight: 26 },
  
  // Fixed Collision: Pushed bottom area up and ensured contentArea doesn't overlap
  bottomArea: { height: 180, justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 32, backgroundColor: PALETTE.bg },
  dots: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  
  button: { width: '100%', borderRadius: 20, shadowColor: '#4A2F1D', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },
  woodButtonGradient: { borderRadius: 20, padding: 2 }, // Outer border effect
  woodButtonInner: { backgroundColor: 'rgba(0,0,0,0.1)', paddingVertical: 18, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#FFF8DC', fontSize: 19, fontWeight: '900', letterSpacing: 1.5, textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4 },
  
  skipButton: { marginTop: 20, padding: 8 },
  skipText: { color: PALETTE.textMuted, fontSize: 16, fontWeight: '700' },
});
