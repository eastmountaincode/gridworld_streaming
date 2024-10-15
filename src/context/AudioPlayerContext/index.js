import { useMediaSession } from '@mebtte/react-media-session';
import React, { createContext, useState, useRef, useEffect } from 'react';

const AudioPlayerContext = createContext();

const AudioPlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTracklist, setCurrentTracklist] = useState(null);
  const [albumArtworkUrl, setAlbumArtworkUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [activeAudioShelfId, setActiveAudioShelfId] = useState(null);

  const audioContextRef = useRef(null);
  const audioElementRef = useRef(null);
  const sourceNodeRef = useRef(null);

  const currentTrackRef = useRef(currentTrack);
  const currentTracklistRef = useRef(currentTracklist);
  const activeAudioShelfIdRef = useRef(activeAudioShelfId);


  useEffect(() => {
    currentTrackRef.current = currentTrack;
    currentTracklistRef.current = currentTracklist;
    activeAudioShelfIdRef.current = activeAudioShelfId;
  }, [currentTrack, currentTracklist, activeAudioShelfId]);

  // Initialize Web Audio API context when the component mounts
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    audioElementRef.current = new Audio();

    // Set crossOrigin attribute to allow loading audio from different domains
    audioElementRef.current.crossOrigin = "anonymous";

    // Create a MediaElementSource node from the Audio element
    sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioElementRef.current);

    // Connect the source node to the AudioContext's destination (speakers)
    sourceNodeRef.current.connect(audioContextRef.current.destination);

    // Add event listener to update currentTime state when audio time changes
    audioElementRef.current.addEventListener('timeupdate', () => {
      setCurrentTime(audioElementRef.current.currentTime);
    });

    // Add event listener to trigger playNextTrack when the audio ends
    audioElementRef.current.addEventListener('ended', handleEnded);

    // Cleanup function to remove event listeners when component unmounts
    return () => {
      audioElementRef.current.removeEventListener('timeupdate', () => { });
      audioElementRef.current.removeEventListener('ended', handleEnded);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const handleEnded = () => {
    console.log('Audio ended');
    console.log('in event listener, currentTrack:', currentTrackRef.current);
    console.log('in event listener, currentTracklist:', currentTracklistRef.current);
    playNextTrack();
  };

  const play = async (track, tracklist, audioShelfId, albumArtworkUrl) => {
    // Resume the AudioContext if it is suspended
    if (audioContextRef.current.state === 'suspended') {
      console.log('AudioContext is suspended, resuming...');
      await audioContextRef.current.resume();
    }

    // If track or tracklist is different than the current one, proceed
    if (currentTrack?.trackId !== track.trackId || currentTracklist?._id !== tracklist._id) {
      await pause();
      setCurrentTrack(track);
      setCurrentTracklist(tracklist);
      setActiveAudioShelfId(audioShelfId);
      setAlbumArtworkUrl(albumArtworkUrl);
      audioElementRef.current.src = track.firebaseURL;
      audioElementRef.current.load();

      // Log the audio element and its properties
      console.log('in context, in play, Audio element:', audioElementRef.current);
      console.log('in context, in play, Audio element crossOrigin:', audioElementRef.current.crossOrigin);
      console.log('in context, in play, Audio element src:', audioElementRef.current.src);

      audioElementRef.current.onloadedmetadata = () => {
        setTotalDuration(audioElementRef.current.duration);
        audioElementRef.current.play();
        setIsPlaying(true);
      };
    } else if (audioElementRef.current) {
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  };

  const pause = async () => {
    console.log('pause function triggered.')
    if (audioElementRef.current) {
      console.log('there is an audioElementRef, continuing with pause')
      audioElementRef.current.pause();
      setIsPlaying(false);
    }
  };

  const playNextTrack = () => {
    console.log('top of play next track');
    console.log('in play next track, is there a current track? ', currentTrackRef.current);
    console.log('in play next track, is there a current tracklist? ', currentTracklistRef.current);
    if (currentTracklistRef.current && currentTrackRef.current) {
      const nextTrackNumber = currentTrackRef.current.trackNumber + 1;
      const nextTrack = currentTracklistRef.current.find(track => track.trackNumber === nextTrackNumber);
      if (nextTrack) {
        play(nextTrack, currentTracklistRef.current, activeAudioShelfIdRef.current);
      } else {
        console.log('in play next track, no next track, pausing and resetting');
        pause();
        setCurrentTime(0);
        setTotalDuration(null);
        setCurrentTrack(null);
        setIsPlaying(false);
      }
    }
  };

  const playPrevTrack = () => {
    if (currentTracklist && currentTrack) {
      const prevTrackNumber = currentTrack.trackNumber - 1;
      const prevTrack = currentTracklist.find(track => track.trackNumber === prevTrackNumber);
      if (prevTrack) {
        play(prevTrack, currentTracklist, activeAudioShelfId);
      }
    }
  };

  const setAudioTime = (time) => {
    if (audioElementRef.current) {
      audioElementRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const reset = () => {
    pause();
    setCurrentTrack(null);
    setCurrentTracklist(null);
    setCurrentTime(0);
    setTotalDuration(0);
    setActiveAudioShelfId(null);
  };

  useMediaSession({
    title: currentTrack?.trackTitle,
    artist: "Andrew Boylan",
    album: currentTracklist?.albumTitle,
    artwork: [{ src: albumArtworkUrl }],
    onPlay: () => play(currentTrack, currentTracklist, activeAudioShelfId, albumArtworkUrl),
    onPause: pause,
    onPreviousTrack: playPrevTrack,
    onNextTrack: playNextTrack,
  });

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
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
