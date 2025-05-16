// src/contexts/ApiKeyContext.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { fetchApiKey } from '../utils/api';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApiKey()
      .then((key) => {
        setApiKey(key);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <ApiKeyContext.Provider value={{ apiKey, loading, error }}>
      {children}
    </ApiKeyContext.Provider>
  );
};
