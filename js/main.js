// === IMPORTATIONS ===
import { getCurrentWeatherUrl, getHourlyForecastUrl, fetchCurrentWeather, fetchHourlyForecast } from "./api.js";
import { renderCurrentWeather, renderHourlyForecast } from "./ui.js";

// === APIKEY import ===
import {APIKEY} from "./config.js";


// === VARIABLES ET CONSTANTES ===
const LANG = "fr";
const UNIT = "metric";

// === FONCTIONS ===

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

        try{
            // récupération et affichage des données du bloc météo actuelle
            let data = await fetchCurrentWeather(url);
            renderCurrentWeather(data);

            // récupération et affichage des données du bloc prévisions horaires
            let hourlyForecastData = await fetchHourlyForecast(urlNextHours);
            renderHourlyForecast(hourlyForecastData);

            // vider barre de recherche
            searchInput.value = "";

        } catch(error){
        // messages personnalisés au cas où le throw new Error intercepte une erreur
            if (error.message === "CITY_NOT_FOUND"){
                console.log("Ville introuvable");
                alert(" La ville recherchée est introuvable, veuillez vérifier l'orthographe");
            } else{
                console.log("Erreur: ", error.message)
            };
        };

    // == Gestion des onglets ==
    // = Sélection de tous les onglets =
    // let townList = document.querySelectorAll(".town-tab");
    // console.log(townList);

    // = Si onglet(s) existant(s) =
    // if (townList != null){
    //     let townFound = false;
    //     for (let item of townList){
    //         let tabValue = (item.textContent).toLowerCase().trim();
    //         if ((cityName === tabValue) && (item.getAttribute("class") === "town-tab active")){
    //             getCurrentWeather(url);
    //             getHourlyForecast(urlNextHours);
    //             townFound = true;
    //         } else if ((cityName === tabValue) && (item.getAttribute("class") !== "town-tab active")){
    //             let activeItem = document.querySelector(".town-tab.active");
    //             activeItem.className = "town-tab";
    //             item.className = "town-tab active";
    //             getCurrentWeather(url);
    //             getHourlyForecast(urlNextHours);
    //             townFound = true;
    //         }
    //     };

        // = Si aucun onglet existant =
        // if (townFound === false) {

        //     let success = await getCurrentWeather(url);
        //     if (success){
        //         let activeItem = document.querySelector(".town-tab.active");
        //         if (activeItem){
        //             activeItem.className = "town-tab";
        //         };
        //         insertNewTab(cityName);
        //     };

        //     getHourlyForecast(urlNextHours);

        // };
        // townList = document.querySelectorAll(".town-tab");

        // == Lancement de la requête via clic sur onglet ==
        // Commenté provisoirement pour éviter d'avoir des doubles requêtes, à voir si conservation ou suppression une fois le local storage paramétré
        // for (let town of townList){
        //     attachTabListener(town);
        // };
});
// });







