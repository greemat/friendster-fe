// src/providers/AuthProvider.tsx
import { API_BASE_URL } from '@env';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import api from '../utils/axios';

type User = {
  id: string;
  email: string;
  profileImage?: string | null;
  profileImageUrl: string | null;
} | null;

interface AuthContextType {
  user: User;
  token: string | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuthToken: () => Promise<string | null>;
  updateUserProfile: (data: FormData) => Promise<void>;
  setProfileImage: (uri: string) => void;
  refreshUserProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  initializing: true,
  login: async () => {},
  logout: async () => {},
  refreshAuthToken: async () => null,
  updateUserProfile: async () => {},
  setProfileImage: () => {},
  refreshUserProfile: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  api.create({ baseURL: API_BASE_URL });
  api.interceptors.request.use(async (config) => {
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;
      if (err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newToken = await refreshAuthToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      }
      return Promise.reject(err);
    }
  );

  const refreshAuthToken = async (): Promise<string | null> => {
    try {
      const storedRefresh = await SecureStore.getItemAsync('refreshToken');
      if (!storedRefresh) {
        await logout();
        return null;
      }

      const res = await api.post(`${API_BASE_URL}/auth/refresh-token`, {
        refreshToken: storedRefresh,
      });

      const { token: newToken, refreshToken: newRefresh } = res.data;

      if (newToken && newRefresh) {
        await SecureStore.setItemAsync('token', newToken);
        await SecureStore.setItemAsync('refreshToken', newRefresh);
        setToken(newToken);
        return newToken;
      }

      throw new Error('Invalid tokens received');
    } catch (err) {
      console.error('Token refresh failed:', err);
      await logout();
      return null;
    }
  };

  const login = async (email: string, password: string) => {
    const res = await api.post(`${API_BASE_URL}/auth/login`, { email, password });
    const { token: accessToken, refreshToken } = res.data;

    if (!accessToken || !refreshToken) throw new Error('Missing token or refreshToken');

    await SecureStore.setItemAsync('token', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    setToken(accessToken);

    const profileRes = await api.get('/auth/profile');
    setUser({
      id: profileRes.data.uid,
      email: profileRes.data.email,
      profileImage: profileRes.data.profileImage || null,
      profileImageUrl: res.data.profileImageUrl ?? null,
    });
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('refreshToken');
    setUser(null);
    setToken(null);
  };

  const updateUserProfile = async (data: FormData) => {
    const res = await api.post('/users/profile-picture', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const { profileImage } = res.data;
    if (profileImage) {
      setUser((prev) => prev && { ...prev, profileImage });
    }
  };

  const setProfileImage = (uri: string) => {
    if (user) setUser({ ...user, profileImage: uri });
  };

  const refreshUserProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      setUser(res.data);
    } catch (err) {
      console.error('Error refreshing user profile:', err);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      setInitializing(true);
      try {
        const savedToken = await SecureStore.getItemAsync('token');
        const savedRefresh = await SecureStore.getItemAsync('refreshToken');

        if (!savedToken || !savedRefresh) return;

        const newToken = await refreshAuthToken();
        if (!newToken) return;

        const profileRes = await api.get('/auth/profile');
        setUser({
          id: profileRes.data.uid,
          email: profileRes.data.email,
          profileImage: profileRes.data.profileImage || null,
          profileImageUrl: profileRes.data.profileImageUrl ?? null,
        });
      } catch (err) {
        console.warn('Session restoration failed:', err);
      } finally {
        setInitializing(false);
      }
    };
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        initializing,
        login,
        logout,
        refreshAuthToken,
        updateUserProfile,
        setProfileImage,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
