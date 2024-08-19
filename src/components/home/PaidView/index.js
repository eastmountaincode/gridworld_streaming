import React from 'react';
import AudioShelf from '../../audio-streaming/AudioShelf';

const PaidView = () => {
  return (
    <div className="paid-view">
      <h2>Welcome to Gridworld Premium</h2>
      <p>Enjoy your access to premium content!</p>
      <AudioShelf />
    </div>
  );
};

export default PaidView;
