import React, { useState } from 'react';
import FlightSearchForm from './Components/FlightSearchFormComponent';

function App() {
  const [flightData, setFlightData] = useState(null);

  const handleSearch = (data) => {
    setFlightData(data);
  };

  return (
    <div className="App">
      <h1>Flight Search</h1>
      <FlightSearchForm onSearch={handleSearch} />
      {flightData && (
        <div>
          <h2>Flight Information:</h2>
          <pre>{JSON.stringify(flightData, null, 2)}</pre>
        </div>
      )}
      
    </div>
    
  );
}

export default App;