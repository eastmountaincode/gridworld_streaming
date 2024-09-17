import React from 'react';
import { Link } from 'react-router-dom';
import MainNavbarAccountArea from './MainNavbarAccountArea';

const MainNavbar = () => {

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: 'slategray' }}>
      {/* LOGO */}
      <div className="logo-area" style={{ marginRight: '20px' }}>
        <Link to="/">
          <img src="/images/site_logo/logo_small.png" alt="Logo" style={{ height: '100px' }} />
        </Link>
      </div>

      {/* ACCOUNT AREA */}
      <MainNavbarAccountArea />
    </nav>
  );
};

export default MainNavbar;