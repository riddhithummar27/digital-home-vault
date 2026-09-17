import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { supabase } from '../../src/lib/supabase';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Check your email for the password reset link!');
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.logo}>🔐</Text>
        <Text style={styles.appName}>Reset Password</Text>
      </LinearGradient>
      
      <View style={[styles.formCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
        <Text style={[styles.instructions, { color: colors.textSecondary }]}>Enter the email address associated with your home vault. We'll send you a secure link to reset your password.</Text>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Email Address</Text>
          <TextInput style={[styles.input, { backgroundColor: colors.surfaceElevated, color: colors.text, borderColor: colors.border }]} value={email} onChangeText={setEmail} placeholder="riddhii@email.com" placeholderTextColor={colors.textMuted} keyboardType="email-address" autoCapitalize="none" />
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleReset} disabled={loading} activeOpacity={0.8}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Send Reset Link</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingBottom: 40, alignItems: 'center', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  backBtn: { position: 'absolute', top: 50, left: 20, padding: 8 },
  logo: { fontSize: 48, marginBottom: 8 },
  appName: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  formCard: { margin: 20, marginTop: -20, borderRadius: 24, padding: 24, elevation: 8, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
  instructions: { fontSize: 14, lineHeight: 20, marginBottom: 24, textAlign: 'center' },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 },
  button: { paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
});
