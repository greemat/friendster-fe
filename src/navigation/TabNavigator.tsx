import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Avatar } from 'react-native-paper';
import { useAuth } from '../providers/AuthProvider';
import MainScreen from '../screens/MainScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SuccessScreen from '../screens/SuccessScreen';

export type TabParamList = {
  Main: undefined;
  Profile: undefined;
  Success: { message: string };
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#6200ee',
        tabBarLabelStyle: { fontSize: 14 },
      }}
    >
      <Tab.Screen
        name="Main"
        component={MainScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: () =>
            user?.profileImageUrl ? (
              <Avatar.Image
                size={24}
                source={{ uri: user.profileImageUrl }}
              />
            ) : (
              <Avatar.Icon size={24} icon="account" />
            ),
        }}
      />
      <Tab.Screen
        name="Success"
        component={SuccessScreen}
        options={{
          tabBarButton: () => null, // Hide it from the tab bar
          //tabBarVisible: false,
        }}
      />
    </Tab.Navigator>
  );
}
