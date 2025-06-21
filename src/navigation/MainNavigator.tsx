// MainNavigator.tsx

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Avatar, Menu, TouchableRipple } from 'react-native-paper';
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
  //const navigation = useNavigation<NavigationProp<MainStackParamList>>();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={({ navigation }) => ({
          title: 'Home',
          headerRight: () => (
            <View style={{ marginRight: 16 }}>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <TouchableRipple onPress={() => setMenuVisible(true)} borderless>
                    <Avatar.Image
                      size={36}
                      source={
                        user?.profileImageUrl
                          ? { uri: user.profileImageUrl }
                          : require('../../assets/images/default-avatar.png')
                      }
                    />
                  </TouchableRipple>
                }
              >
                <Menu.Item
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate('Profile');
                  }}
                  title="Profile"
                />
                <Menu.Item
                  onPress={() => {
                    setMenuVisible(false);
                    logout();
                  }}
                  title="Logout"
                />
              </Menu>
            </View>
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
