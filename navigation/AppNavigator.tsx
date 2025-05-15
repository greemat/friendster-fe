// AppNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Main from '../Main';
import SuccessScreen from '../screens/SuccessScreen';

export type RootStackParamList = {
  Main: undefined;
  Success: { message: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen
        name="Main"
        component={Main}
        options={{ title: 'Submit Info' }}
      />
      <Stack.Screen
        name="Success"
        component={SuccessScreen}
        options={{ title: 'Success' }}
      />
    </Stack.Navigator>
  );
}
