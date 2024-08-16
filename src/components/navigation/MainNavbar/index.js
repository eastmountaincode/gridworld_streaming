import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import MainNavbarAccountArea from './MainNavbarAccountArea';

const MainNavbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#f0f0f0' }}>
      {/* LOGO */}
      <div className="logo-area">
        <Link to="/">
          <img src="/images/main_header.png" alt="Logo" style={{ height: '100px' }} />
        </Link>
      </div>

      {/* ACCOUNT AREA */}
      <MainNavbarAccountArea />
    </nav>
  );
};

export default MainNavbar;