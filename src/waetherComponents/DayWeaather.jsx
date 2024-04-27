import React, { useEffect, useState } from 'react';
import clear_icon from '../waetherComponents/images/sun.png';
import cloud_icon from '../waetherComponents/images/cloudy.png';
import drizzle_icon from '../waetherComponents/images/drizzle.png';
import rain_icon from '../waetherComponents/images/rain.png';
import snow_icon from '../waetherComponents/images/snow.png';


const DayWeaather = () => {
    const [weatherData, setWeatherData] = useState({
        dailyForecasts: []
    });

    useEffect(() => {
        search('tokyo');
    }, []);

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const search = async (searchValue) => {
        const apiKey = process.env.REACT_APP_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&units=metric&appid=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            if (data.cod === '200') {
                setWeatherData({
                    location: data.city.name,
                    dailyForecasts: data.list.filter(item => item.dt_txt.includes('12:00:00')).map(item => ({
                        day: new Date(item.dt * 1000).getDay(),
                        temperature: Math.round(item.main.temp),
                        weatherIcon: getWeatherIcon(item.weather[0].icon)
                    }))
                });
            } else {
                console.error('Error fetching weather data:', data.message);
                setWeatherData({
                    location: 'City not found',
                    dailyForecasts: []
                });
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    const getWeatherIcon = (iconCode) => {
        switch (iconCode) {
            case '01d':
            case '01n':
                return clear_icon;
            case '02d':
            case '02n':
                return cloud_icon;
            case '03d':
            case '03n':
                return drizzle_icon;
            case '04d':
            case '04n':
                return drizzle_icon;
            case '09d':
            case '09n':
                return rain_icon;
            case '10d':
            case '10n':
                return rain_icon;
            case '13d':
            case '13n':
                return snow_icon;
            default:
                return clear_icon; 
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const searchValue = e.target.elements.input.value;
        search(searchValue);
    };

    const renderForecastForDay = (dayIndex) => {
        const forecast = weatherData.dailyForecasts.find(forecast => forecast.day === dayIndex);
        if (forecast) {
            return (
                <div className="weather" key={dayIndex}>
                    <div className="Tempweather">
                        <span className="time">{daysOfWeek[dayIndex]}</span>
                        <div className="bottomImage">
                            <img src={forecast.weatherIcon} alt="Weather Icon" className='iconImage' />
                        </div>
                        <span className="lowerTemp">{forecast.temperature}°C</span>
                    </div>
                </div>
            );
        }
        return null;
    };

  return (
  <>
     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
            <section className="mainSection">
                <form id="form" onSubmit={handleSearch}>
                    <input className="input" type="text" placeholder="Please enter country name" name="input" />
                    <button type="submit"><i className="fas fa-search"></i></button>
                </form>
                <div className="daysContainer">
                    {daysOfWeek.map((day, index) => (
                        <div className="days" key={index}>{day}</div>
                    ))}
                </div>
                <div className="initialContainer">
                    <h1 className="Town weather-location">{weatherData.location}</h1>
                    <div className="bottomContent">
                        <div className="moreWeather">
                            {daysOfWeek.map((day, index) => renderForecastForDay(index))}
                        </div>
                    </div>
                </div>
            </section>
  </>
  )
}

export default DayWeaather
