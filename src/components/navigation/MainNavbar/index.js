import React from 'react';
import { Link } from 'react-router-dom';
import MainNavbarAccountArea from './MainNavbarAccountArea';

const MainNavbar = () => {
  return (
    <nav style={{ display: 'flex', backgroundColor: 'slategrey' }}>
      {/* LOGO AREA */}
      <div className="logo-area" style={{ backgroundColor: 'orange', borderTop: '1px solid black' }}>
        <Link to="/">
          <img src="/images/site_logo/gws_logo_web_transparent.png" alt="Logo" style={{ height: '100px' }} />
        </Link>
      </div>

      {/* ACCOUNT AREA */}
      <MainNavbarAccountArea />
    </nav>
  );
};

export default MainNavbar;