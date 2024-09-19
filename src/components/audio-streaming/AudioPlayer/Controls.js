import React, { useContext } from 'react';
import { Button } from 'antd';
import { FaStepBackward, FaStepForward } from 'react-icons/fa';
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
    <div className="controls" style={{ display: 'flex', justifyContent: 'center', border: '1px solid black' }}>
      <Button onClick={handlePrevious} style={{...buttonStyle(hasPreviousTrack), marginRight: '10px'}} disabled={!hasPreviousTrack} icon={<FaStepBackward />} />
      <Button onClick={handleNext} style={buttonStyle(hasNextTrack)} disabled={!hasNextTrack} icon={<FaStepForward />} />
    </div>
  );
};

export default Controls;