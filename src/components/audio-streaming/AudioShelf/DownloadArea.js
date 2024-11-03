import React, { useState, useCallback } from 'react';
import { Button, Collapse as AntCollapse } from 'antd';
import styled from 'styled-components';

import { useDownloadRadioButton } from '../../../context/DownloadRadioButtonContext';


const { Panel } = AntCollapse;

const StyledCollapse = styled(AntCollapse)`
  &&& {
    background: transparent;
    border: 1px solid black;
    border-radius: 6px;
    margin: 10px;
    margin-top: 0px;
    color: black;
  }

  .ant-collapse-content {
    background-color: transparent;
    border-top: 1px solid black;

  }

  .ant-collapse-content-box {
    background-color: transparent;

  }
`;

const StyledPanel = styled(Panel)`
  &&& {
    background-color: transparent;
    border: none;
  }
`;

const StyledButton = styled(Button)`
  &&& {
    &:not(:disabled) {
      background-color: ${props => props.shelfcolor};
      border-color: ${props => props.shelfcolor};
    }
    &:disabled {
      border: none;
    }
  }
`;
const DownloadArea = ({ formats, shelfcolor, audioShelfId }) => {
  const { 
    activeRadioComponentId, 
    setActiveRadioComponentId
  } = useDownloadRadioButton();

  const [selectedFormat, setSelectedFormat] = useState('');

  const handleFormatChange = useCallback((event) => {
    const newSelectedFormat = event.target.value;
    setSelectedFormat(newSelectedFormat);
    setActiveRadioComponentId(audioShelfId);

  }, []);

  const handleDownload = () => {
    const selectedFormatData = formats.find(
      format => format.formatName === selectedFormat
    );
    if (selectedFormatData) {
      window.open(selectedFormatData.formatLink, '_blank');
    }
  };

  const isActive = activeRadioComponentId === audioShelfId;

  return (
    <StyledCollapse expandIconPosition="right">
      <StyledPanel
        header={<span style={{ float: 'left', fontFamily: 'GogaTest', fontWeight: 'normal', fontSize: '16px' }}>Download</span>}
        key="1"
      >
        <div style={{ textAlign: 'left', margin: '5px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>Format:</span>
            <div style={{ marginLeft: '10px' }}>
              {formats.map((format) => (
                <label key={format.formatName} style={{
                  marginRight: '10px',
                  display: 'inline-flex', // this vertically centers the radio button and label
                  alignItems: 'center' // same with this
                }}>
                  <input
                    type="radio"
                    name={`format-${audioShelfId}`}
                    value={format.formatName}
                    checked={isActive && selectedFormat === format.formatName}
                    onChange={handleFormatChange}
                    style={{
                      marginRight: '5px',
                      accentColor: shelfcolor,
                      height: '18px',
                      width: '18px',
                      cursor: 'pointer',

                    }}
                  />
                  <span style={{ lineHeight: '2' }}>{format.formatName}</span>
                </label>
              ))}
           </div>
          </div>
          <StyledButton
            type="primary"
            onClick={handleDownload}
            disabled={!isActive || !selectedFormat}
            style={{ marginTop: '15px', color: 'black' }}
            shelfcolor={shelfcolor}
          >
            Go
          </StyledButton>
        </div>
      </StyledPanel>
    </StyledCollapse>
  );
}; 

export default DownloadArea;