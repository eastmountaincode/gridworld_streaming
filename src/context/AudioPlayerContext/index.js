import React, { createContext, useState, useRef } from 'react';
import { Howl, Howler } from 'howler';

const AudioPlayerContext = createContext();

Howler.autoUnlock = true;

const AudioPlayerProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const soundRef = useRef(null);
  const currentTrackRef = useRef(null);
  const currentTracklistRef = useRef(null);
  const activeAudioShelfIdRef = useRef(null);
  const albumArtworkUrlRef = useRef(null);

  const play = (track, tracklist, audioShelfId, albumArtworkUrl) => {
    console.log('instructed to play with these parameters:', track.trackTitle, tracklist, audioShelfId, albumArtworkUrl);

    // if we already have a current song, just resume it
    if (soundRef.current && currentTrackRef.current && track.trackId === currentTrackRef.current.trackId) {
      soundRef.current.play();
    } else {
      // this prevents the previous track from playing if we go to the next one
      if (soundRef.current) {
        soundRef.current.unload();
      }

      soundRef.current = new Howl({
        src: [track.firebaseURL],
        html5: true,
        onplay: () => {
          setIsPlaying(true);
          //updateMediaSession(track, tracklist, albumArtworkUrl);

        },
        onplayerror: () => {
          console.error('Error playing audio');
          currentTrackRef.current = track;
          currentTracklistRef.current = tracklist;
          activeAudioShelfIdRef.current = audioShelfId;
          albumArtworkUrlRef.current = albumArtworkUrl;

          soundRef.current.play();
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

  // const updateMediaSession = (track, tracklist, albumArtworkUrl) => {
  //   console.log('in AudioPlayerContext, updateMediaSession called');
  //   if ('mediaSession' in navigator) {
  //     console.log('in AudioPlayerContext, mediaSession is in navigator');
  //     navigator.mediaSession.metadata = new MediaMetadata({
  //       title: track.trackTitle,
  //       artist: "Andrew Boylan",
  //       album: tracklist.albumTitle,
  //       artwork: [
  //         { src: albumArtworkUrl, sizes: '512x512', type: 'image/jpeg' }
  //       ]
  //     });
  //   }
  // };

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