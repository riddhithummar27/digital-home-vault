import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../src/lib/supabase';
import { useTheme } from '../src/context/ThemeContext';
import { ShieldCheck, Mail, Lock } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export default function AuthScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Required', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        Alert.alert('Success', 'Account created! Please sign in.');
        setIsSignUp(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Successful login
        router.replace('/(tabs)/home');
      }
    } catch (error: any) {
      Alert.alert('Authentication Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: '#07090F' }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        
        <Animated.View entering={FadeInDown.duration(800)} style={styles.brandContainer}>
          <View style={styles.logoBox}>
            <ShieldCheck color="#FFF" size={48} strokeWidth={1.5} />
          </View>
          <Text style={styles.brandTitle}>Digital Home</Text>
          <Text style={styles.brandSubtitle}>Secure Vault Authentication</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(800).delay(200)} style={[styles.authCard, { backgroundColor: 'rgba(15, 23, 42, 0.7)' }]}>
          
          <View style={[styles.inputGroup, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }]}>
            <Mail color="#94A3B8" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
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
              placeholder="Password"
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
              <Text style={styles.submitBtnText}>{isSignUp ? 'Create Vault Account' : 'Unlock Vault'}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={styles.toggleBtn}>
            <Text style={styles.toggleText}>
              {isSignUp ? 'Already have a vault? Sign In' : 'New user? Create a Vault Account'}
            </Text>
          </TouchableOpacity>

        </Animated.View>

      </KeyboardAvoidingView>
    </SafeAreaView>
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
