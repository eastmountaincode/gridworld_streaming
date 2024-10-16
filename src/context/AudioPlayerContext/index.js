import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';
import { Howl } from 'howler';

const AudioPlayerContext = createContext();

const AudioPlayerProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [silentLoopInitialized, setSilentLoopInitialized] = useState(false);

  const soundRef = useRef(null);
  const currentTrackRef = useRef(null);
  const currentTracklistRef = useRef(null);
  const activeAudioShelfIdRef = useRef(null);
  const albumArtworkUrlRef = useRef(null);
  const silentLoopRef = useRef(null);

  const initializeSilentLoop = useCallback(() => {

    if (!silentLoopInitialized) {
      console.log('Initializing silent loop');
      silentLoopRef.current = new Howl({
        src: ['/misc/white_noise_loop.mp3'],
        loop: true,
        html5: true,
        format: ['mp3'],
        volume: 0.1,
      });

      silentLoopRef.current.play();
      setSilentLoopInitialized(true);
    }
  }, []);

  // useEffect(() => {
  //   return () => {
  //     if (soundRef.current) {
  //       soundRef.current.unload();
  //     }
  //     if (silentLoopRef.current) {
  //       silentLoopRef.current.unload();
  //     }
  //   };
  // }, []);

  const play = (track, tracklist, audioShelfId, albumArtworkUrl) => {
    //initializeSilentLoop();

    // if we already have a current song, just resume it
    if (soundRef.current && currentTrackRef.current && track.trackId === currentTrackRef.current.trackId) {
      soundRef.current.play();
    } else {
      // if (soundRef.current) {
      //   soundRef.current.unload();
      // }

      soundRef.current = new Howl({
        src: [track.firebaseURL],
        html5: true,
        onplay: () => {
          setIsPlaying(true);
          // if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          //   console.log('Sending PLAY_AUDIO message to service worker');
          //   navigator.serviceWorker.controller.postMessage({
          //     type: 'PLAY_AUDIO',
          //     track: track
          //   });
          // }
        },
        onpause: () => {
          setIsPlaying(false);
        },
        onend: () => {
          // if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          //   console.log('Sending TRACK_ENDED message to service worker');
          //   navigator.serviceWorker.controller.postMessage({
          //     type: 'TRACK_ENDED'
          //   });
          // }
          playNextTrack();
        },
        onload: () => {
          setTotalDuration(soundRef.current.duration());
        },
      });

      currentTrackRef.current = track;
      currentTracklistRef.current = tracklist;
      activeAudioShelfIdRef.current = audioShelfId;
      albumArtworkUrlRef.current = albumArtworkUrl;

      soundRef.current.play();
    }

    setIsPlaying(true);

    const intervalId = setInterval(() => {
      if (soundRef.current) {
        const currentTime = soundRef.current.seek();
        setCurrentTime(currentTime);
      }
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  };

  const pause = () => {
    if (soundRef.current) {
      soundRef.current.pause();
    }
  };

  const playNextTrack = () => {
    if (currentTracklistRef.current && currentTrackRef.current) {
      const nextTrackNumber = currentTrackRef.current.trackNumber + 1;
      const nextTrack = currentTracklistRef.current.find(track => track.trackNumber === nextTrackNumber);

      if (nextTrack) {
        play(nextTrack, currentTracklistRef.current, activeAudioShelfIdRef.current, albumArtworkUrlRef.current);
      } else {
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