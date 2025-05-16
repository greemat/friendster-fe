// contexts/FirebaseProvider.tsx
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useApiKey } from './ApiKeyProvider';

type FirebaseContextType = {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  storage: FirebaseStorage | null;
  initializing: boolean;
};

const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  auth: null,
  db: null,
  storage: null,
  initializing: true,
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const { apiKey, loading: apiKeyLoading, error: apiKeyError } = useApiKey();

  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [storage, setStorage] = useState<FirebaseStorage | null>(null);
  const [initializing, setInitializing] = useState(true);

  console.log('🔄 FirebaseProvider render', { app, auth, db, storage, initializing });

  useEffect(() => {
    console.log('🌀 FirebaseProvider useEffect triggered', { apiKey, apiKeyLoading });

    if (!apiKey || apiKeyLoading) return;

    const config = {
      apiKey,
      authDomain: 'reactnativedemo-d8272.firebaseapp.com',
      projectId: 'reactnativedemo-d8272',
      storageBucket: 'reactnativedemo-d8272.firebasestorage.app',
      messagingSenderId: '139117127529',
      appId: '1:139117127529:web:49f61f885b951d150f3ff8',
      measurementId: "G-YE8S9TQ3D1"

    };

    let firebaseApp: FirebaseApp;

    if (getApps().length === 0) {
      console.log('⚙️ Initializing Firebase with config:', config);
      firebaseApp = initializeApp(config);
      console.log('✅ Firebase initialized');
    } else {
      console.log('🚫 Firebase already initialized. Using existing app.');
      firebaseApp = getApp();
    }

    const firebaseAuth = getAuth(firebaseApp);
    const firestore = getFirestore(firebaseApp);
    const firebaseStorage = getStorage(firebaseApp);

    setApp(firebaseApp);
    setAuth(firebaseAuth);
    setDb(firestore);
    setStorage(firebaseStorage);
    setInitializing(false);
  }, [apiKey, apiKeyLoading]);

  return (
    <FirebaseContext.Provider value={{ app, auth, db, storage, initializing }}>
      {children}
    </FirebaseContext.Provider>
  );
};
