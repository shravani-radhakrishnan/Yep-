import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Item, Status } from '../lib/types';
import { colors, fonts } from '../theme';

interface Props {
  item: Item;
  loading: boolean;
  onMark: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
}

export default function ItemCard({ item, loading, onMark, onDelete }: Props) {
  const dotColor = item.status === 'done' ? colors.green : item.status === 'skip' ? colors.surface3 : colors.gold;
  const badgeStyle = item.status === 'done' ? styles.badgeDone : item.status === 'skip' ? styles.badgeSkip : styles.badgeNew;
  const badgeTextStyle = item.status === 'done' ? styles.badgeTextDone : item.status === 'skip' ? styles.badgeTextSkip : styles.badgeTextNew;
  const badgeLabel = item.status === 'done' ? 'done ✓' : item.status === 'skip' ? 'skipped' : 'not tried';

  return (
    <View style={styles.card}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <View style={styles.meta}>
          {loading ? (
            <Text style={styles.fetching}>fetching…</Text>
          ) : item.rating ? (
            <Text style={styles.rating}>{item.rating}</Text>
          ) : null}
          {!loading && item.detail ? <Text style={styles.detail}>{item.detail}</Text> : null}
          {item.picks > 0 && <Text style={styles.picks}>picked {item.picks}×</Text>}
        </View>
      </View>
      <View style={[styles.badge, badgeStyle]}>
        <Text style={[styles.badgeText, badgeTextStyle]}>{badgeLabel}</Text>
      </View>
      <View style={styles.actions}>
        {item.status !== 'done' && (
          <TouchableOpacity style={[styles.act, styles.actDone]} onPress={() => onMark(item.id, 'done')}>
            <Text style={styles.actDoneText}>✓</Text>
          </TouchableOpacity>
        )}
        {item.status !== 'skip' && (
          <TouchableOpacity style={[styles.act, styles.actSkip]} onPress={() => onMark(item.id, 'skip')}>
            <Text style={styles.actSkipText}>✕</Text>
          </TouchableOpacity>
        )}
        {item.status !== 'new' && (
          <TouchableOpacity style={[styles.act, styles.actReset]} onPress={() => onMark(item.id, 'new')}>
            <Text style={styles.actResetText}>↺</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.act, styles.actDel]} onPress={() => onDelete(item.id)}>
          <Text style={styles.actDelText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card:    { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot:     { width: 7, height: 7, borderRadius: 99, marginLeft: 2, flexShrink: 0 },
  body:    { flex: 1, minWidth: 0 },
  name:    { fontSize: 15, fontWeight: '500', color: colors.text, fontFamily: fonts.sans },
  meta:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4, alignItems: 'center' },
  rating:  { fontSize: 13, fontWeight: '600', color: colors.gold, fontFamily: fonts.sans },
  detail:  { fontSize: 12, color: colors.text2, fontFamily: fonts.sans },
  fetching: { fontSize: 12, color: colors.text3, opacity: 0.4, fontFamily: fonts.mono },
  picks:   { fontSize: 10, color: colors.text3, fontFamily: fonts.mono },
  badge:   { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  badgeNew:  { backgroundColor: colors.goldDim, borderColor: 'rgba(200,151,58,.25)' },
  badgeDone: { backgroundColor: colors.greenDim, borderColor: 'rgba(58,138,82,.25)' },
  badgeSkip: { backgroundColor: colors.surface2, borderColor: colors.border2 },
  badgeText: { fontSize: 10, fontFamily: fonts.mono, letterSpacing: 0.4 },
  badgeTextNew:  { color: colors.gold },
  badgeTextDone: { color: colors.green },
  badgeTextSkip: { color: '#888' },
  actions: { flexDirection: 'row', gap: 5 },
  act:     { width: 30, height: 30, borderRadius: 7, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  actDone: { backgroundColor: colors.greenDim, borderColor: 'rgba(58,138,82,.35)' },
  actSkip: { backgroundColor: colors.redDim,   borderColor: 'rgba(160,48,48,.35)' },
  actReset:{ backgroundColor: colors.goldDim,  borderColor: 'rgba(200,151,58,.3)' },
  actDel:  { backgroundColor: colors.surface2, borderColor: colors.border2 },
  actDoneText:  { color: colors.green, fontSize: 13 },
  actSkipText:  { color: '#c06060',    fontSize: 13 },
  actResetText: { color: colors.gold,  fontSize: 13 },
  actDelText:   { color: '#666',       fontSize: 13 },
});
