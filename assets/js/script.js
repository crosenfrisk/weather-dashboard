var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#textfield");

// When a user types in a city in form input, API generates "Current City" on right side of screen; search also gets added to search history.

var formSubmitHandler = function (event) {
  event.preventDefault();
  // get value from input element
  var currentCityName = cityInputEl.value.trim();

  if (currentCityName) {
    getWeather(currentCityName);
    cityInputEl.value = "";
  } else if (!currentCityName === false) {
    alert("Please check the spelling of your city and try again.");
  }
};

var getWeather = function () {
  // OpenWeather API formatted to fetch any city
  var currentCityName = cityInputEl.value.trim();
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    currentCityName +
    "&units=imperial&appid=24b908f651171bcc6920a65894cdfb4a";

  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      //   console.log(data.name);
    //   console.log(data);

      var divEl = document.querySelector("#Current-City");
      var currentCityEl = document.querySelector("#update-name");
      // Take input from user to return current city from API.
      currentCityEl.textContent = data.name;

      // Display current date/time
      var currentDateEl = document.querySelector("#current-date");
      var dateObj = new Date(data.dt *1000);
      var readableDate = dateObj.toLocaleDateString();
    //   console.log(readableDate);
      currentDateEl.textContent = readableDate;

      // Take object property "temp" and display to html
      var tempEl = document.querySelector("#temp");
      tempEl.textContent = "Temperature: " + data.main.temp + " ° F";

      // Take object property "humidity" and display to html
      var humidityEl = document.querySelector("#humidity");
      humidityEl.textContent = "Humidity: " + data.main.humidity + " %";

      // Take object property "wind speed" and display to html
      var windEl = document.querySelector("#wind");
      windEl.textContent = "Wind Speed: " + data.wind.speed + " MPH";

      // Take object property "icon" and display to html
      var imgEl = document.createElement("img");
      imgEl.src =
        "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";

      var iconEl = document.querySelector("#icon");
      icon.textContent = data.weather[0].icon;

      currentCityEl.appendChild(imgEl);
      currentCityEl.appendChild(iconEl);

      // TODO: Add separate API for UV Index, then create function below for color/settings
    });
  });
};

// var fiveDayForecast = function () {
//     console.log("testing");
//   // OpenWeather API for 5 Day forecast, formatted to fetch any city
//   var currentCityName = cityInputEl.value.trim();
//   var apiFiveDay =
//     "http://api.openweathermap.org/data/2.5/forecast?q=" +
//     currentCityName +
//     "&appid=24b908f651171bcc6920a65894cdfb4a";

//   fetch(apiFiveDay).then(function (response) {
//     response.json().then(function(data) {
//       console.log(data);
//     });
//   });
// }

// fiveDayForecast();

// Use lat/lon from "weather" endpoint to "onecall" API for UV index:

// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

userFormEl.addEventListener("submit", formSubmitHandler);