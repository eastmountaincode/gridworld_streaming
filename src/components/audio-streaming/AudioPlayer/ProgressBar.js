import React, { useContext, useEffect, useState, useRef } from 'react';
import { AudioPlayerContext } from '../../../context/AudioPlayerContext';
import './ProgressBar.css'

const ProgressBar = ({ audioShelfId }) => {
  const { currentTime,
    totalDuration,
    setAudioTime,
    activeAudioShelfId } = useContext(AudioPlayerContext);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(null);
  const progressBarRef = useRef(null);

  const isActiveProgressBar = activeAudioShelfId === audioShelfId;

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && isActiveProgressBar) {
        updateDragTime(e);
      }
    };

    const handleMouseUp = () => {
      if (isDragging && isActiveProgressBar) {
        setIsDragging(false);
        setAudioTime(dragTime);
        document.body.classList.remove('no-select'); // Remove no-select class when dragging ends
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragTime, setAudioTime]);

  const handleMouseDown = (e) => {
    if (isActiveProgressBar) {
      setIsDragging(true);
      updateDragTime(e);
      document.body.classList.add('no-select'); // Add no-select class when dragging starts
    }
  };

  const updateDragTime = (e) => {
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = Math.min(clickPosition * totalDuration, totalDuration);
    setDragTime(newTime);
  };

  const formatTime = (time) => {
    if (!isActiveProgressBar) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = isActiveProgressBar && totalDuration > 0 
  ? ((isDragging ? dragTime : currentTime) / totalDuration) * 100 
  : 0;
  
  return (
    <div className="progress-bar-container">
      <div
        ref={progressBarRef}
        onMouseDown={handleMouseDown}
        className={`progress-bar ${isActiveProgressBar ? '' : 'progress-bar-inactive'}`}
      >
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
        <div
          className="progress-bar-thumb"
          style={{ left: `${progress}%` }}
        />
      </div>
      <div className="progress-bar-timestamps">
        <span>{formatTime(isDragging ? dragTime : currentTime)}</span>
        <span>{formatTime(totalDuration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;