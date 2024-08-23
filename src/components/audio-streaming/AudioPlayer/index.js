import React from 'react';

const AudioPlayer = ({ albumData, trackList, albumArtworkUrl }) => {
  const { albumTitle } = albumData;
  console.log('tracklist', trackList);

  return (
    <div className="audio-player">
      <h2>{albumTitle}</h2>
      {albumArtworkUrl && (
        <img
          src={albumArtworkUrl}
          alt={`${albumTitle} artwork`}
          style={{ width: '200px', height: '200px' }}
        />
      )}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ul style={{ listStylePosition: 'inside', paddingLeft: 0, textAlign: 'left' }}>
          {trackList.tracks.map((track, index) => (
            <li key={index}>
              {track.trackNumber}. {track.trackTitle}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AudioPlayer;
