import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../src/context/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const slides = [
  { key: '1', titleKey: 'onboarding.title1', descKey: 'onboarding.desc1', emoji: '🏠', gradient: ['#6B4226', '#8B5E3C'] as const },
  { key: '2', titleKey: 'onboarding.title2', descKey: 'onboarding.desc2', emoji: '🤖', gradient: ['#4A2E1A', '#6B4226'] as const },
  { key: '3', titleKey: 'onboarding.title3', descKey: 'onboarding.desc3', emoji: '🔔', gradient: ['#8B5E3C', '#D4A574'] as const },
];

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
      setActiveIndex(activeIndex + 1);
    } else {
      router.push('/(tabs)/home'); // Bypassed auth directly to home
    }
  };

  const renderSlide = ({ item }: { item: typeof slides[0] }) => (
    <View style={[styles.slide, { width }]}>
      <LinearGradient colors={[...item.gradient]} style={styles.gradientBg}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{item.emoji}</Text>
        </View>
        <View style={styles.threeDCard}>
          <View style={styles.threeDCardInner}>
            <Text style={styles.threeDIcon}>🏡</Text>
            <View style={styles.threeDLines}>
              <View style={[styles.threeDLine, { width: '80%' }]} />
              <View style={[styles.threeDLine, { width: '60%' }]} />
              <View style={[styles.threeDLine, { width: '40%' }]} />
            </View>
          </View>
        </View>
      </LinearGradient>
      <View style={[styles.contentArea, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>{t(item.titleKey)}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>{t(item.descKey)}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
            <View key={i} style={[styles.dot, { backgroundColor: i === activeIndex ? colors.primary : colors.border }]} />
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]} 
          onPress={handleNext} 
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {activeIndex === slides.length - 1 ? t('onboarding.getStarted') : t('common.next')}
          </Text>
        </TouchableOpacity>

        {activeIndex < slides.length - 1 && (
          <TouchableOpacity onPress={() => router.push('/(tabs)/home')} style={styles.skipButton}>
            <Text style={[styles.skipText, { color: colors.textMuted }]}>{t('onboarding.skip')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: { flex: 1 },
  gradientBg: { height: height * 0.5, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  emojiContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  emoji: { fontSize: 48 },
  threeDCard: { width: width * 0.7, height: 140, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 20, transform: [{ perspective: 800 }, { rotateX: '-5deg' }, { rotateY: '5deg' }], shadowColor: '#000', shadowOffset: { width: 8, height: 12 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 12 },
  threeDCardInner: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  threeDIcon: { fontSize: 40 },
  threeDLines: { flex: 1, gap: 10 },
  threeDLine: { height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4 },
  contentArea: { flex: 1, paddingHorizontal: 32, paddingTop: 40, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 16 },
  description: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  bottomArea: { position: 'absolute', bottom: 50, left: 0, right: 0, alignItems: 'center', paddingHorizontal: 32 },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  button: { width: '100%', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  skipButton: { marginTop: 16 },
  skipText: { fontSize: 16 },
});
