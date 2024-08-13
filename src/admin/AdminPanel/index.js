import React, { useState } from 'react';
import ReactJson from '@microlink/react-json-view'


const AdminPanel = () => {
  const tables = ['users', 'security_questions'];
  const [message, setMessage] = useState('');
  const [fetchedRecords, setFetchedRecords] = useState(null);

  const handleClear = async (table) => {
    try {
      const response = await fetch(`http://localhost:3001/api/${table}?all=true`, { method: 'DELETE' });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage(`Error clearing data: ${error.message}`);
    }
  };

  const handleFetch = async (table) => {
    try {
      const response = await fetch(`http://localhost:3001/api/${table}`, { method: 'GET' });
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
      const response = await fetch(`http://localhost:3001/api/${table}`, {
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
        <div className="json-view-container" style={{textAlign: 'left'}}>
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
    </div>
  );
};

export default AdminPanel;

