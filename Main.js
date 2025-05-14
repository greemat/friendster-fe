// Main.js
import { addDoc, collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, Text, TextInput, Title } from 'react-native-paper';
import { db } from './firebase';

export default function Main() {
  const [name, setName] = useState('');
  const [names, setNames] = useState([]);

  const fetchNames = async () => {
    const snapshot = await getDocs(collection(db, 'users'));
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNames(list);
  };

  const saveName = async () => {
    if (!name.trim()) return;
    await addDoc(collection(db, 'users'), { name });
    setName('');
    fetchNames();
  };

  useEffect(() => {
    fetchNames();
  }, []);

  return (
    <View style={styles.container}>
      <Title style={styles.title}>💬 Name Logger</Title>
      <TextInput
        label="Enter Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />
      <Button mode="contained" onPress={saveName} style={styles.button}>
        Save
      </Button>

      <FlatList
        data={names}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text>{item.name}</Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f6f6f6' },
  title: { marginBottom: 20, textAlign: 'center' },
  input: { marginBottom: 10 },
  button: { marginBottom: 20 },
  card: { marginBottom: 10 }
});
