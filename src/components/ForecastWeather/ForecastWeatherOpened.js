import React, { useEffect } from "react";

const ForecastWeatherOpened = ({ setOpenDetailCard, data }) => {
  useEffect(() => {
    document
      .getElementsByClassName("transition-wrapper")[0]
      .classList.remove("fade-out");

    document
      .getElementsByClassName("transition-wrapper")[0]
      .classList.add("fade-in");
  }, []);
  const sunrise  = new Date(data.sunrise*1000);
  const sunset = new Date(data.sunset*1000);
  const day = new Date(data.dt* 1000);
  
  
  
  return (
    <div className="forecast-opened-wrapper">
      <div className="transition-wrapper fade-out">
        <div className="forecast-opened">
          <div className="forecast-title">
{`${day.toString().split(" ")[0]}, ${day.toString().split(" ")[2]} ${day.toString().split(" ")[1]}`}

          </div>
          <div className="forecast-body">
            <div className="forecast-info">
              <div className="forecast-left-info">
                <span>Sun Rise</span>
                <span>{sunrise.toTimeString().slice(0,5)+"H"}</span>
              </div>
              <div className="forecast-left-info">
                <span>Sun Set</span>
                <span>{sunset.toTimeString().slice(0,5)+"H"}</span>
              </div>
              <div className="forecast-left-info">
                <span>Humidity</span>
                <span>{data.humidity} [%]</span>
              </div>
              <div className="forecast-left-info">
                <span>Pressure</span>
                <span>{data.pressure} [hPa]</span>
              </div>
              <div className="forecast-left-info">
                <span>Wind Speed</span>
                <span>{Math.round(data.wind_speed)} [km/h]</span>
              </div>
            </div>
            <div>
              <hr className="card-divider" />
            </div>
            <div className="forecast-info">
              <span className="forecast-card-icon">
                <div
                  className={`icon${data.weather[0].icon} forecast-icon`}
                ></div>
              </span>
              <span className="forecast-card-description">
                {data.weather[0].description.charAt(0).toUpperCase() +
              data.weather[0].description.slice(1)}
              </span>
            </div>
          </div>
          <div>
            <i
              className="large times circle icon close-opened"
              onClick={() => {
                setOpenDetailCard(false);
              }}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastWeatherOpened;
