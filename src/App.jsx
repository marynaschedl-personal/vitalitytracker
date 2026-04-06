import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Racion from './pages/Racion';
import Exercises from './pages/Exercises';
import Steps from './pages/Steps';
import Measurements from './pages/Measurements';
import MeasurementDetail from './pages/MeasurementDetail';
import Settings from './pages/Settings';

const THEMES = [
  {
    id: "light",
    cssVars: {
      "--background": "0 0% 100%",
      "--foreground": "0 0% 0%",
      "--card": "0 0% 96%",
      "--primary": "221 83% 53%",
    },
  },
  {
    id: "dark",
    cssVars: {
      "--background": "224 71% 4%",
      "--foreground": "213 31% 91%",
      "--card": "224 64% 9%",
      "--primary": "217 91% 60%",
    },
  },
  {
    id: "ocean",
    cssVars: {
      "--background": "210 40% 96%",
      "--foreground": "210 40% 10%",
      "--card": "210 40% 90%",
      "--primary": "210 80% 50%",
    },
  },
  {
    id: "forest",
    cssVars: {
      "--background": "120 30% 95%",
      "--foreground": "120 30% 10%",
      "--card": "120 30% 88%",
      "--primary": "120 70% 45%",
    },
  },
  {
    id: "sunset",
    cssVars: {
      "--background": "30 100% 96%",
      "--foreground": "30 80% 10%",
      "--card": "30 100% 88%",
      "--primary": "30 100% 55%",
    },
  },
  {
    id: "midnight",
    cssVars: {
      "--background": "275 100% 8%",
      "--foreground": "275 50% 90%",
      "--card": "275 100% 15%",
      "--primary": "275 90% 60%",
    },
  },
];

function initializeTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  const theme = THEMES.find((t) => t.id === saved);
  if (theme) {
    Object.entries(theme.cssVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }
}

const AuthenticatedApp = () => {
  const { user, isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not authenticated, show login/register
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Handle authentication errors
  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/racion" element={<Racion />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/steps" element={<Steps />} />
        <Route path="/measurements" element={<Measurements />} />
        <Route path="/measurements/:type" element={<MeasurementDetail />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};


function App() {
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
          <Analytics />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App