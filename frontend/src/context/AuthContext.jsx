import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiStatus, setAiStatus] = useState({ active: false, provider: 'None (BKT Algorithmic)' });

  const refreshAiStatus = async () => {
    try {
      const status = await api.getAiStatus();
      setAiStatus(status);
    } catch (e) {
      console.warn('Could not fetch AI status:', e.message);
    }
  };

  // Initialize or restore authentic session
  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem('learniq_user');
      const token = localStorage.getItem('learniq_token');

      if (savedUser && token) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Error parsing stored user:', e);
          localStorage.removeItem('learniq_user');
          localStorage.removeItem('learniq_token');
        }
      }
      setLoading(false);
      refreshAiStatus();
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    setUser(data);
    localStorage.setItem('learniq_user', JSON.stringify(data));
    localStorage.setItem('learniq_token', data.token);
    return data;
  };

  const register = async (name, email, password, role) => {
    const data = await api.register(name, email, password, role);
    setUser(data);
    localStorage.setItem('learniq_user', JSON.stringify(data));
    localStorage.setItem('learniq_token', data.token);
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('learniq_user');
    localStorage.removeItem('learniq_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        aiStatus,
        refreshAiStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
