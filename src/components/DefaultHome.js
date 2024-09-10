import React from 'react';
import { useAuth } from '../context/AuthContext';
import PaidView from './home/PaidView';
import FreeView from './home/FreeView';

const DefaultHome = () => {
  const { isLoading, isAuthenticated, userData } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>
      <FreeView />
    </div>;
  }

  return (
    <div className="default-home">
      <h1>Gridworld Streaming</h1>
      {userData.hasAccessToken ? <PaidView /> : <FreeView />}
    </div>
  );
};

export default DefaultHome;
