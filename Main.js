import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { Button, Card, TextInput, Title } from 'react-native-paper';
import { db } from './firebase';

export default function Main() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Camera access is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name || !email || !description) {
      Alert.alert('Please fill out all fields.');
      return;
    }

    setUploading(true);
    let imageUrl = '';

    try {
      if (image) {
        const res = await fetch(image);
        const blob = await res.blob();

        const filename = `${Date.now()}.jpg`;
        const storage = getStorage();
        const storageRef = ref(storage, `uploads/${filename}`);

        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'submissions'), {
        name,
        email,
        description,
        imageUrl,
        timestamp: new Date(),
      });

      Alert.alert('Success', 'Submission saved.');
      setName('');
      setEmail('');
      setDescription('');
      setImage(null);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to submit data.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>Submit Info</Title>

          <TextInput label="Name" value={name} onChangeText={setName} style={styles.input} />
          <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} />
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            multiline
          />

          <Button icon="camera" onPress={pickImage} style={styles.button}>
            Take a Picture
          </Button>

          {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={uploading}
            disabled={uploading}
            style={styles.button}
          >
            Submit
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, justifyContent: 'center' },
  input: { marginBottom: 12 },
  button: { marginTop: 10 },
  imagePreview: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
});
