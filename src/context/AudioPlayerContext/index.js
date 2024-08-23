import React, { createContext, useState, useRef } from 'react';

const AudioPlayerContext = createContext();

const AudioPlayerProvider = ({ children }) => {
  const [trackList, setTrackList] = useState([]);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio());

  const play = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const nextTrack = () => {
    const currentIndex = trackList.findIndex(track => track.trackId === currentTrackId);
    const nextIndex = (currentIndex + 1) % trackList.length;
    setCurrentTrackId(trackList[nextIndex].trackId);
  };

  const previousTrack = () => {
    const currentIndex = trackList.findIndex(track => track.trackId === currentTrackId);
    const previousIndex = (currentIndex - 1 + trackList.length) % trackList.length;
    setCurrentTrackId(trackList[previousIndex].trackId);
  };

  const selectTrack = (trackId) => {
    setCurrentTrackId(trackId);
  };

  const updateTrackList = (newTrackList) => {
    setTrackList(newTrackList);
    if (newTrackList.length > 0) {
      setCurrentTrackId(newTrackList[0].trackId);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        trackList,
        currentTrackId,
        isPlaying,
        currentTime,
        duration,
        play,
        pause,
        nextTrack,
        previousTrack,
        selectTrack,
        updateTrackList,
        audioRef,
        setCurrentTime,
        setDuration,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export { AudioPlayerContext, AudioPlayerProvider };