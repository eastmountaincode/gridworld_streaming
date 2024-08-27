import React from 'react';
import Playlist from './Playlist'

const AudioPlayer = ({ albumData, tracklist, albumArtworkUrl }) => {
  console.log('albumData:', albumData);
  console.log('tracklist:', tracklist);

  return (
    <div className="audio-player">
      <h2>{albumData.albumTitle}</h2>
      {albumArtworkUrl && (
        <img
          src={albumArtworkUrl}
          alt={`${albumData.albumTitle} artwork`}
          style={{ width: '200px', height: '200px' }}
        />
      )}
      <Playlist tracklist={tracklist} />
    </div>
  );
};

export default AudioPlayer;