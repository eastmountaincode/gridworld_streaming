import React, { createContext, useState, useRef, useEffect } from 'react';
import { Howl, Howler } from 'loudest';
const unmuteAudio = require('unmute-ios-audio')

unmuteAudio();

const AudioPlayerContext = createContext();

Howler.autoUnlock = true;
Howler.html5PoolSize = 100;

const AudioPlayerProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const soundRef = useRef(null);
  const currentTrackRef = useRef(null);
  const currentTracklistRef = useRef(null);
  const activeAudioShelfIdRef = useRef(null);
  const albumArtworkUrlRef = useRef(null);
  const dummySoundRef = useRef(null);


  const playDummySound = () => {
    console.log('top of play dummy sound');
    return new Promise((resolve) => {
      dummySoundRef.current = new Howl({
        src: ['/misc/silent_loop.mp3'],
        html5: true,
        onend: resolve
      });
      dummySoundRef.current.play();
    });
  };

  const initializeMediaSession = () => {
    console.log('initializeMediaSession called');
    if ('mediaSession' in navigator) {
      console.log('initializing mediaSession')
      // navigator.mediaSession.setActionHandler('play', async () => {
      //   console.log('Play button pressed, current Howler context state:', Howler.ctx.state);

      //   if (Howler.ctx.state === 'suspended') {
      //     console.log('Howler ctx is suspended, resuming');
      //     await Howler.ctx.resume();
      //   }
      //   if (soundRef.current) {
      //     soundRef.current.play();
      //     setIsPlaying(true);
      //   }
      // });
      // navigator.mediaSession.setActionHandler('pause', pause);
      // navigator.mediaSession.setActionHandler('previoustrack', async () => {
      //   await playDummySound();
      //   playPrevTrack();
      // });
      // navigator.mediaSession.setActionHandler('nexttrack', async () => {
      //   await playDummySound();
      //   playNextTrack();
      // });
    }
  };
  useEffect(() => {
    const setup = async () => {
      await playDummySound();
      initializeMediaSession();
    }

    setup();
  }, []);


  const play = async (track, tracklist, audioShelfId, albumArtworkUrl) => {
    console.log('instructed to play with these parameters:', track.trackTitle, tracklist, audioShelfId, albumArtworkUrl);

    await playDummySound();

    // if we already have a current song, just resume it
    if (soundRef.current && currentTrackRef.current && track.trackId === currentTrackRef.current.trackId) {
      soundRef.current.play();
      setIsPlaying(true);
    } else {
      // this prevents the previous track from playing if we go to the next one
      if (soundRef.current) {
        soundRef.current.unload();
      }

      soundRef.current = new Howl({
        src: [track.firebaseURL],
        html5: true,
        preload: true,
        onplay: () => {
          setIsPlaying(true);
        },
        onpause: () => {
          setIsPlaying(false);
        },
        onend: () => {
          console.log('track ended, calling playNextTrack');
          playNextTrack();
        },
        onload: () => {
          setTotalDuration(soundRef.current.duration());
          updateMediaSession(track, tracklist, albumArtworkUrl);
        },
      });

      currentTrackRef.current = track;
      currentTracklistRef.current = tracklist;
      activeAudioShelfIdRef.current = audioShelfId;
      albumArtworkUrlRef.current = albumArtworkUrl;

      initializeMediaSession();

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
    console.log('pause function was called, in pause function');
    if (soundRef.current) {
      soundRef.current.pause();
      setIsPlaying(false);
      console.log('Current Howler context state:', Howler.ctx.state);


    }
  };

  const playNextTrack = async () => {
    if (currentTracklistRef.current && currentTrackRef.current) {
      const nextTrackNumber = currentTrackRef.current.trackNumber + 1;
      const nextTrack = currentTracklistRef.current.find(track => track.trackNumber === nextTrackNumber);

      if (nextTrack) {
        //await playDummySound();
        play(nextTrack, currentTracklistRef.current, activeAudioShelfIdRef.current, albumArtworkUrlRef.current);
        updateMediaSession(nextTrack, currentTracklistRef.current, albumArtworkUrlRef.current);
      } else {
        reset();
      }
    } else {
      console.log('No current track or tracklist');
    }
  };

  const playPrevTrack = async () => {
    if (currentTracklistRef.current && currentTrackRef.current) {
      const prevTrackNumber = currentTrackRef.current.trackNumber - 1;
      const prevTrack = currentTracklistRef.current.find(track => track.trackNumber === prevTrackNumber);

      if (prevTrack) {
        //await playDummySound();
        play(prevTrack, currentTracklistRef.current, activeAudioShelfIdRef.current, albumArtworkUrlRef.current);
        updateMediaSession(prevTrack, currentTracklistRef.current, albumArtworkUrlRef.current);
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

  const updateMediaSession = (track, tracklist, albumArtworkUrl) => {
    console.log('in AudioPlayerContext, updateMediaSession called');
    if ('mediaSession' in navigator) {
      console.log('in AudioPlayerContext, mediaSession is in navigator');
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.trackTitle,
        artist: "Andrew Boylan",
        album: tracklist.albumTitle,
        artwork: [
          { src: albumArtworkUrl, sizes: '512x512', type: 'image/jpeg' }
        ]
      });
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    } else {
      navigator.mediaSession.metadata = null;
    }

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
        playDummySound,
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