
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  // Redirect to the new admin structure
  return <Navigate to="/admin" replace />;
};

export default AdminDashboard;
