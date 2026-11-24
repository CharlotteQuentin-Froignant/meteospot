import {getIconLabel, getIcon, getStaticIcon, applyTempPalette, getTempPalette, getHoursOnly, groupNextDays} from "../utils.js";
import { clearCard } from "./clear.js";
import {renderSolarBow} from "./solar-bow.js";
import { renderCurve } from "./hourly-curve.js";

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
    humidityLabel.textContent = "Humidité";
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
    rainLabel.textContent = "Précipitations récentes";
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
    windLabel.textContent = "Vent";
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

    let skeleton = ".loading-skeleton";
    clearCard(skeleton);

    // insertion des nouvelles données
    target.appendChild(weatherCard);

    // ajouter la couleur de la palette dynamique
    applyTempPalette(tempColor);
};


// === PREVISIONS HORAIRES ===
// Les points de la courbe : la météo actuelle, puis les créneaux de 3 h sur 24 h

// Nombre de créneaux de 3 h affichés (8 x 3 h = 24 h)
const HOURLY_SLOTS = 8;
// Un créneau à moins de 60 minutes de maintenant est ignoré, pour éviter deux points superposés
const MIN_MINUTES_FROM_NOW = 60;

// == Créer le 1er point : la météo actuelle ("Maint.") ==
// la probabilité de pluie n'existe pas pour la météo actuelle : null = inconnue, pas de barre
function buildCurrentPoint(currentData) {
    let weatherID = currentData["weather"][0]["id"];
    let iconCode = currentData["weather"][0]["icon"];

    let point = {
        heure: "Maint.",
        minutes: 0,
        temp: Math.round(currentData["main"]["temp"]),
        iconeSrc: getStaticIcon(weatherID, iconCode),
        nuit: iconCode.endsWith("n"),
        pluie: null,
    };
    return point;
};

// == Créer le point d'un créneau de prévision ==
// minutes = écart entre le créneau et la météo actuelle
function buildSlotPoint(slot, nowTimestamp, timezoneOffset) {
    let weatherID = slot["weather"][0]["id"];
    let iconCode = slot["weather"][0]["icon"];

    let secondsFromNow = slot["dt"] - nowTimestamp;
    let minutesFromNow = Math.round(secondsFromNow / 60);

    let hours = getHoursOnly(slot["dt"], timezoneOffset);

    let point = {
        heure: hours + "\u00a0h",
        minutes: minutesFromNow,
        temp: Math.round(slot["main"]["temp"]),
        iconeSrc: getStaticIcon(weatherID, iconCode),
        nuit: iconCode.endsWith("n"),
        pluie: slot["pop"],
    };
    return point;
};

// == Rassembler tous les points de la courbe ==
function buildCurvePoints(currentData, hourlyForecastData) {
    let nowTimestamp = currentData["dt"];
    let timezoneOffset = hourlyForecastData["city"]["timezone"];
    let slots = hourlyForecastData["list"].slice(0, HOURLY_SLOTS);

    let points = [];
    points.push(buildCurrentPoint(currentData));

    for (let slot of slots) {
        let point = buildSlotPoint(slot, nowTimestamp, timezoneOffset);
        if (point.minutes < MIN_MINUTES_FROM_NOW) {
            continue;
        };
        points.push(point);
    };
    return points;
};

// == Afficher la courbe des prochaines heures ==
// reçoit les données de la météo actuelle ET des prévisions
export function renderHourlyForecast(currentData, hourlyForecastData) {
    let points = buildCurvePoints(currentData, hourlyForecastData);

    // afficher toute la section (titre + courbe) avant de dessiner :
    // la courbe a besoin de connaître la largeur disponible
    let section = document.querySelector(".hourly-forecast");
    section.hidden = false;

    // phrase d'intro : créée une seule fois, juste après le titre
    let caption = section.querySelector(".curve-caption");
    if (caption === null) {
        caption = document.createElement("p");
        caption.className = "curve-caption";
        caption.textContent = "Température en °C, une donnée toutes les 3 h.";
        let title = section.querySelector("h2");
        title.after(caption);
    };

    // conteneur de la courbe : créé une seule fois, juste après la phrase d'intro
    let curveContainer = section.querySelector(".hourly-curve");
    if (curveContainer === null) {
        curveContainer = document.createElement("div");
        curveContainer.className = "hourly-curve";
        caption.after(curveContainer);
    };

    renderCurve(points, curveContainer);
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

        let tempGroup = document.createElement("span");
        tempGroup.className = "day-temp-group";

        let tempMin = document.createElement("span");
        tempMin.className = "day-temp-min";
        tempMin.textContent = Math.round(item["minTemperature"]) + " / ";
        tempGroup.appendChild(tempMin);

        let tempMax = document.createElement("span");
        tempMax.className = "day-temp-max";
        tempMax.textContent = Math.round(item["maxTemperature"]) + "°C";
        let maxPalette = getTempPalette(item["maxTemperature"]);
        if (maxPalette !== null) {
            tempMax.setAttribute("data-temp-palette", maxPalette);
        };
        tempGroup.appendChild(tempMax);

        weatherAndTemp.appendChild(tempGroup);

        let rainProbabilities = document.createElement("span");
        rainProbabilities.className = "day-rain";
        let rainIcon = document.createElement("img");
        rainIcon.className = "rain-icon";
        rainIcon.src = "assets/icons/static/drop.svg";
        rainIcon.alt = "Probabilités de précipitations";
        rainProbabilities.appendChild(rainIcon);

        let rainText = document.createElement("span");
        rainText.className = "day-rain-value";
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
        windText.className = "day-wind-value";
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