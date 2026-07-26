import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './app/pages/Landing';
import Dashboard from './app/pages/Dashboard';
import Generator from './app/pages/Generator';
import Login from './app/pages/Login';
import Register from './app/pages/Register';
import ChangePassword from './app/pages/ChangePassword';
import AuthCallback from './app/pages/AuthCallback';
import AuthError from './app/pages/AuthError';
import Users from './app/pages/Users';
import ContentViewer from './app/pages/ContentViewer';
import GeneratedContents from './app/pages/GeneratedContents';
import NotFound from './app/pages/NotFound';
import ProtectedRoute from './app/components/ProtectedRoute';
import { useThemeStore } from './app/store/useThemeStore';
import CheckoutModal from './app/components/CheckoutModal';

function App() {
  const isDarkMode = useThemeStore(state => state.isDarkMode);

  useEffect(() => {
    // Force sync with localStorage to prevent hydration mismatches
    const storageStr = localStorage.getItem('katedra-theme-storage-v3');
    let actualIsDark = isDarkMode;
    
    if (storageStr) {
      try {
        const parsed = JSON.parse(storageStr);
        if (parsed && parsed.state && typeof parsed.state.isDarkMode === 'boolean') {
          actualIsDark = parsed.state.isDarkMode;
        }
      } catch {
        actualIsDark = isDarkMode;
      }
    }

    if (actualIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/error" element={<AuthError />} />
        <Route path="/cambiar-password" element={<ChangePassword />} />

        {/* Protected Academic Routes (ROLE_PROFESOR) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_PROFESOR']}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/generador" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_PROFESOR']}>
              <Generator />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/usuarios" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <Users />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/contenido/:id" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_PROFESOR']}>
              <ContentViewer />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/contenidos" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_PROFESOR']}>
              <GeneratedContents />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CheckoutModal />
    </BrowserRouter>
  );
}

export default App;


