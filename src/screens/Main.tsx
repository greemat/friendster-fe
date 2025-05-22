// Main screen for authenticated users.
// Handles user input, image picking, and form submission to the backend.

import { API_BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import React, { JSX, useLayoutEffect, useState } from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Button,
  Card,
  IconButton,
  Snackbar,
  Title,
} from 'react-native-paper';
import ImagePickerSection from '../components/ImagePickerSection';
import UserInputForm from '../components/UserInputForm';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../providers/AuthProvider';

type MainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function Main(): JSX.Element {
  const navigation = useNavigation<MainScreenNavigationProp>();
  const { logout } = useAuth();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const showSnackbar = (message: string): void => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
      <IconButton
        icon="logout"
        onPress={logout}
      />
      ),
    });
  }, [navigation, logout]);

  const handleSubmit = async (): Promise<void> => {
    Keyboard.dismiss();
    if (!name || !email || !description) {
      showSnackbar('Please fill all fields');
      return;
    }
    
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('description', description);

      if (image) {
        const filename = image.split('/').pop() || `photo_${Date.now()}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        const response = await fetch(image);
        const blob = await response.blob();

        formData.append('image', {
          uri: image,
          name: filename,
          type,
        } as any);
      }

      const res = await fetch(`${API_BASE_URL}/api/submitForm`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to submit form');
      }

      setName('');
      setEmail('');
      setDescription('');
      setImage(null);

      navigation.navigate('Success', { message: 'Your submission was successful!' });
      } catch (error) {
        console.error('Submission failed:', error);
        showSnackbar('Submission failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
  };

  const pickImageFromCamera = async (): Promise<void> => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      showSnackbar('Camera access is needed.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickImageFromGallery = async (): Promise<void> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      showSnackbar('Gallery access is needed.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
    <Card style={styles.card}>
    <Card.Content>
    <Title>Submit Info</Title>
            <UserInputForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              description={description}
              setDescription={setDescription}
            />

            <ImagePickerSection
              image={image}
              onPickCamera={pickImageFromCamera}
              onPickGallery={pickImageFromGallery}
              onClear={() => setImage(null)}
            />

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={submitting}
              disabled={submitting}
              style={styles.button}
            >
              Submit
            </Button>
          </Card.Content>
        </Card>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
        >
          {snackbarMessage}
        </Snackbar>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    padding: 10,
  },
  button: {
    marginTop: 10,
  },
});