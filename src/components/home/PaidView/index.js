import React from 'react';
import AudioShelf from '../../audio-streaming/AudioShelf';

const PaidView = () => {
  return (
    <div className="paid-view">
      <h2>Welcome to Gridworld Premium</h2>
      <p>Enjoy your access to premium content!</p>
      <div style={{ marginTop: '20px' }}>
        <AudioShelf albumTitle="Gridworld" />
      </div>

      <div style={{ marginTop: '20px' }}>
        <AudioShelf albumTitle="Gridworld Instrumentals" />
      </div>

    </div>
  );
};

export default PaidView;
