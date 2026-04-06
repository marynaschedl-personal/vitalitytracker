import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const login = async (email, password) => {
    try {
      setIsLoadingAuth(true);
      // Simulate login
      const userData = { id: '1', email, name: email.split('@')[0] };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setAuthError(null);
      return userData;
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
