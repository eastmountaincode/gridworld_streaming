import React, { useRef, useEffect } from 'react';
import * as p5 from 'p5';
import 'p5/lib/addons/p5.sound';

const TestVisualizer = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let myP5 = new p5(sketch);

    return () => {
      myP5.remove();
    };
  }, []);

  const sketch = (p) => {
    let sound;
    let amplitude;

    p.preload = () => {
      sound = p.loadSound('https://firebasestorage.googleapis.com/v0/b/gridworldstreaming-d841d.appspot.com/o/audio_files%2Fgridworld%2Fmp3_tracks%2FGridworld_Holly.mp3?alt=media&token=46388a61-ce1a-455b-b0d9-ae85cd3dc7e7');
    };

    p.setup = () => {
      p.createCanvas(400, 200).parent(canvasRef.current);
      amplitude = new p5.Amplitude(0.95);
      let playButton = p.createButton('Play');
      playButton.mousePressed(() => {
        if (sound.isPlaying()) {
          sound.pause();
          playButton.html('Play');
        } else {
          sound.play();
          playButton.html('Pause');
        }
      });
    };

    p.draw = () => {
      p.background(220);
      let level = amplitude.getLevel();
      let size = p.map(level, 0, 1, 10, 200);
      p.fill(0, 255, 0);
      p.ellipse(p.width / 2, p.height / 2, size, size);
    };
  };

  return <div ref={canvasRef}></div>;
};

export default TestVisualizer;