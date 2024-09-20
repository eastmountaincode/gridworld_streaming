import React from 'react';
import { useAuth } from '../context/AuthContext';
import PaidView from './home/PaidView';
import FreeView from './home/FreeView';

const DefaultHome = () => {
  const { isLoading, isAuthenticated, userData } = useAuth();

  const defaultHomeStyle = {
    paddingTop: '25px',
    paddingBottom: '30px',
    backgroundColor: 'orange',

  };

  if (isLoading) {
    return <div style={defaultHomeStyle}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div style={defaultHomeStyle}>
      <FreeView />
    </div>;
  }

  return (
    <div style={defaultHomeStyle}>
      {userData.hasAccessToken ? <PaidView /> : <FreeView />}
    </div>
  );
};

export default DefaultHome;