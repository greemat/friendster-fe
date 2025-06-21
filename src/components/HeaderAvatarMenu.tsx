// components/HeaderAvatarMenu.tsx
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Avatar, Menu, TouchableRipple } from 'react-native-paper';
import { useAuth } from '../providers/AuthProvider';

export default function HeaderAvatarMenu() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleProfile = () => {
    closeMenu();
    navigation.navigate('Profile' as never); // cast if using generic types
  };

  const handleLogout = async () => {
    closeMenu();
    await logout();
  };

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <TouchableRipple onPress={openMenu} borderless style={{ marginRight: 16 }}>
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
      <Menu.Item onPress={handleProfile} title="Profile" />
      <Menu.Item onPress={handleLogout} title="Logout" />
    </Menu>
  );
}
