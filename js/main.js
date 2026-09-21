// APIKEY import
import {APIKEY} from "./config.js";

// === CURRENT WEATHER ===
// Request configuration
const LANG = "fr";
const UNIT = "metric";
const CITY = "Bordeaux";
let URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${APIKEY}&lang=${LANG}&units=${UNIT}`;

// Requête vers open weather map

async function current_weather_request(URL){
    try{
        const RESPONSE = await fetch(URL);
        let data = await RESPONSE.json();

        if (!RESPONSE.ok){
            console.log("Problème: ", data.message);
            return
        }

        console.log("données", data);

        // build primary DOM elements
        let weatherCard = document.createElement("div");
        weatherCard.className = "weather-card";

        let mainInfos = document.createElement("div");
        mainInfos.className = "main-infos";
        weatherCard.appendChild(mainInfos);

        let mainText = document.createElement("div");
        mainText.className = "main-text";
        mainInfos.appendChild(mainText);

        // top data configuration with XSS protection
        let cityName = document.createElement("p");
        cityName.textContent = data["name"];
        cityName.className = "city-name";
        mainText.appendChild(cityName);

        let mainTemp = document.createElement("p");
        mainTemp.className = "main-temperature";
        mainTemp.textContent = ((data["main"]["temp"]).toFixed(1)) + "°C";
        mainText.appendChild(mainTemp);

        let secondaryText = document.createElement("p");
        secondaryText.className = "secondary-text";
        mainText.appendChild(secondaryText);

        let mainWeather = document.createElement("span");
        mainWeather.className = "main-weather";
        mainWeather.textContent = data["weather"][0]["description"];
        secondaryText.appendChild(mainWeather);

        let mainTemperatureFelt = document.createElement("span");
        mainTemperatureFelt.className = "main-temperature-felt";
        mainTemperatureFelt.textContent = "Ressenti " + " " + (data["main"]["feels_like"]).toFixed(1) +"°C";
        secondaryText.appendChild(mainTemperatureFelt);

        let mainIcon = document.createElement("img");
        mainIcon.className = "main-icon";
        mainIcon.src = "assets/icons/animated/sunny-animated.svg";
        mainIcon.alt = " icone" + data["weather"][0]["description"];
        mainInfos.appendChild(mainIcon);

        // build secondary DOM elements
        let secondaryInfos = document.createElement("div");
        secondaryInfos.className = "secondary-infos";
        weatherCard.appendChild(secondaryInfos);

        // bottom data configuration with XSS protection
        // each parameter is spliced for better viewing in smallest screens
        let mainHumidity = document.createElement("span");
        mainHumidity.className  = "main-humidity";
        secondaryInfos.appendChild(mainHumidity);

        let humidityLabel = document.createElement("span");
        humidityLabel.className = "label";
        humidityLabel.textContent = "Humidité: ";
        mainHumidity.appendChild(humidityLabel);

        let humidityValue = document.createElement("span");
        humidityValue.className = "value";
        humidityValue.textContent = data["main"]["humidity"] + " %";
        mainHumidity.appendChild(humidityValue);

        let mainWind = document.createElement("span");
        mainWind.className = "main-wind";
        secondaryInfos.appendChild(mainWind);

        let windLabel = document.createElement("span");
        windLabel.className = "label";
        windLabel.textContent = "Vent: ";
        mainWind.appendChild(windLabel);

        let windValue = document.createElement("span");
        windValue.className = "value";
        let windSpeed = (data["wind"]["speed"])*3.6;
        windValue.textContent = (windSpeed).toFixed(1) + " km/h";
        mainWind.appendChild(windValue);

        let mainRain = document.createElement("span");
        mainRain.className = "main-rain";
        secondaryInfos.appendChild(mainRain);

        let rainLabel = document.createElement("span");
        rainLabel.className = "label";
        rainLabel.textContent = "Précipitations: ";
        mainRain.appendChild(rainLabel);

        let rainValue = document.createElement("span");
        rainValue.className = "value";
        rainValue.textContent = data["rain"] + " mm";
        mainRain.appendChild(rainValue);

        // data insertion
        let target = document.querySelector(".current-weather");
        target.appendChild(weatherCard);

    } catch(error){
        console.log(error);
    }
};

current_weather_request(URL);


// === HOURLY FORECAST ===
// set de données factices

let forecastTable = [
    {
        "time" : "10",
        "weather-icon" :"assets/icons/static/sunny.svg",
        "temperature" : "28",
    },
    {
        "time" : "13",
        "weather-icon" :"assets/icons/static/sunny.svg",
        "temperature" : "30",
    },
    {
        "time" : "16",
        "weather-icon" :"assets/icons/static/cloudy.svg",
        "temperature" : "31",
    },
    {
        "time" : "19",
        "weather-icon" :"assets/icons/static/partly-cloudy-day.svg",
        "temperature" : "29",
    },
    {
        "time" : "22",
        "weather-icon" :"assets/icons/static/partly-cloudy-night.svg",
        "temperature" : "27",
    },
]

let hourlyForecastCard = document.createElement("div");
hourlyForecastCard.className = "hourly-forecast-card";

for (let item in forecastTable){

    let hour = document.createElement("div");
    hour.className = "hour";
    hourlyForecastCard.appendChild(hour);

    let hourlyTime = document.createElement("p");
    hourlyTime.className = "hourly-time";
    hourlyTime.textContent = forecastTable[item]["time"] + "h";
    hour.appendChild(hourlyTime);

    let hourlyIcon = document.createElement("img");
    hourlyIcon.className = "hourly-icon";
    hourlyIcon.src = forecastTable[item]["weather-icon"];
    hourlyIcon.alt = "weather-icon";
    hour.appendChild(hourlyIcon);

    let hourlyTemperature = document.createElement("p");
    hourlyTemperature.className = "hourly-temperature";
    hourlyTemperature.textContent = forecastTable[item]["temperature"] + "°C";
    hour.appendChild(hourlyTemperature);
};

let targetHours = document.querySelector(".hourly-forecast h2");
targetHours.parentNode.insertBefore(hourlyForecastCard, targetHours.nextSibling);
