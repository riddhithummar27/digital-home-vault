import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, TextInput, Alert } from 'react-native';
import { supabase } from '../src/lib/supabase';
import { useTheme } from '../src/context/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';

export default function AppliancesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  
  const [newName, setNewName] = useState('');
  const [newBrand, setNewBrand] = useState('');
  
  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appliances')
        .select('*')
        .order('created_at', { ascending: false });

      if (error && error.code !== '42P01') {
        console.error("Error fetching appliances:", error);
      } else {
        setItems(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return Alert.alert("Required", "Please enter an appliance name");
    
    try {
      const { error } = await supabase.from('appliances').insert({
        name: newName,
        brand: newBrand || 'Unknown',
        status: 'active'
      });
      
      if (error) {
        if (error.code === '42P01') {
          Alert.alert("Database Error", "The 'appliances' table hasn't been created in Supabase yet!");
        } else {
          Alert.alert("Error", error.message);
        }
      } else {
        setNewName('');
        setNewBrand('');
        setShowAdd(false);
        fetchItems();
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surfaceElevated }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Appliances</Text>
        <TouchableOpacity onPress={() => setShowAdd(!showAdd)} style={[styles.backBtn, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name={showAdd ? "close" : "add"} size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {showAdd && (
        <Animated.View entering={FadeInUp} style={[styles.addForm, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.formTitle, { color: colors.text }]}>Add New Appliance</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surfaceElevated }]}
            placeholder="Appliance Name (e.g. Living Room AC)"
            placeholderTextColor={colors.textMuted}
            value={newName}
            onChangeText={setNewName}
          />
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surfaceElevated }]}
            placeholder="Brand (e.g. LG, Samsung)"
            placeholderTextColor={colors.textMuted}
            value={newBrand}
            onChangeText={setNewBrand}
          />
          <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.primary }]} onPress={handleAdd}>
            <Text style={styles.submitText}>Save to Vault</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : items.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="hardware-chip-outline" size={64} color={colors.border} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No appliances logged yet.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => (
            <Animated.View 
              entering={FadeInUp.delay(index * 50).springify()} 
              layout={Layout.springify()}
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="snow" size={24} color={colors.primary} />
              </View>
              <View style={styles.cardText}>
                <Text style={[styles.title, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{item.brand}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: colors.success + '20' }]}>
                <Text style={[styles.badgeText, { color: colors.success }]}>Active</Text>
              </View>
            </Animated.View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 16, fontWeight: '600', marginTop: 16 },
  list: { padding: 20, gap: 12 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, borderWidth: 1 },
  iconBox: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  cardText: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, fontWeight: '500' },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  addForm: { margin: 20, padding: 20, borderRadius: 24, borderWidth: 1, gap: 12 },
  formTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 15 },
  submitBtn: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  submitText: { color: '#FFF', fontWeight: '700', fontSize: 16 }
});
