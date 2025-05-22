// Navigator for splash/loading phase before determining auth or app state.

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import WelcomeScreen from '../screens/WelcomeScreen';

export type SplashStackParamList = {
  Welcome: undefined;
};

const Stack = createNativeStackNavigator<SplashStackParamList>();

export default function SplashNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
