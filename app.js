//VARIABLES
var apiKey = "5b385d5da06a23422c5587a9802957fa";
const conv = 273; // Necessary value to convert Kelvin to Celsius ()


//FUNCTIONS
/* Gets latitude and longitude if user permits the use of 'Geolocation' in browser*/
function success(pos) {
    getCurrentWeatherGeo(pos.coords.latitude, pos.coords.longitude); //Gets actual location and current weather
    getForecastWeather(pos.coords.latitude, pos.coords.longitude); //Gets forecast weather
}

/* Shows a pop-up when user does not permit the use of 'Geolocation' in broswer.
Also sets the default user location to Leiria when location is not avaiable. Leiria coords: [39.74362 ; -8.80705] */
function error(err) {
    let latitude = 39.74362;
    let longitude = -8.80705;
    alert(
        "The user does not allow the use of Geolocation. Location is now set to: Leiria"
    );
    getCurrentWeatherGeo(latitude, longitude);
    getForecastWeather(latitude, longitude);
}

/* Changes HTML document and updates it to get current weather info */
function updatesWeatherHTML(data) {
    document.getElementById("city").innerHTML = data.name;
    document.getElementById("country").innerHTML = data.sys.country;
    document.getElementById("temperature").innerHTML = (data.main.temp - conv).toFixed(0) + "<b>°<sup>c</sup></b>";
    document.getElementById("description").innerHTML = data.weather[0].description;
    document.querySelector(".current-icon").innerHTML = `<img src="icons/${data.weather[0].icon}.png" alt="Current weather icon">`;
    document.getElementById("search").value = data.name + "," + data.sys.country; // Turns the web experience more user friendly by changing every input of search bar to the correct form: City, Country
}

/* Gets current weather condition using GeoLocation latitude and longitude coords, updates information on display */
function getCurrentWeatherGeo(latitude, longitude) {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            updatesWeatherHTML(data);
        });

}

/* Gets current weather (including forecast) depending on the user's input location */
function getCurrentWeatherLocation(location) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            let latitude = data.coord.lat;
            let longitude = data.coord.lon;
            let info = [];
            info.push(data);
            localStorage.setItem("current", JSON.stringify(info)); // Updates 'current' variable in local storage
            getForecastWeather(latitude, longitude); // Gets forecast info and updates the webpage to display forecast weather
            updatesWeatherHTML(data); //Changes HTML document and updates it to get current weather info
        });
}

/* Gets current weather (including forecast) depending on the user's input location */
function getCurrentWeatherLocationAddBut(location) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            let latitude = data.coord.lat;
            let longitude = data.coord.lon;
            let info1 = [];
            let info2 = [];
            info1.push(data); // Adds 'data' into 'info1' array
            localStorage.setItem("current", JSON.stringify(info1)); // Updates 'current' variable in local storage
            updatesWeatherHTML(data);
            getForecastWeather(latitude, longitude);// Gets forecast info and updates the webpage to display forecast weather
            /*Changes HTML document and updates it to get current weather info*/
            let CityCountry = data.name + "," + data.sys.country
            if (!document.getElementById(CityCountry)) { //Condition so that same city button doesnt get created twice
                info2.push(data);
                localStorage.setItem(CityCountry, JSON.stringify(info2)); // Creates new variable under the name of 'CityCountry' value, or overwrites/updates 'CityCountry' if already exists
                document.body.onload = addElement(CityCountry);
            }
        });
}

/* Gets the location input from user*/
function search(ele) {
    if (event.key === "Enter") { // Waits for 'Enter' key pressed to get current weather location
        let location = ele.value;
        getCurrentWeatherLocation(location);
    }
}

/* Gets forecast weather condition within the next 7 days using latitude and longitude coords */
function getForecastWeather(latitude, longitude) {
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&appid=${apiKey}`;
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            updateForecast(data);
        });
}

/* Updates weather forecast on display */
function updateForecast(data) {
    for (i = 1; i < 8; i++) {
        d = new Date(data.daily[i].dt * 1000); //+1 Day Gets current day from API data 
        let dayName = d.toString().split(" ")[0]; // Takes only the day of week to display it 
        document.getElementById("d" + i).innerHTML = dayName + "."; // Displays day of week 
        document.querySelector(".img-day" + i).innerHTML = `<img src="icons/${data.daily[i].weather[0].icon}.png" alt="Forecast weather icon">`;// Changes forecast icon
        
        document.getElementById("min-max-" + i).innerHTML = (data.daily[i].temp.min - conv).toFixed(0) + "<b>°<sup>c</sup></b>" + " | " + (data.daily[i].temp.max - conv).toFixed(0) + "<b>°<sup>c</sup></b>"; // Displays temp max and min of each day 
    }
}

/* Creates new button when adding a city to list */
function addElement(name) {
    let newBut = document.createElement("button"); // City button
    newBut.setAttribute("id", name);
    newBut.setAttribute("class", "city-button");
    newBut.setAttribute("onclick", `getCurrentWeatherLocation("${name}")`);

    let newDelBut = document.createElement("button"); //Delete button
    newDelBut.setAttribute("id", "del" + name);
    newDelBut.setAttribute("class", "delete-button");
    newDelBut.setAttribute("onclick", `deleteCity("${name}")`);

    let newContentBut = document.createTextNode(name); // Text to display on city button
    let newContentDelBut = document.createTextNode("x"); // Text to display on delete button

    newBut.appendChild(newContentBut); // Adds the text node to the newly created city button
    newDelBut.appendChild(newContentDelBut); // Adds the text node to the newly created delete button

    document.getElementById("lt").appendChild(newBut); // Adds the newly created button inside 'lt' id.
    document.getElementById("lt").appendChild(newDelBut); // Adds the newly created button inside 'lt' id.
}

/* Creates new HTML div for city when clicking the "+" button  
Also stores data in local storage*/
function addCityToList() {
    let info = [];
    let citycountry = document.getElementById("search").value;

    if (citycountry === "") { // Condition if search bar is empty - if empty save in list the current location
        let locationVar = localStorage.getItem("current");
        let locationName = JSON.parse(locationVar);
        let CityCountry = locationName[0].name + "," + locationName[0].sys.country
        getCurrentWeatherLocationAddBut(CityCountry);
    }
    else {
        getCurrentWeatherLocationAddBut(citycountry);
    }
}

// Deletes HTML city button and del button when clicking the "x" button
function deleteCity(city) {
    localStorage.removeItem(city); // Removes city from local storage
    let myButton = document.getElementById(city);
    let myButtonDel = document.getElementById("del" + city); // Selects delete button to delete
    myButton.remove(); //Removes city button
    myButtonDel.remove(); //Removes delete button
}

//Updates city list when browser is restarted
function updateList() {
    keys = Object.keys(localStorage); //Selects every element in local storage
    i = keys.length; // Gets the number of elements that are in local storage

    while (i--) {
        if (keys[i] !== "current") { //This condition so that 'current' data doesn't get displayed
            addElement(keys[i]);
        }
    }
}


navigator.geolocation.getCurrentPosition(success, error);
updateList();