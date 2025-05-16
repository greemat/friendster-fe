import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, Title } from 'react-native-paper';
import { useFirebase } from '../contexts/FirebaseProvider'; // <-- Use Firebase context here

import type { AuthStackParamList } from '../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const { auth } = useFirebase(); // Get auth from FirebaseProvider context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    if (!auth) {
      setError('Firebase Auth is not initialized yet.');
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Optionally navigate on success or show message here
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Title style={styles.title}>Sign Up</Title>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button mode="contained" onPress={handleSignup} loading={loading} style={styles.button}>
          Sign Up
        </Button>
        <Button onPress={() => navigation.navigate('Login')} style={styles.link}>
          Already have an account? Log in
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 12, elevation: 2 },
  title: { marginBottom: 20, alignSelf: 'center' },
  input: { marginBottom: 12 },
  button: { marginTop: 12 },
  link: { marginTop: 10, alignSelf: 'center' },
  error: { color: 'red', marginBottom: 10 },
});

export default SignupScreen;
