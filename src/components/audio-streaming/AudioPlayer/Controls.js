import React, { useContext } from 'react';
import { AudioPlayerContext } from '../../../context/AudioPlayerContext';

const Controls = ({ audioShelfId }) => {
  const { playNextTrack, playPrevTrack, activeAudioShelfId, currentTrack, currentTracklist } = useContext(AudioPlayerContext);

  const isActiveAudioShelf = activeAudioShelfId === audioShelfId;
  const isInteractive = isActiveAudioShelf && currentTrack;

  const hasPreviousTrack = isActiveAudioShelf && currentTrack && currentTrack.trackNumber > 1;
  const hasNextTrack = isActiveAudioShelf && currentTrack && currentTracklist && currentTrack.trackNumber < currentTracklist.length;

  const handlePrevious = () => {
    if (isActiveAudioShelf && hasPreviousTrack) {
      playPrevTrack();
    }
  };

  const handleNext = () => {
    if (isActiveAudioShelf && hasNextTrack) {
      playNextTrack();
    }
  };

  const buttonStyle = (isEnabled) => ({
    cursor: isInteractive && isEnabled ? 'pointer' : 'default',
    opacity: isActiveAudioShelf ? (isEnabled ? 1 : 0.5) : 0.5,
    pointerEvents: isInteractive && isEnabled ? 'auto' : 'none',

  });

  return (
    <div className="controls" style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', border: '2px solid green', borderRadius: '5px', padding: '20px 20px' }}>
      <button onClick={handlePrevious} style={buttonStyle(hasPreviousTrack)} className="control-button">⏮️</button>
      <button onClick={handleNext} style={buttonStyle(hasNextTrack)} className="control-button">⏭️</button>
    </div>
  );
};
export default Controls;