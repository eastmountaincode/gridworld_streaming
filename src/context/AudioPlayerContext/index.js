import React, { createContext, useState, useRef, useEffect } from 'react';

const AudioPlayerContext = createContext();

const AudioPlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTracklist, setCurrentTracklist] = useState(null);
  const [activeAudioPlayerId, setActiveAudioPlayerId] = useState(null);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('timeupdate', updateTime);
    return () => audio.removeEventListener('timeupdate', updateTime);
  }, []);

  const play = async (track, tracklist, audioPlayerId) => {
    if (currentTrack?.trackId !== track.trackId || currentTracklist?._id !== tracklist._id) {
      await pause();
      setCurrentTrack(track);
      setCurrentTracklist(tracklist);
      setActiveAudioPlayerId(audioPlayerId);
      audioRef.current.src = track.firebaseURL;
      setDuration(track.trackDuration);
    }
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const pause = async () => {
    try {
      audioRef.current.pause();
      setIsPlaying(false);
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  };

  const nextTrack = () => {
    if (currentTracklist && currentTrack) {
      const nextTrackNumber = (currentTrack.trackNumber % currentTracklist.tracks.length) + 1;
      const nextTrack = currentTracklist.tracks.find(track => track.trackNumber === nextTrackNumber);
      if (nextTrack) {
        play(nextTrack, currentTracklist, activeAudioPlayerId);
      }
    }
  };

  const previousTrack = () => {
    if (currentTracklist && currentTrack) {
      const previousTrackNumber = ((currentTrack.trackNumber - 2 + currentTracklist.tracks.length) % currentTracklist.tracks.length) + 1;
      const previousTrack = currentTracklist.tracks.find(track => track.trackNumber === previousTrackNumber);
      if (previousTrack) {
        play(previousTrack, currentTracklist, activeAudioPlayerId);
      }
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        currentTracklist,
        activeAudioPlayerId,
        play,
        pause,
        nextTrack,
        previousTrack,
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