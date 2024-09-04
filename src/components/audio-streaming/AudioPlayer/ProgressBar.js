import React, { useContext, useEffect, useState, useRef } from 'react';
import { AudioPlayerContext } from '../../../context/AudioPlayerContext';

const ProgressBar = ({ audioPlayerId }) => {
  const { currentTime,
          setCurrentTime,
          totalDuration,
          activeAudioPlayerId,
          currentTrack,
          setAudioTime,
          soundInstance,
          isPlaying } = useContext(AudioPlayerContext);

  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef(null);

  const isActiveAudioPlayer = activeAudioPlayerId === audioPlayerId;
  const displayTime = isActiveAudioPlayer ? currentTime : 0;
  const displayDuration = isActiveAudioPlayer ? totalDuration : 0;

  // set progress
  useEffect(() => {
    if (isActiveAudioPlayer && !isDragging && currentTrack) {
      const calculatedProgress = (currentTime / totalDuration) * 100;
      setProgress(calculatedProgress);
    }
  }, [isActiveAudioPlayer, isDragging, currentTrack, currentTime, totalDuration]);

  const handleSeek = (e) => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const seekPosition = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const seekTime = seekPosition * totalDuration;
      setAudioTime(seekTime);
      setCurrentTime(seekTime);
      setProgress(seekPosition * 100);
    }
  };

  const handleMouseDown = (e) => {
    if (isActiveAudioPlayer) {
      setIsDragging(true);
      handleSeek(e);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && isActiveAudioPlayer) {
      requestAnimationFrame(() => handleSeek(e));
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
  }, [isDragging, isActiveAudioPlayer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.round(time % 60);
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
          cursor: isActiveAudioPlayer ? 'pointer' : 'default',
          position: 'relative'
        }}
        onClick={handleSeek}
      >
        <div
          className="progress"
          style={{
            width: currentTrack ? `${progress}%` : '0%',
            height: '100%',
            backgroundColor: '#007bff'
          }}
        />
        <div
          className="seek-node"
          style={{
            position: 'absolute',
            left: currentTrack ? `calc(${progress}% - 10px)` : '-10px',
            top: '-5px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#007bff',
            cursor: isActiveAudioPlayer ? 'grab' : 'default'
          }}
          onMouseDown={handleMouseDown}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
        <span>{currentTrack ? formatTime(displayTime) : '0:00'}</span>
        <span>{currentTrack ? formatTime(displayDuration) : '0:00'}</span>
      </div>
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
        <p>Progress: {progress.toFixed(2)}%</p>
        <p>Current Time: {currentTime.toFixed(2)} seconds</p>
        <p>soundRef Time: {soundInstance ? soundInstance.currentTime().toFixed(2) : "0:00"} seconds</p>
        <p>Duration: {totalDuration.toFixed(2)} seconds</p>
        <p>isPlaying: {isPlaying.toString()}</p>
      </div>
    </div>
  );
};
export default ProgressBar;