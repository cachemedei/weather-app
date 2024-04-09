import 'bootstrap-icons/font/bootstrap-icons.css';
import au from './utils/au.json'
import {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css'

const cityNames = [];
const data = au;
for(let i = 0; i < data.length; i++){
  cityNames.push(data[i].city, data[i].admin_name)
};

const App = () => {
  const currentDay = new Date().toLocaleDateString("en-AU", {weekday: "long", month: "long", day: "numeric"});
  const [search, setSearch] = useState("")
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSelect = (city, admin) => {
    setSearch(`${city}, ${admin}`)
    getWeatherWithSlowInternet(city)
  };

  const getWeatherWithSlowInternet = async (city) => {
    setLoading(!loading)
    await new Promise(resolve => setTimeout(resolve, 1800));
    return handleSearch(city);
  };

  const handleSearch = (city) => {
    if(city){
      setLoading(true);
      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=213c54a68946c8215cd53d5cacf1c427&units=metric`;
        axios.get(weatherURL)
        .then((response) => {
          setWeather(response.data)
          setSearch("")
          setLoading(false)
        })
        .catch(error => {
          console.error("Error fetching weather data:", error)
          setLoading(false)
        });
    } else return
  };

  useEffect(() => {
    const updateForecast = () => {
      const lat = weather.coord ? weather.coord.lat : null;
      const lon = weather.coord ? weather.coord.lon : null;
      const forecastURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=213c54a68946c8215cd53d5cacf1c427&exclude=current,minutely,hourly,alerts`;

      if (lat && lon) {
        axios.get(forecastURL)
          .then((response) => {
              const threeDayForecast = response.data.daily.slice(1, 4)
              setForecast(threeDayForecast)
          })
          .catch (error => {
            console.error("Error fetching forecast data:", error)
        });
      }
    };
    updateForecast();
  }, [weather]);

  return(
    <div className="weather-app">
      <div className="container" key='container-key'>
        <div className="search">
          <div className="searchbar">
            <input
              key="input-field" 
              type="text"
              id="search-input" 
              name="search-input"
              placeholder='search au cities..'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete='off'
              />
          </div>
          <div className="dropdown">
            {data.filter(item => {
              let searchTerm = search;
              const fullName = item.city.toLowerCase();
              return searchTerm && fullName.includes(searchTerm)
            })
              .map((item, i) => (
                <div
                  key={i}
                  onClick={() => handleSelect(item.city, item.admin_name)}
                  className='dropdown-row'>{`${item.city}, ${item.admin_name}`}</div>
              ))}
          </div>
        </div>
        {loading ? <div className="loading">Loading...</div> : <div></div>}

        {weather.name && (
          <div className="location">
            <h2>{weather.name}</h2>
            <h3>{currentDay}</h3>
          </div>
        )}

        <div className="current">
          {weather.main && (
            <div className="temp">
              <h1>{Math.round(weather.main.temp)}°C</h1>
            </div>
          )}
          {weather.weather && (
            <div className="description">
              <p id="condition">{weather.weather[0].description}</p>
              <p id="low">min: {Math.round(weather.main.temp_min)}°C</p>
              <p id="high">max: {Math.round(weather.main.temp_max)}°C</p>
            </div>
          )}
        </div>

          {forecast.map((data, i) => (
            <div className="forecast">
              <h3 key={i}>
                {new Date(data.dt * 1000).toLocaleDateString('en-AU', {weekday: 'long'})}
              </h3>
              <p key={`${i}-1`}>
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