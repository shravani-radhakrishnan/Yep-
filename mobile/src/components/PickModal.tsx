import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import type { Item, Status } from '../lib/types';
import { colors, fonts } from '../theme';

interface Props {
  item: Item | null;
  categoryLabel: string;
  onFeedback: (status: Status) => void;
  onClose: () => void;
  onReroll: () => void;
}

export default function PickModal({ item, categoryLabel, onFeedback, onClose, onReroll }: Props) {
  useEffect(() => {
    if (item) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [item?.id]);

  return (
    <Modal visible={!!item} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.handle} />
              <Text style={styles.eye}>{categoryLabel.toUpperCase()}</Text>
              <Text style={styles.name}>{item?.name ?? ''}</Text>
              <Text style={styles.detail}>{item?.detail ?? ''}</Text>
              <Text style={styles.rating}>{item?.rating ?? ''}</Text>
              <Text style={styles.pickCount}>
                {item && (item.picks > 1 ? `Suggested ${item.picks}× so far` : 'First time picking this ✨')}
              </Text>

              <Text style={styles.question}>Did you actually do it?</Text>
              <View style={styles.fbs}>
                <TouchableOpacity style={[styles.fb, styles.fbYes]} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onFeedback('done'); }}>
                  <Text style={styles.fbYesText}>✓ Yes, we did!</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.fb, styles.fbNo]} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onFeedback('skip'); }}>
                  <Text style={styles.fbNoText}>✕ Nope, skipped</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.later} onPress={onClose}>
                <Text style={styles.laterText}>Remind me later</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reroll} onPress={() => { Haptics.selectionAsync(); onReroll(); }}>
                <Text style={styles.rerollText}>↻ PICK SOMETHING ELSE</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet:     { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, borderWidth: 1, borderColor: colors.border2 },
  handle:    { width: 38, height: 3, backgroundColor: colors.surface3, borderRadius: 2, alignSelf: 'center', marginBottom: 22 },
  eye:       { fontSize: 10, letterSpacing: 1.5, color: colors.text3, textAlign: 'center', marginBottom: 6, fontFamily: fonts.mono },
  name:      { fontSize: 32, color: colors.text, textAlign: 'center', marginBottom: 5, fontFamily: fonts.serif },
  detail:    { fontSize: 12, color: colors.text2, textAlign: 'center', marginBottom: 4, fontFamily: fonts.sans },
  rating:    { fontSize: 26, fontWeight: '600', color: colors.gold, textAlign: 'center', marginBottom: 4, fontFamily: fonts.sans },
  pickCount: { fontSize: 10, color: colors.text3, textAlign: 'center', marginBottom: 24, fontFamily: fonts.mono },
  question:  { fontSize: 14, fontWeight: '500', color: colors.text2, textAlign: 'center', marginBottom: 14, fontFamily: fonts.sans },
  fbs:       { flexDirection: 'row', gap: 10, marginBottom: 10 },
  fb:        { flex: 1, height: 46, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  fbYes:     { backgroundColor: colors.greenDim, borderColor: 'rgba(58,138,82,.4)' },
  fbNo:      { backgroundColor: colors.redDim,   borderColor: 'rgba(160,48,48,.4)' },
  fbYesText: { color: colors.green, fontSize: 14, fontWeight: '500', fontFamily: fonts.sans },
  fbNoText:  { color: '#c06060',    fontSize: 14, fontWeight: '500', fontFamily: fonts.sans },
  later:     { height: 42, borderRadius: 10, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border2, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  laterText: { color: colors.text2, fontSize: 13, fontFamily: fonts.sans },
  reroll:    { alignItems: 'center', paddingVertical: 8 },
  rerollText:{ color: colors.text3, fontSize: 11, fontFamily: fonts.mono, letterSpacing: 0.5 },
});
