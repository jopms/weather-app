import React, { useState } from "react";
import ForecastWeatherCard from "./ForecastWeatherCard";
import ForecastWeatherOpened from "./ForecastWeatherOpened";

const ForecastWeather = ({ data }) => {
  const [openDetailCard, setOpenDetailCard] = useState(false);

  return (
    <>
      {data.daily === undefined ? null : openDetailCard ? (
        <ForecastWeatherOpened
          setOpenDetailCard={setOpenDetailCard}
          data={openDetailCard}
        />
      ) : (
        <div className="forecast-wrapper">
          <ForecastWeatherCard
            data={data.daily[1]}
            offSet={1}
            setOpenDetailCard={setOpenDetailCard}
          />
          <ForecastWeatherCard
            data={data.daily[2]}
            offSet={2}
            setOpenDetailCard={setOpenDetailCard}
          />
          <ForecastWeatherCard
            data={data.daily[3]}
            offSet={3}
            setOpenDetailCard={setOpenDetailCard}
          />
          <ForecastWeatherCard
            data={data.daily[4]}
            offSet={4}
            setOpenDetailCard={setOpenDetailCard}
          />
          <ForecastWeatherCard
            data={data.daily[5]}
            offSet={5}
            setOpenDetailCard={setOpenDetailCard}
          />
          <ForecastWeatherCard
            data={data.daily[6]}
            offSet={6}
            setOpenDetailCard={setOpenDetailCard}
          />
          <ForecastWeatherCard
            data={data.daily[7]}
            offSet={7}
            setOpenDetailCard={setOpenDetailCard}
          />
        </div>
      )}
    </>
  );
};

export default ForecastWeather;
