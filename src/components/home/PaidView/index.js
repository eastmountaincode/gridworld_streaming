import React from 'react';
import AudioShelf from '../../audio-streaming/AudioShelf';

const PaidView = () => {
  return (
    <div className="paid-view">
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
