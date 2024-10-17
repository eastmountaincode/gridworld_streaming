import React from 'react';
import AudioShelf from '../../audio-streaming/AudioShelf';

const PaidView = () => {
  return (
    <div className="paid-view">
      <div style={{ marginTop: '20px' }}>
        <AudioShelf albumTitle="Gridworld" shelfColor="#85b021" />
      </div>

      <div style={{ marginTop: '20px' }}>
        <AudioShelf albumTitle="Gridworld Instrumentals" shelfColor="#b13a4c" />
      </div>

      <div style={{ marginTop: '20px' }}>
        <AudioShelf albumTitle="Windy Gridworld" shelfColor="#bbbcb6" />
      </div>

    </div>
  );
};

export default PaidView;
