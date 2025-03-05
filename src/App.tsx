// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import InitialWeightEntry from './pages/InitialEntry';
import RemainingWeightEntry from './pages/RemainingEntry';
import DataPage from './pages/DataView';
import FoodAnalysis from './pages/FoodAnalysis';
import BookingEntry from './pages/Bookings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OtpVerification from './pages/OtpVerification';
import PasswordReset from './pages/PasswordReset';


// Types
interface ProtectedRouteProps {
  children: React.ReactNode;
}

// ProtectedRoute component to guard routes that require authentication
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Layout component for consistent page structure
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify" element={<OtpVerification />} />
            <Route path="/reset-password" element={<PasswordReset />} />

            {/* Protected Routes */}
            <Route path="/initial-weight" element={
              <ProtectedRoute>
                <InitialWeightEntry />
              </ProtectedRoute>
            } />
            <Route path="/remaining-weight" element={
              <ProtectedRoute>
                <RemainingWeightEntry />
              </ProtectedRoute>
            } />
            <Route path="/data" element={
              <ProtectedRoute>
                <DataPage />
              </ProtectedRoute>
            } />
            <Route path="/food-analysis" element={
              <ProtectedRoute>
                <FoodAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/booking" element={
              <ProtectedRoute>
                <BookingEntry />
              </ProtectedRoute>
            } />

            {/* Redirect from old paths if needed */}
            <Route path="/old-path" element={<Navigate to="/new-path" replace />} />
            
            {/* 404 Not Found Route */}
            
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;