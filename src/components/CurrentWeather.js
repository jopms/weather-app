import React, { useState, useEffect } from "react";
import "../styles/style.css";
import "../icons/icons.css";

const CurrentWeather = ({ data }) => {
  const [timeAndDate, setTimeAndDate] = useState("");
  const [isCelcius, setIsCelcius] = useState(true);

  useEffect(() => {
    if (!timeAndDate) {
      setTimeAndDate(getTimeAndDate());
    }
    setInterval(() => {
      setTimeAndDate(getTimeAndDate());
    }, 60000);
  }, [timeAndDate]);

  const getTimeAndDate = () => {
    const date = new Date();
    const day = date.toString().split(" ")[2];
    const month = date.toString().split(" ")[1];
    const year = date.getUTCFullYear().toString().slice(2, 4);
    const time = date.toTimeString().slice(0, 5) + "H";
    const weekday = date
      .toLocaleString("en-us", { weekday: "long" })
      .slice(0, 3);
    return `${time} - ${weekday}, ${day} ${month} '${year}`;
  };

  return (
    <div className="current-weather-wrapper">
      <div>
        <h1
          className="current-temperature"
          onClick={() => {
            setIsCelcius(!isCelcius);
          }}
        >
          {isCelcius
            ? Math.round(data?.main?.temp - 273.15) + "º"
            : Math.round(((data?.main?.temp - 273.15) * 9) / 5 + 32) + "F"}
        </h1>
      </div>
      <div className="current-location-time">
        <div className="current-location">
          <h3 className="current-city">{data?.name}</h3>

          <h4 className="current-country">{data?.sys?.country}</h4>
        </div>

        <h5 className="current-time">{timeAndDate}</h5>
      </div>
      <div className="current-weather-icon-text">
        {data && data.weather ? (
          <div
            className={`icon${data.weather[0].icon} current-weather-icon`}
          ></div>
        ) : (
          ""
        )}

        <h6 className="current-weather-text">
          {data && data.weather
            ? data.weather[0].description.charAt(0).toUpperCase() +
              data.weather[0].description.slice(1)
            : ""}
        </h6>
      </div>
    </div>
  );
};

export default CurrentWeather;
