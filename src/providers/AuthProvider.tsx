// contexts/AuthProvider.tsx
import type { User } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFirebase } from './FirebaseProvider';

type AuthContextType = {
  user: User | null;
  initializing: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { auth } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

useEffect(() => {
  console.log('AuthProvider useEffect triggered, auth:', auth);
  if (!auth) return;

  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    console.log('onAuthStateChanged fired, user:', firebaseUser);
    setUser(firebaseUser);
    if (initializing) setInitializing(false);
  });

  return () => {
    console.log('AuthProvider cleanup: unsubscribing auth listener');
    unsubscribe();
  };
}, [auth]);

  const signup = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth not initialized');
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth not initialized');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (!auth) throw new Error('Firebase Auth not initialized');
    await signOut(auth);
  };

  if (!auth) {
    return null; // or loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, initializing, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
