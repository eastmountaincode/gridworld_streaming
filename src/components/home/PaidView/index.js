import React, { useState, useEffect } from 'react';
import AudioShelf from '../../audio-streaming/AudioShelf';
import { v4 as uuidv4 } from 'uuid';
import { useContent } from '../../../context/ContentContext';

const PaidView = () => {
  const { albumsData } = useContent();

  return (
    <div className="paid-view" style={{marginTop: '20px'}}>
      <div>
        <AudioShelf
          albumTitle="Gridworld"
          shelfcolor="#85b021"
          audioShelfId={uuidv4()}
          albumData={albumsData['Gridworld']}
        />
      </div>
      <div>
        <AudioShelf
          albumTitle="Gridworld Instrumentals"
          shelfcolor="#b13a4c"
          audioShelfId={uuidv4()}
          albumData={albumsData['Gridworld Instrumentals']}
        />
      </div>
      <div>
        <AudioShelf
          albumTitle="Windy Gridworld"
          shelfcolor="#bbbcb6"
          audioShelfId={uuidv4()}
          albumData={albumsData['Windy Gridworld']}
        />
      </div>
    </div>
  );
};




export default PaidView;

