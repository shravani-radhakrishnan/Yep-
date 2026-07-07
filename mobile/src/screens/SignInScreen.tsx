import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts } from '../theme';

interface Props {
  onSignInGoogle: () => void;
  onSignInApple: () => void;
}

export default function SignInScreen({ onSignInGoogle, onSignInApple }: Props) {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.logo}>Yep<Text style={styles.logoEm}>!</Text></Text>
        <Text style={styles.tagline}>STOP OVERTHINKING — JUST GO</Text>
        <TouchableOpacity style={styles.btn} onPress={onSignInGoogle} activeOpacity={0.85}>
          <Text style={styles.btnText}>Continue with Google</Text>
        </TouchableOpacity>
        {Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={12}
            style={styles.appleBtn}
            onPress={onSignInApple}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card:    { width: '100%', maxWidth: 340, alignItems: 'center' },
  logo:    { fontSize: 48, color: colors.text, fontFamily: fonts.serif, marginBottom: 4 },
  logoEm:  { color: colors.gold, fontStyle: 'italic' },
  tagline: { fontSize: 10, color: colors.text3, letterSpacing: 1.5, marginBottom: 48, fontFamily: fonts.mono },
  btn:      { width: '100%', height: 52, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border2, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnText:  { color: colors.text, fontSize: 15, fontWeight: '500', fontFamily: fonts.sans },
  appleBtn: { width: '100%', height: 52, marginTop: 12 },
});
