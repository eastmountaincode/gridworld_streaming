import React from 'react';
import { FaChevronDown, FaRegQuestionCircle, FaInstagram, FaSpotify, FaGlobe } from 'react-icons/fa';
import { Collapse } from 'antd';
import styled from 'styled-components';
import './AboutShelf.css';

const StyledCollapse = styled(Collapse)`
  &&& {
    width: 100%;
    max-width: 550px;
    border: 1px solid black;
    border-radius: 1px;
    background-color: orange;
    margin: 0px 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 20px;
    min-width: 300px;

    
    .ant-collapse-header {
      display: flex;
      align-items: center !important;
      padding: 10px;
    }

    .ant-collapse-content {
      background-color: transparent;
      border-top: 1px solid black;
    }

    .ant-collapse-header {
      display: flex;
      align-items: center !important;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      height: 70px;
    }

    .ant-collapse-content {
      background-color: transparent;
      border-top: 1px solid black;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .about-title-container {
      display: flex; /* allow content to be horizontally arranged */
      align-items: center; /* vertically center the icon */
      margin-left: 8px;
    }

    .ant-collapse-content-box {
      white-space: normal; /* give the text a margin */
      margin-top: 10px;
    }

    .social-icons-container {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 15px;
            font-size: 25px;
        }

        .social-icon {
            color: inherit;
            transition: transform 0.3s;
        }

  }
`;

const AboutShelf = () => {
  return (
    <div className="about-shelf-container">
      <StyledCollapse
        expandIconPosition='end'
        collapsible='header'
        expandIcon={({ isActive }) => (
          <FaChevronDown
            style={{
              fontSize: '20px',
              transform: `rotate(${isActive ? -90 : 0}deg)`,
              transition: 'transform 0.3s',
              marginRight: '6px',
            }}
          />
        )}
        items={[
          {
            key: "1",
            label: (
              <div className="about-title-container">
                <h2 className="about-title">About</h2>
                <FaRegQuestionCircle 
                  className="about-icon"
                  style={{fontSize: '25px'}} />
              </div>
            ),
            children: (
              <div style={{ margin: '0px 20px 5px 20px', textAlign: 'left' }}>
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
                <div className="social-icons-container">
                                    <a href="https://andrew-boylan.com/" target="_blank" rel="noopener noreferrer" className="social-icon"><FaGlobe /></a>
                                    <a href="https://open.spotify.com/artist/6150ZY2kIMKWAedOUXmfD4?si=BTEe-L5KQiye-_sfH4_lrw" target="_blank" rel="noopener noreferrer" className="social-icon"><FaSpotify /></a>
                                    <a href="https://www.instagram.com/ndrewboylan/" target="_blank" rel="noopener noreferrer" className="social-icon"><FaInstagram /></a>
                                </div>
              </div>
            )
          }
        ]}
      />
    </div>
  );
};

export default AboutShelf;
