import React, { createContext, useState, useRef, useEffect } from 'react';

const AudioPlayerContext = createContext();

const AudioPlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTracklist, setCurrentTracklist] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [activeAudioPlayerId, setActiveAudioPlayerId] = useState(null);

  const audioRef = useRef(new Audio());

  // updates the currentTime state
  useEffect(() => {
    const audio = audioRef.current;
    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('timeupdate', updateTime);
    return () => audio.removeEventListener('timeupdate', updateTime);
  }, []);

  // automatically play the next track when the current one ends
  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      setIsPlaying(false);
      playNextTrack();
    };
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [currentTracklist, currentTrack]);

  const playNextTrack = () => {
    console.log('playNextTrack called');
    console.log('do we have a currentTracklist?', currentTracklist);
    console.log('do we have a currentTrack?', currentTrack);
    if (currentTracklist && currentTrack) {
      const nextTrackNumber = currentTrack.trackNumber + 1;
      const nextTrack = currentTracklist.tracks.find(track => track.trackNumber === nextTrackNumber);
      if (nextTrack) {
        play(nextTrack, currentTracklist, activeAudioPlayerId);
      } else {
        // If it's the last track, zero everything out and stop playing
        pause();
        setCurrentTime(0);
        setCurrentTrack(null);
        setIsPlaying(false);
      }
    }
  };

  const playPrevTrack = () => {
    if (currentTracklist && currentTrack) {
      const prevTrackNumber = currentTrack.trackNumber - 1;
      const prevTrack = currentTracklist.tracks.find(track => track.trackNumber === prevTrackNumber);
      if (prevTrack) {
        play(prevTrack, currentTracklist, activeAudioPlayerId);
      }
    }
  };

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
        playNextTrack,
        playPrevTrack,
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