
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
import AuthPage from '@/components/auth/AuthPage';
import { Loader2 } from 'lucide-react';

const AdminLayout = () => {
  const { user, isAdmin, isLoading, profile } = useAuth();

  console.log('AdminLayout render:', { 
    user: !!user, 
    isAdmin, 
    isLoading,
    profile: !!profile
  });

  // Show loading if we're still determining auth state OR if user exists but profile is not loaded yet
  if (isLoading || (user && !profile)) {
    console.log('AdminLayout - Still loading auth state or profile...');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-white">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show auth page
  if (!user) {
    console.log('AdminLayout - No user, showing auth page');
    return <AuthPage />;
  }

  // If user exists and profile is loaded but is not admin, redirect to home
  if (user && profile && !isAdmin) {
    console.log('AdminLayout - User is not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // If user is admin, show admin layout
  console.log('AdminLayout - User is admin, showing admin layout');
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
