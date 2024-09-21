import React, { useState } from 'react';
import axios from 'axios';

const FlightSearchForm = () => {
  const [carrierCode, setCarrierCode] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [scheduledDepartureDate, setScheduledDepartureDate] = useState('');
  const [flightData, setFlightData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (carrierCode && flightNumber && scheduledDepartureDate) {
      setLoading(true);
      setError(null);
      setPredictionResult(null); // Clear previous result
      try {
        const flight_iata = `${carrierCode}${flightNumber}`;
        const response = await axios.get(`https://api.aviationstack.com/v1/flights`, {
          params: {
            access_key: process.env.REACT_APP_API_KEY,
            flight_iata: flight_iata,
          },
        });

        if (response.data && response.data.data && response.data.data.length > 0) {
          const flightInfo = response.data.data[0];  
          setFlightData(flightInfo);

          console.log(flightInfo);

          const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
              appid: process.env.REACT_APP_WEATHER_API_KEY,
              q: 'mumbai',
              units: 'metric'
            }
          });
          setWeatherData(weatherResponse.data);

          const postData = {
            carrier_code: carrierCode,  
            scheduled_elapsed_time: flightInfo.departure.scheduled_elapsed_time || 120,  
            delay_weather: 1, 
            HourlyPrecipitation_x: weatherResponse.data.main.precipitation || 3.16,  
            HourlyWindSpeed_x: weatherResponse.data.wind.speed || 0.99
          };
          console.log('POST Data:', postData);
          const predictionResponse = await axios.post('https://flight-delay-f56602e85b27.herokuapp.com/flight-prediction', postData);
          setPredictionResult(predictionResponse.data);
        } else {
          setError('No flight data found');
          setFlightData(null);
        }
      } catch (err) {
        setError('Failed to fetch flight data');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please fill out all fields.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          <label htmlFor="carrierCode">Carrier Code:</label>
          <input
            type="text"
            id="carrierCode"
            value={carrierCode}
            onChange={(e) => setCarrierCode(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="flightNumber">Flight Number:</label>
          <input
            type="text"
            id="flightNumber"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="scheduledDepartureDate">Scheduled Departure Date:</label>
          <input
            type="date"
            id="scheduledDepartureDate"
            value={scheduledDepartureDate}
            onChange={(e) => setScheduledDepartureDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Search Flight</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      
      {flightData && (
        <div>
          <h2>Flight Details:</h2>
          <p><strong>Airline:</strong> {flightData.airline.name}</p>
          <p><strong>Flight Number:</strong> {flightData.flight.number}</p>
          <p><strong>Departure Airport:</strong> {flightData.departure.airport}</p>
          <p><strong>Arrival Airport:</strong> {flightData.arrival.airport}</p>
          <p><strong>Scheduled Departure Time:</strong> {flightData.departure.scheduled}</p>
          <p><strong>Scheduled Arrival Time:</strong> {flightData.arrival.scheduled}</p>
          <p><strong>Status:</strong> {flightData.flight_status}</p>
        </div>
      )}

      {weatherData && (
        <div>
          <h2>Weather:</h2>
          <p><strong>Temperature:</strong> {weatherData.main.temp} °C</p>
          <p><strong>Weather:</strong> {weatherData.weather[0].description}</p>
          <p><strong>Humidity:</strong> {weatherData.main.humidity}%</p>
          <p><strong>Wind Speed:</strong> {weatherData.wind.speed} m/s</p>
        </div>
      )}

      {predictionResult && (
        <div>
          <h2>Flight Delay Prediction Result:</h2>
          <pre>{JSON.stringify(predictionResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FlightSearchForm;