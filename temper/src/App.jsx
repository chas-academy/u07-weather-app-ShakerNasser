import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useUserLocation from './geolocation/useUserLocation'; // Importera useUserLocation-hook

const apiKey = import.meta.env.VITE_APP_KEY;
const apiUrl = 'https://api.openweathermap.org/data/2.5';

const HourlyForecast = ({ latitude, longitude }) => {
  const [hourlyForecast, setHourlyForecast] = useState(null);

  useEffect(() => {
    const fetchHourlyForecast = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        const next6HoursForecast = response.data.list.slice(0, 6);
        setHourlyForecast(next6HoursForecast);
      } catch (error) {
        console.error('Error fetching hourly forecast:', error);
      }
    };

    fetchHourlyForecast();
  }, [latitude, longitude]);

  if (!hourlyForecast) {
    return <div>Loading hourly forecast...</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {hourlyForecast.map((forecast, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow">
          <p className="font-semibold">{new Date(forecast.dt * 1000).toLocaleTimeString()}</p>
          <img
            className="w-10 h-10"
            src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
            alt="Weather Icon"
          />
          <p className="text-lg text-gray-800">{forecast.main.temp}°C</p>
          <p>{forecast.weather[0].description}</p>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const { position, error } = useUserLocation();
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [unit, setUnit] = useState('metric'); // Default till Celsius

  useEffect(() => {
    const fetchData = async () => {
      if (position) {
        try {
          const weatherResponse = await axios.get(
            `${apiUrl}/weather?lat=${position.latitude}&lon=${position.longitude}&appid=${apiKey}&units=${unit}`
          );
          setWeatherData(weatherResponse.data);

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
    return <div className="text-red-600 text-center mt-8">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Temper - Weather application</h1>

        {position && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold"> Current Position:</h2> 
            {/* <p>Latitude: {position.latitude}</p>
            <p>Longitude: {position.longitude}</p> */}
            <p> Country: {weatherData.sys.country}</p>
            <p> Area: {weatherData.name}</p>
          </div>
        )}

        {weatherData && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-semibold text-gray-800">Current Weather</h2>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <img
                  className="w-12 h-12 mr-4"
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                  alt="Weather Icon"
                />
                <div>
                  <p className="text-lg text-gray-700">{weatherData.weather[0].description}</p>
                  <p className="text-3xl font-bold text-gray-800">{weatherData.main.temp}°{unit === 'metric' ? 'C' : 'F'}</p>
                  <br/>
                  <p>Feels like: {weatherData.main.feels_like}°{unit === 'metric' ? 'C' : 'F'}</p>

                  <p>Wind Speed: {weatherData.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
                  <p>Humidity: {weatherData.main.humidity}%</p>
                  <p>Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
                  <p>Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>



                </div>
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                onClick={toggleUnit}
              >
                Change Unit
              </button>
            </div>
          </div>
        )}
<div className="bg-white p-6 rounded-lg shadow-lg mb-8">
<h2 className="text-xl font-semibold text-gray-800">Hourly Forecast</h2>

{position && <HourlyForecast latitude={position.latitude} longitude={position.longitude} />}

</div>
        <br />
        {forecastData && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-semibold text-gray-800">5-Day Forecast</h2>
            <div className="grid grid-cols-3 gap-4">
              {forecastData.list.slice(0, 6).map((forecast, index) => (
                <div key={index} className="p-4 rounded-lg shadow">
                  <p className="font-semibold">Day {index + 1}</p>
                  <p><strong>Date:</strong> {new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                  <img
                    className="w-10 h-10"
                    src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                    alt="Weather Icon"
                  />
                  <p className="text-lg text-gray-800">{forecast.main.temp}°{unit === 'metric' ? 'C' : 'F'}</p>
                  <p><strong>Weather:</strong> {forecast.weather[0].description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
