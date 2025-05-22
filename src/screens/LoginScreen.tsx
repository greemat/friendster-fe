// Login screen for user authentication.
// Submits credentials to backend and updates auth context on success.

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Snackbar, TextInput, Title } from 'react-native-paper';
import type { AuthStackParamList } from '../navigation/AuthNavigator';
import { useAuth } from '../providers/AuthProvider';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      //console.log('handleLogin triggered');
      await login(email, password);
      // No manual navigation here — RootNavigator switches automatically on user set
    } catch (err: any) {
      //console.log('Login error:', err);
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Login</Title>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Login
      </Button>
      <Button onPress={() => navigation.navigate('Signup')} style={styles.link}>
        Don't have an account? Sign Up
      </Button>
      <Snackbar visible={!!error} onDismiss={() => setError('')} duration={3000}>
        {error}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  input: { marginBottom: 10 },
  button: { marginTop: 10 },
  title: { marginBottom: 20, textAlign: 'center' },
  link: { marginTop: 10, textAlign: 'center' },
});

export default LoginScreen;
