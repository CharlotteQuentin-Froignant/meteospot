import { getIcon, getStaticIcon, getLocalDateTime, getHoursOnly, getTimePoint, getBezierPoint } from "./utils.js";

// === MANIPULATION DU DOM ===
// == Meteo Actuelle ==
// = Arc solaire =
function renderSolarBow(data, weatherCard){
    let sunriseTimestamp = data["sys"]["sunrise"];
    let sunsetTimestamp = data["sys"]["sunset"];
    let currentTimestamp = data["dt"];
    let timezoneOffset = data["timezone"];

    // configuration de l'arc pour la nuit
    // definition d'un booléen pour gérer la condition de nuit
    let isNight = currentTimestamp < sunriseTimestamp || currentTimestamp > sunsetTimestamp;
    let timePoint;
    if (isNight){
        // choix d'un timepoint fixe pour placer le soleil endormi
        timePoint = 0.5;
    } else {
        // si on est en journée, la vraie position du soleil est calculée et affichée
        timePoint = getTimePoint(currentTimestamp, sunriseTimestamp, sunsetTimestamp);
    };

    let sunPosition = getBezierPoint(timePoint);

    let sunriseDateTime = getLocalDateTime(sunriseTimestamp, timezoneOffset);
    let sunsetDateTime = getLocalDateTime(sunsetTimestamp, timezoneOffset);
    let currentDateTime = getLocalDateTime(currentTimestamp, timezoneOffset);

    // injection de l'arc solaire, comme SVG n'est pas du html, il faut utiliser document.createElementNS
    // 1- dire au navigateur qu'il s'agit d'un svg
    const SVG_NS = "http://www.w3.org/2000/svg";

    // 2-créer l'élément svg
    let solarBow = document.createElementNS(SVG_NS, "svg");

    // 3-configurer le svg : utilisation de setAttribute (méthode standard pour définir tous les attributs d'un svg et utilisable aussi sur du html)
    // utilisation de toggle pour gérer facilement les changements nocturnes
    // si la condition isNight est vraie, alors la classe night-mode est ajoutée automatiquement
    solarBow.classList.toggle("night-mode", isNight);
    solarBow.setAttribute("viewBox","0 0 340 90");
    weatherCard.appendChild(solarBow);

    let solarBowPath = document.createElementNS(SVG_NS, "path");
    solarBowPath.setAttribute("class","bow");
    solarBowPath.setAttribute("d","M 10 78 Q 170 -20 330 78");
    solarBow.appendChild(solarBowPath);

    let solarBowSunHalo = document.createElementNS(SVG_NS, "circle");
    solarBowSunHalo.setAttribute("class","halo");
    solarBowSunHalo.setAttribute("cx",sunPosition["x"]);
    solarBowSunHalo.setAttribute("cy",sunPosition["y"]);
    solarBowSunHalo.setAttribute("r", "15");
    solarBow.appendChild(solarBowSunHalo);

    let solarBowSun = document.createElementNS(SVG_NS, "circle");
    solarBowSun.setAttribute("class","sun");
    solarBowSun.setAttribute("cx",sunPosition["x"]);
    solarBowSun.setAttribute("cy",sunPosition["y"]);
    solarBowSun.setAttribute("r", "10");
    solarBow.appendChild(solarBowSun);

    // 4-injecter les heures et la date
    let sunriseTime = document.createElementNS(SVG_NS, "text");
    sunriseTime.setAttribute("class", "solar-bow-text sunrise-text");
    sunriseTime.setAttribute("x", "10");
    sunriseTime.setAttribute("y", "75");
    sunriseTime.setAttribute("text-anchor", "start");
    sunriseTime.textContent = sunriseDateTime["time"];
    solarBow.appendChild(sunriseTime);

    let sunriseLabel = document.createElementNS(SVG_NS, "text");
    sunriseLabel.setAttribute("class", "solar-bow-text sunrise-label");
    sunriseLabel.setAttribute("x", "10");
    sunriseLabel.setAttribute("y", "85");
    sunriseLabel.setAttribute("text-anchor", "start");
    sunriseLabel.textContent = "Lever";
    solarBow.appendChild(sunriseLabel);

    let currentTime = document.createElementNS(SVG_NS, "text");
    currentTime.setAttribute("class", "solar-bow-text current-label");
    currentTime.setAttribute("x", "170");
    currentTime.setAttribute("y", "75");
    currentTime.setAttribute("text-anchor", "middle");
    currentTime.textContent = currentDateTime["time"];
    solarBow.appendChild(currentTime);

    let currentDate = document.createElementNS(SVG_NS, "text");
    currentDate.setAttribute("class", "solar-bow-text current-text");
    currentDate.setAttribute("x", "170");
    currentDate.setAttribute("y", "85");
    currentDate.setAttribute("text-anchor", "middle");
    currentDate.textContent = currentDateTime["date"];
    solarBow.appendChild(currentDate);

    let sunsetTime = document.createElementNS(SVG_NS, "text");
    sunsetTime.setAttribute("class", "solar-bow-text sunset-text");
    sunsetTime.setAttribute("x", "325");
    sunsetTime.setAttribute("y", "75");
    sunsetTime.setAttribute("text-anchor", "end");
    sunsetTime.textContent = sunsetDateTime["time"];
    solarBow.appendChild(sunsetTime);

    let sunsetLabel = document.createElementNS(SVG_NS, "text");
    sunsetLabel.setAttribute("class", "solar-bow-text sunset-label");
    sunsetLabel.setAttribute("x", "330");
    sunsetLabel.setAttribute("y", "85");
    sunsetLabel.setAttribute("text-anchor", "end");
    sunsetLabel.textContent = "Coucher";
    solarBow.appendChild(sunsetLabel);

    // svg et texte à ajouter pour la nuit
    if (isNight){
        let zzzText = document.createElementNS(SVG_NS, "text");
        zzzText.setAttribute("class", "zzz-text");
        zzzText.setAttribute("x", sunPosition["x"] + 10);
        zzzText.setAttribute("y", sunPosition["y"] - 5);
        zzzText.textContent = "zZz";
        solarBow.appendChild(zzzText);

        let nextSunrise = document.createElementNS(SVG_NS, "text");
        nextSunrise.setAttribute("class", "solar-bow-text current-text");
        nextSunrise.setAttribute("x", "170");
        nextSunrise.setAttribute("y", "55");
        nextSunrise.setAttribute("text-anchor", "middle");
        nextSunrise.textContent = "Prochain lever: " + sunriseDateTime["time"];
        solarBow.appendChild(nextSunrise);
    };
};

// = Météo Actuelle =
export function renderCurrentWeather(data){

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
    let weatherID = data["weather"][0]["id"];
    let iconCode = data["weather"][0]["icon"];
    mainIcon.src = getIcon(weatherID, iconCode);
    mainIcon.alt = " icone" + data["weather"][0]["description"];
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
    rainLabel.textContent = "Précipitations récentes: ";
    mainRain.appendChild(rainLabel);

    let rainValue = document.createElement("span");
    rainValue.className = "value";
    let rain = data["rain"];
    if (rain == undefined){
        rainValue.textContent = 0 + " mm";
    } else {
        rainValue.textContent = (data["rain"]["1h"]).toFixed(1) + " mm";
    };
    mainRain.appendChild(rainValue);

    // sélection du bloc "météo actuelle"
    let target = document.querySelector(".current-weather");

    // vider les données existantes
    let existingCurrentCard = document.querySelector(".weather-card");
    if (existingCurrentCard){
        existingCurrentCard.remove();
    };

    let existingStateCards = document.querySelector(".state-card");
    if (existingStateCards){
        existingStateCards.remove();
    };

    // insertion des nouvelles données
    target.appendChild(weatherCard);
};

// = Prévisions Horaires =
export function renderHourlyForecast(hourlyForecastData){
    let hourlyData = hourlyForecastData["list"].slice(0,8);

    let hourlyForecastCard = document.createElement("div");
    hourlyForecastCard.className = "hourly-forecast-card";

    for (let item in hourlyData){
        let hour = document.createElement("div");
        hour.className = "hour";
        hourlyForecastCard.appendChild(hour);

        let hourlyTime = document.createElement("p");
        hourlyTime.className = "hourly-time";

        // récupération du timestamp
        let timestamp = hourlyData[item]["dt"];
        let timezoneOffset = hourlyForecastData["city"]["timezone"];

        let hours = getHoursOnly(timestamp, timezoneOffset);

        hourlyTime.textContent = hours + "h";
        hour.appendChild(hourlyTime);

        let hourlyIcon = document.createElement("img");
        hourlyIcon.className = "hourly-icon";
        let hourlyWeatherID = hourlyData[item]["weather"][0]["id"];
        let hourlyIconCode = hourlyData[item]["weather"][0]["icon"];
        hourlyIcon.src = getStaticIcon(hourlyWeatherID, hourlyIconCode);
        hourlyIcon.alt = "icone" + hourlyData[item]["weather"][0]["description"];
        hour.appendChild(hourlyIcon);

        let hourlyTemperature = document.createElement("p");
        hourlyTemperature.className = "hourly-temperature";
        hourlyTemperature.textContent = Math.round(hourlyData[item]["main"]["temp"]) + "°C";
        hour.appendChild(hourlyTemperature);
    };

    // sélectionner bloc prévisions horaires
    let targetHours = document.querySelector(".hourly-forecast h2");

    // afficher toute la section (titre + prévisions)
    let section = document.querySelector(".hourly-forecast");
    section.hidden = false;

    // vider les données précédentes
    let existingCard = document.querySelector(".hourly-forecast-card");
    if (existingCard){
        existingCard.remove();
    };

    // // insérer les nouvelles données
    targetHours.parentNode.insertBefore(hourlyForecastCard, targetHours.nextSibling);
};

// === ONGLETS ===
// == Déterminer si la ville recherchée a déjà un onglet ou non ==
export function findTab(townName){
    // interrogation du DOM
    let allTabs = document.querySelectorAll(".town-tab");
    for (let item of allTabs){
        let town = item.textContent.toLowerCase().trim();
        if (town === townName){
            return item;
        };
    };
    return null;
};

// == Créer les onglets ==
export function insertNewTab(townName, onClick){
    // création et insertion de l'onglet
    let targetTab = document.querySelector(".searched-towns");
    let searchedTowns = document.createElement("div");
    let tab = document.createElement("button");
    tab.className = "town-tab";
    tab.textContent = townName;
    searchedTowns.appendChild(tab);
    targetTab.appendChild(searchedTowns);

    // ajout de l'écouteur d'évènement sur le clic
    // fonction onClick à configurer dans main.js
    tab.addEventListener("click", () => onClick(townName))
    setActiveTab(findTab(townName));
};

// == Changement de classe des onglets ==
export function setActiveTab(tabToActivate){
    let activeTab = document.querySelector(".town-tab.active");
    if (activeTab){
        activeTab.className = "town-tab";
    };

    if (tabToActivate){
        tabToActivate.className = "town-tab active";
    };
};


// === ETATS DE L'APPLICATION ==
// == Bouton provisoire d'activation de géolocalisation ==
export function renderGeolocationButton(onClick){
    // création du bouton
    let target = document.querySelector(".current-weather");
    let activateGeolocationButton = document.createElement("button");
    activateGeolocationButton.className = "geolocation-button";
    activateGeolocationButton.textContent = "Activez votre position";

    // mise en place de l'écoute et de l'action au clic
    activateGeolocationButton.addEventListener("click", onClick);

    // insertion dans la page
    target.appendChild(activateGeolocationButton);
};

// == API Indisponible ==
export function downAPI (lastData, onRetry){
    // Supprimer les cartes d'états et de météo déjà présentes
    let existingStateCards = document.querySelector(".state-card");
    if (existingStateCards){
        existingStateCards.remove();
    };
    let weatherCard = document.querySelector(".weather-card");
    if (weatherCard){
        weatherCard.remove();
    };
    let hourlySection = document.querySelector(".hourly-forecast");
    hourlySection.hidden = true;

    // Créer la carte pour l'erreur d'API
    let downApiCard = document.createElement("div");
    downApiCard.className = "state-card";
    downApiCard.id = "api-card";
    downApiCard.setAttribute("role", "alert");

    // icône
    let apiCardIcon = document.createElement("img");
    apiCardIcon.id = "api-card-icon";
    apiCardIcon.src = "";
    apiCardIcon.alt = "icone de nuage barré";
    downApiCard.appendChild(apiCardIcon);

    // titre
    let apiCardTitle = document.createElement("h2");
    apiCardTitle.id = "api-card-title";
    apiCardTitle.textContent = "Météo indisponible";
    downApiCard.appendChild(apiCardTitle);

    // message
    let apiCardText = document.createElement("p");
    apiCardText.id = "api-card-text";
    apiCardText.textContent = "Impossible de récupérer les données météo pour le moment. Vérifie ta connexion et réessaie";
    downApiCard.appendChild(apiCardText);

    // bouton
    let apiCardButton = document.createElement("button");
    apiCardButton.className = "state-button";
    apiCardButton.id = "api-button";
    apiCardButton.textContent = "Réessayer";
    // relancer la dernière requête au clic et désactiver le bouton
    apiCardButton.addEventListener("click", () => {
        apiCardButton.disabled = true;
        onRetry();
    });
    downApiCard.appendChild(apiCardButton);

    // dernières données connues
    if (lastData !== null){
        let apiLastData = document.createElement("div");
        apiLastData.className = "api-last-data";
        apiLastData.id = "last-data-api";
        downApiCard.appendChild(apiLastData);

        let apiLastText = document.createElement("span");
        apiLastText.className = "api-last-text";
        apiLastText.id = "last-text-api";
        apiLastText.textContent = "Dernière donnée connue: ";
        apiLastData.appendChild(apiLastText);

        let apiLastCity = document.createElement("span");
        apiLastCity.className = "api-last-city";
        apiLastCity.id = "last-town";
        apiLastCity.textContent = lastData["city"] +", ";
        apiLastData.appendChild(apiLastCity);

        let apiLastTemp = document.createElement("span");
        apiLastTemp.className = "api-last-temp";
        apiLastTemp.id = "last-temp";
        apiLastTemp.textContent = (lastData["temp"]).toFixed(1) + "°C ";
        apiLastData.appendChild(apiLastTemp);

        let apiLastTime = document.createElement("span");
        apiLastTime.className = "api-last-time";
        apiLastTime.id = "last-time";
        let localTime = getLocalDateTime(lastData["dt"], lastData["timezoneOffset"]);
        apiLastTime.textContent = "à " + localTime["time"];
        apiLastData.appendChild(apiLastTime);
    };

    // insertion des nouvelles données
    let target = document.querySelector(".current-weather");
    target.appendChild(downApiCard);
};