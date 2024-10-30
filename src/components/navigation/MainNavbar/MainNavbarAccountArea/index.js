import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { Button } from 'antd';
import './MainNavbarAccountArea.css'; // Import the CSS file

const MainNavbarAccountArea = () => {
  const { isAuthenticated, userData, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleAccountClick = () => {
    navigate('/account');
  };

  const buttonStyle = {
    backgroundColor: 'slategrey',
    color: 'black',
    borderColor: 'black',
  };

  const accountButtonStyle = {
    backgroundColor: 'orange',
    color: 'black',
    borderColor: 'black',
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="navbar-account-area">
        <div className="auth-buttons">
          <Link to="/create-account">
            <Button type="default" style={buttonStyle}>Create Account</Button>
          </Link>
          <Link to="/login">
            <Button type="default" style={buttonStyle}>Login</Button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="navbar-account-area">
      <div className="logged-in-buttons">
        <Button
          type="default"
          onClick={handleAccountClick}
          className="account-button"
          style={accountButtonStyle}
        >
          {userData.email}
        </Button>

        <img
          src={userData.hasAccessToken ? "/images/access_token/bw_invert.png" : "/images/access_token/bw_empty.png"}
          alt="User status"
          className="user-status-icon"
        />

        <Button type="default" style={buttonStyle} onClick={logout} className="logout-button">Logout</Button>
      </div>
    </div>
  );
};

export default MainNavbarAccountArea;