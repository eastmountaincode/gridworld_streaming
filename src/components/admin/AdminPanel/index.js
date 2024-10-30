import React, { useState } from 'react';
import ReactJson from '@microlink/react-json-view'
import AdminNavbar from './AdminNavbar';


const AdminPanel = () => {
  const tables = ['users', 'security-questions'];
  const [message, setMessage] = useState('');
  const [fetchedRecords, setFetchedRecords] = useState(null);
  const [trackData, setTrackData] = useState({
    trackTitle: '',
    minutes: '',
    seconds: '',
    firebaseURL: ''
  });
  const [trackMessage, setTrackMessage] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleTrackInputChange = (e) => {
    setTrackData({ ...trackData, [e.target.name]: e.target.value });
  }

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    console.log('trackData', trackData);
    const totalSeconds = (Number(trackData.minutes) * 60) + Number(trackData.seconds);
    console.log('totalSeconds', totalSeconds);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tracks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trackTitle: trackData.trackTitle,
          trackDuration: totalSeconds,
          firebaseURL: trackData.firebaseURL
        }),
      });
      const data = await response.json();
      setTrackMessage(`${trackData.trackTitle} ${data.message}`);
      setTrackData({ trackTitle: '', minutes: '', seconds: '', firebaseURL: '' });
    } catch (error) {
      setTrackMessage(`Error uploading track: ${error.message}`);
    }
  };

  const handleClear = async (table) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/${table}?all=true`, { method: 'DELETE' });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage(`Error clearing data: ${error.message}`);
    }
  };

  const handleFetch = async (table) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/${table}`, { method: 'GET' });
      const data = await response.json();
      setFetchedRecords(data.records);
      //const recordsString = JSON.stringify(data.records, null, 2);
      setMessage(`Fetched ${data.count} records from ${table}.`);
    } catch (error) {
      setMessage(`Error fetching data: ${error.message}`);
    }
  };



  const handleSeed = async (table) => {
    try {
      const seedData = require(`./seed_data/${table}_seed.json`)[table];
      const response = await fetch(`${API_BASE_URL}/api/${table}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(seedData),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage(`Error seeding data: ${error.message}`);
    }
  };


  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>

      {message && <div className="message">{message}</div>}
      {fetchedRecords && (
        <div className="json-view-container" style={{ textAlign: 'left' }}>
          <ReactJson src={fetchedRecords}
            collapsed={true}
            enableClipboard={false} />
        </div>
      )}

      {tables.map(table => (
        <div key={table} className="table-controls">
          <h2>{table}</h2>
          <button onClick={() => handleClear(table)}>Clear</button>
          <button onClick={() => handleFetch(table)}>Fetch</button>
          <button onClick={() => handleSeed(table)}>Seed</button>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
        <AdminNavbar></AdminNavbar>
      </div>

      {/* TRACK UPLOAD */}
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div className="track-upload" style={{ border: '1px solid #ccc', padding: '10px 10px 25px 10px', marginTop: '20px', width: '500px' }}>
          {trackMessage && <div className="message">{trackMessage}</div>}
          <h2>Upload Track</h2>
          <form onSubmit={handleTrackSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <input
              type="text"
              name="trackTitle"
              value={trackData.trackTitle}
              onChange={handleTrackInputChange}
              placeholder="Track Title"
              required
              style={{ display: 'block', marginBottom: '10px', width: '200px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '200px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
                <input
                  type="number"
                  name="minutes"
                  value={trackData.minutes}
                  onChange={handleTrackInputChange}
                  placeholder="Min"
                  required
                  style={{ width: '100%', padding: '5px' }}
                />
                <label style={{ fontSize: '12px', marginTop: '2px' }}>Minutes</label>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
                <input
                  type="number"
                  name="seconds"
                  value={trackData.seconds}
                  onChange={handleTrackInputChange}
                  placeholder="Sec"
                  required
                  style={{ width: '100%', padding: '5px' }}
                />
                <label style={{ fontSize: '12px', marginTop: '2px' }}>Seconds</label>
              </div>
            </div>

            <input
              type="text"
              name="firebaseURL"
              value={trackData.firebaseURL}
              onChange={handleTrackInputChange}
              placeholder="Firebase URL"
              required
              style={{ display: 'block', marginBottom: '10px', width: '400px' }}
            />
            <button type="submit">Upload Track</button>
          </form>
        </div>
      </div>


    </div>
  );
};

export default AdminPanel;

