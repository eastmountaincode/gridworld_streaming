import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PaidView from './home/PaidView';
import FreeView from './home/FreeView';
import AboutShelf from './home/AboutShelf';

const DefaultHome = () => {
  console.log('Default Home is at least rendering something')
  const { isAuthenticated, userData } = useAuth();

  const defaultHomeStyle = {
    paddingTop: '25px',
    paddingBottom: '30px',
    backgroundColor: 'orange',
  };

  return (
    <div style={defaultHomeStyle}>
      {!isAuthenticated ? (
        <FreeView />
      ) : (
        userData.hasAccessToken ? 
          <PaidView /> : 
          <FreeView />
      )}
      <div>
        <AboutShelf />
      </div>
    </div>
  );
};

export default DefaultHome;

