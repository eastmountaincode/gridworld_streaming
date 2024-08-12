import React, { useState } from 'react';
import './App.css';

function App() {
  const [apiData, setApiData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/example');
      const data = await response.json();
      setApiData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="App">
      <p>Hello111</p>
      <button onClick={fetchData}>Fetch API Data</button>
      {apiData && (
        <div>
          <h2>API Response:</h2>
          <pre>{JSON.stringify(apiData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;