import React, { useState, useContext, useEffect } from 'react';
import Playlist from './Playlist';
import ProgressBar from './ProgressBar';
import Controls from './Controls';
import PlayerHeader from './PlayerHeader';

import './AudioPlayer.css';

import { AudioPlayerContext } from '../../../context/AudioPlayerContext';

const AudioPlayer = ({ tracklist, albumArtworkUrl, audioShelfId, shelfColor }) => {
  // get the ID of the active audio shelf
  const { activeAudioShelfId, pause, reset } = useContext(AudioPlayerContext);

  const isActiveAudioPlayer = activeAudioShelfId === audioShelfId;

  useEffect(() => {
    return () => {
      pause();
      reset();
    }
  }, []);

  return (
    <div className="audio-player">
      <PlayerHeader
        albumArtworkUrl={albumArtworkUrl}
        audioShelfId={audioShelfId}
        shelfColor={shelfColor}
        tracklist={tracklist}
        firstTrack={tracklist[0]}
      />
      <div className="progress-controls-container">
        <div className="progress-bar-wrapper">
          <ProgressBar audioShelfId={audioShelfId} />
        </div>
        <Controls audioShelfId={audioShelfId} />
      </div>
      <Playlist tracklist={tracklist} audioShelfId={audioShelfId} />
    </div>
  );
};
export default AudioPlayer;