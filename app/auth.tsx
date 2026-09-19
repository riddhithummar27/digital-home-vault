import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform, TextInput, Alert, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../src/lib/supabase';

const { width } = Dimensions.get('window');

const PALETTE = {
  bg: '#FAF6F0', 
  woodDark: '#4A2F1D', 
  woodMedium: '#8B5E34', 
  woodLight: '#D4A373', 
  textBlack: '#1A1A1A', 
  textMuted: '#5C4033',
  white: '#FFFFFF', 
};

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // Check if user already has a home setup
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('home_id').eq('id', user.id).single();
          
          if (profile?.home_id) {
            router.replace('/(tabs)/home');
          } else {
            router.replace('/setup');
          }
        }
      } else {
        if (!fullName) {
          Alert.alert('Error', 'Please enter your full name.');
          setLoading(false);
          return;
        }
        
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        
        if (error) throw error;
        Alert.alert('Success', 'Account created! Let\'s setup your vault.');
        router.replace('/setup');
      }
    } catch (error: any) {
      Alert.alert('Authentication Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        
        <View style={styles.logoContainer}>
          <View style={styles.logoShadow}>
            <LinearGradient colors={['#A67B5B', '#6F4E37', '#4A2F1D']} style={styles.logoGradient}>
              <View style={styles.innerWoodBorder}>
                <Ionicons name="shield-checkmark" size={48} color="#FFF8DC" style={styles.woodIconShadow} />
              </View>
            </LinearGradient>
          </View>
          <Text style={styles.title}>Digital Home Vault</Text>
          <Text style={styles.subtitle}>{isLogin ? 'Welcome back to your estate.' : 'Secure your household today.'}</Text>
        </View>

        <View style={styles.formContainer}>
          
          {!isLogin && (
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color={PALETTE.woodMedium} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={PALETTE.textMuted}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          )}

          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color={PALETTE.woodMedium} style={styles.inputIcon} />
            <TextInput 
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={PALETTE.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={PALETTE.woodMedium} style={styles.inputIcon} />
            <TextInput 
              style={styles.input}
              placeholder="Master Password"
              placeholderTextColor={PALETTE.textMuted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleAuth} disabled={loading} activeOpacity={0.9}>
            <LinearGradient colors={['#A67B5B', '#6F4E37', '#4A2F1D']} locations={[0, 0.5, 1]} style={styles.btnGradient}>
              <View style={styles.btnInner}>
                <Text style={styles.btnText}>{loading ? 'Authenticating...' : (isLogin ? 'Unlock Vault' : 'Create Vault')}</Text>
                <Ionicons name={isLogin ? 'key' : 'add-circle'} size={20} color="#FFF8DC" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toggleBtn} onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have a vault? " : "Already have a vault? "}
              <Text style={{fontWeight: '800', color: PALETTE.woodDark}}>{isLogin ? 'Create one.' : 'Log in.'}</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.bg },
  content: { flex: 1, padding: 32, justifyContent: 'center' },
  
  logoContainer: { alignItems: 'center', marginBottom: 48 },
  logoShadow: { borderRadius: 24, shadowColor: '#4A2F1D', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8, marginBottom: 24 },
  logoGradient: { borderRadius: 24, padding: 4 },
  innerWoodBorder: { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 20, width: 80, height: 80, justifyContent: 'center', alignItems: 'center' },
  woodIconShadow: { textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4 },
  title: { color: PALETTE.textBlack, fontSize: 28, fontWeight: '900', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', marginBottom: 8 },
  subtitle: { color: PALETTE.woodMedium, fontSize: 16, fontWeight: '600' },
  
  formContainer: { gap: 16 },
  
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: PALETTE.white, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(74, 47, 29, 0.2)', paddingHorizontal: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 16, fontSize: 16, color: PALETTE.textBlack, fontWeight: '500' },
  
  primaryBtn: { width: '100%', borderRadius: 20, shadowColor: '#4A2F1D', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8, marginTop: 12 },
  btnGradient: { borderRadius: 20, padding: 2 },
  btnInner: { backgroundColor: 'rgba(0,0,0,0.1)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 18, gap: 12 },
  btnText: { color: '#FFF8DC', fontSize: 18, fontWeight: '900', letterSpacing: 1, textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4 },
  
  toggleBtn: { alignItems: 'center', marginTop: 16, padding: 10 },
  toggleText: { color: PALETTE.textMuted, fontSize: 15 },
});
