// Main app screen shown to authenticated users.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from '../providers/AuthProvider';

const MainScreen: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Main App!</Text>
      {user && (
        <Text style={styles.userInfo}>Logged in as: {user.email}</Text>
      )}
      <Button mode="outlined" onPress={logout} style={styles.button}>
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  userInfo: {
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 10,
  },
});

export default MainScreen;
