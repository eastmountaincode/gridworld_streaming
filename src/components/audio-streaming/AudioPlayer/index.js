import React, { useState, useContext, useEffect } from 'react';
import Playlist from './Playlist';
import ProgressBar from './ProgressBar';
import Controls from './Controls';
import PlayerHeader from './PlayerHeader';

import { AudioPlayerContext } from '../../../context/AudioPlayerContext';

const AudioPlayer = ({ tracklist, albumArtworkUrl, audioShelfId, shelfColor }) => {
  // get the ID of the active audio shelf
  const { activeAudioShelfId, pause, reset } = useContext(AudioPlayerContext);

  const isActiveAudioPlayer = activeAudioShelfId === audioShelfId;

  // console.log('in audioplayer, audioShelfId is ', audioShelfId);
  // console.log('in audioplayer, isActiveAudioPlayer: ', isActiveAudioPlayer)

  useEffect(() => {
    return () => {
        pause();
        reset();
      }
  }, []);

  return (
    <div
      className="audio-player"
      style={{
        // border: isActiveAudioPlayer ? '4px solid orange' : 'none',
        padding: '10px',
        borderRadius: '8px'
      }}
    >
      <PlayerHeader albumArtworkUrl={albumArtworkUrl} audioShelfId={audioShelfId} shelfColor={shelfColor} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0px', width: '100%' }}>
        <div style={{ flex: 1 }}>
          <ProgressBar audioShelfId={audioShelfId} />
        </div>
        <Controls audioShelfId={audioShelfId} />
      </div>

      <Playlist tracklist={tracklist} audioShelfId={audioShelfId} />
    </div>
  );
};
export default AudioPlayer;