// contexts/ApiKeyProvider.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type ApiKeyContextType = {
  apiKey: string | null;
  loading: boolean;
  error: string | null;
};

const ApiKeyContext = createContext<ApiKeyContextType>({
  apiKey: null,
  loading: true,
  error: null,
});

export const useApiKey = () => useContext(ApiKeyContext);

export const ApiKeyProvider = ({ children }: { children: ReactNode }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      console.log('🔑 Fetching API key...');
      try {
        const response = await fetch('http://192.168.1.66:3000/api/getApiKey');
        console.log('🌐 Response status:', response.status);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!data.apiKey) throw new Error('No apiKey in response');

        console.log('✅ Fetched API key:', data.apiKey);
        setApiKey(data.apiKey);
      } catch (err: any) {
        console.warn('❌ Error fetching API key, falling back to test key:', err.message || err);
        // Simulated fallback for local development
        console.log('⏳ Simulating fallback API key...');
        const fallbackKey = 'FAKE_API_KEY_123456';
        setApiKey(fallbackKey);
        setError(null); // you can optionally store the warning if needed
      } finally {
        console.log('⏹️ Finished fetching API key');
        setLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  console.log('📦 ApiKeyProvider render', { apiKey, error, loading });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading API key...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ApiKeyContext.Provider value={{ apiKey, loading, error }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
