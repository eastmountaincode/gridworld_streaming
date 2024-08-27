import React, { createContext, useState, useRef } from 'react';

const AudioPlayerContext = createContext();

const AudioPlayerProvider = ({ children }) => {
  const [tracklist, setTracklist] = useState(null);
  const [albumData, setAlbumData] = useState(null);
  const [albumArtworkUrl, setAlbumArtworkUrl] = useState(null);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio());

  const updateAudioPlayerData = (newAlbumData, newTracklist, newAlbumArtworkUrl) => {
    setAlbumData(newAlbumData);
    setTracklist(newTracklist);
    setAlbumArtworkUrl(newAlbumArtworkUrl);
    if (newTracklist && newTracklist.tracks.length > 0) {
      setCurrentTrackId(newTracklist.tracks[0].trackId);
    }
  };

  const play = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const nextTrack = () => {
    const currentIndex = tracklist.findIndex(track => track.trackId === currentTrackId);
    const nextIndex = (currentIndex + 1) % tracklist.length;
    setCurrentTrackId(tracklist[nextIndex].trackId);
  };

  const previousTrack = () => {
    const currentIndex = tracklist.findIndex(track => track.trackId === currentTrackId);
    const previousIndex = (currentIndex - 1 + tracklist.length) % tracklist.length;
    setCurrentTrackId(tracklist[previousIndex].trackId);
  };

  const selectTrack = (trackId) => {
    setCurrentTrackId(trackId);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        tracklist,
        albumData,
        albumArtworkUrl,
        currentTrackId,
        isPlaying,
        currentTime,
        duration,
        play,
        pause,
        nextTrack,
        previousTrack,
        selectTrack,
        updateAudioPlayerData,
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