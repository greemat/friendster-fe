// Navigator for authenticated users, defines main app flow screens.

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MainScreen from '../screens/MainScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SuccessScreen from '../screens/SuccessScreen';

export type MainStackParamList = {
  Main: undefined;
  Profile: undefined;
  Success: { message: string };
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen 
        name="Main" 
        component={MainScreen} 
        options={{ title: 'Fill Your Details' }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Manage Your Profile' }}
      />      
      <Stack.Screen 
        name="Success" 
        component={SuccessScreen} 
        options={{ title: 'Success' }}
      />
    </Stack.Navigator>
  );
}
