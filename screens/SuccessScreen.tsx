// screens/SuccessScreen.tsx
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, Title } from 'react-native-paper';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Success'>;

export default function SuccessScreen({ navigation, route }: Props) {
  const { message } = route.params;

  return (
    <View style={styles.container}>
      <Title>Success</Title>
      <Text style={styles.message}>{message}</Text>
      <Button mode="contained" onPress={() => navigation.navigate('Main')}>
        Back to Main
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginVertical: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});
