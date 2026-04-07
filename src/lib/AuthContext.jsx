import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/api/apiClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Check if user is logged in (from localStorage or API)
    const checkAuth = async () => {
      try {
        setIsLoadingPublicSettings(true);
        setIsLoadingAuth(true);

        // Seed demo users on first app load
        await seedDemoUsers();

        // Simulate checking auth status
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          // Not registered error
          setAuthError({ type: 'user_not_registered' });
        }
      } catch (err) {
        setAuthError({ type: 'auth_error', message: err.message });
      } finally {
        setIsLoadingPublicSettings(false);
        setIsLoadingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const seedDemoUsers = async () => {
    try {
      // Try to create demo users (backend will handle duplicates)
      try {
        await apiClient.entities.User.register('demo@example.com', 'demo123', 'Demo User');
        apiClient.clearToken();
      } catch (e) {
        // User may already exist, that's ok
        console.log('Demo user creation info:', e.message);
      }

      try {
        await apiClient.entities.User.register('maryna.schedl@gmail.com', 'Maryna123!', 'Maryna Schedl');
        apiClient.clearToken();
      } catch (e) {
        // User may already exist, that's ok
        console.log('Maryna user creation info:', e.message);
      }
    } catch (error) {
      console.log('Demo user setup completed:', error.message);
    }
  };

  const register = async (email, password) => {
    try {
      setIsLoadingAuth(true);

      // Call API to register
      const response = await apiClient.entities.User.register(email, password, email.split('@')[0]);

      // Store user data
      const sessionData = { id: response.user.id, email: response.user.email, name: response.user.name };
      setUser(sessionData);
      localStorage.setItem('user', JSON.stringify(sessionData));
      setAuthError(null);
      return sessionData;
    } catch (err) {
      setAuthError({ type: 'auth_error', message: err.message });
      throw err;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoadingAuth(true);

      // Call API to login
      const response = await apiClient.entities.User.login(email, password);

      // Store user data and token
      const sessionData = { id: response.user.id, email: response.user.email, name: response.user.name };
      setUser(sessionData);
      localStorage.setItem('user', JSON.stringify(sessionData));
      setAuthError(null);
      return sessionData;
    } catch (err) {
      setAuthError({ type: 'auth_error', message: err.message });
      throw err;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    apiClient.clearToken();
    setAuthError(null);
  };

  const navigateToLogin = () => {
    // Redirect to login page - implement based on your routing
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      login,
      register,
      logout,
      navigateToLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
