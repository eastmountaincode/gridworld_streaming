import React, { useState } from 'react';

const AdminPanel = () => {
  const tables = ['users', 'security_questions'];
  const [message, setMessage] = useState('');

  const handleClear = async (table) => {
    try {
      const response = await fetch(`/api/clear?table=${table}`, { method: 'DELETE' });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage(`Error clearing data: ${error.message}`);
    }
  };

  const handleFetch = async (table) => {
    try {
      const response = await fetch(`/api/fetch?table=${table}`, { method: 'GET' });
      const data = await response.json();
      setMessage(`Fetched ${data.count} records from ${table}`);
    } catch (error) {
      setMessage(`Error fetching data: ${error.message}`);
    }
  };

  const handleSeed = async (table) => {
    try {
      const response = await fetch(`/api/seed?table=${table}`, { method: 'POST' });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage(`Error seeding data: ${error.message}`);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      {tables.map(table => (
        <div key={table} className="table-controls">
          <h2>{table}</h2>
          <button onClick={() => handleClear(table)}>Clear</button>
          <button onClick={() => handleFetch(table)}>Fetch</button>
          <button onClick={() => handleSeed(table)}>Seed</button>
        </div>
      ))}
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default AdminPanel;

