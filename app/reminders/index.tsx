import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { mockReminders } from '../../src/data/reminders';
import { Reminder } from '../../src/types';

export default function RemindersScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  // Sort reminders by date
  const sortedReminders = [...mockReminders].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const renderReminder = ({ item }: { item: Reminder }) => {
    const isOverdue = new Date(item.dueDate).getTime() < Date.now();
    const isDueSoon = new Date(item.dueDate).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

    let dateColor = colors.textSecondary;
    if (isOverdue) dateColor = colors.danger;
    else if (isDueSoon) dateColor = colors.warning;

    return (
      <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
        <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={1}>{item.description}</Text>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color={dateColor} />
            <Text style={[styles.dateText, { color: dateColor }]}>
              {new Date(item.dueDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.border }]}>
          <Ionicons name="checkmark" size={20} color={colors.success} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Reminders</Text>
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.primary }]}>
          <Ionicons name="add" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedReminders}
        keyExtractor={item => item.id}
        renderItem={renderReminder}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 60, borderBottomWidth: 1 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  addBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 20, paddingBottom: 100 },
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  iconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  icon: { fontSize: 22 },
  content: { flex: 1, marginRight: 12 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  description: { fontSize: 13, marginBottom: 8 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { fontSize: 13, fontWeight: '600' },
  actionBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
});
