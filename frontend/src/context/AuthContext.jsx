import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await userService.getProfile();
      const updatedUser = { ...user, ...res.data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, rememberMe) => {
    const res = await authService.login({ email, password, rememberMe });
    const jwtData = res.data;
    setToken(jwtData.token);
    setUser(jwtData);
    localStorage.setItem('token', jwtData.token);
    localStorage.setItem('user', JSON.stringify(jwtData));
    return jwtData;
  };

  const googleLogin = async (googleData) => {
    const res = await authService.googleLogin(googleData);
    const jwtData = res.data;
    setToken(jwtData.token);
    setUser(jwtData);
    localStorage.setItem('token', jwtData.token);
    localStorage.setItem('user', JSON.stringify(jwtData));
    return jwtData;
  };

  const register = async (registerData) => {
    return await authService.register(registerData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAdmin = () => {
    return user && user.roles && user.roles.includes('ROLE_ADMIN');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, googleLogin, register, logout, isAdmin, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
