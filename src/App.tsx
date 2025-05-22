// Root component of the app; sets up providers and navigation.

import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import RootNavigator from './navigation/RootNavigator';
import { AuthProvider } from './providers/AuthProvider';


export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
