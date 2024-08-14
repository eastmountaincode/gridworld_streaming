import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';

const MainNavbarAccountArea = () => {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div>
        <Link to="/create-account">Create Account</Link>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  return (
    <div>
      <span>{user.email}</span>
      <img 
        src={user.hasAccessToken ? "/path-to-premium-icon.png" : "/path-to-regular-icon.png"} 
        alt="User status" 
        style={{ height: '30px', marginLeft: '10px' }}
      />
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default MainNavbarAccountArea;