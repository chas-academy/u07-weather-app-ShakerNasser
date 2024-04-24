import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import useUserLocation from './geolocation/useUserLocation'; // Importera useUserLocation-hooken

const apiKey = import.meta.env.VITE_APP_KEY;
const apiUrl = 'https://api.openweathermap.org/data/2.5';

function App() {
  const { position, error, locationName } = useUserLocation(); // Använd useUserLocation-hooken för att hämta position och platsnamn
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [unit, setUnit] = useState('metric'); // Default till Celsius

  useEffect(() => {
    const fetchData = async () => {
      if (position) {
        try {
          // Hämta nuvarande väder
          const weatherResponse = await axios.get(
            `${apiUrl}/weather?lat=${position.latitude}&lon=${position.longitude}&appid=${apiKey}&units=${unit}`
          );
          setWeatherData(weatherResponse.data);

          // Hämta väderprognos för 5 dagar framåt
          const forecastResponse = await axios.get(
            `${apiUrl}/forecast?lat=${position.latitude}&lon=${position.longitude}&appid=${apiKey}&units=${unit}`
          );
          setForecastData(forecastResponse.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [position, unit]);

  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App">
      <h1>Väderapplikation</h1>

      {/* Visa nuvarande platsnamn om det är tillgängligt */}
      {locationName && (
        <div>
          <h2>Nuvarande position: {locationName}</h2>
        </div>
      )}

      {weatherData && (
        <div>
          <h2>Nuvarande väder</h2>
          <p>Temperatur: {weatherData.main.temp}°{unit === 'metric' ? 'C' : 'F'}</p>
          <p>Vindstyrka: {weatherData.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
          <p>Luftfuktighet: {weatherData.main.humidity}%</p>
          <p>Soluppgång: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
          <p>Solnedgång: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
          <button onClick={toggleUnit}>Byt enhet</button>
        </div>
      )}

      {forecastData && (
        <div>
          <h2>Väderprognos för 5 dagar framåt</h2>
          {forecastData.list.slice(0, 5).map((forecast, index) => (
            <div key={index}>
              <p>Dag {index + 1}: {forecast.main.temp}°{unit === 'metric' ? 'C' : 'F'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
