import React, { JSX } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

type Props = {
  name: string; setName: (value: string) => void;
  email: string; setEmail: (value: string) => void;
  description: string; setDescription: (value: string) => void;
};

export default function UserInputForm({
  name, setName,
  email, setEmail,
  description, setDescription,
}: Props): JSX.Element {
  return (
    <>
      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={styles.input}
      />
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
  },
});
