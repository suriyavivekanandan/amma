// src/components/Navbar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Utensils, LogOut, User, BarChart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-green-700' : '';
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Utensils className="h-6 w-6" />
            <span className="font-bold text-lg">Food Waste Management</span>
          </Link>
          
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 ${isActive('/')}`}
            >
              Home
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/initial-weight"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 ${isActive('/initial-weight')}`}
                >
                  Initial Weight
                </Link>
                <Link
                  to="/remaining-weight"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 ${isActive('/remaining-weight')}`}
                >
                  Remaining Weight
                </Link>
                <Link
                  to="/data"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 ${isActive('/data')}`}
                >
                  Data
                </Link>
                <Link
                  to="/food-analysis"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 ${isActive('/food-analysis')}`}
                >
                  <BarChart className="h-4 w-4 mr-1" />
                  Food Analysis
                </Link>
                <Link
                  to="/booking"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 ${isActive('/booking')}`}
                >
                  Booking
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 ${isActive('/login')}`}
              >
                <User className="h-4 w-4 mr-1" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;