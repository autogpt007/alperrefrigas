import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
import AuthPage from '@/components/auth/AuthPage';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminLayout = () => {
  const { user, isAdmin, isLoading, profile, authError, resetLocalSession, signOut } = useAuth();
  const [profileTimedOut, setProfileTimedOut] = useState(false);

  // If user is authenticated but profile never arrives, show a recovery
  // screen instead of an infinite spinner.
  useEffect(() => {
    if (user && !profile) {
      setProfileTimedOut(false);
      const t = setTimeout(() => setProfileTimedOut(true), 8000);
      return () => clearTimeout(t);
    }
    setProfileTimedOut(false);
  }, [user, profile]);

  console.log('AdminLayout render:', {
    user: !!user,
    isAdmin,
    isLoading,
    profile: !!profile,
    authError,
  });

  // Recovery state: auth service unreachable or profile never loaded
  if ((authError && !user) || (user && !profile && profileTimedOut)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800/60 border border-amber-500/30 rounded-lg p-6 text-center">
          <AlertTriangle className="h-10 w-10 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Can't reach authentication service
          </h2>
          <p className="text-sm text-gray-300 mb-5">
            {authError ||
              "We couldn't load your admin profile. This usually clears up after a quick retry."}
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              Retry
            </Button>
            <Button
              onClick={() => resetLocalSession()}
              variant="outline"
              className="w-full border-slate-600 text-gray-200 hover:bg-slate-700"
            >
              Reset session
            </Button>
            {user && (
              <Button
                onClick={() => signOut()}
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
              >
                Sign out
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

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
