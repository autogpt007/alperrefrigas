
import React from 'react';
import { Navigate } from 'react-router-dom';
import SEOComponent from '../seo/SEOComponent';

const AdminDashboard = () => {
  return (
    <>
      <SEOComponent
        title="Admin Dashboard"
        description="Admin dashboard for Alper Refrigerants."
        robotsContent="noindex, nofollow"
      />
      <Navigate to="/admin" replace />
    </>
  );
};

export default AdminDashboard;
