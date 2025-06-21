// Root navigator that switches between Auth and Main stacks based on auth state.

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAuth } from '../providers/AuthProvider';
import AuthNavigator from './AuthNavigator';
import SplashNavigator from './SplashNavigator';
import TabNavigator from './TabNavigator';

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
        <RootStack.Screen name="MainRoot" component={TabNavigator} />
      ) : (
        <RootStack.Screen name="AuthRoot" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
}
