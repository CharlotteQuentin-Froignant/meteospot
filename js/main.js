// === IMPORTATIONS ===
import { getCurrentWeatherUrl, getHourlyForecastUrl, fetchCurrentWeather, fetchHourlyForecast } from "./api.js";
import { renderCurrentWeather, renderHourlyForecast, findTab, insertNewTab, setActiveTab } from "./ui.js";

import {APIKEY} from "./config.js";

// === VARIABLES ET CONSTANTES ===
const LANG = "fr";
const UNIT = "metric";

// === FONCTIONS ===

// == Obtenir et afficher la météo d'une ville ==
async function loadCity(cityName){
    // création des urls pour les requêtes
    let url = getCurrentWeatherUrl(cityName, APIKEY, LANG, UNIT);
    let urlNextHours = getHourlyForecastUrl(cityName, APIKEY, LANG, UNIT);

    // lancement des requêtes
    let data = await fetchCurrentWeather(url);
    let hourlyForecastData = await fetchHourlyForecast(urlNextHours);

    // intégration visuelle des données météo
    renderCurrentWeather(data);
    renderHourlyForecast(hourlyForecastData);
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
async function handleTabClick(cityName){
    try {
        await loadCity(cityName);
        setActiveTab(findTab(cityName));
    } catch(error){
        showRequestError(error);
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

    try{
        // récupération et affichage des données du bloc météo actuelle
        await loadCity(cityName);

        // gestion des onglets
        let existingTab = findTab(cityName);
        if (existingTab){
            setActiveTab(existingTab);
        } else{
            insertNewTab(cityName, handleTabClick);
        };

    } catch(error){
        showRequestError(error);
    };

    // vider la barre de recherche
    searchInput.value = "";
});