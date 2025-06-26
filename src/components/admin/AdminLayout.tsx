
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
import AuthPage from '@/components/auth/AuthPage';
import { Loader2 } from 'lucide-react';

const AdminLayout = () => {
  const { user, isAdmin, isLoading } = useAuth();

  console.log('AdminLayout - user:', user, 'isAdmin:', isAdmin, 'isLoading:', isLoading);

  if (isLoading) {
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

  // If user exists but is not admin, redirect to home
  if (user && !isAdmin) {
    console.log('AdminLayout - User exists but not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // If user is admin, show admin layout
  console.log('AdminLayout - User is admin, showing admin layout');
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      <div className="w-64 flex-shrink-0">
        <AdminSidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
