import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { dataService } from '@/api/dataService';

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
      // Check if demo users already exist
      const demoUsers = await dataService.entities.User.filter({ email: 'demo@example.com' });
      if (demoUsers.length > 0) return; // Already seeded

      // Create demo user
      const demoPassword = await bcrypt.hash('demo123', 10);
      await dataService.entities.User.create({
        email: 'demo@example.com',
        password: demoPassword,
        name: 'Demo User',
        created_at: new Date().toISOString(),
      });

      // Create maryna user
      const marynaPassword = await bcrypt.hash('Maryna123!', 10);
      await dataService.entities.User.create({
        email: 'maryna.schedl@gmail.com',
        password: marynaPassword,
        name: 'Maryna Schedl',
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.log('Demo users already seeded or error creating them:', error.message);
    }
  };

  const register = async (email, password) => {
    try {
      setIsLoadingAuth(true);

      // Check if user already exists
      const existingUsers = await dataService.entities.User.filter({ email });
      if (existingUsers.length > 0) {
        throw new Error('Email already registered');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const userData = await dataService.entities.User.create({
        email,
        password: hashedPassword,
        name: email.split('@')[0],
        created_at: new Date().toISOString(),
      });

      // Login user after registration
      const sessionData = { id: userData.id, email: userData.email, name: userData.name };
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

      // Find user by email
      const users = await dataService.entities.User.filter({ email });
      if (users.length === 0) {
        throw new Error('Invalid email or password');
      }

      const user = users[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // Login successful
      const sessionData = { id: user.id, email: user.email, name: user.name };
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
