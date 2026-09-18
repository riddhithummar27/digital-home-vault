import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { supabase } from '../src/lib/supabase';
import { useTheme } from '../src/context/ThemeContext';
import { ShieldCheck, Mail, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

const bgBefore = require('../assets/before log in image.jpeg');

export default function AuthScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const handleAuth = async () => {
    setLoading(true);
    try {
      // BYPASSING SUPABASE AUTHENTICATION FOR NOW
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('mock_auth', 'true');
      router.replace('/setup');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={bgBefore} style={styles.safe} resizeMode="cover">
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        
        <View style={styles.brandContainer}>
          <View style={styles.logoBox}>
            <ShieldCheck color="#FFF" size={48} strokeWidth={1.5} />
          </View>
          <Text style={styles.brandTitle}>{t('auth.brandTitle', 'Digital Home')}</Text>
          <Text style={styles.brandSubtitle}>{t('auth.brandSubtitle', 'Secure Vault Authentication')}</Text>
        </View>

        <View style={[styles.authCard, { backgroundColor: 'rgba(15, 23, 42, 0.75)' }]}>
          
          <View style={[styles.inputGroup, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }]}>
            <Mail color="#94A3B8" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t('auth.email', 'Email Address')}
              placeholderTextColor="#64748B"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={[styles.inputGroup, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }]}>
            <Lock color="#94A3B8" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t('auth.password', 'Password')}
              placeholderTextColor="#64748B"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.submitBtn, { backgroundColor: '#38BDF8', opacity: loading ? 0.7 : 1 }]} 
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#0F172A" /> : (
              <Text style={styles.submitBtnText}>Initialize Vault (Setup Wizard)</Text>
            )}
          </TouchableOpacity>

        </View>

      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  brandContainer: { alignItems: 'center', marginBottom: 48 },
  logoBox: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#38BDF8', justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: '#38BDF8', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 },
  brandTitle: { color: '#FFF', fontSize: 28, fontWeight: '800', letterSpacing: 0.5 },
  brandSubtitle: { color: '#94A3B8', fontSize: 16, marginTop: 4 },
  authCard: { padding: 24, borderRadius: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  inputGroup: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 16, marginBottom: 16, paddingHorizontal: 16 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 18, color: '#FFF', fontSize: 16 },
  submitBtn: { paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 8, shadowColor: '#38BDF8', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16 },
  submitBtnText: { color: '#0F172A', fontSize: 16, fontWeight: '700' },
  toggleBtn: { marginTop: 24, alignItems: 'center' },
  toggleText: { color: '#38BDF8', fontSize: 14, fontWeight: '600' }
});
