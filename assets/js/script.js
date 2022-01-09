var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#textfield");
var savedCities = [];

// When a user types in a city in form input, API generates "Current City" on right side of screen; search also gets added to search history.

var formSubmitHandler = function (event) {
  event.preventDefault();

  // Get value from input element
  var currentCityName = cityInputEl.value.trim();

  // Save input into savedCities array, but only if it doesn't already exist
  if (currentCityName && !savedCities.includes(currentCityName)) {
    savedCities.push(currentCityName);
    createHistory(currentCityName);
  }

  // Convert savedCities into an string for local storage
  var savedCitiesString = JSON.stringify(savedCities);

  // Save cities to local storage
  localStorage.setItem("cities", savedCitiesString);

  // // Max length to savedCities[]
  // savedCities.length = 7;

  // Set condition for max length of array. If greater than set size, remove oldest record [0]
  if (savedCities && savedCities.length > 7) {
    savedCities.shift(1);
  }

  if (currentCityName) {
    getWeather(currentCityName);
    // fiveDayForecast(currentCityName);
    cityInputEl.value = "";
  } else if (!currentCityName) {
    alert("Please check the spelling of your city and try again.");
  }
};

var getWeather = function (cityName) {
  // OpenWeather API formatted to fetch any city
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&units=imperial&appid=24b908f651171bcc6920a65894cdfb4a";

  fetch(apiUrl).then(function (response) {
    // request was successful
    if (response.ok) {
      response.json().then(function (data) {
        var divEl = document.querySelector("#Current-City");
        var currentCityEl = document.querySelector("#update-name");
        // Take input from user to return current city from API.
        currentCityEl.textContent = data.name;

        // Display current date
        var currentDateEl = document.querySelector("#current-date");
        var dateObj = new Date(data.dt * 1000);

        // Convert to JUST date, no time.
        var readableDate = dateObj.toLocaleDateString();

        // Display converted date on html
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
          "http://openweathermap.org/img/wn/" +
          data.weather[0].icon +
          "@2x.png";
        currentCityEl.appendChild(imgEl);

        // Add image description for screen readers and apply to img "description"
        imgEl.setAttribute("alt", data.weather[0].description);

        // Add API for UV Index referencing latitude and longitude from "coord" of previous API
        var lat = data.coord.lat;
        var lon = data.coord.lon;

        var additionalData =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          lat +
          "&lon=" +
          lon +
          "&units=imperial&exclude=hourly,daily&appid=24b908f651171bcc6920a65894cdfb4a";

        // Use additionalData to fetch and return data for current UV index, and display on html
        fetch(additionalData).then(function (response) {
          response.json().then(function (data) {
            // Display UV Index
            var uviEl = document.querySelector("#uvi");
            var uvIndex = data.current.uvi;
            uviEl.textContent = "UV Index: " + uvIndex;

            // Display flag of favorable, moderate or severe UV conditions
            if (uvIndex <= 3) {
              // Display color coded flag of UV Index to indicate favorable conditions
              uviEl.style.backgroundColor = "green";
            } else if (uvIndex <= 5) {
              // Display color coded flag of UV Index to indicate moderate conditions
              uviEl.style.backgroundColor = "orange";
            } else if (uvIndex > 5) {
              // Display color coded flag of UV Index to indicate severe conditions
              uviEl.style.backgroundColor = "red";
            }
          });
        });

        // OpenWeather API for 5 Day forecast, formatted to fetch any city
        var forecast =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          lat +
          "&lon=" +
          lon +
          "&units=imperial&exclude=minutely,hourly,alerts&include=daily.dt&cnt=5&appid=24b908f651171bcc6920a65894cdfb4a";

        // Use forecast to fetch and display data for 5 Day forecast on html
        fetch(forecast).then(function (response) {
          response.json().then(function (data) {
            // Display five day forecast ids for "date"

            // Day 1 Date
            var day1El = document.querySelector("#dateDay1");
            var day1Data = new Date(data.daily[1].dt * 1000);
            day1El.textContent = day1Data.toLocaleDateString();

            // Day 1 Icon
            var iconDay1imgEl = document.createElement("img");
            iconDay1imgEl.src =
              "http://openweathermap.org/img/wn/" +
              data.daily[1].weather[0].icon +
              "@2x.png";

            day1El.appendChild(iconDay1imgEl);

            // Add image description for screen readers and apply to img "description"

            var iconDay1DescriptionEl =
              document.querySelector(".descriptionDay1");
            iconDay1DescriptionEl.textContent =
              data.daily[1].weather[0].description;

            var iconDay1El = document.querySelector("#iconDay1");
            iconDay1El.textContent = data.daily[1].weather[0].icon;

            // Day 1 "temp"
            var tempDay1El = document.querySelector("#tempDay1");
            tempDay1El.textContent = "Temp: " + data.daily[1].temp.day + "° F";

            // Day 1 "wind"
            var windDay1El = document.querySelector("#windDay1");
            windDay1El.textContent =
              "Wind Speed: " + data.daily[1].wind_speed + "MPH";

            // Day 1 "humidity"
            var humidityDay1El = document.querySelector("#humidityDay1");
            humidityDay1El.textContent =
              "Humidity: " + data.daily[1].humidity + "%";

            // Day 2 Date
            var day2El = document.querySelector("#dateDay2");
            var day2Data = new Date(data.daily[2].dt * 1000);
            day2El.textContent = day2Data.toLocaleDateString();

            // Day 2 Icon
            var iconDay2imgEl = document.createElement("img");
            iconDay2imgEl.src =
              "http://openweathermap.org/img/wn/" +
              data.daily[2].weather[0].icon +
              "@2x.png";

            day2El.appendChild(iconDay2imgEl);

            // Add image description for screen readers and apply to img "description"

            var iconDay2DescriptionEl =
              document.querySelector(".descriptionDay2");
            iconDay2DescriptionEl.textContent =
              data.daily[2].weather[0].description;

            var iconDay2 = document.querySelector("#iconDay2");
            iconDay2.textContent = data.daily[2].weather[0].icon;

            // Day 2 "temp"
            var tempDay2El = document.querySelector("#tempDay2");
            tempDay2El.textContent = "Temp: " + data.daily[2].temp.day + "° F";

            // Day 2 "wind"
            var windDay2El = document.querySelector("#windDay2");
            windDay2El.textContent =
              "Wind Speed: " + data.daily[2].wind_speed + "MPH";

            // Day 2 "humidity"
            var humidityDay2El = document.querySelector("#humidityDay2");
            humidityDay2El.textContent =
              "Humidity: " + data.daily[2].humidity + "%";

            // Day 3 Date
            var day3El = document.querySelector("#dateDay3");
            var day3Data = new Date(data.daily[3].dt * 1000);
            day3El.textContent = day3Data.toLocaleDateString();

            // Day 3 Icon
            var iconDay3imgEl = document.createElement("img");
            iconDay3imgEl.src =
              "http://openweathermap.org/img/wn/" +
              data.daily[3].weather[0].icon +
              "@2x.png";

            day3El.appendChild(iconDay3imgEl);

            // Add image description for screen readers and apply to img "description"

            var iconDay3DescriptionEl =
              document.querySelector(".descriptionDay3");
            iconDay3DescriptionEl.textContent =
              data.daily[3].weather[0].description;

            var iconDay3 = document.querySelector("#iconDay3");
            iconDay3.textContent = data.daily[3].weather[0].icon;

            // Day 3 "temp"
            var tempDay3El = document.querySelector("#tempDay3");
            tempDay3El.textContent = "Temp: " + data.daily[3].temp.day + "° F";

            // Day 3 "wind"
            var windDay3El = document.querySelector("#windDay3");
            windDay3El.textContent =
              "Wind Speed: " + data.daily[3].wind_speed + "MPH";

            // Day 3 "humidity"
            var humidityDay3El = document.querySelector("#humidityDay3");
            humidityDay3El.textContent =
              "Humidity: " + data.daily[3].humidity + "%";

            // Day 4 Date
            var day4El = document.querySelector("#dateDay4");
            var day4Data = new Date(data.daily[4].dt * 1000);
            day4El.textContent = day4Data.toLocaleDateString();

            // Day 4 Icon
            var iconDay4imgEl = document.createElement("img");
            iconDay4imgEl.src =
              "http://openweathermap.org/img/wn/" +
              data.daily[4].weather[0].icon +
              "@2x.png";

            day4El.appendChild(iconDay4imgEl);

            // Add image description for screen readers and apply to img "description"

            var iconDay4DescriptionEl =
              document.querySelector(".descriptionDay4");
            iconDay4DescriptionEl.textContent =
              data.daily[4].weather[0].description;

            var iconDay4 = document.querySelector("#iconDay4");
            iconDay4.textContent = data.daily[4].weather[0].icon;

            // Day 4 "temp"
            var tempDay4El = document.querySelector("#tempDay4");
            tempDay4El.textContent = "Temp: " + data.daily[4].temp.day + "° F";

            // Day 4 "wind"
            var windDay4El = document.querySelector("#windDay4");
            windDay4El.textContent =
              "Wind Speed: " + data.daily[4].wind_speed + "MPH";

            // Day 4 "humidity"
            var humidityDay4El = document.querySelector("#humidityDay4");
            humidityDay4El.textContent =
              "Humidity: " + data.daily[4].humidity + "%";

            // Day 5 Date
            var day5El = document.querySelector("#dateDay5");
            var day5Data = new Date(data.daily[5].dt * 1000);
            day5El.textContent = day5Data.toLocaleDateString();

            // Day 5 Icon
            var iconDay5imgEl = document.createElement("img");
            iconDay5imgEl.src =
              "http://openweathermap.org/img/wn/" +
              data.daily[5].weather[0].icon +
              "@2x.png";

            day5El.appendChild(iconDay5imgEl);

            // Add image description for screen readers and apply to img "description"

            var iconDay5DescriptionEl =
              document.querySelector(".descriptionDay5");
            iconDay5DescriptionEl.textContent =
              data.daily[5].weather[0].description;

            var iconDay5 = document.querySelector("#iconDay5");
            iconDay5.textContent = data.daily[5].weather[0].icon;

            // Day 5 "temp"
            var tempDay5El = document.querySelector("#tempDay5");
            tempDay5El.textContent = "Temp: " + data.daily[5].temp.day + "° F";

            // Day 5 "wind"
            var windDay5El = document.querySelector("#windDay5");
            windDay5El.textContent =
              "Wind Speed: " + data.daily[5].wind_speed + "MPH";

            // Day 5 "humidity"
            var humidityDay5El = document.querySelector("#humidityDay5");
            humidityDay5El.textContent =
              "Humidity: " + data.daily[5].humidity + "%";
          });
        });
      });
      // .catch(function (error) {
      //   // from initial API fetch
      //   alert(error.message);
      // });
    }
  });
};

var createHistory = function (currentCityName) {
  var searchHistoryEl = document.querySelector("#Search-History");

  var createButtonEl = document.createElement("button");

  createButtonEl.className = "button";
  createButtonEl.textContent = currentCityName;

  searchHistoryEl.appendChild(createButtonEl);

  // Event listener for each button created
  createButtonEl.addEventListener("click", function(){
    // Reset input value if filled
    cityInputEl.value = "";
    cityInputEl.setAttribute("placeholder", currentCityName);
    // When city button is clicked
    getWeather(currentCityName);
  })
};

var loadSavedItems = function (cityName) {
  savedCities = JSON.parse(localStorage.getItem("cities"));

  if (savedCities) {
    for (var i = 0; i < savedCities.length; i++) {
      createHistory(savedCities[i]);
    }
    getWeather(savedCities[savedCities.length - 1]);
  } else {
    savedCities = [];
  }
};

loadSavedItems();


userFormEl.addEventListener("submit", formSubmitHandler);