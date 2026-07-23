import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './app/pages/Landing';
import Dashboard from './app/pages/Dashboard';
import Generator from './app/pages/Generator';
import Login from './app/pages/Login';
import Register from './app/pages/Register';
import AuthCallback from './app/pages/AuthCallback';
import AuthError from './app/pages/AuthError';
import Users from './app/pages/Users';
import ContentViewer from './app/pages/ContentViewer';
import GeneratedContents from './app/pages/GeneratedContents';
import ProtectedRoute from './app/components/ProtectedRoute';
import { useThemeStore } from './app/store/useThemeStore';

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
      } catch (e) {}
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;


