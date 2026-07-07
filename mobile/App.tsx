import * as Google from 'expo-auth-session/providers/google';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './src/lib/firebase';
import { signInWithApple, signOutUser } from './src/lib/firebase/authService';
import { useAuth } from './src/hooks/useAuth';
import HomeScreen from './src/screens/HomeScreen';
import SignInScreen from './src/screens/SignInScreen';
import { colors } from './src/theme';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const { user, loading } = useAuth();

  // Let expo-auth-session automatically use the reverse client ID scheme
  // as redirect URI for iOS — do NOT pass a custom redirectUri
  const [, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch(console.error);
    }
  }, [response]);

  const handleAppleSignIn = () => {
    signInWithApple().catch(console.error);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.gold} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      {user ? (
        <HomeScreen userId={user.uid} onSignOut={signOutUser} />
      ) : (
        <SignInScreen onSignInGoogle={() => promptAsync()} onSignInApple={handleAppleSignIn} />
      )}
    </>
  );
}
