import { useEffect, useState } from 'react';
import './App.css';
import searchIcon from './assets/search.png';
import clearIcon from './assets/sunny.png';
import cloudIcon from './assets/cloudy.png';
import drizzleIcon from './assets/drizzle.png';
import rainIcon from './assets/rainy-day.png';
import windIcon from './assets/wind.png';
import snowIcon from './assets/snow.png';
import humidityIcon from './assets/humidity.png';

const Detais=({icon,temp,city,country,lat,log,humidity,wind})=>{
  return(
    <>
    <div className="image">
      <img src={icon} className='icon' alt="image" />
    </div>
    <div className="temp">{temp} <sup>o</sup>C</div>
    <div className="location">{city}</div>
    <div className="country">{country}</div>
    <div className="cord">
      <div>
        <span className="lat">Latitude</span>
        <span className='lat1'>{lat}</span>
        </div>
      <div>
        <span className="log">Longiitude</span>
        <span>{log}</span>
        </div>
    </div>
    <div className="data-container">
       <div className="element">
        <img src={humidityIcon} alt="humidity" className='design'/>
        <div className="data">
          <div className="humidity-percent">{humidity}% </div>
          <div className="text">Humidity</div>
        </div>
      </div>
      <div className="element">
        <img src={windIcon} alt="humidity" className='design'/>
        <div className="data">
          <div className="wind-percent">{wind} Km/h </div>
          <div className="text">Wind Speed</div>
        </div>
      </div>
      
      
    </div>
 </>
  );
};



function App() {
  const [text,setText]=useState("Chennai");
  const [icon,setIcon]=useState(snowIcon);
  const [temp,setTemp]=useState(0);
  const [city,setCity]=useState("");
  const [country,setCountry]=useState("");
  const [lat,setLat]=useState(0);
  const [log,setLog]=useState(0);
  const [humidity,setHumidity]=useState(0);
  const [wind,setWind]=useState(0);
  const [cityNotFound,setCityNotFound]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);

  const weatherIconMap={
    "01d":clearIcon,
    "01n":clearIcon,
    "02d":cloudIcon,
    "02n":cloudIcon,
    "03d":drizzleIcon,
    "04d":drizzleIcon,
    "09d":rainIcon,
    "09n":rainIcon,
    "10d":rainIcon,
    "10n":rainIcon,
    "13d":snowIcon,
    "13n":snowIcon,
  };

  const search=async ()=>{
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=1183d7f9ae11172a09aa3ac0a01ddc58&units=Metric`;
    setLoading(true);
    try{
      let res=await fetch(url);
      let data=await res.json();
      
      if(data.cod==="404"){
        console.log("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconCode=data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);
    }catch(error){
        console.error("An error occurred:",error.message);
        setError("An error occured while fetching weather data");
    }finally{
      setLoading(false);

    }
  };

  const handleCity=(e)=>{
    setText(e.target.value);
  }
  const handleKey=(e)=>{
    if(e.key==="Enter"){
      search();
    }
  }

  useEffect(function(){
    search();
  },[]);
  
  return (
    <>
      <div className="container">
        <div className="input-container">
          <input type="text" className='cityInput' placeholder='Search City' onChange={handleCity} value={text} onKeyDown={handleKey}/>
          <div className='search-Icon' onClick={()=>search()}>
            <img  src={searchIcon} height={30} width={30} alt="Search" />
          </div>   
        </div>
        {!loading && !cityNotFound && <Detais icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind}/>}
        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>  }
        {cityNotFound && <div className="city-not-found">City not found</div>    }
      </div>
      
    </>
  );
}

export default App
