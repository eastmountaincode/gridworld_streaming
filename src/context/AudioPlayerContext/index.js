import React, { createContext, useState, useRef, useEffect } from 'react';
import { Howl } from 'howler';

const AudioPlayerContext = createContext();

const AudioPlayerProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const soundRef = useRef(null);
  const currentTrackRef = useRef(null);
  const currentTracklistRef = useRef(null);
  const activeAudioShelfIdRef = useRef(null);
  const albumArtworkUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  const play = (track, tracklist, audioShelfId, albumArtworkUrl) => {
    console.log('Play function called with:', { track, audioShelfId, albumArtworkUrl });

    if (soundRef.current && currentTrackRef.current && track.trackId === currentTrackRef.current.trackId) {
      console.log('Playing current track');
      soundRef.current.play();
    } else {
      console.log('Setting up new track');
      if (soundRef.current) {
        console.log('Unloading previous sound');
        soundRef.current.unload();
      }

      console.log('Creating new Howl instance');
      soundRef.current = new Howl({
        src: [track.firebaseURL],
        html5: true,
        onplay: () => {
          console.log('Howl onplay triggered');
          setIsPlaying(true);
          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            console.log('Sending PLAY_AUDIO message to service worker');
            navigator.serviceWorker.controller.postMessage({
              type: 'PLAY_AUDIO',
              track: track
            });
          }
        },
        onpause: () => {
          console.log('Howl onpause triggered');
          setIsPlaying(false);
        },
        onend: () => {
          console.log('Howl onend triggered');
          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            console.log('Sending TRACK_ENDED message to service worker');
            navigator.serviceWorker.controller.postMessage({
              type: 'TRACK_ENDED'
            });
          }
          console.log('Calling playNextTrack from onend');
          playNextTrack();
        },
        onload: () => {
          console.log('Howl onload triggered');
          setTotalDuration(soundRef.current.duration());
        },
      });

      console.log('Updating current track references');
      currentTrackRef.current = track;
      currentTracklistRef.current = tracklist;
      activeAudioShelfIdRef.current = audioShelfId;
      albumArtworkUrlRef.current = albumArtworkUrl;

      console.log('Playing new track');
      soundRef.current.play();
      console.log('After playing new track... did we get this far?');
    }

    setIsPlaying(true);

    console.log('Setting up interval for updating current time');
    const intervalId = setInterval(() => {
      if (soundRef.current) {
        const currentTime = soundRef.current.seek();
        setCurrentTime(currentTime);
      }
    }, 500);

    return () => {
      console.log('Clearing interval');
      clearInterval(intervalId);
    };
  };

  const pause = () => {
    if (soundRef.current) {
      soundRef.current.pause();
    }
  };

  const playNextTrack = () => {
    console.log('playNextTrack called');
    
    if (currentTracklistRef.current && currentTrackRef.current) {
      console.log('Current track:', currentTrackRef.current);
      console.log('Current tracklist:', currentTracklistRef.current);
      
      const nextTrackNumber = currentTrackRef.current.trackNumber + 1;
      console.log('Next track number:', nextTrackNumber);
      
      const nextTrack = currentTracklistRef.current.find(track => track.trackNumber === nextTrackNumber);
      console.log('Next track:', nextTrack);
      
      if (nextTrack) {
        console.log('Playing next track:', nextTrack);
        play(nextTrack, currentTracklistRef.current, activeAudioShelfIdRef.current, albumArtworkUrlRef.current);
      } else {
        console.log('No next track found, resetting player');
        reset();
      }
    } else {
      console.log('No current track or tracklist');
    }
  };

  const playPrevTrack = () => {
    if (currentTracklistRef.current && currentTrackRef.current) {
      const prevTrackNumber = currentTrackRef.current.trackNumber - 1;
      const prevTrack = currentTracklistRef.current.find(track => track.trackNumber === prevTrackNumber);
      if (prevTrack) {
        play(prevTrack, currentTracklistRef.current, activeAudioShelfIdRef.current, albumArtworkUrlRef.current);
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
    currentTrackRef.current = null;
    currentTracklistRef.current = null;
    albumArtworkUrlRef.current = null;
    activeAudioShelfIdRef.current = null;
    setCurrentTime(0);
    setTotalDuration(0);
    setIsPlaying(false);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack: currentTrackRef.current,
        albumArtworkUrl: albumArtworkUrlRef.current,
        isPlaying,
        currentTime,
        totalDuration,
        currentTracklist: currentTracklistRef.current,
        activeAudioShelfId: activeAudioShelfIdRef.current,
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