import React from 'react';
import { Link } from 'react-router-dom';
import MainNavbarAccountArea from './MainNavbarAccountArea';
import './MainNavbar.css';

const MainNavbar = () => {
  return (
    <nav className="main-nav">
      <div className="logo-area">
        <Link to="/">
          <img src="/images/site_logo/gridworld_font_1_edit.png" alt="Logo" />
        </Link>
      </div>
      <div className='account-area'>
        <MainNavbarAccountArea />
      </div>
    </nav>
  );
};

export default MainNavbar;
