// Displays a success message passed through navigation after form submission.

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import { styles } from '../theme/styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Success'>;

const SuccessScreen: React.FC<Props> = ({ route }) => {
  const { message } = route.params;

  return (
    <View style={styles.container}>
      <Text>{message}</Text>
    </View>
  );
};

/*
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

*/

export default SuccessScreen;
