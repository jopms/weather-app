import React, { useState, useEffect } from "react";
import axios from "axios";

import CurrentWeather from "./CurrentWeather";
import ForecastWeather from "./ForecastWeather/ForecastWeather";
import SavedLocations from "./SavedLocations/SavedLocations";

const App = () => {
  const API_KEY = "5e5765a835fd5c6a2e13ed922a1a6f46";

  const [coords, setCoords] = useState({});
  const [data, setData] = useState({});
  const [savedLocations, setSavedLocations] = useState([]);
  const [forecastData, setForecastData] = useState({});

  const time = new Date().getHours();

  useEffect(() => {
    if (time <= 20) {
      document
        .getElementsByClassName("center-div")[0]
        .classList.remove("background-blue");
      document
        .getElementsByClassName("center-div")[0]
        .classList.add("background-dark-blue");
    }

    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        successPosition,
        failurePosition
      );
    } else {
      alert("Your browser doesn't support geolocation! Location set to Leiria");
      setCoords({ latitude: 39.74362, longitude: -8.80705 });
    }

    if (localStorage.getItem("location")) {
      setSavedLocations(JSON.parse(localStorage.getItem("location")));
    }
  }, [time]);

  useEffect(() => {
    if (Object.keys(coords).length !== 0) {
      axios
        .get(
          //`https://api.openweathermap.org/data/2.5/find?lat=${coords.latitude}&lon=${coords.longitude}&cnt=10&appid=${API_KEY}`
          `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}`
          //`https://api.openweathermap.org/data/2.5/onecall?lat=${coords.latitude}&lon=${coords.longitude}&exclude=""&appid=${API_KEY}`
        )
        .then(({ data }) => {
          setData(data);
        });

      axios
        .get(
          //`https://api.openweathermap.org/data/2.5/find?lat=${coords.latitude}&lon=${coords.longitude}&cnt=10&appid=${API_KEY}`
          //`https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}`
          `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.latitude}&lon=${coords.longitude}&exclude=minutely,hourly&appid=${API_KEY}`
        )
        .then(({ data }) => {
          setForecastData(data);
        });
    }
  }, [coords]);

  const successPosition = ({ coords }) => {
    setCoords({ latitude: coords.latitude, longitude: coords.longitude });
  };

  const failurePosition = ({ message }) => {
    alert(message + ". Location set to Leiria!");
    setCoords({ latitude: 39.74362, longitude: -8.80705 });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (searchByLocation(e.target.value.trim())) {
        e.target.value = "";
      }
    }
  };

  const searchByLocation = (location, save) => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`
      )
      .then(({ data }) => {
        setData(data);
        document.getElementById("search-bar").value = "";
        if (save) {
          saveLocation(data);
        }
        axios
          .get(
            //`https://api.openweathermap.org/data/2.5/find?lat=${coords.latitude}&lon=${coords.longitude}&cnt=10&appid=${API_KEY}`
            //`https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}`
            `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely,hourly&appid=${API_KEY}`
          )
          .then(({ data }) => {
            setForecastData(data);
          });
      });
  };

  const handleClickSave = () => {
    if (document.getElementById("search-bar").value !== "") {
      searchByLocation(document.getElementById("search-bar").value, true);
      return;
    }
    saveLocation(data);
  };

  const saveLocation = (data) => {
    if (savedLocations.length > 0) {
      if (
        !savedLocations.some(
          (location) =>
            location.city === data.name && location.country === data.sys.country
        )
      ) {
        setSavedLocations([
          ...savedLocations,
          { city: data.name, country: data.sys.country },
        ]);
        localStorage.setItem(
          "location",
          JSON.stringify([
            ...savedLocations,
            { city: data.name, country: data.sys.country },
          ])
        );
      }
    } else {
      setSavedLocations([{ city: data.name, country: data.sys.country }]);
      localStorage.setItem(
        "location",
        JSON.stringify([{ city: data.name, country: data.sys.country }])
      );
    }
  };

  const deleteLocation = (locationToDelete) => {
    const updatedList = savedLocations.filter((location) => {
      return (
        location.city !== locationToDelete.city ||
        location.country !== locationToDelete.country
      );
    });
    setSavedLocations(updatedList);
    localStorage.setItem("location", JSON.stringify([...updatedList]));
  };

  const openLocation = (locationToOpen) => {
    searchByLocation(`${locationToOpen.city},${locationToOpen.country}`);
  };

  return (
    <>
      {Object.keys(data).length > 0 ? (
        <div className="center-div background-blue">
          <div className="middle-div">
            <CurrentWeather data={data} />
            <div className="search-bar">
              <input
                id="search-bar"
                type="text"
                onKeyUp={(e) => {
                  handleKeyPress(e);
                }}
                placeholder={
                  Object.keys(data).length > 0
                    ? `${data?.name} , ${data?.sys?.country}`
                    : "Search new location..."
                }
              />
              <button
                onClick={() => {
                  handleClickSave();
                }}
                className="button-save"
              >
                {" "}
                Save Location
              </button>
            </div>
            <div className="saved-locations-wrap-wrap">
              <div className="saved-locations-centered">
                <div className="saved-locations-wrap">
                  {savedLocations.length > 0 ? (
                    <SavedLocations
                      data={savedLocations}
                      deleteLocation={deleteLocation}
                      openLocation={openLocation}
                    />
                  ) : (
                    <div className="blank"></div>
                  )}
                </div>
              </div>
              <hr className="divider" />
            </div>
            <ForecastWeather data={forecastData} />
          </div>
        </div>
      ) : (
        <div className="center-div background-blue">
          <div className="ui active inverted loader large"></div>
        </div>
      )}
    </>
  );
};

export default App;
