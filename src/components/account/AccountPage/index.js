import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './index.css'

const AccountPage = () => {
  const { isAuthenticated, userData, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="account-page">
      <h1>Account Information</h1>
      <p>Email: {userData.email}</p>
      <p>Access Token: {userData.hasAccessToken ? 'Yes' : 'No'}</p>
      <p>Created on: {new Date(userData.dateCreated).toLocaleDateString()}</p>
    </div>
  );
};

export default AccountPage;

