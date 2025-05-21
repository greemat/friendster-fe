import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

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

const API_BASE_URL = 'http://192.168.1.78:3000';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>(null);
  const [initializing, setInitializing] = useState(true);

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
      if (
        error.response?.status === 401 &&
        !originalRequest._retry
      ) {
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
      //console.log('Login response:', res.data);
      const { token, refreshToken } = res.data;
      if (!token || !refreshToken) throw new Error('Missing tokens on login');

      await SecureStore.setItemAsync('token', token);
      await SecureStore.setItemAsync('refreshToken', refreshToken);

      const profileRes = await api.get('/auth/profile');
      //console.log('Profile response:', profileRes.data);
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
    setUser(null);
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('refreshToken');
  };

useEffect(() => {
  const loadUser = async () => {
    setInitializing(true);
    try {
      const token = await SecureStore.getItemAsync('token');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');


      if (!token || !refreshToken) {
        // No tokens found, user is logged out
        setUser(null);
        return;
      }

      // Try refreshing token before loading profile
      const newToken = await refreshAuthToken();

      if (!newToken) {
        // Refresh failed, logout
        setUser(null);
        return;
      }

      // Fetch user profile with refreshed token
      const profileRes = await api.get('/auth/profile');
      setUser({ id: profileRes.data.uid, email: profileRes.data.email });

      //console.log('Token on load:', token);
      //console.log('Refresh token on load:', refreshToken);
      //console.log('Profile response:', profileRes.data);
    } catch (err) {
      //console.error('Failed to load user profile:', err);
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
