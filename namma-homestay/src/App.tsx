import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HostDashboard from './pages/HostDashboard';
import GuestListing from './pages/GuestListing';
import HomestayDetails from './pages/HomestayDetails';
import LandingPage from './pages/LandingPage';

function AppContent() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-brand-olive/20 rounded-full mb-4"></div>
          <p className="text-brand-earth/40 font-serif italic">Namma HomeStay...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<GuestListing />} />
            <Route path="/homestay/:id" element={<HomestayDetails />} />
            <Route 
              path="/host/*" 
              element={user ? <HostDashboard /> : <Navigate to="/" />} 
            />
          </Routes>
        </main>
        <footer className="py-12 border-t border-brand-earth/5 text-center">
          <p className="text-brand-earth/40 text-sm font-serif italic">
            Promoting Sustainable Rural Tourism. Namma HomeStay © 2026
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
