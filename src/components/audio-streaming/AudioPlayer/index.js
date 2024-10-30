import React, { useState, useContext, useEffect } from 'react';
import Playlist from './Playlist';
import ProgressBar from './ProgressBar';
import Controls from './Controls';
import PlayerHeader from './PlayerHeader';

import './AudioPlayer.css';

import { AudioPlayerContext } from '../../../context/AudioPlayerContext';

const AudioPlayer = ({ tracklist, albumArtworkUrl, audioShelfId, shelfcolor, albumBlurb }) => {
  const { pause, reset } = useContext(AudioPlayerContext);

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
        shelfcolor={shelfcolor}
        tracklist={tracklist}
        firstTrack={tracklist[0]}
        albumBlurb={albumBlurb}
      />
      <div className="progress-controls-container">
        <div className="progress-bar-wrapper">
          <ProgressBar audioShelfId={audioShelfId} shelfcolor={shelfcolor} />
        </div>
        <Controls audioShelfId={audioShelfId} shelfcolor={shelfcolor} />

      </div>
      <Playlist
        tracklist={tracklist}
        audioShelfId={audioShelfId}
        shelfcolor={shelfcolor}
        albumArtworkUrl={albumArtworkUrl}
      />
    </div>
  );
};
export default AudioPlayer;