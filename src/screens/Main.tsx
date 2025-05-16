// Main.tsx

import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { JSX, useState } from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Button,
  Card,
  Snackbar,
  Title,
} from 'react-native-paper';
import uuid from 'react-native-uuid';

import ImagePickerSection from '../components/ImagePickerSection';
import UserInputForm from '../components/UserInputForm';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

import { useFirebase } from '../contexts/FirebaseProvider'; // <-- get firebase from context

type MainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function Main(): JSX.Element {
  const navigation = useNavigation<MainScreenNavigationProp>();
  const { db, storage } = useFirebase();

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

  const handleSubmit = async (): Promise<void> => {
    Keyboard.dismiss();
    if (!name || !email || !description) {
      showSnackbar('Please fill all fields');
      return;
    }

    if (!db || !storage) {
      showSnackbar('Firebase is still initializing, please wait.');
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = '';
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRef = ref(storage, `images/${uuid.v4()}`);
        try {
          await uploadBytes(imageRef, blob);
          console.log('✅ Upload successful');
        } catch (uploadError) {
          console.error('❌ Upload failed:', uploadError);
          throw uploadError; // rethrow so handleSubmit can catch it
        }
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, 'submissions'), {
        name,
        email,
        description,
        imageUrl,
        createdAt: new Date(),
      });

      // Clear form
      setName('');
      setEmail('');
      setDescription('');
      setImage(null);

      // Navigate to Success screen
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
      <ScrollView contentContainerStyle={styles.container}>
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
