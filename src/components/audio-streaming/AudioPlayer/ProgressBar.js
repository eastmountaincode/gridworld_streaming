import React, { useContext, useEffect, useState, useRef } from 'react';
import { AudioPlayerContext } from '../../../context/AudioPlayerContext';

const ProgressBar = ({ audioPlayerId }) => {
  const { audioRef, currentTime, duration, setCurrentTime, activeAudioPlayerId } = useContext(AudioPlayerContext);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef(null);

  const isActive = activeAudioPlayerId === audioPlayerId;
  const displayTime = isActive ? currentTime : 0;
  const displayDuration = isActive ? duration : 0;

  useEffect(() => {
    if (isActive && !isDragging) {
      const calculatedProgress = (currentTime / duration) * 100;
      setProgress(calculatedProgress);
    } else if (!isActive) {
      setProgress(0);
    }
  }, [currentTime, duration, isActive, isDragging]);

  const handleSeek = (e) => {
    if (progressBarRef.current && isActive) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const seekPosition = (e.clientX - rect.left) / rect.width;
      const seekTime = seekPosition * duration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
      setProgress(seekPosition * 100);
    }
  };

  const handleMouseDown = (e) => {
    if (isActive) {
      setIsDragging(true);
      handleSeek(e);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && isActive) {
      handleSeek(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isActive]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="progress-bar-container" style={{ padding: '20px 20px', border: '2px solid red' }}>
      <div
        ref={progressBarRef}
        className="progress-bar"
        style={{
          width: '100%',
          height: '10px',
          backgroundColor: '#ddd',
          cursor: isActive ? 'pointer' : 'default',
          position: 'relative'
        }}
        onClick={handleSeek}
      >
        <div
          className="progress"
          style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: '#007bff'
          }}
        />
        <div
          className="seek-node"
          style={{
            position: 'absolute',
            left: `calc(${progress}% - 10px)`,
            top: '-5px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#007bff',
            cursor: isActive ? 'grab' : 'default'
          }}
          onMouseDown={handleMouseDown}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
        <span>{formatTime(displayTime)}</span>
        <span>{formatTime(displayDuration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;