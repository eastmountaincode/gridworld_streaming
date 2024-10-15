import React, { useState, useRef } from 'react';
import { FaChevronDown, FaRegQuestionCircle } from 'react-icons/fa';
import './AboutShelf.css';

const AboutShelf = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (contentRef.current) {
      if (isExpanded) {
        contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
        setTimeout(() => {
          contentRef.current.style.height = '0';
        }, 0);
      } else {
        contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
        setTimeout(() => {
          contentRef.current.style.height = 'auto';
        }, 200);
      }
    }
  };

  return (
    <div className="about-shelf-container">
      <div className={`about-shelf ${isExpanded ? '' : 'collapsed'}`}>
        <div className="about-shelf-header">
          <div className="about-title-container">
            <h2 className="about-title">About</h2>
            <FaRegQuestionCircle className="about-icon" />

          </div>
          <div className="chevron-container" onClick={toggleExpand}>
            <FaChevronDown style={{ width: '20px', height: '20px', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }} />
          </div>
        </div>
        <div className={`about-shelf-content ${isExpanded ? 'expanded' : ''}`} ref={contentRef} style={{ textAlign: 'left' }}>
          <p>
            Hi 👋🎵, it's me <a href="https://www.instagram.com/ndrewboylan/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', }}>Andrew</a>, the creator of <i>Gridworld</i> 🌐🎧. I've been releasing music on the internet for a decade now 🎉🕰️. As an artist 🎨🎸, it's frustrating when there are people who want to support me, but the only way they can do that is through a site like Bandcamp that takes 15% PLUS processing fees 😕💸, or a platform like Spotify that devalues smaller artists 😔🎵.
          </p>
          <p>
            I created <b>Gridworld Streaming</b> 🌈🎶 as a way for people to support my music with the minimum possible barrier in terms of processing fees 💰✨. The site uses Square as a payment processor 💳, which charges 2.9% + 30¢ per transaction, which is the lowest fee I've found after researching such things 🕵️‍♂️📊.
          </p>
          <p>
            This is an experiment 🧪🎭 that asks, "what does it look like for an artist to own their platform?" 🤔🎨 If you are an artist / label / etc. that wants a site like this, or would like to create a non-traditional internet experience 🌐🎨, get in touch and let's have a chat 💬🤝.
          </p>
          <p>
            andreweboylan /// at /// gmail /// dot /// com
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutShelf;
