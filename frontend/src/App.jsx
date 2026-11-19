import React, { useState } from 'react';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { PropertyListingPage } from './pages/PropertyListingPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { OwnerDashboardPage } from './pages/OwnerDashboardPage';
import { AuthModal } from './pages/AuthModal';
import { VisitModal } from './components/booking/VisitModal';
import { AddPropertyModal } from './components/owner/AddPropertyModal';

function AppContent() {
  const [currentView, setCurrentView] = useState('home'); // home | explore | detail | student-dashboard | owner-dashboard
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [exploreFilters, setExploreFilters] = useState({});
  const [quickVisitProperty, setQuickVisitProperty] = useState(null);
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);

  const { isAuthenticated, isOwner, openAuthModal } = useAuth();

  const handleSelectProperty = (property) => {
    setSelectedPropertyId(property.id);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateExplore = (filters = {}) => {
    setExploreFilters(filters);
    setCurrentView('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScheduleVisit = (property) => {
    setQuickVisitProperty(property);
  };

  const handleOpenAddProperty = () => {
    if (!isAuthenticated) {
      openAuthModal('login', 'owner');
      return;
    }
    setIsAddPropertyOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Global Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenAddProperty={handleOpenAddProperty}
      />

      {/* Main View Render */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onNavigateExplore={handleNavigateExplore}
            onSelectProperty={handleSelectProperty}
            onScheduleVisit={handleScheduleVisit}
          />
        )}

        {currentView === 'explore' && (
          <PropertyListingPage
            initialFilters={exploreFilters}
            onSelectProperty={handleSelectProperty}
            onScheduleVisit={handleScheduleVisit}
          />
        )}

        {currentView === 'detail' && (
          <PropertyDetailPage
            propertyId={selectedPropertyId}
            onBack={() => setCurrentView('explore')}
            onNavigateExplore={handleNavigateExplore}
          />
        )}

        {currentView === 'student-dashboard' && (
          <StudentDashboardPage
            onSelectProperty={handleSelectProperty}
          />
        )}

        {currentView === 'owner-dashboard' && (
          <OwnerDashboardPage
            onSelectProperty={handleSelectProperty}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onSelectCity={(city) => handleNavigateExplore({ city })}
      />

      {/* Modals */}
      <AuthModal />

      <VisitModal
        property={quickVisitProperty}
        isOpen={!!quickVisitProperty}
        onClose={() => setQuickVisitProperty(null)}
      />

      <AddPropertyModal
        isOpen={isAddPropertyOpen}
        onClose={() => setIsAddPropertyOpen(false)}
        onPropertyAdded={() => {
          setCurrentView('owner-dashboard');
        }}
      />

    </div>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <WishlistProvider>
          <AppContent />
        </WishlistProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
