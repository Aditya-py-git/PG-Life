import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import { DEMO_ACCOUNTS } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('pglife_token'));
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'
  const [preferredRole, setPreferredRole] = useState('student');

  // Verify and fetch profile on load
  const loadUser = useCallback(async () => {
    const savedToken = localStorage.getItem('pglife_token');
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.auth.me();
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        logout();
      }
    } catch (err) {
      console.warn('Session verification error:', err);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const res = await api.auth.login({ email, password });
    if (res.success && res.data?.token) {
      localStorage.setItem('pglife_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setAuthModalOpen(false);
      return res.data.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.auth.register(userData);
    if (res.success && res.data?.token) {
      localStorage.setItem('pglife_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setAuthModalOpen(false);
      return res.data.user;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const loginAsDemo = async (role = 'student') => {
    const demo = DEMO_ACCOUNTS[role] || DEMO_ACCOUNTS.student;
    return await login(demo.email, demo.password);
  };

  const logout = () => {
    localStorage.removeItem('pglife_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await api.auth.updateProfile(data);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
      return res.data.user;
    }
    throw new Error(res.message || 'Profile update failed');
  };

  const openAuthModal = (tab = 'login', role = 'student') => {
    setAuthModalTab(tab);
    setPreferredRole(role);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isOwner: user?.role === 'owner' || user?.role === 'admin',
    login,
    register,
    loginAsDemo,
    logout,
    updateProfile,
    authModalOpen,
    authModalTab,
    setAuthModalTab,
    preferredRole,
    setPreferredRole,
    openAuthModal,
    closeAuthModal
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
