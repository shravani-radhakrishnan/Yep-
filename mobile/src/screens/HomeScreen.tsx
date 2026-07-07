import * as Haptics from 'expo-haptics';
import { useRef, useState } from 'react';
import {
  ActivityIndicator, FlatList, KeyboardAvoidingView, Platform,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import CategoryTabs from '../components/CategoryTabs';
import ItemCard from '../components/ItemCard';
import PickModal from '../components/PickModal';
import { useDecider } from '../hooks/useDecider';
import { colors, fonts } from '../theme';

interface Props {
  userId: string | null;
  onSignOut: () => void;
}

export default function HomeScreen({ userId, onSignOut }: Props) {
  const {
    ready, items, cat, sort, toast, pickedItem, loadingIds,
    categories, data,
    setCat, setSort, markItem, deleteItem, addItem, pickOne,
    giveFeedback, closeModal, reroll, addCategory, deleteCategory,
  } = useDecider(userId);

  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef<TextInput>(null);

  const activeCat = categories.find(c => c.id === cat) ?? categories[0];
  const [, ...rest] = activeCat.label.split(' ');
  const categoryLabel = rest.join(' ');

  function handleAdd() {
    const val = inputVal.trim();
    if (!val) return;
    addItem(val);
    setInputVal('');
  }

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.gold} />
      </View>
    );
  }

  const SORTS = [
    { key: 'smart', label: 'SMART' },
    { key: 'name',  label: 'A→Z' },
    { key: 'new',   label: 'NEW' },
  ] as const;

  const newCount = items.filter(i => i.status === 'new').length;
  const loadingItems = items.filter(i => loadingIds.has(i.id));

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>Yep<Text style={styles.logoEm}>!</Text></Text>
          <Text style={styles.tagline}>STOP OVERTHINKING — JUST GO</Text>
        </View>
        <TouchableOpacity onPress={onSignOut}>
          <Text style={styles.signOut}>Sign out</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <CategoryTabs
        categories={categories}
        active={cat}
        data={data}
        onSelect={setCat}
        onAddCategory={addCategory}
        onDeleteCategory={deleteCategory}
      />

      {/* Add input */}
      <View style={styles.addWrap}>
        <TextInput
          ref={inputRef}
          style={styles.addInput}
          value={inputVal}
          onChangeText={setInputVal}
          onSubmitEditing={handleAdd}
          placeholder={activeCat.placeholder}
          placeholderTextColor={colors.text3}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.hint}>{activeCat.hint}</Text>

      {/* List header */}
      <View style={styles.listTop}>
        <Text style={styles.count}>
          {items.length > 0 ? `${items.length} items · ${newCount} not tried` : ''}
        </Text>
        <View style={styles.sorts}>
          {SORTS.map(s => (
            <TouchableOpacity
              key={s.key}
              style={[styles.sortBtn, sort === s.key && styles.sortBtnActive]}
              onPress={() => setSort(s.key)}
            >
              <Text style={[styles.sortText, sort === s.key && styles.sortTextActive]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Loading bars */}
      {loadingItems.map(item => (
        <View key={item.id} style={styles.loadingBar}>
          <ActivityIndicator size="small" color={colors.gold} />
          <Text style={styles.loadingText}>Looking up "{item.name}"…</Text>
        </View>
      ))}

      {/* List */}
      <FlatList
        data={items}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIco}>{activeCat.label.split(' ')[0]}</Text>
            <Text style={styles.emptyText}>Nothing added yet.{'\n'}Type something above!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            loading={loadingIds.has(item.id)}
            onMark={markItem}
            onDelete={deleteItem}
          />
        )}
      />

      {/* Pick button */}
      <View style={styles.pickWrap}>
        <TouchableOpacity
          style={styles.pickBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            pickOne();
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.pickBtnText}>🎲  Pick one for us</Text>
        </TouchableOpacity>
      </View>

      {/* Toast */}
      {!!toast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}

      {/* Pick modal */}
      <PickModal
        item={pickedItem}
        categoryLabel={categoryLabel}
        onFeedback={giveFeedback}
        onClose={closeModal}
        onReroll={reroll}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: colors.bg },
  loading: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  logo:    { fontSize: 36, color: colors.text, fontFamily: fonts.serif },
  logoEm:  { color: colors.gold, fontStyle: 'italic' },
  tagline: { fontSize: 10, color: colors.text3, letterSpacing: 1.5, marginTop: 4, fontFamily: fonts.mono },
  signOut: { fontSize: 11, color: colors.text3, fontFamily: fonts.mono },
  addWrap: { flexDirection: 'row', gap: 8, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 4 },
  addInput:{ flex: 1, height: 44, paddingHorizontal: 16, backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.gold, borderRadius: 10, fontSize: 14, color: colors.text, fontFamily: fonts.sans },
  addBtn:  { height: 44, paddingHorizontal: 20, backgroundColor: colors.gold, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  addBtnText: { color: '#0e0e0e', fontSize: 14, fontWeight: '600', fontFamily: fonts.sans },
  hint:    { paddingHorizontal: 24, paddingBottom: 8, fontSize: 11, color: colors.text3, fontFamily: fonts.mono },
  listTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 8 },
  count:   { fontSize: 11, color: colors.text3, fontFamily: fonts.mono },
  sorts:   { flexDirection: 'row', gap: 4 },
  sortBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border2 },
  sortBtnActive: { backgroundColor: colors.goldDim, borderColor: 'rgba(200,151,58,.4)' },
  sortText: { fontSize: 10, color: colors.text2, fontFamily: fonts.mono, letterSpacing: 0.4 },
  sortTextActive: { color: colors.gold },
  loadingBar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: colors.border },
  loadingText: { fontSize: 11, color: colors.text3, fontFamily: fonts.mono },
  list:    { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 120 },
  empty:   { alignItems: 'center', paddingVertical: 52 },
  emptyIco:{ fontSize: 40, opacity: 0.4, marginBottom: 10 },
  emptyText: { fontSize: 13, color: colors.text3, textAlign: 'center', lineHeight: 22, fontFamily: fonts.sans },
  pickWrap:{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, paddingBottom: 40, backgroundColor: 'transparent' },
  pickBtn: { backgroundColor: colors.gold, height: 54, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  pickBtnText: { color: '#0e0e0e', fontSize: 19, fontFamily: fonts.serif, fontStyle: 'italic' },
  toast:   { position: 'absolute', bottom: 110, alignSelf: 'center', backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border2, paddingHorizontal: 18, paddingVertical: 9, borderRadius: 99 },
  toastText: { color: colors.text, fontSize: 12, fontFamily: fonts.mono },
});
