import { db } from './firebase';

import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';
import {
  Button,
  Card,
  TextInput,
  Title
} from 'react-native-paper';
import uuid from 'react-native-uuid';

const storage = getStorage();

export default function Main() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (!name || !email || !description) return;
    setSubmitting(true);
    try {
      let imageUrl = '';
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRef = ref(storage, `images/${uuid.v4()}`);
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, 'submissions'), {
        name,
        email,
        description,
        imageUrl,
        createdAt: new Date()
      });

      setName('');
      setEmail('');
      setDescription('');
      setImage(null);
      Alert.alert('Success', 'Your submission was successful!');
    } catch (error) {
      console.error('Submission failed:', error);
      Alert.alert('Error', 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const pickImageFromCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Camera access is needed.');
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

  const pickImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Gallery access is needed.');
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
            <TextInput
              label="Name"
              value={name}
              onChangeText={setName}
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={true}
              style={styles.input}
            />
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={true}
              style={styles.input}
            />
            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={true}
              style={styles.input}
            />
            <Button mode="outlined" onPress={pickImageFromCamera} style={styles.button}>
              Take Photo
            </Button>
            <Button mode="outlined" onPress={pickImageFromGallery} style={styles.button}>
              Pick from Gallery
            </Button>
            {image && (
              <Image source={{ uri: image }} style={styles.image} />
            )}
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
  input: {
    marginBottom: 10,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 10,
  },
  image: {
    marginTop: 10,
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
});
