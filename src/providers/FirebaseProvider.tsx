import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth as FirebaseAuth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { FirebaseConfig } from '../hooks/useFirebaseConfig';
import { useFirebaseConfig } from '../hooks/useFirebaseConfig';

interface FirebaseContextValue {
  firebaseApp: FirebaseApp | null;
  db: Firestore | null;
  storage: FirebaseStorage | null;
  auth: FirebaseAuth | null;
  loading: boolean;
  error: string | null;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  firebaseApp: null,
  db: null,
  storage: null,
  auth: null,
  loading: true,
  error: null,
});

export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const { config, initializing, error } = useFirebaseConfig();
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [storage, setStorage] = useState<FirebaseStorage | null>(null);
  const [auth, setAuth] = useState<FirebaseAuth | null>(null);

  useEffect(() => {
    if (!initializing && config) {
      if (!getApps().length) {
        const app = initializeApp(config as FirebaseConfig);
        setFirebaseApp(app);
        setDb(getFirestore(app));
        setStorage(getStorage(app));
        setAuth(getAuth(app));
      } else {
        const app = getApps()[0];
        setFirebaseApp(app);
        setDb(getFirestore(app));
        setStorage(getStorage(app));
        setAuth(getAuth(app));
      }
    }
  }, [initializing, config]);

  return (
    <FirebaseContext.Provider
      value={{
        firebaseApp,
        db,
        storage,
        auth,
        loading: initializing,
        error,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
