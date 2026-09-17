import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { Sparkles } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AssistantScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <Animated.View entering={FadeInDown.springify()} style={styles.center}>
        <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
          <Sparkles color={colors.primary} size={48} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>AI Assistant</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Your smart home intelligence is currently offline.</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  iconBox: { width: 100, height: 100, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 12 },
  subtitle: { fontSize: 16, textAlign: 'center', lineHeight: 24 }
});
