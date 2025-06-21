// MainNavigator.tsx

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import HeaderAvatarMenu from '../components/HeaderAvatarMenu';
import { useAuth } from '../providers/AuthProvider';
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
  const { user, logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={({ navigation }) => ({
          title: 'Home',
          headerRight: () => <HeaderAvatarMenu />,
        })}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Manage Your Profile',
          headerRight: () => <HeaderAvatarMenu />,
        }}
      />
      <Stack.Screen
        name="Success"
        component={SuccessScreen}
        options={{
          title: 'Success',
          headerRight: () => <HeaderAvatarMenu />,
        }}
      />
    </Stack.Navigator>
  );
}
