// App.js
import React, { useState } from 'react';
import GraphComponent from './GraphComponent'; // Adjust path according to your structure
import { convertData } from './utils';
function App() {
  const [topic, setTopic] = useState('');
  const [graphData, setGraphData] = useState(null);

  const fetchInitialGraph = async () => {
    // Replace with your backend endpoint
    const response = await fetch(`http://localhost:8000/generate/${topic}`, {
      method: 'GET', // This is the default for `fetch`, so not strictly necessary
      headers: {
        'Accept': 'application/json',
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    
    const data = await response.json();
    const graph_data = convertData(data);
    console.log(graph_data);
    setGraphData(graph_data);
  };

  return (
    <div>
      {!graphData ? (
        // Initial Input Form
        <div>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} />
          <button onClick={fetchInitialGraph}>Generate Graph</button>
        </div>
      ) : (
        // Render GraphComponent once data is fetched
        <GraphComponent data={graphData} />
      )}
    </div>
  );
}

export default App;

