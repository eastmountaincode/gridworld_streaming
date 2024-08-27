import React from 'react';
import BuyAccessToken from '../BuyAccessToken';
import AudioShelf from '../../audio-streaming/AudioShelf';

const FreeView = () => {
  return (
    <div className="free-view">
      <h2>Welcome to Gridworld Streaming</h2>
      <p>Upgrade to access premium content and start streaming!</p>
      <BuyAccessToken />
      <div style={{ marginTop: '20px' }}>
        <AudioShelf albumTitle="Gridworld Lite" />
      </div>

      <div style={{ marginTop: '20px' }}>
        <AudioShelf albumTitle="Gridworld Instrumentals" />
      </div>
    </div>
  );
};

export default FreeView;
