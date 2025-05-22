import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAuth } from '../providers/AuthProvider';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import SplashNavigator from './SplashNavigator';

import type { RootStackParamList } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, initializing } = useAuth();

  // While loading auth state, show Splash
  if (initializing) {
    return <SplashNavigator />;
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <RootStack.Screen name="MainRoot" component={MainNavigator} />
      ) : (
        <RootStack.Screen name="AuthRoot" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
}
