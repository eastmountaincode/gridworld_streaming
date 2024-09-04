import React, { createContext, useState, useRef, useEffect } from 'react';
import '../../utils/p5sound_fix.js';
import * as p5 from 'p5';
import 'p5/lib/addons/p5.sound';

const AudioPlayerContext = createContext();

const AudioPlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTracklist, setCurrentTracklist] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [activeAudioPlayerId, setActiveAudioPlayerId] = useState(null);
  const [tempSetTime, setTempSetTime] = useState(null); // Temporary set time

  const p5Ref = useRef(null);
  const soundRef = useRef(null);

  // Initialize new instance of p5 when the component mounts
  useEffect(() => {
    p5Ref.current = new p5(() => {});
  }, []);

  // Update currentTime as the sound plays
  useEffect(() => {
    if (soundRef.current && isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(soundRef.current.currentTime());
      }, 50); // Update every __ milliseconds

      return () => clearInterval(interval);
    }
  }, [soundRef.current, isPlaying]);

  const handleSongEnd = () => {
    console.log('Song ended');
    if (isPlaying) {
      playNextTrack();
    }
  };

  const play = async (track, tracklist, audioPlayerId) => {
    // If track or tracklist is different than the current one, proceed
    if (currentTrack?.trackId !== track.trackId || currentTracklist?._id !== tracklist._id) {
      await pause();
      setCurrentTrack(track);
      setCurrentTracklist(tracklist);
      setActiveAudioPlayerId(audioPlayerId);
      soundRef.current = p5Ref.current.loadSound(track.firebaseURL, () => {
        // These things happen only AFTER loadSound is done
        setTotalDuration(soundRef.current.duration());
        soundRef.current.play();
        setIsPlaying(true);
        if (tempSetTime !== null) {
          soundRef.current.jump(tempSetTime);
          setTempSetTime(null);
        }
        // Add event listener for when the song ends
        soundRef.current.onended(handleSongEnd);
        console.log('Event listener for song end added');
      });
    } else if (soundRef.current) {
      soundRef.current.play();
      setIsPlaying(true);
      if (tempSetTime !== null) {
        soundRef.current.jump(tempSetTime);
        setTempSetTime(null);
      }
      // Add event listener for when the song ends
      soundRef.current.onended(handleSongEnd);
      console.log('Event listener for song end added');
    }
  };

  const pause = async () => {
    if (soundRef.current) {
      await soundRef.current.pause();
      setIsPlaying(false);
    }
  };

  const playNextTrack = () => {
    if (currentTracklist && currentTrack) {
      const nextTrackNumber = currentTrack.trackNumber + 1;
      const nextTrack = currentTracklist.find(track => track.trackNumber === nextTrackNumber);
      if (nextTrack) {
        play(nextTrack, currentTracklist, activeAudioPlayerId);
      } else {
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
      const prevTrack = currentTracklist.find(track => track.trackNumber === prevTrackNumber);
      if (prevTrack) {
        play(prevTrack, currentTracklist, activeAudioPlayerId);
      }
    }
  };

  const setAudioTime = (time) => {
    if (soundRef.current) {
      console.log('setAudioTime in AudioPlayerContext. setting time to', time);
      if (isPlaying) {
        soundRef.current.jump(time);
      } else {
        console.log("not playing. setting time to", time);
        setTempSetTime(time);
      }
      setCurrentTime(time);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        totalDuration,
        currentTracklist,
        activeAudioPlayerId,
        play,
        pause,
        playNextTrack,
        playPrevTrack,
        p5Instance: p5Ref.current,
        soundInstance: soundRef.current,
        setCurrentTime,
        setTotalDuration,
        setAudioTime
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export { AudioPlayerContext, AudioPlayerProvider };