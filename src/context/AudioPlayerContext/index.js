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
  const [duration, setDuration] = useState(0);
  const [activeAudioPlayerId, setActiveAudioPlayerId] = useState(null);

  const p5Ref = useRef(null);
  const soundRef = useRef(null);

  useEffect(() => {
    p5Ref.current = new p5(() => {});
  }, []);

  useEffect(() => {
    if (soundRef.current) {
      const updateTime = () => {
        setCurrentTime(soundRef.current.currentTime());
      };
      //p5Ref.current.frameRate(30);  // Set frame rate to 30 fps
      p5Ref.current.draw = updateTime;  // Set draw function to update time
      return () => {
        p5Ref.current.draw = () => {};  // Clear draw function on cleanup
      };
    }
  }, [soundRef.current]);

  const play = async (track, tracklist, audioPlayerId) => {
    if (currentTrack?.trackId !== track.trackId || currentTracklist?._id !== tracklist._id) {
      await pause();
      setCurrentTrack(track);
      setCurrentTracklist(tracklist);
      setActiveAudioPlayerId(audioPlayerId);
      soundRef.current = p5Ref.current.loadSound(track.firebaseURL, () => {
        setDuration(soundRef.current.duration());
        soundRef.current.play();
        setIsPlaying(true);
      });
    } else if (soundRef.current) {
      soundRef.current.play();
      setIsPlaying(true);
    }
  };

  const pause = async () => {
    if (soundRef.current) {
      soundRef.current.pause();
      setIsPlaying(false);
    }
  };

  const playNextTrack = () => {
    if (currentTracklist && currentTrack) {
      const nextTrackNumber = currentTrack.trackNumber + 1;
      const nextTrack = currentTracklist.tracks.find(track => track.trackNumber === nextTrackNumber);
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
      const prevTrack = currentTracklist.tracks.find(track => track.trackNumber === prevTrackNumber);
      if (prevTrack) {
        play(prevTrack, currentTracklist, activeAudioPlayerId);
      }
    }
  };

  const setAudioTime = (time) => {
    if (soundRef.current) {
      soundRef.current.jump(time);
      setCurrentTime(time);
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
        p5Instance: p5Ref.current,
        soundInstance: soundRef.current,
        setCurrentTime,
        setDuration,
        setAudioTime
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export { AudioPlayerContext, AudioPlayerProvider };