// CURRENT WEATHER
// set de données factices
let data = {
    name : "Bordeaux",
    temperature : 29,
    weather : "Ensoleillé",
    temperature_felt : 30,
    humidity : 48,
    wind : 11,
    rain : 0.2,
}

//configuration des données principales dans bloc current-weather avec protection contre faille XSS
let weatherCard = document.createElement("div");
weatherCard.className = "weather-card";

let mainInfos = document.createElement("div");
mainInfos.className = "main-infos";
weatherCard.appendChild(mainInfos);

let mainText = document.createElement("div");
mainText.className = "main-text";
mainInfos.appendChild(mainText);

let cityName = document.createElement("p");
cityName.textContent = data["name"];
cityName.className = "city-name";
mainText.appendChild(cityName);

let mainTemp = document.createElement("p");
mainTemp.className = "main-temperature";
mainTemp.textContent = data["temperature"] +"°C";
mainText.appendChild(mainTemp);

let secondaryText = document.createElement("p");
secondaryText.className = "secondary-text";
mainText.appendChild(secondaryText);

let mainWeather = document.createElement("span");
mainWeather.className = "main-weather";
mainWeather.textContent = data["weather"];
secondaryText.appendChild(mainWeather);

let mainTemperatureFelt = document.createElement("span");
mainTemperatureFelt.className = "main-temperature-felt";
mainTemperatureFelt.textContent = "Ressenti " + " " + data["temperature_felt"] +"°C";
secondaryText.appendChild(mainTemperatureFelt);

let mainIcon = document.createElement("img");
mainIcon.className = "main-icon";
mainIcon.src = "assets/icons/animated/sunny-animated.svg";
mainIcon.alt = data["weather"];
mainInfos.appendChild(mainIcon);

//configuration des données secondaires dans bloc current-weather avec protection contre faille XSS
let secondaryInfos = document.createElement("div");
secondaryInfos.className = "secondary-infos";
weatherCard.appendChild(secondaryInfos);

let mainHumidity = document.createElement("span");
mainHumidity.className  = "main-humidity";
secondaryInfos.appendChild(mainHumidity);

// découpage de chaque section en plusieurs spans afin de gérer les très petits écrans
let humidityLabel = document.createElement("span");
humidityLabel.className = "label";
humidityLabel.textContent = "Humidité: ";
mainHumidity.appendChild(humidityLabel);

let humidityValue = document.createElement("span");
humidityValue.className = "value";
humidityValue.textContent = data["humidity"] + " %";
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
windValue.textContent = data["wind"] + " km/h";
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

// insertion des données
let target = document.querySelector(".current-weather");
target.appendChild(weatherCard);

