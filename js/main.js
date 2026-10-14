// === IMPORTATIONS ===
import { getCurrentWeatherUrl, getHourlyForecastUrl, fetchCurrentWeather, fetchHourlyForecast } from "./api.js";
import { renderCurrentWeather, renderHourlyForecast, findTab, insertNewTab, setActiveTab } from "./ui.js";

// === APIKEY import ===
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

// == Réaction au clic sur onglet ==
async function handleTabClick(cityName){
    try {
        await loadCity(cityName);
        setActiveTab(findTab(cityName));
    } catch(error){
        if (error.message === "CITY_NOT_FOUND"){
            console.log("Ville introuvable");
            alert(" La ville recherchée est introuvable, veuillez vérifier l'orthographe");
        } else{
            console.log("Erreur: ", error.message)
        };
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
    console.log("Ville:", cityName);

        try{
            // récupération et affichage des données du bloc météo actuelle
            await loadCity(cityName);
            let existingTab = findTab(cityName);
            if (existingTab){
                setActiveTab(existingTab);
            } else{
                insertNewTab(cityName, handleTabClick);
            };

        } catch(error){
        // messages personnalisés au cas où le throw new Error intercepte une erreur
            if (error.message === "CITY_NOT_FOUND"){
                console.log("Ville introuvable");
                alert(" La ville recherchée est introuvable, veuillez vérifier l'orthographe");
            } else{
                console.log("Erreur: ", error.message)
            };
        };

    // vider barre de recherche
            searchInput.value = "";
});







