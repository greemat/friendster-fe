// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ApiKeyProvider } from './contexts/ApiKeyProvider';
import { AuthProvider, useAuth } from './contexts/AuthProvider';
import { FirebaseProvider, useFirebase } from './contexts/FirebaseProvider';

import AppNavigator from './navigation/AppNavigator'; // Your main stack/tab navigator

const LoadingScreen = () => (
  <View style={styles.center}>
    <ActivityIndicator size="large" />
  </View>
);

const Providers = ({ children }: { children: React.ReactNode }) => (
  <ApiKeyProvider>
    <FirebaseProvider>
      <AuthProvider>{children}</AuthProvider>
    </FirebaseProvider>
  </ApiKeyProvider>
);

const Root = () => {
  const { initializing: firebaseInitializing } = useFirebase();
  const { initializing: authInitializing } = useAuth();

  if (firebaseInitializing || authInitializing) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Providers>
      <Root />
    </Providers>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
