import React, { useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Playlist from './Playlist';
import ProgressBar from './ProgressBar';
import { AudioPlayerContext } from '../../../context/AudioPlayerContext';

const AudioPlayer = ({ albumData, tracklist, albumArtworkUrl }) => {
  // assign unique ID to help keep track of which audio player is active
  const [audioPlayerId] = useState(() => uuidv4());
  const { activeAudioPlayerId } = useContext(AudioPlayerContext);

  const isActive = activeAudioPlayerId === audioPlayerId;

  return (
    <div 
      className="audio-player"
      style={{
        border: isActive ? '4px solid orange' : 'none',
        padding: '10px',
        borderRadius: '8px'
      }}
    >
      <h2>{albumData.albumTitle}</h2>
      {albumArtworkUrl && (
        <img
          src={albumArtworkUrl}
          alt={`${albumData.albumTitle} artwork`}
          style={{ width: '200px', height: '200px' }}
        />
      )}
      <ProgressBar audioPlayerId={audioPlayerId} />
      <Playlist tracklist={tracklist} audioPlayerId={audioPlayerId} />
    </div>
  );
};

export default AudioPlayer;