import React, { JSX } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

type Props = {
  image: string | null;
  onPickCamera: () => void;
  onPickGallery: () => void;
  onClear: () => void;
};

export default function ImagePickerSection({
  image,
  onPickCamera,
  onPickGallery,
  onClear,
}: Props): JSX.Element {
  return (
    <View style={styles.container}>
      <Text variant="labelMedium">Image</Text>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text>No image selected</Text>
      )}
      <View style={styles.buttonRow}>
        <Button mode="outlined" onPress={onPickCamera} style={styles.button}>
          Take Photo
        </Button>
        <Button mode="outlined" onPress={onPickGallery} style={styles.button}>
          Choose Image
        </Button>
      </View>
      {image && (
        <Button onPress={onClear} style={styles.clearButton}>
          Remove Image
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  clearButton: {
    marginTop: 10,
  },
});
