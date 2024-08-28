import React, { useContext, useEffect, useState, useRef } from 'react';
import { AudioPlayerContext } from '../../../context/AudioPlayerContext';

const ProgressBar = () => {
  const { audioRef, currentTime, duration, setCurrentTime } = useContext(AudioPlayerContext);
  const [progress, setProgress] = useState(0);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const updateProgress = () => {
      const calculatedProgress = (currentTime / duration) * 100;
      setProgress(calculatedProgress);
    };

    updateProgress();
  }, [currentTime, duration]);

  const handleSeek = (e) => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const seekPosition = (e.clientX - rect.left) / rect.width;
      const seekTime = seekPosition * duration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

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
          cursor: 'pointer' 
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
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;