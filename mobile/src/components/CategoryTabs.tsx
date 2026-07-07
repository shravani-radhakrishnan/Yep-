import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { Category, DataStore } from '../lib/types';
import { colors, fonts } from '../theme';

interface Props {
  categories: Category[];
  active: string;
  data: DataStore;
  onSelect: (id: string) => void;
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
}

export default function CategoryTabs({ categories, active, data, onSelect, onAddCategory, onDeleteCategory }: Props) {
  const [adding, setAdding] = useState(false);
  const [input, setInput] = useState('');
  const inputRef = useRef<TextInput>(null);

  function commit() {
    if (input.trim()) onAddCategory(input.trim());
    setInput('');
    setAdding(false);
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {categories.map(c => (
        <TouchableOpacity
          key={c.id}
          style={[styles.tab, c.id === active && styles.tabActive]}
          onPress={() => onSelect(c.id)}
        >
          <Text style={[styles.tabText, c.id === active && styles.tabTextActive]}>
            {c.label}
          </Text>
          <View style={[styles.badge, c.id === active && styles.badgeActive]}>
            <Text style={[styles.badgeText, c.id === active && styles.badgeTextActive]}>
              {(data[c.id] ?? []).length}
            </Text>
          </View>
          {c.isCustom && (
            <TouchableOpacity onPress={() => onDeleteCategory(c.id)} style={styles.del}>
              <Text style={styles.delText}>×</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      ))}

      {adding ? (
        <View style={styles.addWrap}>
          <TextInput
            ref={inputRef}
            style={styles.addInput}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={commit}
            onBlur={commit}
            placeholder="Category name…"
            placeholderTextColor={colors.text3}
            autoFocus
            maxLength={24}
          />
        </View>
      ) : (
        <TouchableOpacity style={styles.tab} onPress={() => setAdding(true)}>
          <Text style={styles.plus}>＋</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:   { borderBottomWidth: 1, borderBottomColor: colors.border, flexGrow: 0 },
  tab:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, gap: 6 },
  tabActive:   { borderBottomWidth: 2, borderBottomColor: colors.gold },
  tabText:     { fontSize: 13, color: colors.text2, fontFamily: fonts.sans },
  tabTextActive: { color: colors.gold },
  badge:       { backgroundColor: colors.surface2, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 99 },
  badgeActive: { backgroundColor: colors.goldDim },
  badgeText:   { fontSize: 10, color: colors.text3, fontFamily: fonts.mono },
  badgeTextActive: { color: colors.gold },
  del:         { paddingLeft: 2 },
  delText:     { fontSize: 13, color: colors.text3 },
  plus:        { fontSize: 18, color: colors.text3 },
  addWrap:     { justifyContent: 'center', paddingHorizontal: 12 },
  addInput:    { height: 30, paddingHorizontal: 10, backgroundColor: colors.surface2, borderWidth: 1.5, borderColor: colors.gold, borderRadius: 7, fontSize: 13, color: colors.text, fontFamily: fonts.sans, minWidth: 140 },
});
