// Navigator for authenticated users, defines main app flow screens.

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Avatar, TouchableRipple } from 'react-native-paper';
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
  const { user } = useAuth();
  
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen 
        name="Main" 
        component={MainScreen} 
        options={({ navigation }) => ({
          title: 'Home',
          headerRight: () => (
            <TouchableRipple
              onPress={() => navigation.navigate('Profile')}
              borderless
              style={{ marginRight: 16 }}
            >
              <Avatar.Image
                size={36}
                source={
                  user?.profileImageUrl
                    ? { uri: user.profileImageUrl }
                    : require('../../assets/images/default-avatar.png')
                }
              />
            </TouchableRipple>
          ),
        })}
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
