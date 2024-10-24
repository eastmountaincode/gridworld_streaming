import React from 'react';
import BuyAccessToken from '../BuyAccessToken';
import AudioShelf from '../../audio-streaming/AudioShelf';

const FreeView = () => {
  return (
    <div className="free-view">
      <BuyAccessToken />
      <div>
        <AudioShelf albumTitle="Gridworld Lite" shelfColor="#b5b4db" />
      </div>

      {/* <div style={{ marginTop: '20px' }}>
        <AudioShelf albumTitle="Gridworld Instrumentals" />
      </div> */}
    </div>
  );
};

export default FreeView;
