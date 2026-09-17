import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/context/ThemeContext';
import { ChatMessage } from '../../src/types';
import Ionicons from '@expo/vector-icons/Ionicons';

const MOCK_RESPONSES: Record<string, { answer: string; citation: string }> = {
  'when does my ac warranty expire?': { answer: 'Your LG Split AC warranty expires on 12 June 2027. That\'s about 10 months away. The warranty was activated on your purchase date (12 June 2026) and covers 1 year.', citation: 'LG AC Invoice, Warranty Card' },
  'how much did we spend on repairs?': { answer: 'Based on your records, you\'ve spent ₹5,700 on repairs this year:\n\n• ₹2,500 — Samsung Washing Machine inlet valve (Jul 2026)\n• ₹3,200 — Whirlpool Refrigerator thermostat (Mar 2026)\n\nThe washing machine repair was covered under warranty for parts.', citation: 'Service Records, Expense Records' },
  'which appliances are under warranty?': { answer: 'You have 4 appliances currently under active warranty:\n\n🟢 LG Split AC — expires 12 Jun 2027\n🟢 Samsung Washing Machine — expires 15 Aug 2027\n🟢 Sony Bravia TV — expires 10 Jan 2027\n🟢 Bajaj Geyser — expires 01 Oct 2027\n\n2 appliances have expired warranties:\n🔴 Whirlpool Refrigerator — expired Nov 2025\n🔴 Kent RO Water Purifier — expired Mar 2026', citation: 'Appliance Records' },
};

export default function AssistantScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'assistant', content: t('assistant.greeting'), timestamp: new Date().toISOString() },
  ]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const suggestions = [t('assistant.q1'), t('assistant.q2'), t('assistant.q4'), t('assistant.q5')];

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const key = text.toLowerCase().trim().replace(/[?!.,]/g, '').replace(/\s+/g, ' ');
      const match = Object.entries(MOCK_RESPONSES).find(([k]) => key.includes(k.replace(/[?]/g, '')));
      const response = match ? match[1] : { answer: `Based on your household records, I found relevant information about "${text}". This is a demo — in the full version, I'd search through all your documents, appliances, warranties, and expenses to give you a grounded answer.`, citation: 'Home Records' };
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(), role: 'assistant', content: response.answer, timestamp: new Date().toISOString(),
        citations: [{ label: response.citation, entityType: 'document', entityId: 'doc-1' }],
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1200);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🤖</Text>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('assistant.title')}</Text>
      </View>

      <FlatList ref={flatListRef} data={messages} keyExtractor={m => m.id} contentContainerStyle={styles.chatList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListFooterComponent={
          messages.length <= 1 ? (
            <View style={styles.suggestionsArea}>
              <Text style={[styles.suggestLabel, { color: colors.textSecondary }]}>{t('assistant.suggestedQuestions')}</Text>
              {suggestions.map((q, i) => (
                <TouchableOpacity key={i} style={[styles.suggestBtn, { borderColor: colors.border, backgroundColor: colors.surface }]} onPress={() => sendMessage(q)}>
                  <Text style={[styles.suggestText, { color: colors.primary }]}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={[styles.msgRow, item.role === 'user' && styles.userRow]}>
            <View style={[styles.bubble, item.role === 'user' ? { backgroundColor: colors.primary } : { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }]}>
              <Text style={[styles.msgText, { color: item.role === 'user' ? '#FFF' : colors.text }]}>{item.content}</Text>
              {item.citations && (
                <View style={[styles.citationRow, { backgroundColor: item.role === 'user' ? 'rgba(255,255,255,0.15)' : colors.surfaceElevated }]}>
                  <Ionicons name="document-text-outline" size={12} color={item.role === 'user' ? 'rgba(255,255,255,0.7)' : colors.textMuted} />
                  <Text style={[styles.citationText, { color: item.role === 'user' ? 'rgba(255,255,255,0.7)' : colors.textMuted }]}>
                    {t('assistant.citedFrom')}: {item.citations.map(c => c.label).join(', ')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TextInput style={[styles.input, { backgroundColor: colors.surfaceElevated, color: colors.text }]} value={input} onChangeText={setInput} placeholder={t('assistant.placeholder')} placeholderTextColor={colors.textMuted} onSubmitEditing={() => sendMessage(input)} returnKeyType="send" />
          <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.primary }]} onPress={() => sendMessage(input)}>
            <Ionicons name="send" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  headerEmoji: { fontSize: 28 },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  chatList: { padding: 16, paddingBottom: 8 },
  msgRow: { marginBottom: 12, alignItems: 'flex-start' },
  userRow: { alignItems: 'flex-end' },
  bubble: { maxWidth: '85%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 18, elevation: 1 },
  msgText: { fontSize: 15, lineHeight: 22 },
  citationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  citationText: { fontSize: 11 },
  suggestionsArea: { padding: 8 },
  suggestLabel: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
  suggestBtn: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  suggestText: { fontSize: 14, fontWeight: '500' },
  inputBar: { flexDirection: 'row', padding: 12, gap: 10, borderTopWidth: 1 },
  input: { flex: 1, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, fontSize: 15 },
  sendBtn: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
});
