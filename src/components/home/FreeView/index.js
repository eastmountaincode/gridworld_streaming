import React from 'react';
import BuyAccessToken from '../BuyAccessToken';

const FreeView = () => {
  return (
    <div className="free-view">
      <h2>Welcome to Gridworld Streaming</h2>
      <p>Upgrade to access premium content and start streaming!</p>
      <BuyAccessToken />
    </div>
  );
};

export default FreeView;
