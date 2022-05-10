let currentCity = "Vancouver";
let units = "metric";
let apiKey = "aeb2b3f4a790f66fe13d4f5b8325028b";
let apiWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}`;
let apiForecastUrl = `https://api.openweathermap.org/data/2.5/onecall?appid=${apiKey}`;

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

  let cityElement = document.querySelector("#current-city");
  cityElement.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  let temperatureElement = document.querySelector("#current-temperature");
  temperatureElement.innerHTML = `${Math.round(
    response.data.main.temp
  )}˚${unitTemp}`;
  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = response.data.weather[0].description;
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.main.humidity;
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = `${Math.round(
    response.data.wind.speed
  )} ${unitSpeed}`;

  document.getElementById(
    "current-forecast"
  ).src = `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;

  getForecast(response.data.coord.lat, response.data.coord.lon);
}

function updateForecast(response) {
  const forecasts = response.data.daily;
  const dailyForecasts = document.querySelectorAll(".day");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  dailyForecasts.forEach(function (day, idx) {
    const forecast = forecasts[idx + 1];
    const date = new Date(forecast.dt * 1000);
    const tempHigh = Math.round(forecast.temp.max);
    const tempLow = Math.round(forecast.temp.min);
    const icon = forecast.weather[0].icon;
    const weatherDesc = forecast.weather[0].description;

    day.querySelector("h3").innerHTML = days[date.getDay()];
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

let currentDay = new Date();
let currentDayFormatted = new Intl.DateTimeFormat("default", {
  hour12: true,
  hour: "numeric",
  minute: "numeric",
})
  .format(currentDay)
  .toLowerCase();

let currentDayTime = document.querySelector("#current-day-time");

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[currentDay.getDay()];
currentDayTime.innerHTML = `${day}, ${currentDayFormatted}`;

let currentDateNow = new Date();

let currentDate = document.querySelector("#current-date");

let newDate = currentDateNow.getDate();
let newYear = currentDateNow.getFullYear();

let months = [
  "January",
  "Febreuary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let newMonth = months[currentDateNow.getMonth()];

currentDate.innerHTML = `${newMonth} ${newDate}, ${newYear}`;

const localCities = document.querySelectorAll(".local-city");
localCities.forEach(function (city) {
  city.addEventListener("click", function (event) {
    event.preventDefault();
    currentCity = event.target.innerText;
    getWeatherByCity();
  });
});

getWeatherByCity();
