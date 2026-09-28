// APIKEY import
import {APIKEY} from "./config.js";


//  === CARIABLES ET CONSTANTES ===
const LANG = "fr";
const UNIT = "metric";

// === FUNCTIONS ===

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

function getCurrentWeatherUrl(city, APIKEY, LANG, UNIT){
    let currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&lang=${LANG}&units=${UNIT}`;
    return currentUrl;
};

function getHourlyForecastUrl(city, APIKEY, LANG, UNIT){
    let urlHourlyForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKEY}&lang=${LANG}&units=${UNIT}`;
    return urlHourlyForecast;
}

// == REQUETE CURRENT WEATHER ==

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
            return;
        }

        console.log("données", data);

        // configuration des éléments à injecter dans le DOM
        let weatherCard = document.createElement("div");
        weatherCard.className = "weather-card";

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
    }
};


// == REQUETE HOURLY FORECAST ==

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
            return;
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

            // utilisation de la classe Date pour créer un objet date
            // conversion du timestamp openweathermap (s) en timestamp js (ms)
            let dateObjet = new Date(timestamp *1000);

            // obtenir uniquement l'heure
            let time = dateObjet.getHours();

            hourlyTime.textContent = time + "h";
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
    }
};

// == FONCTION MAKE TAB ==

function insertNewTab(item){
    let targetTab = document.querySelector(".searched-towns");
    let searchedTowns = document.createElement("div");
    let tab = document.createElement("button");
    tab.className = "town-tab active";

    tab.value = item;
    tab.textContent = item;
    searchedTowns.appendChild(tab);
    targetTab.appendChild(searchedTowns);
};


// === CODE PRINCIPAL ===

// == Récupération de l'input barre de recherche ==
let searchBar = document.querySelector("#search");
let searchInput = document.querySelector("#search-bar");

// == Lancement des requêtes depuis barre de recherche ==
searchBar.addEventListener("submit", (getCityName) => {
    getCityName.preventDefault();
    let cityName = (searchInput.value).toLowerCase().trim();
    console.log("Ville:", cityName);
    let url = getCurrentWeatherUrl(cityName, APIKEY, LANG, UNIT);
    let urlNextHours = getHourlyForecastUrl(cityName, APIKEY, LANG, UNIT);

    // == Gestion des onglets ==
    // = Sélection de tous les onglets =
    let townList = document.querySelectorAll(".town-tab");

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
                let activeItem = document.querySelector(".town-tab.active");
                activeItem.className = "town-tab";
                insertNewTab(cityName);
                getCurrentWeather(url);
                getHourlyForecast(urlNextHours);
            };

        // == Lancement de la requête via clic sur onglet ==
        for (let town of townList){
            town.addEventListener("click", (event) =>{
                event.preventDefault();
                cityName = (town.textContent).toLowerCase().trim();
                let urlTab = getCurrentWeatherUrl(cityName, APIKEY, LANG, UNIT);
                let urlNextHoursTab = getHourlyForecastUrl(cityName, APIKEY, LANG,  UNIT);
                getCurrentWeather(urlTab);
                getHourlyForecast(urlNextHoursTab);
                let activeTab = document.querySelector(".town-tab.active");
                activeTab.className = "town-tab";
                town.className = "town-tab active";
            })
        };
    }
});







