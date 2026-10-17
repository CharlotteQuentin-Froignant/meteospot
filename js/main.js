// === IMPORTATIONS ===
import { getCurrentWeatherUrl, getHourlyForecastUrl, getCurrentWeatherUrlByCoords, getHourlyForecastUrlByCoords, fetchCurrentWeather, fetchHourlyForecast } from "./api.js";
import { renderCurrentWeather, renderHourlyForecast, findTab, insertNewTab, setActiveTab, renderGeolocationButton } from "./ui.js";

import {APIKEY} from "./config.js";

// === VARIABLES ET CONSTANTES ===
const LANG = "fr";
const UNIT = "metric";

const GEOLOCATION_OPTIONS = {
    // timeout en millisecondes
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

// == Onglets ==
// = Changement de l'onglet actif ou création d'un nouvel onglet
function showCityTab(townName){
    // certaines données de géolocalisation n'étant pas rattachées à une ville, l'onglet crée serait vide (coordonnées en mer par exemple)
    // si townName est vide, il n'y a pas de création d'onglets
    if (townName === ""){
        return;
    };
    let existingTab = findTab(townName);
    if (existingTab){
        setActiveTab(existingTab);
    } else{
        insertNewTab(townName, handleTabClick);
    };
};

// = Réaction au clic sur onglet =
async function handleTabClick(townName){
    try {
        await loadCity(townName);
        setActiveTab(findTab(townName));
    } catch(error){
        showRequestError(error);
    };
};

// == Géolocalisation ==

// = Charge et affiche la météo par coordonnées, puis active ou crée l'onglet =
// les erreurs sont gérées par la fonction d'appel handleGeolocationSuccess
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
    showCityTab(townName);
};

// = Récupérer les données de géolocalisation, lancer la requête, afficher le rendu et attraper les erreurs =
async function handleGeolocationSuccess(position){
    let userLat = position.coords.latitude;
    let userLon = position.coords.longitude;

    try {
        await loadCityByCoords(userLat, userLon);
        let button = document.querySelector(".geolocation-button");
        if (button != null){
            button.remove();
        };

    } catch (error){
        showRequestError(error);
    };
};

// = Gérer les erreurs de géolocalisation =
function handleGeolocationError(error){
    switch(error.code){
        // Refus
        case 1:
            alert("Localisation refusée. Veuillez autoriser la localisation ou utiliser la barre de recherche");
            break;

        // Position indisponible
        case 2:
            alert("Position indisponible. Veuillez utiliser la barre de recherche");
            break;

        // Délai dépassé
        case 3:
            alert("Délai dépassé. Veuillez réessayer");
            break;

        default:
            alert("Problème avec la géolocalisation");
            break;
    };
};

// == Récupérer le statut d'utilisation de la localisation ==
async function getPermissionStatus(){
    if ("geolocation" in navigator){
        try {
            let result = await navigator.permissions.query({name:"geolocation"});
            return result.state;
        } catch (error){
            console.log("Statut de permission non défini : ", error.message);
            // si le statut n'est pas défini, utilisation de prompt par défaut pour laisser le choix à l'utilisateur
            return "prompt";
        };
    } else {
        return "unavailable";
    };
};

// == Demander la position au navigateur et afficher la météo correspondante ==
function loadGeolocation(){
    // si le statut est "prompt" : appelle la fenêtre d'autorisation
    // si le statut est "granted" : affiche la météo directement sans fenêtre
    navigator.geolocation.getCurrentPosition(handleGeolocationSuccess, handleGeolocationError, GEOLOCATION_OPTIONS);
};

// == Gestion des requêtes et de l'affichage selon les autorisations ==
async function initGeolocation(){
    // obtenir le statut d'autorisation
    let permission = await getPermissionStatus();

    // gérer les actions selon l'autorisation donnée
    switch (permission) {
        // autorisé
        // si autorisé, évite d'avoir une pop-up de demande d'autorisation
        // lors de la prochaine visite, la météo sera chargée directement sans pop-up
        case "granted":
            loadGeolocation();
            break;

        // statut par défaut
        // bouton d'activation présent
        // le clic sur le bouton entraîne le chargement de la météo correspondante et le navigateur fait passer le statut de prompt -> granted (temporaire ou tout le temps selon choix utilisateur)
        // si l'utilisateur refuse d'activer sa localisation après avoir cliqué, le bouton reste; un refus mémorisé donnera denied à la prochaine visite
        case "prompt":
            renderGeolocationButton(loadGeolocation);
            break;

        // refus
        // l'utilisateur devra utiliser la barre de recherche
        case "denied":
            // provisoire jusqu'au ticket 12
            console.log("Votre position ne sera pas utilisée. Vous pouvez utiliser la barre de recherche");
            break;

        // gestion des navigateurs qui ne proposent pas la géolocalisation (ex: Safari)
        case "unavailable":
            alert ("Géolocalisation indisponible. Veuillez utiliser la barre de recherche");
            break;

        default:
            alert("Problème avec la géolocalisation. Veuillez utiliser la barre de recherche");
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
            showCityTab(townName);

        } catch(error){
            showRequestError(error);
        };
    };

    // vider la barre de recherche
    searchInput.value = "";
});

// == Recherche par géolocalisation ==
initGeolocation();