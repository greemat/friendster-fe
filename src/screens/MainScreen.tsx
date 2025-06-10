// MainScreen.tsx
import { API_BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useLayoutEffect, useState } from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Button, IconButton, Snackbar, Text } from 'react-native-paper';
import ImagePickerSection from '../components/ImagePickerSection';
import UserInputForm from '../components/UserInputForm';
import { MainStackParamList } from '../navigation/MainNavigator';
import { useAuth } from '../providers/AuthProvider';
import { styles } from '../theme/styles';

type MainScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Main'>;

export default function MainScreen() {
  const navigation = useNavigation<MainScreenNavigationProp>();
  const { logout, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const showModal = () => {
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton
            icon="logout"
            size={28}
            onPress={logout}
          />
          {user && (
            <IconButton
              icon="account-circle"
              size={28}
              onPress={() => navigation.navigate('Profile')}
              style={{ marginRight: 8 }}
            />
          )}
        </View>
      ),
    });
  }, [navigation, logout, user]);

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (!name || !email || !description) {
      showSnackbar('Please fill in all fields.');
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

      if (!res.ok) throw new Error('Failed to submit form');

      setName('');
      setEmail('');
      setDescription('');
      setImage(null);

      //navigation.navigate('Success', { message: 'Your submission was successful!' });
      //showSnackbar('Your submission was successful!');
      //setSuccessModalVisible(true);
      showModal();

    } catch (error) {
      console.error('Submission failed:', error);
      showSnackbar('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const pickImageFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      showSnackbar('Camera access is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const pickImageFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showSnackbar('Gallery access is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) setImage(result.assets[0].uri);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Submit Info</Text>

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
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Submit
          </Button>

        </View>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={styles.snackbar}
        >
          {snackbarMessage}
        </Snackbar>

        <Modal
          visible={modalVisible}
          transparent
          animationType="none" // We’re handling animation with Animated API
        >
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)'],
              }),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Animated.View
              style={{
                opacity: fadeAnim,
                backgroundColor: '#ffffff',
                padding: 24,
                borderRadius: 16,
                width: '80%',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 16, color: '#333' }}>
                Success!
              </Text>
              <Text style={{ fontSize: 16, textAlign: 'center', color: '#555' }}>
                Your submission was successful.
              </Text>
              <Button
                mode="contained"
                onPress={hideModal}
                style={{ marginTop: 24, borderRadius: 8, backgroundColor: '#4f46e5' }}
                labelStyle={{ color: '#fff' }}
              >
                Close
              </Button>
            </Animated.View>
          </Animated.View>
        </Modal>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

/*
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  inner: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    color: '#222222',
  },
  button: {
    marginTop: 24,
    borderRadius: 12,
    backgroundColor: '#4f46e5', // Indigo for a modern, vibrant feel
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  snackbar: {
    backgroundColor: '#333333',
    borderRadius: 8,
  },
});
*/