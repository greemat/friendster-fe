import { Ionicons } from '@expo/vector-icons'; // or any icon set you prefer
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../providers/AuthProvider';

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogout = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={{ marginRight: 10 }}>
      <Ionicons name="log-out-outline" size={24} color="black" />
    </TouchableOpacity>
  );
};

export default LogoutButton;
