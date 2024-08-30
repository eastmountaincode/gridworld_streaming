import React, { useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Playlist from './Playlist';
import ProgressBar from './ProgressBar';
import Controls from './Controls';
import PlayerHeader from './PlayerHeader';

import { AudioPlayerContext } from '../../../context/AudioPlayerContext';

const AudioPlayer = ({ tracklist, albumArtworkUrl }) => {
  // assign unique ID to help keep track of which audio player is active
  const [audioPlayerId] = useState(() => uuidv4());
  // get the ID of the active audio player
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
      <PlayerHeader albumArtworkUrl={albumArtworkUrl} audioPlayerId={audioPlayerId} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0px', width: '100%' }}>
        <div style={{ flex: 1 }}>
          <ProgressBar audioPlayerId={audioPlayerId} />
        </div>
        <Controls audioPlayerId={audioPlayerId} />
      </div>

      <Playlist tracklist={tracklist} audioPlayerId={audioPlayerId} />
    </div>
  );
};
export default AudioPlayer;