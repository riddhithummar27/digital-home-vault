import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage, LANGUAGES } from '../../src/context/LanguageContext';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { colors, isDark, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{t('menu.settings')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
            <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ true: colors.primary, false: colors.border }} />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Language</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {LANGUAGES.map((lang, i) => (
            <TouchableOpacity key={lang.code} style={[styles.langRow, i < LANGUAGES.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]} onPress={() => setLanguage(lang.code)}>
              <Text style={[styles.langText, { color: colors.text }]}>{lang.nativeName} ({lang.name})</Text>
              {language === lang.code && <Ionicons name="checkmark" size={20} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { fontSize: 22, fontWeight: '800' },
  content: { padding: 16 },
  card: { borderRadius: 16, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '600' },
  sectionTitle: { fontSize: 14, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8, paddingHorizontal: 8 },
  langRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14 },
  langText: { fontSize: 15, fontWeight: '500' },
});
