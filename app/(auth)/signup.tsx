import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/context/ThemeContext';
import { supabase } from '../../src/lib/supabase';

export default function SignupScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [homeName, setHomeName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          home_name: homeName,
        }
      }
    });

    setLoading(false);

    if (error) {
      Alert.alert('Signup Failed', error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.header}>
          <Text style={styles.logo}>🏠</Text>
          <Text style={styles.appName}>{t('auth.createHome')}</Text>
          <Text style={styles.subtitle}>{t('auth.signupSubtitle')}</Text>
        </LinearGradient>

        <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.formTitle, { color: colors.text }]}>{t('auth.signup')}</Text>

          {[
            { label: t('auth.fullName'), value: name, setter: setName, placeholder: 'Riddhii', props: {} },
            { label: t('auth.email'), value: email, setter: setEmail, placeholder: 'riddhii@email.com', props: { keyboardType: 'email-address' as const, autoCapitalize: 'none' as const } },
            { label: t('auth.password'), value: password, setter: setPassword, placeholder: '••••••••', props: { secureTextEntry: true } },
            { label: t('auth.homeName'), value: homeName, setter: setHomeName, placeholder: "Riddhii's Home", props: {} },
          ].map((field, i) => (
            <View key={i} style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>{field.label}</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.surfaceElevated, color: colors.text, borderColor: colors.border }]} value={field.value} onChangeText={field.setter} placeholder={field.placeholder} placeholderTextColor={colors.textMuted} {...field.props} />
            </View>
          ))}

          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSignup} activeOpacity={0.8} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>{t('auth.createHome')}</Text>}
          </TouchableOpacity>

          <View style={styles.switchRow}>
            <Text style={[styles.switchText, { color: colors.textSecondary }]}>{t('auth.hasAccount')} </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[styles.switchLink, { color: colors.primary }]}>{t('auth.login')}</Text>
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
  header: { paddingTop: 70, paddingBottom: 45, alignItems: 'center', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  logo: { fontSize: 48, marginBottom: 8 },
  appName: { fontSize: 22, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  formCard: { margin: 20, marginTop: -20, borderRadius: 24, padding: 24, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 },
  formTitle: { fontSize: 24, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 },
  button: { paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 8, marginBottom: 20 },
  buttonText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  switchRow: { flexDirection: 'row', justifyContent: 'center' },
  switchText: { fontSize: 15 },
  switchLink: { fontSize: 15, fontWeight: '700' },
});
