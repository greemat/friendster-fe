// navigation/MainNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Main from '../screens/Main'; // your form screen
import SuccessScreen from '../screens/SuccessScreen';

export type MainStackParamList = {
  Main: undefined;
  Success: { message: string };
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen 
        name="Main" 
        component={Main} 
        options={{ title: 'Fill Your Details' }}
      />
      <Stack.Screen 
        name="Success" 
        component={SuccessScreen} 
        options={{ title: 'Success' }}
      />
    </Stack.Navigator>
  );
}
