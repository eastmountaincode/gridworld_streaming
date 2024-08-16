import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const Account = () => {
  const { isAuthenticated, userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', {replace: true});
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; 
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

export default Account;