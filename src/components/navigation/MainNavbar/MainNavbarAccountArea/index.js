import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';

const MainNavbarAccountArea = () => {
  const { isAuthenticated, userData, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleAccountClick = () => {
    navigate('/account', { replace: true });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
        {userData.email}
      </span>
      <img
        src={userData.hasAccessToken ? "/images/yes_token.png" : "/images/no_token.png"}
        alt="User status"
        style={{ height: '50px', marginLeft: '10px' }}
      />
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default MainNavbarAccountArea;
