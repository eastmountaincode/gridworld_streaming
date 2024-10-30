import React, { useContext, useEffect, useState, useRef } from 'react';
import { AudioPlayerContext } from '../../../context/AudioPlayerContext';
import './ProgressBar.css'

const ProgressBar = ({ audioShelfId, shelfcolor }) => {
  const { currentTime, totalDuration, setAudioTime, activeAudioShelfId } = useContext(AudioPlayerContext);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(null);
  const progressBarRef = useRef(null);

  const isActiveProgressBar = activeAudioShelfId === audioShelfId;

  useEffect(() => {
    const handleMove = (e) => {
      if (isDragging && isActiveProgressBar) {
        e.preventDefault();
        updateDragTime(e);
      }
    };

    const handleEnd = (e) => {
      if (isDragging && isActiveProgressBar) {
        e.preventDefault();
        setIsDragging(false);
        setAudioTime(dragTime);
        document.body.classList.remove('no-select');
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragTime, setAudioTime, isActiveProgressBar]);

  const handleStart = (e) => {
    if (isActiveProgressBar) {
      e.preventDefault();
      setIsDragging(true);
      updateDragTime(e);
      document.body.classList.add('no-select');
    }
  };

  const updateDragTime = (e) => {
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clickPosition = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
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
    <div className="progress-bar-container" style={{ touchAction: 'none' }}>
      <div
        ref={progressBarRef}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        onTouchMove={(e) => {
          e.preventDefault();
        }}
        className={`progress-bar ${isActiveProgressBar ? '' : 'progress-bar-inactive'}`}
        style={{ '--shelf-color': shelfcolor }}
      >

        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%`, backgroundColor: 'var(--shelf-color)' }}
        />
        <div
          className="progress-bar-thumb"
          style={{ left: `${progress}%`, backgroundColor: 'var(--shelf-color)' }}
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