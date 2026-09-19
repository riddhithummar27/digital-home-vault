import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const PALETTE = {
  bg: '#FAF6F0',
  woodDark: '#4A2F1D',
  woodLight: '#D4A373',
  gold: '#8B5E34',
  goldLight: '#A67B5B',
  textDark: '#1A1A1A',
  textMuted: '#5C4033',
  white: '#FFFFFF',
};

export default function SetupWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [propertyName, setPropertyName] = useState('My Digital Home');
  const [rooms, setRooms] = useState({ bedrooms: 3, bathrooms: 2, livingRooms: 1, kitchens: 1 });
  const [appliances, setAppliances] = useState<{room: string, type: string}[]>([]);
  const [family, setFamily] = useState<{id: string, name: string, role: string}[]>([]);

  // Helpers
  const updateRoom = (key: keyof typeof rooms, delta: number) => {
    setRooms(prev => ({ ...prev, [key]: Math.max(0, prev[key] + delta) }));
  };

  const addFamilyMember = () => {
    setFamily([...family, { id: Date.now().toString(), name: '', role: 'Family Member' }]);
  };
  
  const updateFamilyMember = (id: string, field: string, value: string) => {
    setFamily(family.map(f => f.id === id ? { ...f, [field]: value } : f));
  };
  
  const removeFamilyMember = (id: string) => {
    setFamily(family.filter(f => f.id !== id));
  };

  const toggleAppliance = (room: string, type: string) => {
    const exists = appliances.find(a => a.room === room && a.type === type);
    if (exists) {
      setAppliances(appliances.filter(a => !(a.room === room && a.type === type)));
    } else {
      setAppliances([...appliances, { room, type }]);
    }
  };

  const handleComplete = () => {
    setLoading(true);
    // Simulate API call and saving to local storage
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)/home');
    }, 2500);
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${(step / 4) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>Step {step} of 4</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {step < 4 && (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.replace('/auth')} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={PALETTE.woodDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vault Setup</Text>
          <View style={{ width: 44 }} />
        </View>
      )}

      {step < 4 && renderProgressBar()}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* STEP 1: PROPERTY */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Household Topology</Text>
            <Text style={styles.stepDesc}>Let's build the digital blueprint of your home.</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Property Name</Text>
              <TextInput 
                style={styles.input}
                value={propertyName}
                onChangeText={setPropertyName}
                placeholder="e.g. The Royal Villa"
                placeholderTextColor={PALETTE.textMuted}
              />
            </View>

            <Text style={styles.label}>Rooms & Layout</Text>
            {Object.keys(rooms).map((key) => (
              <View key={key} style={styles.counterRow}>
                <Text style={styles.counterLabel}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</Text>
                <View style={styles.counterControls}>
                  <TouchableOpacity onPress={() => updateRoom(key as any, -1)} style={styles.counterBtn}>
                    <Ionicons name="remove" size={20} color={PALETTE.white} />
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{rooms[key as keyof typeof rooms]}</Text>
                  <TouchableOpacity onPress={() => updateRoom(key as any, 1)} style={styles.counterBtn}>
                    <Ionicons name="add" size={20} color={PALETTE.white} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* STEP 2: APPLIANCES */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Asset Discovery</Text>
            <Text style={styles.stepDesc}>Select the major appliances in each room to initialize your vault inventory.</Text>

            {['Bedrooms', 'LivingRooms', 'Kitchens'].map(roomType => {
              const count = rooms[roomType.charAt(0).toLowerCase() + roomType.slice(1) as keyof typeof rooms];
              if (count === 0) return null;
              
              const options = roomType === 'Kitchens' ? ['Refrigerator', 'Microwave', 'Oven', 'Dishwasher'] : ['Air Conditioner', 'Ceiling Fan', 'Smart TV'];
              
              return Array.from({ length: count }).map((_, i) => (
                <View key={`${roomType}-${i}`} style={styles.roomCard}>
                  <Text style={styles.roomTitle}>{roomType.replace('s', '')} {i + 1}</Text>
                  <View style={styles.applianceGrid}>
                    {options.map(app => {
                      const isSelected = appliances.some(a => a.room === `${roomType}-${i}` && a.type === app);
                      return (
                        <TouchableOpacity 
                          key={app} 
                          style={[styles.applianceChip, isSelected && styles.applianceChipSelected]}
                          onPress={() => toggleAppliance(`${roomType}-${i}`, app)}
                        >
                          <Ionicons name={isSelected ? 'checkmark-circle' : 'ellipse-outline'} size={18} color={isSelected ? PALETTE.gold : PALETTE.textMuted} />
                          <Text style={[styles.applianceText, isSelected && {color: PALETTE.woodDark, fontWeight: 'bold'}]}>{app}</Text>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                </View>
              ));
            })}
          </View>
        )}

        {/* STEP 3: FAMILY */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Family Vault</Text>
            <Text style={styles.stepDesc}>Add household members to manage their documents and assign permissions.</Text>

            {family.map((member, index) => (
              <View key={member.id} style={styles.familyCard}>
                <View style={styles.familyHeader}>
                  <Text style={styles.familyTitle}>Member {index + 1}</Text>
                  <TouchableOpacity onPress={() => removeFamilyMember(member.id)}>
                    <Ionicons name="trash-outline" size={20} color="#DC2626" />
                  </TouchableOpacity>
                </View>
                
                <TextInput 
                  style={[styles.input, { marginBottom: 12 }]}
                  value={member.name}
                  onChangeText={(val) => updateFamilyMember(member.id, 'name', val)}
                  placeholder="Full Name"
                  placeholderTextColor={PALETTE.textMuted}
                />
                
                <View style={styles.roleGrid}>
                  {['Spouse', 'Child', 'Parent', 'Other'].map(role => (
                    <TouchableOpacity 
                      key={role}
                      style={[styles.roleChip, member.role === role && styles.roleChipSelected]}
                      onPress={() => updateFamilyMember(member.id, 'role', role)}
                    >
                      <Text style={[styles.roleText, member.role === role && {color: PALETTE.white}]}>{role}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addFamilyBtn} onPress={addFamilyMember}>
              <Ionicons name="add-circle-outline" size={24} color={PALETTE.woodDark} />
              <Text style={styles.addFamilyText}>Add Family Member</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 4: SYNCING */}
        {step === 4 && (
          <View style={styles.loadingContainer}>
            <Ionicons name="shield-checkmark" size={80} color={PALETTE.gold} style={{ marginBottom: 24 }} />
            <Text style={styles.loadingTitle}>Initializing Vault</Text>
            <Text style={styles.loadingDesc}>Encrypting your household topology and securing initial asset graphs...</Text>
            
            <View style={styles.spinnerRow}>
              <Ionicons name="sync" size={24} color={PALETTE.woodLight} />
              <Text style={styles.spinnerText}>Constructing {propertyName} database</Text>
            </View>
            <View style={styles.spinnerRow}>
              <Ionicons name="sync" size={24} color={PALETTE.woodLight} />
              <Text style={styles.spinnerText}>Registering {appliances.length} predicted assets</Text>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer Navigation */}
      {step < 4 && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.primaryBtn} 
            onPress={() => step === 3 ? handleComplete() : setStep(step + 1)}
            activeOpacity={0.9}
          >
            <LinearGradient 
              colors={['#A67B5B', '#6F4E37', '#4A2F1D']} 
              locations={[0, 0.5, 1]}
              style={styles.btnGradient}
            >
              <View style={styles.btnInner}>
                <Text style={styles.btnText}>{step === 3 ? 'Secure & Enter Vault' : 'Continue'}</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF8DC" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: PALETTE.white, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2 },
  headerTitle: { color: PALETTE.textDark, fontSize: 18, fontWeight: 'bold' },
  
  progressContainer: { paddingHorizontal: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(74, 47, 29, 0.1)' },
  progressBarBg: { height: 6, backgroundColor: 'rgba(74, 47, 29, 0.1)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
  progressBarFill: { height: '100%', backgroundColor: PALETTE.woodDark, borderRadius: 3 },
  progressText: { color: PALETTE.textMuted, fontSize: 13, fontWeight: '600', textAlign: 'right' },

  scrollContent: { padding: 24 },
  
  stepContainer: { flex: 1 },
  stepTitle: { color: PALETTE.woodDark, fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  stepDesc: { color: PALETTE.textMuted, fontSize: 15, lineHeight: 22, marginBottom: 32 },

  inputGroup: { marginBottom: 24 },
  label: { color: PALETTE.woodDark, fontSize: 14, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  input: { backgroundColor: PALETTE.white, borderWidth: 1, borderColor: 'rgba(74, 47, 29, 0.2)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: PALETTE.textDark },

  counterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: PALETTE.white, padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(74, 47, 29, 0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  counterLabel: { color: PALETTE.textDark, fontSize: 16, fontWeight: '600' },
  counterControls: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  counterBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: PALETTE.gold, justifyContent: 'center', alignItems: 'center' },
  counterValue: { fontSize: 18, fontWeight: 'bold', color: PALETTE.textDark, width: 24, textAlign: 'center' },

  roomCard: { backgroundColor: PALETTE.white, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(74, 47, 29, 0.2)' },
  roomTitle: { color: PALETTE.woodDark, fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  applianceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  applianceChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: PALETTE.bg, borderWidth: 1, borderColor: 'rgba(74, 47, 29, 0.2)', gap: 6 },
  applianceChipSelected: { backgroundColor: 'rgba(139, 94, 52, 0.1)', borderColor: PALETTE.gold },
  applianceText: { color: PALETTE.textMuted, fontSize: 14 },

  familyCard: { backgroundColor: PALETTE.white, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(74, 47, 29, 0.2)' },
  familyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  familyTitle: { color: PALETTE.textDark, fontSize: 15, fontWeight: 'bold' },
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  roleChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: PALETTE.bg, borderWidth: 1, borderColor: 'rgba(74, 47, 29, 0.2)' },
  roleChipSelected: { backgroundColor: PALETTE.gold, borderColor: PALETTE.woodDark },
  roleText: { color: PALETTE.textMuted, fontSize: 13, fontWeight: '600' },

  addFamilyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, borderStyle: 'dashed', borderWidth: 2, borderColor: 'rgba(74, 47, 29, 0.4)', gap: 8 },
  addFamilyText: { color: PALETTE.woodDark, fontSize: 16, fontWeight: 'bold' },

  // Fixed footer and added massive wood button
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, backgroundColor: PALETTE.bg, borderTopWidth: 1, borderTopColor: 'rgba(74, 47, 29, 0.1)' },
  primaryBtn: { borderRadius: 20, shadowColor: '#4A2F1D', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },
  btnGradient: { borderRadius: 20, padding: 2 },
  btnInner: { backgroundColor: 'rgba(0,0,0,0.1)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 18, gap: 12 },
  btnText: { color: '#FFF8DC', fontSize: 18, fontWeight: '900', letterSpacing: 1.5, textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4 },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  loadingTitle: { color: PALETTE.woodDark, fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  loadingDesc: { color: PALETTE.textMuted, fontSize: 15, textAlign: 'center', paddingHorizontal: 32, marginBottom: 48, lineHeight: 22 },
  spinnerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: PALETTE.white, paddingHorizontal: 20, paddingVertical: 16, borderRadius: 16, marginBottom: 16, width: '100%', borderWidth: 1, borderColor: 'rgba(74, 47, 29, 0.2)' },
  spinnerText: { color: PALETTE.textDark, fontSize: 14, fontWeight: '600', flex: 1 },
});
