import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QrCode } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import QRCodeGenerator from './components/QRCodeGenerator';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const { user, loading } = useAuth();
  const { currentTheme } = useTheme();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/app" 
          element={
            user ? (
              <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-8 md:mb-12 animate-fade-in">
                    <div className="inline-flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
                      <QrCode size={32} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                      Modern QR Code Generator
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                      Create beautiful, customizable QR codes for your websites, business cards, 
                      and more in seconds.
                    </p>
                  </div>
                  
                  <QRCodeGenerator />
                </div>
              </main>
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
        <Route 
          path="/profile" 
          element={
            user ? <ProfilePage /> : <Navigate to="/auth" replace />
          } 
        />
        <Route 
          path="/auth" 
          element={
            !user ? <AuthPage /> : <Navigate to="/app" replace />
          } 
        />
      </Routes>
      
      <Footer />
    </div>
  );
}

export default App