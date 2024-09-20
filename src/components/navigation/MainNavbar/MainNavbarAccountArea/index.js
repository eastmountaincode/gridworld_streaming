import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { Button } from 'antd';
import './MainNavbarAccountArea.css';

const MainNavbarAccountArea = () => {
  const { isAuthenticated, userData, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleAccountClick = () => {
    navigate('/account');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-buttons">
        <Link to="/create-account">
          <Button type="default">Create Account</Button>
        </Link>
        <Link to="/login">
          <Button type="default">Login</Button>
        </Link>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
        <img
          src={userData.hasAccessToken ? "/images/access_token/bw_invert.png" : "/images/access_token/bw_empty.png"}
          alt="User status"
          style={{ height: '50px' }}
        />
        <span
          onClick={handleAccountClick}
          style={{
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'text-decoration 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
        >
          {userData.email}
        </span>
      </div>
      <div style={{marginRight: '10px'}}>
        <Button type="default" onClick={logout}>Logout</Button>
      </div>
    </div>
  );
};

export default MainNavbarAccountArea;