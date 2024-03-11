import React, { useEffect, useState } from 'react';
import './Weather.css';
import { FaSearch, FaWind, FaThermometer, FaTemperatureHigh, FaTemperatureLow, FaTachometerAlt, FaEye } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { WiHumidity } from 'react-icons/wi';
import countriesData from './countriesData.json';

const Weather = () => {
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const API_KEY = '5acc1683650652bab831ecf7d57fd397';
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

  useEffect(() => {
    // Set countries using the example JSON data
    setCountries(countriesData.countries);
  }, []);

  const fetchStates = (selectedCountryCode) => {
    // Find the selected country in the JSON data
    const selectedCountry = countries.find((c) => c.country_short_name === selectedCountryCode);

    // Set states based on the selected country
    setStates(selectedCountry ? selectedCountry.states : []);
  };

  const fetchCities = (selectedStateName) => {
    // Find the selected state in the JSON data
    const selectedState = states.find((s) => s.state_name === selectedStateName);

    // Set cities based on the selected state
    setCities(selectedState ? selectedState.cities : []);
  };

  const handleCountryChange = (event) => {
    const selectedCountryCode = event.target.value;
    setCountry(selectedCountryCode);
    setState('');
    setCity('');
    // Fetch states based on the selected country
    fetchStates(selectedCountryCode);
  };

  const handleStateChange = (event) => {
    const selectedStateName = event.target.value;
    setState(selectedStateName);
    setCity('');
    // Fetch cities based on the selected state
    fetchCities(selectedStateName);
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(weatherApiUrl);
      const data = await response.json();

      if (response.ok) {
        setWeather(data);
        setError('');
      } else {
        setError('No data found. Please enter a valid city name.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data.');
    }
  };

  return (
    <div className='container'>
      <div className='city'>
        <select value={country} onChange={handleCountryChange}>
          <option value='' disabled>Select Country</option>
          {countries.map((country) => (
            <option key={country.country_short_name} value={country.country_short_name}>
              {country.country_name}
            </option>
          ))}
        </select>

        <select value={state} onChange={handleStateChange}>
          <option value='' disabled>Select State</option>
          {states.map((state, index) => (
            <option key={index} value={state.state_name}>
              {state.state_name}
            </option>
          ))}
        </select>

        <select value={city} onChange={handleCityChange}>
          <option value='' disabled>Select City</option>
          {cities.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>

        <button onClick={fetchData}>
          <FaSearch />
        </button>
      </div>

      {error && <p className='error-message'>{error}</p>}

      {weather && weather.weather && (
        <div className='content'>
          <div className='weather-image'>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt=''
            />
            <h3 className='desc'>{weather.weather[0].description}</h3>
          </div>

          <div className='weather-temp'>
            <h2>{weather.main.temp}<span>&deg;C</span></h2>
          </div>

          <div className='weather-city'>
            <div className='location'>
              <MdLocationOn />
            </div>
            <p>{weather.name},<span>{weather.sys.country}</span></p>
          </div>

          <div className='weather-stats'>
            <div className='wind'>
              <div className='wind-icon'>
                <FaWind />
              </div>
              <h3 className='wind-speed'>{weather.wind.speed}<span>Km/h</span></h3>
              <h3 className='wind-heading'>Wind Speed</h3>
            </div>    
            <div className='humidity'>
              <div className='humidity-icon'>
                <WiHumidity />
              </div>
              <h3 className='humidity-percent'>{weather.main.humidity}<span>%</span></h3>
              <h3 className='humidity-heading'>Humidity</h3>
            </div>

            <div className='feels-like'>
              <div className='feels-like-icon'>
                <FaTachometerAlt />
              </div>
              <h3 className='feelslike-data'>{weather.main.feels_like}<span>&deg;C</span></h3>
              <h3 className='feels-like-heading'>Feels Like </h3>
            </div>

            <div className='min-temp'>
              <div className='min-temp-icon'>
                <FaTemperatureLow />
              </div>
              <h3 className='mintemp-data'>{weather.main.temp_min}<span>&deg;C</span></h3>
              <h3 className='min_temp-heading'>Min Temperature</h3>
            </div>

            <div className='max-temp'>
              <div className='max-temp-icon'>
                <FaTemperatureHigh />
              </div>
              <h3 className='max-temp-data'>{weather.main.temp_max}<span>&deg;C</span></h3>
              <h3 className='max_temp-heading'>Max Temperature</h3>
            </div>

            <div className='pressure'>
              <div className='pressure-icon'>
                <FaThermometer />
              </div>
              <h3 className='pressure-data'>{weather.main.pressure} <span>hPa</span></h3>
              <h3 className='pressure-heading'>Pressure</h3>
            </div>

            <div className='visibility'>
              <div className='visibility-icon'>
                <FaEye />
              </div>
              <h3 className='visibility-data'>{weather.visibility} <span>meters</span></h3>
              <h3 className='humidity-heading'>Visibility</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
