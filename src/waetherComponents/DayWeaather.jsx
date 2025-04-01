import React, { useEffect, useState } from "react";
import { FaBars, FaMapMarkedAlt } from "react-icons/fa";

const DayWeather = () => {
    const [showInput, setShowInput] = useState(false);
    const [displayData, setDisplayData] = useState(null);
    const [search, setSearch] = useState("cape town");
    const [city, setCity] = useState("");
    const [weeklyData, setWeeklyData] = useState([]);

    const apiKey = process.env.REACT_APP_API_KEY;

    // Fetching the  weather data when `search` updates
    useEffect(() => {
        if (search) {
            getData(search);
            getWeeklyData(search);
        }
    }, [search]);

    const getData = async (cityName) => {
        if (!cityName) return;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("City not found");

            const data = await response.json();
            setDisplayData(data);
            console.log("Current weather data:", data);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setDisplayData(null);
        }
    };

    const handleSearch = (event) => {
        event.preventDefault();
        setSearch(city);
    };

    const getWeeklyData = async (city) => {
        try {
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
            const geoRes = await fetch(geoUrl);
            const geoData = await geoRes.json();
    
            console.log("GeoData Response:", geoData); 
    
            if (!geoData || geoData.length === 0) {
                console.error("City not found in geolocation API response.");
                setWeeklyData([]);
                return;
            }
    
            const { lat, lon } = geoData[0];
    
            // Fetching data for a 5-day, 3-hour forecast
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
            const res = await fetch(url);
            const data = await res.json();
    
            console.log("Weekly Weather Data:", data);
    
            if (!data.list || !Array.isArray(data.list)) {
                console.error("No valid forecast data:", data);
                setWeeklyData([]);
                return;
            }
    
            // Extracting one forecast per day (preferably at 12:00 PM)
            const dailyData = data.list.filter((entry) => entry.dt_txt.includes("12:00:00"));
    
            setWeeklyData(dailyData);
        } catch (error) {
            console.error("Error fetching weekly data:", error);
            setWeeklyData([]);
        }
    };
    





    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const getDayOfWeek = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return daysOfWeek[date.getDay()];
    };

    return (
        <>
            <main>
                <section className="inside-container">
                    <div className="header">
                        <span className="country">
                            <FaMapMarkedAlt /> {displayData?.name || "Search City"}
                        </span>
                        <form onSubmit={handleSearch}>
                            {showInput && (
                                <input
                                    type="text"
                                    placeholder="Search location"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                />
                            )}
                            <FaBars
                                onClick={() => setShowInput(!showInput)}
                                style={{ cursor: "pointer" }}
                                className="bars"
                            />
                        </form>
                    </div>
                    <div className="container">
                        <div className="temp">
                            <span className="month">October</span>
                            <span className="date">23</span>
                            <span className="time">15:40</span>
                            <p className="temperature">
                                {displayData?.main?.temp ?? "--"}&deg;<span>C</span>
                            </p>
                            <div className="moderate">
                                <span>{displayData?.main?.temp_max ?? "--"}&deg;</span>
                            </div>
                        </div>
                        <p className="info">{displayData?.weather?.[0]?.description ?? "Unknown"}</p>
                    </div>
                    <div className="cover">
                        <div className="analytics">
                            <div>
                                <span>{displayData?.main?.humidity ?? "--"}%</span> <br />
                                <span>Humidity</span>
                            </div>
                            <div>
                                <span>{displayData?.wind?.speed ?? "--"} km/h</span> <br />
                                <span>Wind Speed</span>
                            </div>
                            <div>
                                <span>UVI {displayData?.uvi ?? "--"}</span>
                                <span>Won't harm your skin</span>
                            </div>
                        </div>
                    </div>
                    <div className="subContent">
                        <h1>Weekly Forecast</h1>
                        <div className="weekly-forecast">
                            {weeklyData?.length > 0 ? (
                                weeklyData.map((day, index) => (
                                    <figure key={index}>
                                        <img
                                            src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                                            alt={day.weather[0].description}
                                        />
                                        <figcaption>
                                            {getDayOfWeek(day.dt)} <br />
                                            {Math.round(day.main.temp)}&deg;C
                                        </figcaption>
                                    </figure>
                                ))
                            ) : (
                                <p>Loading weekly forecast...</p>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default DayWeather;

