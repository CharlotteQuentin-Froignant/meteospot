// === IMPORTATIONS ===
import { getCurrentWeatherUrl, getHourlyForecastUrl, getCurrentWeatherUrlByCoords, getHourlyForecastUrlByCoords, fetchCurrentWeather, fetchHourlyForecast } from "./api.js";
import { renderCurrentWeather, renderHourlyForecast, findTab, insertNewTab, setActiveTab } from "./ui.js";

import {APIKEY} from "./config.js";

// === VARIABLES ET CONSTANTES ===
const LANG = "fr";
const UNIT = "metric";

const GEOLOCALISATION_OPTIONS = {
    timeout:10000,
};

// === FONCTIONS ===

// == Obtenir et afficher la météo d'une ville ==
async function loadCity(cityName){
    // création des urls pour les requêtes
    let url = getCurrentWeatherUrl(cityName, APIKEY, LANG, UNIT);
    let urlNextHours = getHourlyForecastUrl(cityName, APIKEY, LANG, UNIT);

    // lancement des requêtes
    let data = await fetchCurrentWeather(url);
    let hourlyForecastData = await fetchHourlyForecast(urlNextHours);

    let townName = data["name"].toLowerCase().trim();

    // intégration visuelle des données météo
    renderCurrentWeather(data);
    renderHourlyForecast(hourlyForecastData);

    return townName;
};

// == Afficher les erreurs de requêtes ==
function showRequestError(error){
    // message personnalisé si la ville n'est pas trouvée pour que l'utilisateur comprenne l'erreur
    if (error.message === "CITY_NOT_FOUND"){
        console.log("Ville introuvable");
        alert(" La ville recherchée est introuvable, veuillez vérifier l'orthographe");
    } else{
        console.log("Erreur: ", error.message);
    };
};

// == Réaction au clic sur onglet ==
async function handleTabClick(townName){
    try {
        await loadCity(townName);
        setActiveTab(findTab(townName));
    } catch(error){
        showRequestError(error);
    };
};

// == Géolocalisation ==

// = Appel et rendu météo d'une ville avec la géolocalisation =
async function loadCityByCoords(lat,lon){
    let currentUrlByCoords = getCurrentWeatherUrlByCoords(lat,lon, APIKEY, LANG, UNIT);
    let hourlyForecastUrlByCoords = getHourlyForecastUrlByCoords(lat,lon, APIKEY, LANG, UNIT);

    let data = await fetchCurrentWeather(currentUrlByCoords);
    let hourlyForecastData = await fetchHourlyForecast(hourlyForecastUrlByCoords);

    let townName = data["name"].toLowerCase().trim();

    // récupération et affichage des données du bloc météo actuelle
    renderCurrentWeather(data);
    renderHourlyForecast(hourlyForecastData);

    // gestion des onglets
    let existingTab = findTab(townName);
    if (existingTab){
        setActiveTab(existingTab);
    } else{
        insertNewTab(townName, handleTabClick);
    };
};

// = Récupérer les données de géolocalisation, lancer la requête et afficher le rendu =
async function handleGeolocationSuccess(position){
    let userLat = position.coords.latitude;
    let userLon = position.coords.longitude;

    try {
        await loadCityByCoords(userLat, userLon);
    } catch (error){
        showRequestError(error);
    };
};

// = Gérer les erreurs de géolocalisation =
function handleGeolocationError(error){
    switch(error.code){
        case 1:
            alert("Localisation refusée. Veuillez autoriser la localisation ou utiliser la barre de recherche");
            break;
        case 2:
            alert("Position indisponible. Veuillez utiliser la barre de recherche");
            break;
        case 3:
            alert("Délai dépassé. Veuillez réessayer");
            break;
        default:
            alert("Problème avec la géolocalisation");
            break;
    };
};


// === CODE PRINCIPAL ===
// == Récupération de l'input barre de recherche ==
let searchBar = document.querySelector("#search");
let searchInput = document.querySelector("#search-bar");

// == Lancement des requêtes depuis barre de recherche ==
searchBar.addEventListener("submit", async (getCityName) => {
    getCityName.preventDefault();
    let cityName = (searchInput.value).toLowerCase().trim();
    if (cityName === ""){
        alert(" Aucune ville recherchée, veuillez indiquer une ville dans la barre de recherche");
    } else {
        try{
            // récupération et affichage des données du bloc météo actuelle
            let townName =  await loadCity(cityName);

            // gestion des onglets
            let existingTab = findTab(townName);
            if (existingTab){
                setActiveTab(existingTab);
            } else{
                insertNewTab(townName, handleTabClick);
            };

        } catch(error){
            showRequestError(error);
        };
    };

    // vider la barre de recherche
    searchInput.value = "";
});

// == Recherche par géolocalisation ==
if ("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(handleGeolocationSuccess, handleGeolocationError, GEOLOCALISATION_OPTIONS);
} else {
    alert("Problème avec la géolocalisation. Veuillez utiliser la barre de recherche");
};