import React, { useEffect, useState } from 'react';
import './Weather.css';
import { FaSearch, FaWind, FaThermometer, FaTemperatureHigh, FaTemperatureLow, FaTachometerAlt, FaEye } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { WiHumidity } from 'react-icons/wi';
// import countriesData from './countriesData.json';
import { Country, State, City }  from 'country-state-city'


//Changes 1. Use node module for countries, 2. remove previous data if invalid api call is made 3. form validation(disable search button) 4. avoid multiple api calls for the same params selected 

const Weather = () => {
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [prevParams, setPrevParams] = useState({country:'',state:'',city:''})

  const API_KEY = '5acc1683650652bab831ecf7d57fd397';
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
  // console.log(State.getStatesOfCountry("IN"))

  useEffect(() => {
    // Set countries using the example JSON data
    setCountries(Country.getAllCountries());
    
  }, []);

  const fetchStates = (selectedCountryCode) => {
    // Find the selected country in the module data
    //const selectedCountry = Country.getCountryByShortName(selectedCountryCode);
 

    // Set states based on the selected country
    // console.log(selectedCountryCode)
    setStates(State.getStatesOfCountry(selectedCountryCode));
  };

  const fetchCities = (selectedState) => {
    // Find the selected state in the module data
    let components = selectedState.split(",")
    let countrycode = components[0];
    let statecode = components[1];
    //console.log(components)

    // Set cities based on the selected state
    // console.log(selectedStateCode)
    setCities(City.getCitiesOfState(countrycode,statecode));
  };

  const handleCountryChange = (event) => {
    const selectedCountryCode = event.target.value;
    setCountry(selectedCountryCode);
    setState('');
    setCity('');
    // Fetch states based on the selected country
    fetchStates(selectedCountryCode);
    setIsFormValid(false); // Reset form validation
  };

  const handleStateChange = (event) => {
    const selectedStateName = event.target.value;
    setState(selectedStateName);
    setCity('');
    // Fetch cities based on the selected state
  
    fetchCities(selectedStateName);
    setIsFormValid(false); // Reset form validation
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
    setIsFormValid(!!event.target.value); // Update form validation based on city input
  };

  const fetchData = async () => {
    if(country === prevParams.country && state === prevParams.state && city === prevParams.city){
      return;
    }

    try {
      const response = await fetch(weatherApiUrl);
      const data = await response.json();

      if (response.ok) {
        setWeather(data);
        setError('');
        setPrevParams({ country, state, city });
      } else {
        setWeather(null);
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
            <option key={country.name} value={country.isoCode}>
              {country.name}
            </option>
          ))}
        </select>
       
        <select value={state} onChange={handleStateChange}>
          <option value='' disabled>Select State</option>
          {states.map((state) => (
            
            <option key={state.name} value={[state.countryCode,state.isoCode]}>
              {state.name}
            </option>
          ))}
        </select>

        <select value={city} onChange={handleCityChange}>
          <option value='' disabled>Select City</option>
          {cities.map((city, index) => (
            <option key={index} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>

        <button onClick={fetchData} disabled={!isFormValid }>
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
