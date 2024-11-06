import React from 'react';
import './SplashScreen.css';

const SplashScreen = () => {
  return (
    <div className="splash-screen">
      <img
        src="/images/site_logo/gridworld_font_1_edit.png"
        alt="Site Logo"
        className="splash-logo"
        style={{ border: '0px solid black', borderRadius: '0px' }}
      />
      <div className="spinner" style={{ marginBottom: '15px' }}></div>
    </div>
  );
};

export default SplashScreen;

