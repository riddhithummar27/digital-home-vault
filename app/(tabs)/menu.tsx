import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/context/ThemeContext';
import { Menu, Settings, LogOut, Bell, Shield, User, Globe } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'expo-router';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'te', label: 'తెలుగు (Telugu)' }
];

export default function MenuScreen() {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/auth');
  };

  const changeLanguage = (langCode: string, langLabel: string) => {
    Alert.alert(
      'Change Language',
      `Are you sure you want to switch the app language to ${langLabel}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Yes, Switch', 
          onPress: () => {
            i18n.changeLanguage(langCode);
            Alert.alert('Language Updated', `The app is now running in ${langLabel}.`);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('menu.settings', 'Settings')}</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('menu.appLanguage', 'App Language')}</Text>
        <View style={styles.langGrid}>
          {LANGUAGES.map((lang, index) => (
            <Animated.View key={lang.code} entering={FadeInUp.delay(index * 50).springify()} style={styles.langWrapper}>
              <TouchableOpacity 
                style={[
                  styles.langBtn, 
                  { backgroundColor: i18n.language === lang.code ? colors.primary : colors.surfaceElevated,
                    borderColor: i18n.language === lang.code ? colors.primary : colors.border }
                ]}
                onPress={() => changeLanguage(lang.code, lang.label)}
              >
                <Text style={[
                  styles.langText, 
                  { color: i18n.language === lang.code ? '#FFF' : colors.text }
                ]}>
                  {lang.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 24 }]}>{t('menu.preferences', 'Preferences')}</Text>
        <View style={styles.list}>
          {[
            { icon: User, label: t('menu.profile', 'Profile Settings') },
            { icon: Shield, label: t('menu.security', 'Security & Face ID') },
            { icon: Bell, label: t('menu.notifications', 'Notifications') },
          ].map((item, index) => (
            <Animated.View key={index} entering={FadeInUp.delay((index + 4) * 100).springify()}>
              <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.iconBox, { backgroundColor: colors.primary + '10' }]}>
                  <item.icon color={colors.primary} size={20} />
                </View>
                <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}

          <Animated.View entering={FadeInUp.delay(800).springify()}>
            <TouchableOpacity onPress={handleLogout} style={[styles.menuItem, { backgroundColor: '#FEE2E2', borderColor: '#FECACA', marginTop: 16 }]}>
              <View style={[styles.iconBox, { backgroundColor: '#EF4444' + '20' }]}>
                <LogOut color="#EF4444" size={20} />
              </View>
              <Text style={[styles.menuLabel, { color: '#EF4444' }]}>{t('menu.logout', 'Log Out')}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 100 },
  header: { padding: 24, paddingTop: 12 },
  headerTitle: { fontSize: 32, fontWeight: '800', letterSpacing: 0.5 },
  sectionTitle: { fontSize: 14, fontWeight: '700', textTransform: 'uppercase', paddingHorizontal: 24, marginBottom: 12 },
  
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 12 },
  langWrapper: { width: '47%' },
  langBtn: { paddingVertical: 14, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  langText: { fontSize: 14, fontWeight: '600' },

  list: { padding: 20, paddingTop: 0, gap: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, borderWidth: 1 },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  menuLabel: { fontSize: 16, fontWeight: '600' }
});
