import Constants from 'expo-constants';
import { useEffect, useState } from 'react';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export function useFirebaseConfig() {
  const [config, setConfig] = useState<FirebaseConfig | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/getFirebaseConfig`);
        if (!response.ok) {
          throw new Error(`Failed to fetch Firebase config: ${response.statusText}`);
        }
        const data = await response.json();
        setConfig(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setInitializing(false);
      }
    }
    fetchConfig();
  }, []);

  return { config, initializing, error };
}
