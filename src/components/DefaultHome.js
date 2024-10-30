import React from 'react';
import { useAuth } from '../context/AuthContext';
import PaidView from './home/PaidView';
import FreeView from './home/FreeView';
import AboutShelf from './home/AboutShelf';

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

  return (
    <div style={defaultHomeStyle}>
      {!isAuthenticated ? (
        <FreeView />
      ) : (
        userData.hasAccessToken ? <PaidView /> : <FreeView />
      )}
      <div>
        <AboutShelf />
      </div>

    </div>
  );
};

export default DefaultHome;