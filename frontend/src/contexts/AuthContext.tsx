import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { username: string; email: string; password: string; firstName: string; lastName: string; mass?: number; height?: number }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  updateUserData: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't check auth on login/register pages to prevent loops
    const currentPath = window.location.pathname;
    if (currentPath === '/login' || currentPath === '/register') {
      console.log('On login/register page, skipping auth check');
      setLoading(false);
      return;
    }
    
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Auth check - Token in localStorage:', !!token);
      
      // If no token, don't make API call
      if (!token) {
        console.log('No token found, skipping auth check');
        setLoading(false);
        return;
      }
      
      if (token) {
        console.log('Token value:', token.substring(0, 20) + '...');
      }
      
      const response = await apiService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        console.log('Auth check failed - response:', response);
        // Clear invalid token
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid token on error
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login({ email, password });
      if (response.success && response.data) {
        setUser(response.data.user);
        // Store token in localStorage
        localStorage.setItem('authToken', response.data.token);
        console.log('Login successful - Token stored:', response.data.token.substring(0, 20) + '...');
        toast.success('Login successful!');
        return true;
      } else {
        console.log('Login failed - response:', response);
        toast.error(response.error || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
      return false;
    }
  };

  const register = async (userData: { username: string; email: string; password: string; firstName: string; lastName: string; mass?: number; height?: number }): Promise<boolean> => {
    try {
      const response = await apiService.register(userData);
      if (response.success && response.data) {
        setUser(response.data.user);
        // Store token in localStorage
        localStorage.setItem('authToken', response.data.token);
        toast.success('Registration successful!');
        return true;
      } else {
        toast.error(response.error || 'Registration failed');
        return false;
      }
    } catch (error) {
      toast.error('Registration failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
      // Remove token from localStorage
      localStorage.removeItem('authToken');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const response = await apiService.updateProfile(userData);
      if (response.success && response.data) {
        setUser(response.data);
        toast.success('Profile updated successfully!');
        return true;
      } else {
        toast.error(response.error || 'Profile update failed');
        return false;
      }
    } catch (error) {
      toast.error('Profile update failed');
      return false;
    }
  };

  const updateUserData = (userData: User) => {
    // Merge new user data with existing user data to preserve all fields
    setUser(prevUser => {
      if (!prevUser) return userData;
      return { ...prevUser, ...userData };
    });
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    updateUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 