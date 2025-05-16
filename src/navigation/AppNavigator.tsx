// navigation/AppNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../contexts/AuthProvider';
import LoginScreen from '../screens/LoginScreen';
import Main from '../screens/Main';
import SignupScreen from '../screens/SignupScreen';
import SuccessScreen from '../screens/SuccessScreen';




export type RootStackParamList = {
  Main: undefined;
  Success: { message: string };
  Login: undefined;
  Signup: undefined;
  TestAPI: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="Success" component={SuccessScreen} />
         
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}
