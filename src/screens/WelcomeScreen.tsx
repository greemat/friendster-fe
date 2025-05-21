// screens/WelcomeScreen.tsx
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../navigation/types'; // adjust path if needed
import { useAuth } from '../providers/AuthProvider';

type WelcomeNav = NativeStackNavigationProp<RootStackParamList>;

export default function WelcomeScreen() {
  const { user, initializing } = useAuth();
  const navigation = useNavigation<WelcomeNav>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!initializing) {
        navigation.reset({
          index: 0,
          routes: [{ name: user ? 'MainRoot' : 'AuthRoot' }],
        });
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [initializing, user, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>Welcome to MyApp</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { marginTop: 10, fontSize: 18, fontWeight: 'bold' },
});
