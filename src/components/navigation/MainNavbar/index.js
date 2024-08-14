import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import MainNavbarAccountArea from './MainNavbarAccountArea';

const MainNavbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#f0f0f0' }}>
      <div className="logo-area">
        <img src="/path-to-your-logo.png" alt="Logo" style={{ height: '50px' }} />
      </div>
      <MainNavbarAccountArea />
    </nav>
  );
};

export default MainNavbar;