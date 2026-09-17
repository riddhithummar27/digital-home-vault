import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/context/ThemeContext';
import { supabase } from '../../src/lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Login Failed', error.message);
    } else {
      router.replace('/(tabs)/home');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const redirectUrl = Linking.createURL('/(tabs)/home');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      
      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        if (result.type === 'success' && result.url) {
          // Trigger URL listener in _layout to catch the auth token session
          Linking.openURL(result.url);
        }
      }
    } catch (err: any) {
      Alert.alert('Google Login Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.header}>
          <Text style={styles.logo}>🏠</Text>
          <Text style={styles.appName}>{t('app.name')}</Text>
          <Text style={styles.subtitle}>{t('auth.loginSubtitle')}</Text>
        </LinearGradient>

        <View style={[styles.formCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
          <Text style={[styles.formTitle, { color: colors.text }]}>{t('auth.login')}</Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t('auth.email')}</Text>
            <TextInput style={[styles.input, { backgroundColor: colors.surfaceElevated, color: colors.text, borderColor: colors.border }]} value={email} onChangeText={setEmail} placeholder="riddhii@email.com" placeholderTextColor={colors.textMuted} keyboardType="email-address" autoCapitalize="none" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t('auth.password')}</Text>
            <TextInput style={[styles.input, { backgroundColor: colors.surfaceElevated, color: colors.text, borderColor: colors.border }]} value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor={colors.textMuted} secureTextEntry />
          </View>

          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
            <Text style={[styles.forgot, { color: colors.accent }]}>{t('auth.forgotPassword')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} activeOpacity={0.8} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>{t('auth.login')}</Text>}
          </TouchableOpacity>

          <Text style={[styles.orText, { color: colors.textMuted }]}>{t('auth.orContinueWith')}</Text>

          <View style={styles.socialRow}>
            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]} onPress={handleGoogleLogin} disabled={loading}>
              <Text style={styles.socialIcon}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]} disabled={loading}>
              <Text style={styles.socialIcon}>🍎</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switchRow}>
            <Text style={[styles.switchText, { color: colors.textSecondary }]}>{t('auth.noAccount')} </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text style={[styles.switchLink, { color: colors.primary }]}>{t('auth.signup')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1 },
  header: { paddingTop: 80, paddingBottom: 50, alignItems: 'center', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  logo: { fontSize: 56, marginBottom: 8 },
  appName: { fontSize: 24, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  formCard: { margin: 20, marginTop: -20, borderRadius: 24, padding: 24, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8 },
  formTitle: { fontSize: 24, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 },
  forgot: { textAlign: 'right', fontSize: 14, fontWeight: '600', marginBottom: 24 },
  button: { paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  orText: { textAlign: 'center', marginBottom: 16, fontSize: 14 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 24 },
  socialBtn: { width: 56, height: 56, borderRadius: 16, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  socialIcon: { fontSize: 22, fontWeight: '700' },
  switchRow: { flexDirection: 'row', justifyContent: 'center' },
  switchText: { fontSize: 15 },
  switchLink: { fontSize: 15, fontWeight: '700' },
});
