import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = api.getToken();
      const storedUser = localStorage.getItem('smartspend_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Refresh profile in background
          const res = await api.get('/auth/profile');
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('smartspend_user', JSON.stringify(res.data.user));
          }
        } catch (e) {
          console.warn('Auth token refresh error:', e.message);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data && res.data.success) {
      api.setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('smartspend_user', JSON.stringify(res.data.user));
      return res.data;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data && res.data.success) {
      api.setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('smartspend_user', JSON.stringify(res.data.user));
      return res.data;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  const logout = () => {
    api.setToken(null);
    localStorage.removeItem('smartspend_user');
    setUser(null);
    window.location.href = '/login';
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('smartspend_user', JSON.stringify(updated));
  };

  const CURRENCIES = [
    { code: 'INR', symbol: '₹', label: 'Indian Rupee (₹ INR)', locale: 'en-IN' },
    { code: 'USD', symbol: '$', label: 'US Dollar ($ USD)', locale: 'en-US' },
    { code: 'EUR', symbol: '€', label: 'Euro (€ EUR)', locale: 'de-DE' },
    { code: 'GBP', symbol: '£', label: 'British Pound (£ GBP)', locale: 'en-GB' },
    { code: 'JPY', symbol: '¥', label: 'Japanese Yen (¥ JPY)', locale: 'ja-JP' },
    { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar (C$ CAD)', locale: 'en-CA' },
    { code: 'AUD', symbol: 'A$', label: 'Australian Dollar (A$ AUD)', locale: 'en-AU' },
    { code: 'AED', symbol: 'AED ', label: 'UAE Dirham (AED)', locale: 'en-AE' }
  ];

  const changeCurrency = async (newCurrency) => {
    if (!user) return;
    const updated = { ...user, currency: newCurrency };
    setUser(updated);
    localStorage.setItem('smartspend_user', JSON.stringify(updated));

    try {
      await api.put('/auth/profile', { currency: newCurrency });
    } catch (e) {
      console.warn('Failed to persist currency change to server:', e.message);
    }
  };

  const formatCurrency = (val) => {
    const num = Number(val || 0);
    const currCode = user?.currency || 'INR';
    const found = CURRENCIES.find(c => c.code === currCode) || CURRENCIES[0];
    const formattedNum = num.toLocaleString(found.locale, {
      minimumFractionDigits: currCode === 'JPY' ? 0 : 2,
      maximumFractionDigits: currCode === 'JPY' ? 0 : 2
    });
    return `${found.symbol} ${formattedNum}`;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateUser,
      formatCurrency,
      changeCurrency,
      currencies: CURRENCIES,
      currentCurrency: user?.currency || 'INR',
      isAuthenticated: Boolean(user)
    }}>
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
