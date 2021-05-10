import React, { useEffect } from "react";

const ForecastWeatherCard = ({ data, offSet, setOpenDetailCard }) => {
  const day = new Date(data.dt * 1000);

  useEffect(() => {
    document
      .getElementsByClassName("forecast-card")
      [offSet - 1].classList.remove("fade-out");

    document
      .getElementsByClassName("forecast-card")
      [offSet - 1].classList.add("fade-in");
  }, [offSet]);

  const handleClick = () => {
    setOpenDetailCard(data);
  };
  return (
    <div className="forecast-card fade-out" onClick={() => handleClick()}>
      <div className="forecast-day-wrapper">
        <span className="forecast-day">
          {day.toString().split(" ")[0] + "."}
        </span>
      </div>
      <div className="forecast-icon-text">
        <div className="forecast-icon">
          <div className={`icon${data.weather[0].icon} forecast-icon`}></div>
        </div>
        <div className="forecast-text">{data.weather[0].main}</div>
      </div>
      <div className="forecast-max-min">
        <div className="forecast-temp">
          <span className="margin-right">Máx.</span>
          <span>{Math.round(data.temp?.max - 273.15)}º</span>
        </div>
        <div className="forecast-temp">
          <span>Min.</span>
          <span>{Math.round(data.temp?.min - 273.15)}º</span>
        </div>
      </div>
    </div>
  );
};

export default ForecastWeatherCard;
