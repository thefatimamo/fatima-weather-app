let currentCity = "Vancouver";
let units = "metric";
let apiKey = "aeb2b3f4a790f66fe13d4f5b8325028b";
let apiWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}`;
let apiForecastUrl = `https://api.openweathermap.org/data/2.5/onecall?appid=${apiKey}`;

let daysAbbr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getWeatherByCity() {
  axios
    .get(`${apiWeatherUrl}&units=${units}&q=${currentCity}`)
    .then(updateCity);
}

function getWeatherByGeo(lat, lon) {
  axios
    .get(`${apiWeatherUrl}&units=${units}&lat=${lat}&lon=${lon}`)
    .then(updateCity);
}

function getForecast(lat, lon) {
  axios
    .get(
      `${apiForecastUrl}&lat=${lat}&lon=${lon}&units=${units}&exclude=current,minutely,hourly,alerts`
    )
    .then(updateForecast);
}

function updateCity(response) {
  let unitTemp = "C";
  let unitSpeed = "km/h";

  if (units === "metric") {
    unitMetric.classList.add("fw-bold");
    unitImperial.classList.remove("fw-bold");
  } else {
    unitTemp = "F";
    unitSpeed = "mph";
    unitMetric.classList.remove("fw-bold");
    unitImperial.classList.add("fw-bold");
  }

  let dateTime = moment(new Date()).utc().add(response.data.timezone, "s");

  let currentDayTimeElement = document.querySelector("#current-day-time");
  currentDayTimeElement.innerHTML = dateTime.format("dddd, h:mm a");

  let currentDate = document.querySelector("#current-date");
  currentDate.innerHTML = dateTime.format("MMMM D, YYYY");

  let cityElement = document.querySelector("#current-city");
  cityElement.innerHTML = `${response.data.name}, ${response.data.sys.country}`;

  let temperatureElement = document.querySelector("#current-temperature");
  temperatureElement.innerHTML = `${Math.round(
    response.data.main.temp
  )}˚${unitTemp}`;

  let descriptionElement = document.querySelector("#current-description");
  descriptionElement.innerHTML = response.data.weather[0].description;

  let highElement = document.querySelector("#current-high");
  highElement.innerHTML = Math.round(response.data.main.temp_max);

  let lowElement = document.querySelector("#current-low");
  lowElement.innerHTML = Math.round(response.data.main.temp_min);

  let feelsLikeElement = document.querySelector("#current-feels-like");
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like);

  let humidityElement = document.querySelector("#current-humidity");
  humidityElement.innerHTML = response.data.main.humidity;

  let windElement = document.querySelector("#current-wind");
  windElement.innerHTML = `${Math.round(
    response.data.wind.speed
  )} ${unitSpeed}`;

  document.getElementById(
    "current-forecast"
  ).src = `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;

  getForecast(response.data.coord.lat, response.data.coord.lon);
}

function updateForecast(response) {
  let forecasts = response.data.daily;
  let dailyForecasts = document.querySelectorAll(".day");

  dailyForecasts.forEach(function (day, idx) {
    let forecast = forecasts[idx + 1];
    let date = new Date(forecast.dt * 1000);
    let tempHigh = Math.round(forecast.temp.max);
    let tempLow = Math.round(forecast.temp.min);
    let icon = forecast.weather[0].icon;
    let weatherDesc = forecast.weather[0].description;

    day.querySelector("h3").innerHTML = daysAbbr[date.getDay()];
    day.querySelector(
      ".date"
    ).innerHTML = `${date.getMonth()}/${date.getDate()}`;
    day.querySelector(".temp").innerHTML = `${tempHigh}˚/${tempLow}˚`;
    day.querySelector(
      ".icon"
    ).src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    day.querySelector(".icon").alt = weatherDesc;
    day.querySelector(".icon").title = weatherDesc;
  });
}

function changeUnits(value) {
  units = value;
  getWeatherByCity();
}

let unitMetric = document.querySelector("#unit-metric");
unitMetric.addEventListener("click", function (event) {
  event.preventDefault();
  changeUnits("metric");
});

let unitImperial = document.querySelector("#unit-imperial");
unitImperial.addEventListener("click", function (event) {
  event.preventDefault();
  changeUnits("imperial");
});

function onSearch(event) {
  event.preventDefault();

  currentCity = document.querySelector("#search-input").value;
  getWeatherByCity();
}

let search = document.querySelector("#btn-search");
search.addEventListener("click", onSearch);

function onCurrent(event) {
  event.preventDefault();

  navigator.geolocation.getCurrentPosition(function (position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    getWeatherByGeo(lat, lon);
  });
}

let currentLocation = document.querySelector("#btn-current");
currentLocation.addEventListener("click", onCurrent);

let localCities = document.querySelectorAll(".local-city");
localCities.forEach(function (city) {
  city.addEventListener("click", function (event) {
    event.preventDefault();
    currentCity = event.target.innerText;
    getWeatherByCity();
  });
});

getWeatherByCity();
