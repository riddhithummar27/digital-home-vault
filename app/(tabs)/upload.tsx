import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Light Brown Wood, Cream, Black Theme
const PALETTE = {
  bg: '#FAF6F0', 
  woodDark: '#4A2F1D', 
  woodMedium: '#8B5E34', 
  woodLight: '#D4A373', 
  textBlack: '#1A1A1A', 
  textMuted: '#5C4033',
  white: '#FFFFFF', 
  gold: '#D4AF37',
};

const STEPS = [
  { key: 'step1', label: 'Scanning Document...', icon: 'scan-outline', duration: 1200 },
  { key: 'step2', label: 'Running True AI OCR...', icon: 'bulb-outline', duration: 1500 },
  { key: 'step3', label: 'Extracting Entities & Dates...', icon: 'analytics-outline', duration: 1800 },
  { key: 'step4', label: 'Linking to Household Graph...', icon: 'git-network-outline', duration: 1000 },
];

export default function UploadScreen() {
  const { t } = useTranslation();
  
  const [stage, setStage] = useState<'idle' | 'processing' | 'done'>('idle');
  const [currentStep, setCurrentStep] = useState(-1);
  const [extractedData, setExtractedData] = useState<any>(null);
  
  const progressAnims = useRef(STEPS.map(() => new Animated.Value(0))).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scannerAnim = useRef(new Animated.Value(0)).current;

  // Simulate scanning radar
  useEffect(() => {
    if (stage === 'idle') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scannerAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(scannerAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      scannerAnim.stopAnimation();
    }
  }, [stage]);

  const simulateScan = () => {
    setStage('processing');
    setCurrentStep(0);
    progressAnims.forEach(anim => anim.setValue(0));
    fadeAnim.setValue(0);
    setExtractedData(null);

    let stepIndex = 0;
    const processNextStep = () => {
      if (stepIndex >= STEPS.length) {
        setStage('done');
        
        // Dummy Extracted Data (Flawless Simulation)
        setExtractedData({
          documentType: 'Warranty Invoice',
          confidence: '98%',
          linkedAsset: 'Daikin 1.5 Ton AC',
          fields: [
            { key: 'Brand', value: 'Daikin' },
            { key: 'Purchase Date', value: '18 Sep 2026' },
            { key: 'Amount', value: '₹42,500' },
            { key: 'Warranty Expiry', value: '18 Sep 2028' },
            { key: 'Seller', value: 'Reliance Digital' }
          ]
        });

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
        return;
      }

      Animated.timing(progressAnims[stepIndex], {
        toValue: 1,
        duration: STEPS[stepIndex].duration,
        useNativeDriver: false,
      }).start(() => {
        stepIndex++;
        setCurrentStep(stepIndex);
        processNextStep();
      });
    };

    processNextStep();
  };

  const reset = () => {
    setStage('idle');
    setCurrentStep(-1);
    setExtractedData(null);
  };

  const renderIdle = () => (
    <View style={styles.idleContainer}>
      <Text style={styles.idleTitle}>Intelligent Scanner</Text>
      <Text style={styles.idleDesc}>Upload receipts, warranties, or property deeds. Our AI will extract dates, prices, and link them to your assets automatically.</Text>
      
      <View style={styles.scannerBox}>
        <Ionicons name="document-text" size={80} color="rgba(74, 47, 29, 0.1)" />
        <Animated.View style={[styles.scannerLine, { 
          transform: [{ 
            translateY: scannerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-80, 80]
            }) 
          }] 
        }]} />
        {/* Corner Brackets */}
        <View style={[styles.bracket, styles.tl]} />
        <View style={[styles.bracket, styles.tr]} />
        <View style={[styles.bracket, styles.bl]} />
        <View style={[styles.bracket, styles.br]} />
      </View>

      <TouchableOpacity style={styles.woodButton} onPress={simulateScan} activeOpacity={0.9}>
        <LinearGradient colors={['#A67B5B', '#6F4E37', '#4A2F1D']} locations={[0, 0.5, 1]} style={styles.woodButtonGradient}>
          <View style={styles.woodButtonInner}>
            <Ionicons name="camera" size={24} color="#FFF8DC" />
            <Text style={styles.buttonText}>Scan Document</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.secondaryBtn} onPress={() => alert('Opens native file picker to select PDF or image.')}>
        <Ionicons name="folder-open-outline" size={20} color={PALETTE.woodDark} />
        <Text style={styles.secondaryBtnText}>Upload from Files</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProcessing = () => (
    <View style={styles.processingContainer}>
      <Text style={styles.processingTitle}>AI Extraction</Text>
      
      <View style={styles.stepsContainer}>
        {STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isPast = index < currentStep;
          
          return (
            <View key={step.key} style={styles.stepRow}>
              <View style={[styles.stepIconBox, isPast && styles.stepIconBoxDone, isActive && styles.stepIconBoxActive]}>
                <Ionicons name={step.icon as any} size={20} color={isPast || isActive ? PALETTE.white : PALETTE.textMuted} />
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepLabel, (isActive || isPast) && styles.stepLabelActive]}>
                  {step.label}
                </Text>
                <View style={styles.progressBarBg}>
                  <Animated.View style={[
                    styles.progressBarFill, 
                    { width: progressAnims[index].interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }
                  ]} />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderDone = () => (
    <Animated.ScrollView contentContainerStyle={styles.doneContainer} style={{ opacity: fadeAnim }} showsVerticalScrollIndicator={false}>
      <View style={styles.successHeader}>
        <View style={styles.successIconRing}>
          <Ionicons name="checkmark-circle" size={50} color="#10B981" />
        </View>
        <Text style={styles.successTitle}>Scan Complete</Text>
        <Text style={styles.successSubtitle}>Document successfully added to vault.</Text>
      </View>

      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultDocType}>{extractedData.documentType}</Text>
          <View style={styles.confidenceBadge}>
            <Ionicons name="sparkles" size={14} color={PALETTE.woodDark} />
            <Text style={styles.confidenceText}>{extractedData.confidence} Match</Text>
          </View>
        </View>
        
        <View style={styles.linkAlert}>
          <Ionicons name="link" size={18} color={PALETTE.woodDark} />
          <Text style={styles.linkText}>Linked to: <Text style={{fontWeight: 'bold'}}>{extractedData.linkedAsset}</Text></Text>
        </View>

        <View style={styles.fieldsContainer}>
          {extractedData.fields.map((f: any, i: number) => (
            <View key={i} style={styles.fieldRow}>
              <Text style={styles.fieldKey}>{f.key}</Text>
              <Text style={styles.fieldValue}>{f.value}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.woodButton} onPress={reset} activeOpacity={0.9}>
        <LinearGradient colors={['#A67B5B', '#6F4E37', '#4A2F1D']} locations={[0, 0.5, 1]} style={styles.woodButtonGradient}>
          <View style={styles.woodButtonInner}>
            <Ionicons name="scan" size={24} color="#FFF8DC" />
            <Text style={styles.buttonText}>Scan Another</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.ScrollView>
  );

  return (
    <View style={styles.container}>
      {stage === 'idle' && renderIdle()}
      {stage === 'processing' && renderProcessing()}
      {stage === 'done' && renderDone()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.bg, paddingTop: 60, paddingHorizontal: 24 },
  
  // Idle UI
  idleContainer: { flex: 1, alignItems: 'center' },
  idleTitle: { color: PALETTE.textBlack, fontSize: 32, fontWeight: '900', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', marginBottom: 12 },
  idleDesc: { color: PALETTE.textMuted, fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 40 },
  
  scannerBox: { width: 220, height: 260, backgroundColor: PALETTE.white, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 40, borderWidth: 1, borderColor: 'rgba(74, 47, 29, 0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
  scannerLine: { position: 'absolute', width: '80%', height: 3, backgroundColor: PALETTE.woodLight, shadowColor: PALETTE.woodMedium, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 8, elevation: 10 },
  bracket: { position: 'absolute', width: 20, height: 20, borderColor: PALETTE.woodMedium, borderWidth: 0 },
  tl: { top: 16, left: 16, borderTopWidth: 3, borderLeftWidth: 3 },
  tr: { top: 16, right: 16, borderTopWidth: 3, borderRightWidth: 3 },
  bl: { bottom: 16, left: 16, borderBottomWidth: 3, borderLeftWidth: 3 },
  br: { bottom: 16, right: 16, borderBottomWidth: 3, borderRightWidth: 3 },

  secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8, marginTop: 12 },
  secondaryBtnText: { color: PALETTE.woodDark, fontSize: 16, fontWeight: '700' },

  // Processing UI
  processingContainer: { flex: 1, justifyContent: 'center' },
  processingTitle: { color: PALETTE.textBlack, fontSize: 32, fontWeight: '900', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', marginBottom: 40, textAlign: 'center' },
  stepsContainer: { backgroundColor: PALETTE.white, borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 5 },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  stepIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: PALETTE.bg, justifyContent: 'center', alignItems: 'center', marginRight: 16, borderWidth: 1, borderColor: 'rgba(74, 47, 29, 0.1)' },
  stepIconBoxActive: { backgroundColor: PALETTE.woodMedium, borderColor: PALETTE.woodDark },
  stepIconBoxDone: { backgroundColor: '#10B981', borderColor: '#059669' },
  stepContent: { flex: 1 },
  stepLabel: { color: PALETTE.textMuted, fontSize: 15, fontWeight: '600', marginBottom: 8 },
  stepLabelActive: { color: PALETTE.textBlack },
  progressBarBg: { height: 6, backgroundColor: PALETTE.bg, borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: PALETTE.woodMedium, borderRadius: 3 },

  // Done UI
  doneContainer: { paddingBottom: 100 },
  successHeader: { alignItems: 'center', marginBottom: 32 },
  successIconRing: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(16, 185, 129, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  successTitle: { color: PALETTE.textBlack, fontSize: 28, fontWeight: '900', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', marginBottom: 8 },
  successSubtitle: { color: PALETTE.textMuted, fontSize: 16 },
  
  resultCard: { backgroundColor: PALETTE.white, borderRadius: 24, padding: 24, marginBottom: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 5, borderWidth: 1, borderColor: 'rgba(74, 47, 29, 0.1)' },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  resultDocType: { color: PALETTE.woodDark, fontSize: 18, fontWeight: '800' },
  confidenceBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(139, 94, 52, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
  confidenceText: { color: PALETTE.woodDark, fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  linkAlert: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(74, 47, 29, 0.05)', padding: 12, borderRadius: 12, gap: 8, marginBottom: 24 },
  linkText: { color: PALETTE.woodDark, fontSize: 14 },
  
  fieldsContainer: { gap: 16 },
  fieldRow: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: PALETTE.bg, paddingBottom: 12 },
  fieldKey: { color: PALETTE.textMuted, fontSize: 14, fontWeight: '600' },
  fieldValue: { color: PALETTE.textBlack, fontSize: 14, fontWeight: '800' },

  // Universal Button
  woodButton: { width: '100%', borderRadius: 20, shadowColor: '#4A2F1D', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },
  woodButtonGradient: { borderRadius: 20, padding: 2 },
  woodButtonInner: { backgroundColor: 'rgba(0,0,0,0.1)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 18, gap: 12 },
  buttonText: { color: '#FFF8DC', fontSize: 18, fontWeight: '900', letterSpacing: 1.5, textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4 },
});
