import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/context/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function MenuScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();

  const sections = [
    { title: t('dashboard.myHome'), items: [
      { label: t('menu.appliances'), icon: 'hardware-chip-outline', route: '/appliances' },
      { label: t('menu.vehicles'), icon: 'car-outline', route: '/vehicles' },
      { label: t('menu.property'), icon: 'home-outline', route: '/property' },
      { label: t('menu.family'), icon: 'people-outline', route: '/family' },
      { label: t('menu.utilities'), icon: 'flash-outline', route: '/utilities' },
    ]},
    { title: '', items: [
      { label: t('menu.warranties'), icon: 'shield-checkmark-outline', route: '/warranties' },
      { label: t('menu.expenses'), icon: 'wallet-outline', route: '/expenses' },
      { label: t('menu.reminders'), icon: 'alarm-outline', route: '/reminders' },
      { label: t('menu.search'), icon: 'search-outline', route: '/search' },
    ]},
    { title: '', items: [
      { label: t('menu.settings'), icon: 'settings-outline', route: '/settings' },
    ]},
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.text }]}>{t('menu.title')}</Text>

        {sections.map((section, si) => (
          <View key={si} style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
            {section.title ? <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{section.title}</Text> : null}
            {section.items.map((item, ii) => (
              <TouchableOpacity key={ii} style={[styles.menuItem, ii < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]} onPress={() => router.push(item.route as any)} activeOpacity={0.6}>
                <View style={[styles.menuIcon, { backgroundColor: colors.surfaceElevated }]}>
                  <Ionicons name={item.icon as any} size={22} color={colors.primary} />
                </View>
                <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 20 },
  sectionCard: { borderRadius: 18, marginBottom: 16, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', paddingHorizontal: 18, paddingTop: 14, paddingBottom: 4, letterSpacing: 0.5 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, gap: 14 },
  menuIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: 16, fontWeight: '600' },
});
