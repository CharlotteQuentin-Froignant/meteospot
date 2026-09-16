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

//insertion des données principales dans bloc current-weather avec protection contre faille XSS
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
mainTemperatureFelt.textContent = "ressenti" + " " + data["temperature_felt"] +"°C";
secondaryText.appendChild(mainTemperatureFelt);

let mainIcon = document.createElement("img");
mainIcon.className = "main-icon";
mainIcon.src = "assets/icons/animated/sunny-animated.svg";
mainIcon.alt = data["weather"];
mainInfos.appendChild(mainIcon);

//insertion des données secondaires dans bloc current-weather avec protection contre faille XSS
let secondaryInfos = document.createElement("div");
secondaryInfos.className = "secondary-infos";
weatherCard.appendChild(secondaryInfos);

let mainHumidity = document.createElement("span");
mainHumidity.className = "main-humidity";
mainHumidity.textContent = "Humidité:" + " " + data["humidity"] + " %";
secondaryInfos.appendChild(mainHumidity);

let mainWind = document.createElement("span");
mainWind.className = "main-wind";
mainWind.textContent = "Vent:" + " " + data["wind"] + " km/h";
secondaryInfos.appendChild(mainWind);

let mainRain = document.createElement("span");
mainRain.className = "main-rain";
mainRain.textContent = "Précipitations:" + " " + data["rain"] + " mm";
secondaryInfos.appendChild(mainRain);

let target = document.querySelector(".current-weather");
target.appendChild(weatherCard);