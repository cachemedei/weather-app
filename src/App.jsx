import 'bootstrap-icons/font/bootstrap-icons.css';
import {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css'

const App = () => {
  const currentDay = new Date().toLocaleDateString("en-AU", {weekday: "long", month: "long", day: "numeric"});
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=213c54a68946c8215cd53d5cacf1c427&units=metric`;
  const lat = weather.coord ? weather.coord.lat : null;
  const lon = weather.coord ? weather.coord.lon : null;
  const forecastURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=213c54a68946c8215cd53d5cacf1c427&exclude=current,minutely,hourly,alerts`;

  const handleSearch = () => {
      try {
        axios.get(weatherURL).then((response) => {
          setWeather(response.data)
        })
      } catch (error) {
        console.error("Error fetching weather data:", error)
      }
      setLocation("")
  };

  const handleEnter = (e) => {
    if(e.key === "Enter"){
      handleSearch();
    } else return
  };

  useEffect(() => {
    const updateForecast = () => {
      if (lat && lon) {
        try {
          axios.get(forecastURL).then((response) => {
            const threeDayForecast = response.data.daily.slice(1, 4)
            setForecast(threeDayForecast)
          })
        } catch (error) {
          console.error("Error fetching forecast data:", error)
        }
      } else return
    };
    updateForecast();
  }, [lat, lon]);
    
  return(
    <div className="weather-app">
      <div className="container">
        <div className="searchbar">
          <input 
              type="text"
              id="search-input" 
              placeholder='search'
              value={location}
              onKeyDown={location ? handleEnter : null}
              onChange={(e) => setLocation(e.target.value)} />
          <button className="search-btn" onClick={location ? handleSearch : null}>
            <i className="bi bi-search"></i>
          </button>
        </div>
        <div className="location">
          <h2>{weather.name}</h2>
          <h3>{currentDay}</h3>
        </div>
        <div className="current">
          <div className="temp">
            {weather.main ? <h1>{Math.round(weather.main.temp)}°C</h1> : null}
          </div>
          <div className="description">
            {weather.weather ? <p id="condition">{weather.weather[0].description}</p> : null}
            {weather.main ? <p id="low">min: {Math.round(weather.main.temp_min)}°C</p> : null}
            {weather.main ? <p id="high">max: {Math.round(weather.main.temp_max)}°C</p> : null}
          </div>
        </div>
          {forecast.map((data, i) => (
            <div className="forecast">
              <h3 key={i}>
                {new Date(data.dt * 1000).toLocaleDateString('en-AU', {weekday: 'long'})}
              </h3>
              <p key="summary">
                {`${Math.round(data.temp.day)}°C | ${data.weather[0].description}`}
              </p>
            </div>
          ))
        }
      </div>
    </div>
  )
};
export default App;