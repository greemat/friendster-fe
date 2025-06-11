import * as ImagePicker from 'expo-image-picker';
import React, { JSX, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Snackbar,
  Text,
} from 'react-native-paper';
import { useAuth } from '../providers/AuthProvider';
import api from '../utils/axios';

export default function ProfileScreen(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const { logout, user, refreshUserProfile } = useAuth();
  const showSnackbar = (message: string): void => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const fetchProfile = async (): Promise<void> => {
    try {
      const res = await api.get('/auth/profile');
      const { email, profileImageUrl } = res.data;
      setEmail(email);
      setProfileImageUrl(profileImageUrl ?? null);
      //console.log('Fetched profile:', res.data);
    } catch (err) {
      console.error('Failed to fetch profile', err);
      showSnackbar('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const pickAndUploadImage = async (): Promise<void> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow media access to continue.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const uri = asset.uri;

      const formData = new FormData();
      formData.append('profileImage', {
        uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as any);

      try {
        const res = await api.post('/users/profile-picture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const newImageUrl = res.data.signedUrl;
        setProfileImageUrl(newImageUrl);
        showSnackbar('Profile picture updated!');
        // Refresh global user data
        await refreshUserProfile();
      } catch (err) {
        console.error('Upload failed:', err);
        showSnackbar('Upload failed. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  //console.log('Profile Image: ', profileImageUrl);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.centered}>
          <Avatar.Image
            size={120}
            source={
              profileImageUrl
                ? { uri: profileImageUrl }
                : require('../../assets/images/default-avatar.png')
            }
          />
          <Text style={styles.email}>{email}</Text>
          <Button
            mode="contained"
            style={styles.button}
            onPress={pickAndUploadImage}
          >
            Change Profile Picture
          </Button>
          <Button
            mode="contained"
            style={styles.button}
            onPress={logout}
          >
            Logout
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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    padding: 16,
  },
  centered: {
    alignItems: 'center',
  },
  email: {
    marginTop: 16,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
  },
});
