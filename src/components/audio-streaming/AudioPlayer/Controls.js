import React, { useContext } from 'react';
import { Button } from 'antd';
import { FaStepBackward, FaStepForward } from 'react-icons/fa';
import { AudioPlayerContext } from '../../../context/AudioPlayerContext';
import './Controls.css';

const Controls = ({ audioShelfId, shelfcolor }) => {
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
    opacity: isActiveAudioShelf ? (isEnabled ? 1 : 0.4) : 0.4,
    pointerEvents: isInteractive && isEnabled ? 'auto' : 'none',
    backgroundColor: shelfcolor,
    borderColor: 'black',
    color: 'black',

  });

  return (
    <div className="controls" >
      <Button onClick={handlePrevious} style={buttonStyle(hasPreviousTrack)} disabled={!hasPreviousTrack} icon={<FaStepBackward />} />
      <Button onClick={handleNext} style={buttonStyle(hasNextTrack)} disabled={!hasNextTrack} icon={<FaStepForward />} />
    </div>
  );
};
export default Controls;