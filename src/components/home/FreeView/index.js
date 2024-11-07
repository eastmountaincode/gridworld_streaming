import React, { useState, useEffect } from 'react';
import BuyAccessToken from '../BuyAccessToken';
import AudioShelf from '../../audio-streaming/AudioShelf';
import { v4 as uuidv4 } from 'uuid';
import { useContent } from '../../../context/ContentContext';

const FreeView = () => {
  const { albumsData } = useContent();

  return (
    <div className="free-view">
      <BuyAccessToken />
      <div style={{ marginTop: '20px' }}>
        <AudioShelf
          albumTitle="Gridworld Lite"
          shelfcolor="#b5b4db"
          audioShelfId={uuidv4()}
          albumData={albumsData['Gridworld Lite']}
          startExpanded={true}
        />
      </div>
    </div>
  );
};



export default FreeView;

