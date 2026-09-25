import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './app/pages/Landing';
import StudentLanding from './modules/public/pages/StudentLanding';
import StudentLayout from './modules/public/components/StudentLayout';
import { StudentAuthPage, StudentRecoveryPage, StudentSearchPage, StudentContactPage, StudentSitemapPage, StudentMissingPage } from './modules/public/pages/StudentPages';
import Dashboard from './modules/teacher/pages/Dashboard';
import Generator from './modules/teacher/pages/Generator';
import Login from './app/pages/Login';
import Register from './app/pages/Register';
import ChangePassword from './app/pages/ChangePassword';
import AuthCallback from './app/pages/AuthCallback';
import AuthError from './app/pages/AuthError';
import Users from './app/pages/Users';
import ContentViewer from './modules/teacher/pages/ContentViewer';
import GeneratedContents from './modules/teacher/pages/GeneratedContents';
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
        <Route path="/alumnos" element={<StudentLayout />}>
          <Route index element={<StudentLanding />} />
          <Route path="forms" element={<StudentMissingPage forms />} />
          <Route path="iniciar-sesion" element={<StudentAuthPage key="login" mode="login" />} />
          <Route path="crear-cuenta" element={<StudentAuthPage key="register" mode="register" />} />
          <Route path="recuperar-contrasena" element={<StudentRecoveryPage />} />
          <Route path="buscar" element={<StudentSearchPage />} />
          <Route path="contacto" element={<StudentContactPage />} />
          <Route path="mapa-del-sitio" element={<StudentSitemapPage />} />
          <Route path="*" element={<StudentMissingPage />} />
        </Route>
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

