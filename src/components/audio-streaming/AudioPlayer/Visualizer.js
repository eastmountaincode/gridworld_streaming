import React, { useRef, useEffect, useContext } from 'react';
import '../../../utils/p5sound_fix.js';
import 'p5/lib/addons/p5.sound';
import * as p5 from 'p5';
import { AudioPlayerContext } from '../../../context/AudioPlayerContext/index.js';

const Visualizer = () => {
    const { audioRef } = useContext(AudioPlayerContext);
    const canvasContainerRef = useRef();

    useEffect(() => {
      const Sketch = (p) => {
        let sound;
        let amplitude;

        p.setup = () => {
          p.createCanvas(225, 225).parent(canvasContainerRef.current); // Create a canvas and attach it to the DOM element (visualizer-container)
          sound = new p5.SoundFile(audioRef.current.src);
          amplitude = new p5.Amplitude();
          amplitude.setInput(sound);
          console.log("Sound file loaded:", sound);

        };

        p.draw = () => {
          p.background(50); // Set the background color
          p.translate(p.width / 2, p.height / 2); // Move the origin to the center of the canvas

          let level = amplitude.getLevel();
          let size = p.map(level, 0, 1, 10, 200);

          p.fill(255);
          p.ellipse(0, 0, size, size);
        };
      };

      const myP5 = new p5(Sketch);

      return () => {
        myP5.remove(); // Clean up the p5.js sketch
      };
    }, [audioRef]);

    useEffect(() => {
      if (audioRef && audioRef.current) {
        console.log("AudioRef is set in useEffect");
      }
    }, [audioRef]);

    return <div className="visualizer-container" ref={canvasContainerRef}></div>; // Return a div that will contain the p5.js canvas
};

export default Visualizer;