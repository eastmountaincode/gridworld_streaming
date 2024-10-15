import React, { createContext, useState, useRef, useEffect } from 'react';
import { Howl, Howler } from 'howler';

const AudioPlayerContext = createContext();

const AudioPlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTracklist, setCurrentTracklist] = useState(null);
  const [albumArtworkUrl, setAlbumArtworkUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [activeAudioShelfId, setActiveAudioShelfId] = useState(null);

  const soundRef = useRef(null);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  const play = (track, tracklist, audioShelfId, albumArtworkUrl) => {
    if (soundRef.current) {
      soundRef.current.unload();
    }

    soundRef.current = new Howl({
      src: [track.firebaseURL],
      html5: true,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onend: () => playNextTrack(),
      onload: () => {
        setTotalDuration(soundRef.current.duration());
      },
    });

    setCurrentTrack(track);
    setCurrentTracklist(tracklist);
    setActiveAudioShelfId(audioShelfId);
    setAlbumArtworkUrl(albumArtworkUrl);

    soundRef.current.play();

    // Update current time
    const intervalId = setInterval(() => {
      if (soundRef.current) {
        setCurrentTime(soundRef.current.seek());
      }
    }, 1000);

    return () => clearInterval(intervalId);
  };

  const pause = () => {
    if (soundRef.current) {
      soundRef.current.pause();
    }
  };

  const playNextTrack = () => {
    if (currentTracklist && currentTrack) {
      const nextTrackNumber = currentTrack.trackNumber + 1;
      const nextTrack = currentTracklist.find(track => track.trackNumber === nextTrackNumber);
      if (nextTrack) {
        play(nextTrack, currentTracklist, activeAudioShelfId, albumArtworkUrl);
      } else {
        reset();
      }
    }
  };

  const playPrevTrack = () => {
    if (currentTracklist && currentTrack) {
      const prevTrackNumber = currentTrack.trackNumber - 1;
      const prevTrack = currentTracklist.find(track => track.trackNumber === prevTrackNumber);
      if (prevTrack) {
        play(prevTrack, currentTracklist, activeAudioShelfId, albumArtworkUrl);
      }
    }
  };

  const setAudioTime = (time) => {
    if (soundRef.current) {
      soundRef.current.seek(time);
      setCurrentTime(time);
    }
  };

  const reset = () => {
    if (soundRef.current) {
      soundRef.current.unload();
    }
    setCurrentTrack(null);
    setCurrentTracklist(null);
    setAlbumArtworkUrl(null);
    setCurrentTime(0);
    setTotalDuration(0);
    setActiveAudioShelfId(null);
    setIsPlaying(false);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        albumArtworkUrl,
        isPlaying,
        currentTime,
        totalDuration,
        currentTracklist,
        activeAudioShelfId,
        play,
        pause,
        playNextTrack,
        playPrevTrack,
        setCurrentTime,
        setTotalDuration,
        setAudioTime,
        reset,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export { AudioPlayerContext, AudioPlayerProvider };