import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';

const MainNavbarAccountArea = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAccountClick = () => {
    navigate('/account', {replace: true});
  };

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
        {user.email}
      </span>
      <img
        src={user.hasAccessToken ? "/images/yes_token.png" : "/images/no_token.png"}
        alt="User status"
        style={{ height: '50px', marginLeft: '10px' }}
      />
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default MainNavbarAccountArea;