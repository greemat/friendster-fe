import { API_BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { RootStackParamList } from '../navigation/AppNavigator';

type User = { id: string; email: string } | null;

interface AuthContextType {
  user: User;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuthToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  initializing: true,
  login: async () => {},
  logout: async () => {},
  refreshAuthToken: async () => null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>(null);
  const [initializing, setInitializing] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const api = axios.create({ baseURL: API_BASE_URL });

  api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newToken = await refreshAuthToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );

  const refreshAuthToken = async (): Promise<string | null> => {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (!refreshToken) {
        await logout();
        return null;
      }
      const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
      const { token: newToken, refreshToken: newRefreshToken } = res.data;
      if (!newToken || !newRefreshToken) throw new Error('Invalid tokens from refresh');
      await SecureStore.setItemAsync('token', newToken);
      await SecureStore.setItemAsync('refreshToken', newRefreshToken);
      return newToken;
    } catch (err) {
      console.error('Failed to refresh token:', err);
      await logout();
      return null;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { token, refreshToken } = res.data;
      if (!token || !refreshToken) throw new Error('Missing tokens on login');
      await SecureStore.setItemAsync('token', token);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      const profileRes = await api.get('/auth/profile');
      setUser({ id: profileRes.data.uid, email: profileRes.data.email });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Login error:', err.response?.data || err.message);
      } else if (err instanceof Error) {
        console.error('Login error:', err.message);
      } else {
        console.error('Login error:', err);
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('refreshToken');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      setInitializing(true);
      try {
        const token = await SecureStore.getItemAsync('token');
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (!token || !refreshToken) {
          setUser(null);
          return;
        }
        const newToken = await refreshAuthToken();
        if (!newToken) {
          setUser(null);
          return;
        }
        const profileRes = await api.get('/auth/profile');
        setUser({ id: profileRes.data.uid, email: profileRes.data.email });
      } catch (err) {
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        initializing,
        login,
        logout,
        refreshAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
