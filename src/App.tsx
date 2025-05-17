// src/App.tsx

import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from 'providers/AuthProvider';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { JSX } from 'react/jsx-runtime';
import { useFirebaseConfig } from './hooks/useFirebaseConfig';
import AppNavigator from './navigation/AppNavigator';
import { FirebaseProvider } from './providers';


export default function App(): JSX.Element {
  const { config, initializing, error } = useFirebaseConfig();

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Initializing Firebase...</Text>
      </View>
    );
  }

  if (error || !config) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Failed to load Firebase config</Text>
      </View>
    );
  }

  return (
    <FirebaseProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </FirebaseProvider>
  );
}
