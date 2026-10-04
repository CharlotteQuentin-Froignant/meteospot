// === APIKEY import ===
import {APIKEY} from "./config.js";


// === VARIABLES ET CONSTANTES ===
const LANG = "fr";
const UNIT = "metric";

// === FONCTIONS ===

function getIcon(weatherID, iconCode){
    if (weatherID === 906){
            return "assets/icons/animated/hail-animated.svg";
        } else {
            switch(iconCode){
                case "01d":
                    return "assets/icons/animated/sunny-animated.svg";
                case "01n":
                    return "assets/icons/animated/clear-night-animated.svg";
                case "02d":
                    return "assets/icons/animated/partly-cloudy-day-animated.svg";
                case "02n":
                    return "assets/icons/animated/partly-cloudy-night-animated.svg";
                case "03d":
                case "03n":
                    return "assets/icons/animated/cloudy-animated.svg";
                case "04d":
                case "04n":
                    return "assets/icons/animated/overcast-animated.svg";
                case "09d":
                case "09n":
                    return "assets/icons/animated/drizzle-animated.svg";
                case "10d":
                case "10n":
                    return "assets/icons/animated/rain-animated.svg";
                case "11d":
                case "11n":
                    return "assets/icons/animated/thunderstorm-animated.svg";
                case "13d":
                case "13n":
                    return "assets/icons/animated/snow-animated.svg";
                case "50d":
                case "50n":
                    return "assets/icons/animated/fog-animated.svg";
                default:
                    return "assets/icons/animated/cloudy-animated.svg";
            }
        };
};

function getStaticIcon(hourlyWeatherID, hourlyIconCode){
    if (hourlyWeatherID === 906){
            return "assets/icons/static/hail.svg";
        } else {
            switch(hourlyIconCode){
                case "01d":
                    return "assets/icons/static/sunny.svg";
                case "01n":
                    return "assets/icons/static/clear-night.svg";
                case "02d":
                    return "assets/icons/static/partly-cloudy-day.svg";
                case "02n":
                    return "assets/icons/static/partly-cloudy-night.svg";
                case "03d":
                case "03n":
                    return "assets/icons/static/cloudy.svg";
                case "04d":
                case "04n":
                    return "assets/icons/static/overcast.svg";
                case "09d":
                case "09n":
                    return "assets/icons/static/drizzle.svg";
                case "10d":
                case "10n":
                    return "assets/icons/static/rain.svg";
                case "11d":
                case "11n":
                    return "assets/icons/static/thunderstorm.svg";
                case "13d":
                case "13n":
                    return "assets/icons/static/snow.svg";
                case "50d":
                case "50n":
                    return "assets/icons/static/fog.svg";
                default:
                    return "assets/icons/static/cloudy.svg";
            }
        };
};

// == Fonctions de création des urls ==
function getCurrentWeatherUrl(city, APIKEY, LANG, UNIT){
    let currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&lang=${LANG}&units=${UNIT}`;
    return currentUrl;
};

function getHourlyForecastUrl(city, APIKEY, LANG, UNIT){
    let urlHourlyForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKEY}&lang=${LANG}&units=${UNIT}`;
    return urlHourlyForecast;
}

// == Obtenir la date et l'heure locale ==

function getLocalDateTime(timestamp, timezoneOffset){
    // addition du timestamp et du décalage horaire pour obtenir le temps local
    let fullTime = timestamp + timezoneOffset;
    // création d'un objet Date en JS, nécessité de convertir les s en ms pour le js
    let dateObject = new Date(fullTime *1000);

    let localDate = dateObject.toLocaleDateString("fr-FR",
        {
            timeZone: "UTC",
        });

    // définition du format de l'horaire affiché : ici l'heure sera affiché selon le modèle français, avec 2 chiffres
    let localTime = dateObject.toLocaleTimeString("fr-FR",
        {
            hour: "2-digit",
            minute: "2-digit",
            // évite que le fuseau horaire de l'utilisateur soit ajouté à l'horaire local affiché
            timeZone: "UTC",
        });
        return {
            "date": localDate,
            "time": localTime};
};

// Obtenir uniquement l'heure
function getHoursOnly(timestamp, timezoneOffset){
    let fullTime = timestamp + timezoneOffset;
    let DateObject = new Date(fullTime *1000);

    // obtenir les heures
    let hours = DateObject.getUTCHours();
    return hours;
};

// == Fonctions pour définir la position du soleil sur l'arc solaire ==
// conversion de l'heure actuelle en avancement de la journée (0 = lever ; 1=coucher)
function getTimePoint(currentTimestamp, sunriseTimestamp, sunsetTimestamp){
    let timePoint = ((currentTimestamp - sunriseTimestamp)/(sunsetTimestamp - sunriseTimestamp));
    return timePoint;
};

// Calcule la position (X, Y) du soleil sur l'arc SVG (courbe de Bézier quadratique)
// solution la plus simple à metre en place pour réaliser un arc en svg car ne necessite que 3 points d'ancrage
function getBezierPoint(timepoint){
    // Les valeurs correspondent aux 3 points (x,y) de la courbe : Départ (10,78), Zénith (170,-20), Arrivée (330,78).
    let xposition = ((1 - timepoint)**2) * 10 + 2 * (1 - timepoint) * timepoint * 170 + (timepoint**2) * 330;
    let yposition = ((1 - timepoint)**2) * 78 + 2 * (1 - timepoint) * timepoint * (-20) + (timepoint**2) * 78;
    return { x: xposition, y: yposition };
};

// == Requête météo actuelle ==

async function getCurrentWeather(url){
    // gestion des erreurs
    try{
        const RESPONSE = await fetch(url);
        let data = await RESPONSE.json();

        if (!RESPONSE.ok){
            if (RESPONSE.status === 404){
                console.log("Ville introuvable");
                alert("La ville recherchée est introuvable, veuillez vérifier l'orthographe");
            } else {
            console.log("Problème: ", data.message);
            };

            // retourne false si une erreur existe
            return false;
        }

        console.log("données", data);

        // construction arc lever/coucher de soleil
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

        // configuration des éléments à injecter dans le DOM
        let weatherCard = document.createElement("div");
        weatherCard.className = "weather-card";

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
        currentTime.setAttribute("class", "solar-bow-text curent-label");
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


        // insertion des nouvelles données
        target.appendChild(weatherCard);

        // vider barre de recherche
        searchInput.value = "";

    } catch(error){
        console.log(error);

    // retourne true si la requête se passe bien
    } return true;
};


// == Requête prévisions horaires ==

async function getHourlyForecast(urlHourlyForecast){
    try {
        const RESPONSE = await fetch(urlHourlyForecast);
        let fullData = await RESPONSE.json();


        if (!RESPONSE.ok){
            // gestion de l'erreur ville introuvable sans alerte pour ne pas avoir 2 popups qui apparaissent
            if (RESPONSE.status === 404){
                console.log("Ville introuvable");
            } else {
            console.log("Problème: ", fullData.message);
            };
            return false;
        };

        let hourlyData = fullData["list"].slice(0,8);

        console.log("Prévisions horaires:", hourlyData);

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
            let timezoneOffset = fullData["city"]["timezone"];

            let hours = getHoursOnly(timestamp, timezoneOffset);
            console.log(hours);

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

        // vider les données précédentes
        let existingCard = document.querySelector(".hourly-forecast-card");
        if (existingCard){
            existingCard.remove();
        }

        // insérer les nouvelles données
        targetHours.parentNode.insertBefore(hourlyForecastCard, targetHours.nextSibling);

    } catch(error){
        console.log(error);
    } return true;
};

// == Rendre les onglets de villes cliquables ==
function attachTabListener(tab){
    tab.addEventListener("click", (event) =>{
        event.preventDefault();
        let clickedCity = (tab.textContent).toLowerCase().trim();
        let urlTab = getCurrentWeatherUrl(clickedCity, APIKEY, LANG, UNIT);
        let urlNextHoursTab = getHourlyForecastUrl(clickedCity, APIKEY, LANG,  UNIT);
        getCurrentWeather(urlTab);
        getHourlyForecast(urlNextHoursTab);
        let activeTab = document.querySelector(".town-tab.active");
        activeTab.className = "town-tab";
        tab.className = "town-tab active";
    })
};


// == Créer les onglets ==

function insertNewTab(item){
    let targetTab = document.querySelector(".searched-towns");
    let searchedTowns = document.createElement("div");
    let tab = document.createElement("button");
    tab.className = "town-tab active";
    tab.value = item;
    tab.textContent = item;
    searchedTowns.appendChild(tab);
    targetTab.appendChild(searchedTowns);

    attachTabListener(tab);
};


// === CODE PRINCIPAL ===

// == Récupération de l'input barre de recherche ==
let searchBar = document.querySelector("#search");
let searchInput = document.querySelector("#search-bar");

// == Lancement des requêtes depuis barre de recherche ==
searchBar.addEventListener("submit", async (getCityName) => {
    getCityName.preventDefault();
    let cityName = (searchInput.value).toLowerCase().trim();
    console.log("Ville:", cityName);
    let url = getCurrentWeatherUrl(cityName, APIKEY, LANG, UNIT);
    let urlNextHours = getHourlyForecastUrl(cityName, APIKEY, LANG, UNIT);

    // == Gestion des onglets ==
    // = Sélection de tous les onglets =
    let townList = document.querySelectorAll(".town-tab");
    console.log(townList);

    // = Si onglet(s) existant(s) =
    if (townList != null){
        let townFound = false;
        for (let item of townList){
            let tabValue = (item.textContent).toLowerCase().trim();
            if ((cityName === tabValue) && (item.getAttribute("class") === "town-tab active")){
                getCurrentWeather(url);
                getHourlyForecast(urlNextHours);
                townFound = true;
            } else if ((cityName === tabValue) && (item.getAttribute("class") !== "town-tab active")){
                let activeItem = document.querySelector(".town-tab.active");
                activeItem.className = "town-tab";
                item.className = "town-tab active";
                getCurrentWeather(url);
                getHourlyForecast(urlNextHours);
                townFound = true;
            }
        };

        // = Si aucun onglet existant =
        if (townFound === false) {

            let success = await getCurrentWeather(url);
            if (success){
                let activeItem = document.querySelector(".town-tab.active");
                if (activeItem){
                    activeItem.className = "town-tab";
                };
                insertNewTab(cityName);
            };

            getHourlyForecast(urlNextHours);

        };
        townList = document.querySelectorAll(".town-tab");

        // == Lancement de la requête via clic sur onglet ==
        // Commenté provisoirement pour éviter d'avoir des doubles requêtes, à voir si conservation ou suppression une fois le local storage paramétré
        // for (let town of townList){
        //     attachTabListener(town);
        // };
    };
});







