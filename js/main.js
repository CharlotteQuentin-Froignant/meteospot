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
let mainInfos = document.createElement("div");
mainInfos.className = "main-infos";

let cityName = document.createElement("p");
cityName.textContent = data["name"];
cityName.className = "city-name";
mainInfos.appendChild(cityName);

let mainTemp = document.createElement("p");
mainTemp.className = "main-temperature";
mainTemp.textContent = data["temperature"] +"°C";
mainInfos.appendChild(mainTemp);

let mainWeather = document.createElement("p");
mainWeather.className = "main-weather";
mainWeather.textContent = data["weather"];
mainInfos.appendChild(mainWeather);

let mainTemperatureFelt = document.createElement("p");
mainTemperatureFelt.className = "main-temperature-felt";
mainTemperatureFelt.textContent = data["temperature_felt"] +"°C";
mainInfos.appendChild(mainTemperatureFelt);

let mainIcon = document.createElement("img");
mainIcon.className = "main-icon";
mainIcon.src = "assets/icons/static/sunny.svg";
mainInfos.appendChild(mainIcon);

//insertion des données secondaires dans bloc current-weather avec protection contre faille XSS
let secondaryInfos = document.createElement("div");
secondaryInfos.className = "secondary-infos";

let mainHumidity = document.createElement("span");
mainHumidity.className = "main-humidity";
mainHumidity.textContent = data["humidity"] + "%";
secondaryInfos.appendChild(mainHumidity);

let mainWind = document.createElement("span");
mainWind.className = "main-wind";
mainWind.textContent = data["wind"] + "km/h";
secondaryInfos.appendChild(mainWind);

let mainRain = document.createElement("span");
mainRain.className = "main-rain";
mainRain.textContent = data["rain"] + "mm";
secondaryInfos.appendChild(mainRain);


let target = document.querySelector(".current-weather");
target.appendChild(mainInfos);
target.appendChild(secondaryInfos);