import React from 'react';
import AudioShelf from '../../audio-streaming/AudioShelf';

const PaidView = () => {
  return (
    <div className="paid-view">
      <div>
        <AudioShelf albumTitle="Gridworld" shelfcolor="#85b021" />
      </div>

      <div>
        <AudioShelf albumTitle="Gridworld Instrumentals" shelfcolor="#b13a4c" />
      </div>

      <div>
        <AudioShelf albumTitle="Windy Gridworld" shelfcolor="#bbbcb6" />
      </div>

    </div>
  );
};

export default PaidView;
