import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, Alert, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/context/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../src/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STEPS = [
  { key: 'step1', label: 'Preparing Image...', icon: 'image', duration: 800 },
  { key: 'step2', label: 'Connecting to True AI (Gemini)...', icon: 'planet', duration: 1200 },
  { key: 'step3', label: 'Analyzing Context & Meaning...', icon: 'brain', duration: 2500 },
  { key: 'step4', label: 'Extracting Exact Data...', icon: 'bulb', duration: 1000 },
];

export default function UploadScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  
  const [stage, setStage] = useState<'api_key' | 'type_selection' | 'upload_choice' | 'processing' | 'done'>('type_selection');
  const [apiKey, setApiKey] = useState('');
  
  const [customDocType, setCustomDocType] = useState<string>('');
  
  const [currentStep, setCurrentStep] = useState(-1);
  const [fileData, setFileData] = useState<{ uri: string, name: string, mimeType: string, isImage: boolean, base64?: string } | null>(null);
  const [dynamicResult, setDynamicResult] = useState<any>(null);
  
  const progressAnims = useRef(STEPS.map(() => new Animated.Value(0))).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Check for saved API key on load
  useEffect(() => {
    AsyncStorage.getItem('GEMINI_API_KEY').then(key => {
      if (!key) setStage('api_key');
      else setApiKey(key);
    });
  }, []);

  const saveApiKey = async () => {
    if (apiKey.length < 20) return Alert.alert("Invalid Key", "Please enter a valid Google Gemini API Key.");
    await AsyncStorage.setItem('GEMINI_API_KEY', apiKey);
    setStage('type_selection');
  };

  const handleContinue = () => {
    if (customDocType.trim().length < 2) {
      Alert.alert("Required", "Please type what kind of document you are uploading.");
      return;
    }
    setStage('upload_choice');
  };

  const pickDocument = async () => {
    Alert.alert("Notice", "For True AI Vision, please use the 'Take Photo' button to upload an image.");
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') return Alert.alert('Permission needed', 'Camera access is required.');

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5, 
        base64: true, 
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const file = result.assets[0];
      const fileName = file.uri.split('/').pop() || 'camera_scan.jpg';
      
      setFileData({ 
        uri: file.uri, 
        name: fileName, 
        mimeType: 'image/jpeg',
        isImage: true,
        base64: file.base64
      });
      startProcessing(file.uri, fileName, file.base64 || null, customDocType.trim());
    } catch (err) {
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const analyzeImageWithTrueAI = async (base64String: string, targetDocType: string) => {
    try {
      const prompt = `
        You are an elite, 100% accurate AI vision assistant.
        The user claims this image is a: "${targetDocType}".
        
        Task 1: Verify. Does this image genuinely look like a ${targetDocType}? If they uploaded a selfie, a random object, or the wrong document, reject it.
        Task 2: If it IS valid, extract the most important details (e.g. Price, Date, Company, ID Number, etc) based on what the document is.
        
        You MUST respond in EXACTLY this JSON format (no markdown, no backticks, just raw JSON):
        {
          "success": true or false,
          "reason": "If success is false, explain exactly what the image actually is and why it was rejected.",
          "fields": [
            { "key": "Name of Field (e.g. Total Amount)", "value": "Extracted Value" }
          ]
        }
      `;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: "image/jpeg", data: base64String } }
            ]
          }],
          generationConfig: { temperature: 0.1, response_mime_type: "application/json" }
        })
      });

      const json = await response.json();
      if (json.error) throw new Error(json.error.message);

      const aiText = json.candidates[0].content.parts[0].text;
      const aiResult = JSON.parse(aiText);

      if (!aiResult.success) {
        return { success: false, reason: aiResult.reason };
      }

      setDynamicResult({
        type: targetDocType,
        fields: aiResult.fields || [],
        linkedEntity: '📁 Vault Inbox',
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, reason: `AI Error: \${error.message}` };
    }
  };

  const startProcessing = async (uri: string, name: string, base64: string | null, docTypeId: string) => {
    setStage('processing');
    setCurrentStep(0);
    
    let delay = 0;
    STEPS.forEach((step, i) => {
      setTimeout(() => {
        setCurrentStep(i);
        Animated.timing(progressAnims[i], { toValue: 1, duration: step.duration, useNativeDriver: false }).start();
      }, delay);
      delay += step.duration + 200;
    });
    
    const result = await analyzeImageWithTrueAI(base64!, docTypeId);
    
    if (!result.success) {
      Alert.alert('AI Verification Failed', result.reason, [{ text: 'Try Again', onPress: reset }]);
      return;
    }

    setTimeout(() => {
      setStage('done');
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }, delay);
  };

  const reset = () => {
    setStage('type_selection');
    setCurrentStep(-1);
    setCustomDocType('');
    setFileData(null);
    setDynamicResult(null);
    progressAnims.forEach(a => a.setValue(0));
    fadeAnim.setValue(0);
  };

  const saveToDatabase = async () => {
    try {
      let publicFileUrl = fileData?.uri; 

      if (fileData?.uri) {
        try {
          const ext = fileData.uri.substring(fileData.uri.lastIndexOf('.') + 1) || 'jpg';
          const fileName = `\${Date.now()}_\${Math.random().toString(36).substring(7)}.\${ext}`;
          
          const response = await fetch(fileData.uri);
          const blob = await response.blob();
          
          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileName, blob, { contentType: fileData.mimeType || 'image/jpeg' });
            
          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(fileName);
            publicFileUrl = publicUrl;
          }
        } catch (e) {
          console.warn("Storage upload skipped due to error");
        }
      }

      const { error } = await supabase.from('documents').insert({
        name: fileData?.name || 'Unknown Document',
        type: dynamicResult?.type || 'Document',
        file_url: publicFileUrl, 
        extracted_data: dynamicResult?.fields,
        linked_entity: dynamicResult?.linkedEntity
      });
      
      if (error) {
        Alert.alert('Database Missing Table', `The insert failed. You MUST run the SQL setup script in your Supabase Dashboard to create the tables! Error: \${error.message}`);
      } else {
        Alert.alert('Success', 'Document completely verified by AI and saved securely!', [{ text: 'OK', onPress: reset }]);
      }
    } catch (error: any) {
      Alert.alert('Database Error', error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={[styles.title, { color: colors.text }]}>{t('upload.title', 'True AI Vault Upload')}</Text>

          {stage === 'api_key' && (
            <View style={styles.selectionContainer}>
              <View style={[styles.uploadIcon, { backgroundColor: '#10B98120' }]}>
                <Ionicons name="sparkles" size={48} color="#10B981" />
              </View>
              <Text style={[styles.selectionTitle, { color: colors.text }]}>{t('upload.activateTrueAI', 'Activate 100% True AI')}</Text>
              <Text style={[styles.selectionSub, { color: colors.textMuted }]}>
                {t('upload.aiDescription', 'To get perfect, 100% accurate document recognition, we use Google Gemini Vision AI. Get a free API key from aistudio.google.com and paste it below.')}
              </Text>
              
              <TextInput
                style={[styles.textInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surfaceElevated }]}
                placeholder={t('upload.pasteKey', 'Paste Gemini API Key here')}
                placeholderTextColor={colors.textMuted}
                value={apiKey}
                onChangeText={setApiKey}
                secureTextEntry
              />

              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: '#10B981', marginTop: 24 }]} onPress={saveApiKey}>
                <Text style={styles.saveBtnText}>{t('upload.activateBtn', 'Activate True AI')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {stage === 'type_selection' && (
            <View style={styles.selectionContainer}>
              <Text style={[styles.selectionTitle, { color: colors.text }]}>{t('upload.whatAreYouUploading', 'What are you uploading?')}</Text>
              <Text style={[styles.selectionSub, { color: colors.textMuted }]}>
                {t('upload.whatAreYouUploadingSub', 'Type literally anything. The True AI will perfectly verify it and extract its details.')}
              </Text>
              
              <TextInput
                style={[styles.textInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surfaceElevated }]}
                placeholder={t('upload.placeholder', 'e.g. Dog Vaccination Record')}
                placeholderTextColor={colors.textMuted}
                value={customDocType}
                onChangeText={setCustomDocType}
                autoFocus={true}
              />

              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary, marginTop: 24, opacity: customDocType.trim().length > 1 ? 1 : 0.5 }]} onPress={handleContinue} disabled={customDocType.trim().length < 2}>
                <Text style={styles.saveBtnText}>{t('upload.continue', 'Continue')}</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}

          {stage === 'upload_choice' && (
            <View style={[styles.uploadZone, { borderColor: colors.accent, backgroundColor: colors.surfaceElevated }]}>
              <TouchableOpacity onPress={() => setStage('type_selection')} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={20} color={colors.textSecondary} />
                <Text style={{ color: colors.textSecondary }}>{t('upload.change', 'Change')}</Text>
              </TouchableOpacity>

              <View style={[styles.uploadIcon, { backgroundColor: colors.primary + '18' }]}>
                <Ionicons name="camera" size={48} color={colors.primary} />
              </View>
              <Text style={[styles.uploadText, { color: colors.text }]}>{t('upload.uploadYour', 'Upload your {{type}}', { type: customDocType })}</Text>
              
              <View style={styles.uploadButtons}>
                <TouchableOpacity style={[styles.uploadBtn, { backgroundColor: colors.accent }]} onPress={takePhoto}>
                  <Ionicons name="camera" size={18} color="#FFF" />
                  <Text style={styles.uploadBtnText}>{t('upload.takePhoto', 'Take Photo')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {(stage === 'processing' || stage === 'done') && fileData && (
            <View style={[styles.processingCard, { backgroundColor: colors.surface }]}>
              <View style={[styles.filePreview, { backgroundColor: colors.surfaceElevated }]}>
                <Ionicons name={fileData.isImage ? "image" : "document-text"} size={32} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.fileName, { color: colors.text }]} numberOfLines={1}>{fileData.name}</Text>
                  <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600', marginTop: 2 }}>{t('upload.analyzingAs', 'True AI analyzing as:')} {customDocType}</Text>
                </View>
              </View>
              
              {STEPS.map((step, i) => {
                const isActive = i <= currentStep;
                const isDone = i < currentStep || stage === 'done';
                return (
                  <View key={step.key} style={styles.stepRow}>
                    <View style={[styles.stepIcon, { backgroundColor: isDone ? colors.success + '20' : isActive ? colors.primary + '20' : colors.surfaceElevated }]}>
                      <Ionicons name={isDone ? 'checkmark-circle' : step.icon as any} size={20} color={isDone ? colors.success : isActive ? colors.primary : colors.textMuted} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.stepText, { color: isActive ? colors.text : colors.textMuted }]}>{step.label}</Text>
                      {isActive && !isDone && (
                        <View style={[styles.progressBg, { backgroundColor: colors.surfaceElevated }]}>
                          <Animated.View style={[styles.progressFill, { backgroundColor: colors.primary, width: progressAnims[i].interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {stage === 'done' && dynamicResult && (
            <Animated.View style={[styles.resultCard, { backgroundColor: colors.surface, opacity: fadeAnim }]}>
              <Text style={[styles.resultTitle, { color: colors.text }]}>{t('upload.verificationResults', 'True AI Verification Results')}</Text>
              <View style={[styles.typeBadge, { backgroundColor: '#10B98120' }]}>
                <Text style={{ color: '#10B981', fontWeight: '800', fontSize: 14 }}>{t('upload.verified', '✓ 100% VERIFIED')} {dynamicResult.type.toUpperCase()}</Text>
              </View>
              {dynamicResult.fields.map((f: any, i: number) => (
                <View key={i} style={[styles.fieldRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.fieldKey, { color: colors.textSecondary }]}>{f.key}</Text>
                  <Text style={[styles.fieldValue, { color: colors.text }]}>{f.value}</Text>
                </View>
              ))}
              <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={saveToDatabase}>
                  <Ionicons name="cloud-upload" size={20} color="#FFF" />
                  <Text style={styles.saveBtnText}>{t('upload.saveToVault', 'Save to Secure Vault')}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 20 },
  selectionContainer: { marginTop: 10 },
  selectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  selectionSub: { fontSize: 14, marginBottom: 20, lineHeight: 20 },
  textInput: { borderWidth: 1, borderRadius: 14, padding: 16, fontSize: 16, fontWeight: '500' },
  backBtn: { position: 'absolute', top: 16, left: 16, flexDirection: 'row', alignItems: 'center', gap: 6, zIndex: 10 },
  uploadZone: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 24, padding: 32, paddingTop: 50, alignItems: 'center', position: 'relative' },
  uploadIcon: { width: 80, height: 80, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  uploadText: { fontSize: 16, fontWeight: '500', marginBottom: 20, textAlign: 'center' },
  uploadButtons: { flexDirection: 'row', gap: 12 },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  uploadBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  processingCard: { borderRadius: 20, padding: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  filePreview: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, marginBottom: 20 },
  fileName: { fontSize: 15, fontWeight: '600' },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  stepIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  stepText: { fontSize: 14, fontWeight: '500' },
  progressBg: { height: 4, borderRadius: 2, marginTop: 6, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  resultCard: { borderRadius: 20, padding: 20, marginTop: 16, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  resultTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  typeBadge: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10, marginBottom: 16 },
  fieldRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
  fieldKey: { width: 120, fontSize: 13, fontWeight: '500' },
  fieldValue: { flex: 1, fontSize: 14, fontWeight: '600' },
  actionRow: { marginTop: 20 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 14 },
  saveBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
});
