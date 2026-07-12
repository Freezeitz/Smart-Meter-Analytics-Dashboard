import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedToken = localStorage.getItem('pulsemeter_token');
    const savedUser = localStorage.getItem('pulsemeter_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password });
      const data = response.data;
      if (data.token) {
        localStorage.setItem('pulsemeter_token', data.token);
        localStorage.setItem('pulsemeter_user', JSON.stringify({
          username: data.username,
          fullName: data.fullName,
          role: data.role,
        }));
        setToken(data.token);
        setUser({ username: data.username, fullName: data.fullName, role: data.role });
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Invalid username or password' 
      };
    }
  };

  const register = async (username, email, password, fullName) => {
    try {
      const response = await authAPI.register({ username, email, password, fullName });
      const data = response.data;
      if (data.token) {
        localStorage.setItem('pulsemeter_token', data.token);
        localStorage.setItem('pulsemeter_user', JSON.stringify({
          username: data.username,
          fullName: data.fullName,
          role: data.role,
        }));
        setToken(data.token);
        setUser({ username: data.username, fullName: data.fullName, role: data.role });
        return { success: true };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Try a different username/email.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('pulsemeter_token');
    localStorage.removeItem('pulsemeter_user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
