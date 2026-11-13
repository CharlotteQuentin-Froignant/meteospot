import {getIconLabel, getIcon, getStaticIcon, applyTempPalette, getHoursOnly, groupNextDays} from "../utils.js";
import { clearCard } from "./clear.js";
import {renderSolarBow} from "./solar-bow.js";

// === METEO ACTUELLE ===
export function renderCurrentWeather(data) {
    // configuration des éléments à injecter dans le DOM
    let weatherCard = document.createElement("div");
    weatherCard.className = "weather-card";

    renderSolarBow(data, weatherCard);
    // partie données principales
    let mainInfos = document.createElement("div");
    mainInfos.className = "main-infos";
    weatherCard.appendChild(mainInfos);

    let mainText = document.createElement("div");
    mainText.className = "main-text";
    mainInfos.appendChild(mainText);

    // configuration des données à récupérer et à insérer avec protection contre failles XSS
    let cityName = document.createElement("h2");
    cityName.textContent = data["name"];
    cityName.className = "city-name";
    mainText.appendChild(cityName);

    let mainTemp = document.createElement("p");
    mainTemp.className = "main-temperature";
    mainTemp.textContent = Math.round((data["main"]["temp"])) + "°C";
    mainText.appendChild(mainTemp);
    let tempColor = Math.round((data["main"]["temp"]));

    let secondaryText = document.createElement("p");
    secondaryText.className = "secondary-text";
    mainText.appendChild(secondaryText);

    let mainWeather = document.createElement("span");
    mainWeather.className = "main-weather";
    mainWeather.textContent = data["weather"][0]["description"];
    secondaryText.appendChild(mainWeather);

    let mainTemperatureFelt = document.createElement("span");
    mainTemperatureFelt.className = "main-temperature-felt";
    mainTemperatureFelt.textContent = "Ressenti " + " " + Math.round(data["main"]["feels_like"]) +"°C";
    secondaryText.appendChild(mainTemperatureFelt);

    let mainIcon = document.createElement("img");
    mainIcon.className = "main-icon";
    let weatherID = data["weather"][0]["id"];
    let iconCode = data["weather"][0]["icon"];
    mainIcon.src = getIcon(weatherID, iconCode);
    mainIcon.alt = "";
    mainInfos.appendChild(mainIcon);

    // préparation des éléments secondaires
    let secondaryInfos = document.createElement("div");
    secondaryInfos.className = "secondary-infos";
    weatherCard.appendChild(secondaryInfos);

    // pour les données secondaires, chaque élément a été divisé pour faciliter la gestion de l'affichage sur petits et moyens écrans
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

    let mainRain = document.createElement("span");
    mainRain.className = "main-rain";
    secondaryInfos.appendChild(mainRain);

    let rainLabel = document.createElement("span");
    rainLabel.className = "label";
    rainLabel.textContent = "Précipitations récentes: ";
    mainRain.appendChild(rainLabel);

    let rainValue = document.createElement("span");
    rainValue.className = "value";
    let rain = data["rain"];
    if (rain == undefined) {
        rainValue.textContent = 0 + " mm";
    } else {
        rainValue.textContent = Math.round(data["rain"]["1h"]) + " mm";
    };
    mainRain.appendChild(rainValue);

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
    windValue.textContent = Math.round(windSpeed) + " km/h";
    mainWind.appendChild(windValue);


    // sélection du bloc "météo actuelle"
    let target = document.querySelector(".current-weather");

    // vider les données existantes
    let card = ".weather-card";
    clearCard(card);

    let stateCard = ".state-card";
    clearCard(stateCard);

    // insertion des nouvelles données
    target.appendChild(weatherCard);

    // ajouter la couleur de la palette dynamique
    applyTempPalette(tempColor);
};


// === PREVISIONS HORAIRES ===
export function renderHourlyForecast(hourlyForecastData) {
    let hourlyData = hourlyForecastData["list"].slice(0,8);

    let hourlyForecastCard = document.createElement("div");
    hourlyForecastCard.className = "hourly-forecast-card";

    for (let item of hourlyData) {
        let hour = document.createElement("div");
        hour.className = "hour";
        hourlyForecastCard.appendChild(hour);

        let hourlyTime = document.createElement("p");
        hourlyTime.className = "hourly-time";

        // récupération du timestamp
        let timestamp = item["dt"];
        let timezoneOffset = hourlyForecastData["city"]["timezone"];

        let hours = getHoursOnly(timestamp, timezoneOffset);

        hourlyTime.textContent = hours + "h";
        hour.appendChild(hourlyTime);

        let hourlyIcon = document.createElement("img");
        hourlyIcon.className = "hourly-icon";
        let staticWeatherID = item["weather"][0]["id"];
        let staticIconCode = item["weather"][0]["icon"];
        hourlyIcon.src = getStaticIcon(staticWeatherID, staticIconCode);
        hourlyIcon.alt = item["weather"][0]["description"];
        hour.appendChild(hourlyIcon);

        let hourlyTemperature = document.createElement("p");
        hourlyTemperature.className = "hourly-temperature";
        hourlyTemperature.textContent = Math.round(item["main"]["temp"]) + "°C";
        hour.appendChild(hourlyTemperature);
    };

    // sélectionner bloc prévisions horaires
    let targetHours = document.querySelector(".hourly-forecast h2");

    // afficher toute la section (titre + prévisions)
    let section = document.querySelector(".hourly-forecast");
    section.hidden = false;

    // vider les données précédentes
    let card = ".hourly-forecast-card";
    clearCard(card);

    // insérer les nouvelles données
    targetHours.parentNode.insertBefore(hourlyForecastCard, targetHours.nextSibling);
};


// === PREVISIONS 4 JOURS ===
export function renderNextDays(hourlyForecastData) {
    let daysData = groupNextDays(hourlyForecastData);
    let nextDaysCard = document.createElement("div");
    nextDaysCard.className = "next-days-card";

    let nextDaysList = document.createElement("ul");
    nextDaysList.className = "next-days";
    nextDaysCard.appendChild(nextDaysList);

    for (let item of daysData) {
        let nextDay = document.createElement("li");
        nextDay.className = "forecast-day";
        nextDaysList.appendChild(nextDay);

        let dayName = document.createElement("span");
        dayName.className = "day-name";
        dayName.textContent = item["dayName"];
        nextDay.appendChild(dayName);

        let weatherAndTemp = document.createElement("span");
        weatherAndTemp.className = "weather-temp";
        nextDay.appendChild(weatherAndTemp);

        let dayIcon = document.createElement("img");
        dayIcon.className = "day-icon";
        let staticWeatherID = 0;
        let staticIconCode = item["icon"] +"d";
        dayIcon.src = getStaticIcon(staticWeatherID, staticIconCode);
        dayIcon.alt = getIconLabel(staticIconCode);
        weatherAndTemp.appendChild(dayIcon);

        let temperature = document.createElement("span");
        temperature.className = "day-temp";
        temperature.textContent = Math.round(item["minTemperature"]) +" / "+ Math.round(item["maxTemperature"]) + "°C";
        weatherAndTemp.appendChild(temperature);

        let rainProbabilities = document.createElement("span");
        rainProbabilities.className = "day-rain";
        let rainIcon = document.createElement("img");
        rainIcon.className = "rain-icon";
        rainIcon.src = "assets/icons/static/drop.svg";
        rainIcon.alt = "Probabilités de précipitations";
        rainProbabilities.appendChild(rainIcon);

        let rainText = document.createElement("span");
        rainText.textContent = item["maxRainProbability"]+ " %";
        rainProbabilities.appendChild(rainText);

        nextDay.appendChild(rainProbabilities);

        let windSpeed = document.createElement("span");
        windSpeed.className = "day-wind";
        let windIcon = document.createElement("img");
        windIcon.className = "wind-icon";
        windIcon.src = "assets/icons/static/wind.svg";
        windIcon.alt = "Vitesse maximale du vent";
        windSpeed.appendChild(windIcon);

        let windText = document.createElement("span");
        windText.textContent = item["maxWindSpeed"] + " km/h";
        windSpeed.appendChild(windText);

        nextDay.appendChild(windSpeed);
    };

    // sélectionner bloc prochains jours
    let target = document.querySelector(".daily-forecast h2");

    // afficher toute la section (titre + prévisions)
    let section = document.querySelector(".daily-forecast");
    section.hidden = false;

    // vider les données précédentes
    let card = ".next-days-card";
    clearCard(card);

    // insérer les nouvelles données
    target.parentNode.insertBefore(nextDaysCard, target.nextSibling);
};