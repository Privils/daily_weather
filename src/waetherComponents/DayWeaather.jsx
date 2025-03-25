import React, { useEffect, useState } from "react";
import { FaBars, FaMapMarkedAlt } from "react-icons/fa";

const DayWeaather = () => {
    const [showInput, setShowInput] = useState(false);
    const [displayData, setDisplayData] = useState(null);
    const [search, setSearch] = useState("");
    const [city, setCity] = useState("");

    const apiKey = "4691f84a324dfa4a84b310180558ee28";

    // Fetch weather data when `search` updates
    useEffect(() => {
        if (search) {
            getData(search);
        }
    }, [search]);

    const getData = async (cityName) => {
        if (!cityName) return; // Prevent empty searches
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("City not found");

            const data = await response.json();
            setDisplayData(data);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setDisplayData(null);
        }
    };

    const handleSearch = (event) => {
        event.preventDefault();
        setSearch(city);
    };

    return (
        <>
            <main>
                <section className="inside-container">
                    <div className="header">
                        <span className="country">
                            <FaMapMarkedAlt /> {displayData?.name || "Search City"}
                        </span>
                        <form action="submit" onSubmit={handleSearch}>
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
                                <span>{displayData?.main?.temp_min ?? "--"}&deg;</span>
                            </div>
                        </div>
                        <p className="info">{displayData?.weather?.[0]?.description ?? "Unknown"}</p>
                    </div>
                    <div className="cover">
                        <div className="analytics">
                            <div>
                                <span>23:00</span>
                                <span>cloudy with less rain</span>
                            </div>
                            <div>
                                <span>{displayData?.wind?.speed ?? "--"} km/h</span>
                                <span>gentle breeze</span>
                            </div>
                            <div>
                                <span>uvi {displayData?.uvi ?? "--"}</span>
                                <span>wont harm your skin</span>
                            </div>
                        </div>
                    </div>
                    <div className="subContent">
                        <h1>hourly forecast</h1>
                        <div className="hourly-focust">
                            <figure>
                                <img src="" alt="" />
                                <figcaption> 05:00 <br /> 33&deg;</figcaption>
                            </figure>

                            <figure>
                                <img src="" alt="" />
                                <figcaption> 05:00 <br /> 33&deg;</figcaption>
                            </figure>
                            <figure>
                                <img src="" alt="" />
                                <figcaption> 05:00 <br /> 33&deg;</figcaption>
                            </figure>
                            <figure>
                                <img src="" alt="" />
                                <figcaption> 05:00 <br /> 33&deg;</figcaption>
                            </figure>
                            <figure>
                                <img src="" alt="" />
                                <figcaption> 05:00 <br /> 33&deg;</figcaption>
                            </figure>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default DayWeaather;
