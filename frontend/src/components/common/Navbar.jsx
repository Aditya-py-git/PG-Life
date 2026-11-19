import React, { useState } from 'react';
import {
  Home,
  Search,
  Heart,
  User,
  LogOut,
  Building2,
  Calendar,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  Compass,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

export const Navbar = ({ currentView, setCurrentView, onOpenAddProperty }) => {
  const { user, isAuthenticated, isOwner, isStudent, logout, openAuthModal, loginAsDemo } = useAuth();
  const { wishlistIds } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => { setCurrentView('home'); setMenuOpen(false); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <Home className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                  PG<span className="text-brand-600">-Life</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                  PRO
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 tracking-wide uppercase">
                Student & Co-Living
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                currentView === 'home'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => setCurrentView('explore')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                currentView === 'explore'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4 text-brand-600" />
              Explore All PGs
            </button>
            {isAuthenticated && isOwner && (
              <button
                onClick={() => setCurrentView('owner-dashboard')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  currentView === 'owner-dashboard'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-600" />
                Owner Portal
              </button>
            )}
            {isAuthenticated && isStudent && (
              <button
                onClick={() => setCurrentView('student-dashboard')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  currentView === 'student-dashboard'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-4 h-4 text-brand-600" />
                My Bookings & Visits
              </button>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Demo Switcher Pills */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 gap-1">
              <span className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider">Demo:</span>
              <button
                onClick={async () => {
                  await loginAsDemo('student');
                  setCurrentView('student-dashboard');
                }}
                title="Log in instantly as Student Rahul"
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  isAuthenticated && isStudent 
                    ? 'bg-brand-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                🎓 Student
              </button>
              <button
                onClick={async () => {
                  await loginAsDemo('owner');
                  setCurrentView('owner-dashboard');
                }}
                title="Log in instantly as PG Owner Vikram"
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  isAuthenticated && isOwner 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                🏢 Owner
              </button>
            </div>

            {/* List Property CTA (Owner) */}
            {isAuthenticated && isOwner ? (
              <button
                onClick={onOpenAddProperty}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all hover:shadow-lg"
              >
                <PlusCircle className="w-4 h-4" />
                List New PG
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('register', 'owner')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-brand-600 hover:bg-brand-50 border border-slate-200 transition-all"
              >
                <Building2 className="w-3.5 h-3.5 text-brand-600" />
                List Your Property
              </button>
            )}

            {/* Wishlist Icon */}
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setCurrentView('student-dashboard');
                } else {
                  openAuthModal('login');
                }
              }}
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Saved Shortlist"
            >
              <Heart className={`w-5 h-5 ${wishlistIds.size > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {wishlistIds.size > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-md">
                  {wishlistIds.size}
                </span>
              )}
            </button>

            {/* User Profile / Auth State */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user?.name}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-brand-500/20"
                  />
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name}</p>
                    <p className="text-[10px] font-medium text-slate-500 capitalize">{user?.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div 
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      <span className="mt-1.5 inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 capitalize">
                        {user?.role} Account
                      </span>
                    </div>

                    {isOwner ? (
                      <button
                        onClick={() => { setCurrentView('owner-dashboard'); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Building2 className="w-4 h-4 text-slate-400" />
                        Host Dashboard
                      </button>
                    ) : (
                      <button
                        onClick={() => { setCurrentView('student-dashboard'); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4 text-slate-400" />
                        My Bookings & Visits
                      </button>
                    )}

                    <button
                      onClick={() => { logout(); setProfileDropdownOpen(false); setCurrentView('home'); }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 mt-1 border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:text-brand-600 hover:bg-slate-50 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition-all"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => { setCurrentView('home'); setMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg font-semibold text-slate-800 hover:bg-slate-50"
            >
              Home
            </button>
            <button
              onClick={() => { setCurrentView('explore'); setMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg font-semibold text-slate-800 hover:bg-slate-50"
            >
              Explore All PGs
            </button>
            {isAuthenticated && isOwner && (
              <button
                onClick={() => { setCurrentView('owner-dashboard'); setMenuOpen(false); }}
                className="text-left px-3 py-2 rounded-lg font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Owner Dashboard
              </button>
            )}
            {isAuthenticated && isStudent && (
              <button
                onClick={() => { setCurrentView('student-dashboard'); setMenuOpen(false); }}
                className="text-left px-3 py-2 rounded-lg font-semibold text-brand-700 hover:bg-brand-50"
              >
                Student Portal
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Quick Demo Login</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={async () => {
                  await loginAsDemo('student');
                  setCurrentView('student-dashboard');
                  setMenuOpen(false);
                }}
                className="p-2 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-brand-50 hover:border-brand-300"
              >
                🎓 Student Demo
              </button>
              <button
                onClick={async () => {
                  await loginAsDemo('owner');
                  setCurrentView('owner-dashboard');
                  setMenuOpen(false);
                }}
                className="p-2 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300"
              >
                🏢 Owner Demo
              </button>
            </div>
          </div>

          {isAuthenticated ? (
            <button
              onClick={() => { logout(); setMenuOpen(false); }}
              className="w-full text-center py-2.5 rounded-xl font-bold text-sm text-rose-600 bg-rose-50"
            >
              Sign Out
            </button>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => { openAuthModal('login'); setMenuOpen(false); }}
                className="w-full py-2.5 rounded-xl font-bold text-sm text-slate-700 bg-slate-100"
              >
                Sign In
              </button>
              <button
                onClick={() => { openAuthModal('register'); setMenuOpen(false); }}
                className="w-full py-2.5 rounded-xl font-bold text-sm text-white bg-brand-600"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
