// === IMPORTATIONS ===
import { getCurrentWeatherUrl, getHourlyForecastUrl, getCurrentWeatherUrlByCoords, getHourlyForecastUrlByCoords, fetchWeatherData,  fetchLegalDialog } from "./api.js";
import { renderCurrentWeather, renderHourlyForecast, findTab, insertNewTab, setActiveTab, insertLocalStorageTab, removeTab, downAPI, renderWelcomeCard, renderBlockedCard, renderLoadingCard, clearCard, renderNextDays, fillContactMail, renderLegalContent, showLegalError, initLegalDialog} from "./ui.js";
import { importLocalStorage, removeFromLocalStorage, saveToLocalStorage} from "./utils.js";

import {APIKEY} from "./config.js";

// === VARIABLES ET CONSTANTES ===
// requêtes
const LANG = "fr";
const UNIT = "metric";

// géolocalisation
const GEOLOCATION_OPTIONS = {
    // timeout en millisecondes
    timeout:10000,
};

// onglets
const TAB_LIMIT = 5;

// enregistrement des données
let lastData = null;
let lastRequest = null;

// footer - informations légales
let legalLoaded = false;

// === FONCTIONS ===

// == Enregistrer certaines données de la dernière recherche météo ==
function saveLastData(data) {
    lastData = {
        "city" : data["name"],
        "temp" : data["main"]["temp"],
        "dt" : data["dt"],
        "timezoneOffset" : data["timezone"],
    };
};

// == Obtenir et afficher la météo d'une ville ==
async function loadCity(cityName) {
    // création des urls pour les requêtes
    let url = getCurrentWeatherUrl(cityName, APIKEY, LANG, UNIT);
    let urlNextHours = getHourlyForecastUrl(cityName, APIKEY, LANG, UNIT);

    // sauvegarde des paramètres de la requête
    lastRequest = {
        "type" : "name",
        "town" : cityName,
    };

    // timer pour la carte de chargement
    let loadingTimer = setTimeout(renderLoadingCard, 300);

    try {
        // lancement des requêtes
        let data = await fetchWeatherData(url);
        let hourlyForecastData = await fetchWeatherData(urlNextHours);

        let townName = data["name"].toLowerCase().trim();

        // intégration visuelle des données météo
        renderCurrentWeather(data);
        renderHourlyForecast(hourlyForecastData);
        renderNextDays(hourlyForecastData);

        // enregistrement du nom de la ville, de la température et de l'heure
        saveLastData(data);

        // enregistrement du nom de la ville dans le localStorage si la limite n'est pas atteinte
        let storageResult = saveToLocalStorage(townName,TAB_LIMIT);
        if (storageResult === "limit") {
            alert("Limite d'onglets atteinte. Votre recherche s'affichera mais ne disposera pas d'un onglet comme raccourci. Supprimez des onglets pour enregistrer des nouvelles villes");

            // lorsque la limite est atteinte, la ville recherchée ne disposera pas d'onglet mais sa météo sera affichée, il faut donc désactiver le dernier onglet actif pour ne pas tromper l'utilisateur sur la ville affichée
            // utilisation de null pour désactiver l'ancien onglet sans en activer un nouveu
            setActiveTab(null);
        };

    return {
        "name" :townName,
        "storageResult" : storageResult,
    };
    } finally {
        clearTimeout(loadingTimer);
        clearCard(".loading-overlay");
    };
};

// == Lancer la dernière requête ==
async function retryLastRequest() {
    // gérer la déclaration de null pour éviter l'interception d'erreur
    if (lastRequest === null) {
        return;
    };

    // dernière requête = recherche par nom
    if (lastRequest["type"] === "name") {
        try{
            // récupération et affichage des données du bloc météo actuelle
            let lastSearch =  await loadCity(lastRequest["town"]);
            // vider la barre de recherche
            searchInput.value = "";

            // gestion des onglets
            if (lastSearch["storageResult"] === "limit") {
                return;
            };
            showCityTab(lastSearch["name"]);
        } catch(error) {
            showRequestError(error);
        };

    // dernière requête = recherche par coordonnées
    } else if (lastRequest["type"] === "coords") {
        try {
            await loadCityByCoords(lastRequest["lat"], lastRequest["lon"]);
        } catch(error) {
            showRequestError(error);
        };
    };
};

// == Afficher les erreurs de requêtes ==
function showRequestError(error) {
    // message personnalisé si la ville n'est pas trouvée pour que l'utilisateur comprenne l'erreur
    if (error.message === "CITY_NOT_FOUND") {
        // délai avant l'affichage de l'alerte pour laisser le temps au navigateur de retirer la carte de chargement
        setTimeout( () => alert(" La ville recherchée est introuvable, veuillez vérifier l'orthographe"), 50);
    } else {
        console.log("Erreur: ", error.name, error.message);
        // création de la carte d'état, lancement de la dernière requête avec désactivation du bouton de relance
        // si la requête échoue de nouveau, une nouvelle carte est créee avec un bouton actif
        // pas de parenthèse pour retryLastRequest car appelée par click sur bouton
        downAPI(lastData, retryLastRequest);
    };
};

// == Onglets ==
// = Changement de l'onglet actif ou création d'un nouvel onglet
function showCityTab(townName) {
    // certaines données de géolocalisation n'étant pas rattachées à une ville, l'onglet créé serait vide (coordonnées en mer par exemple)
    // si townName est vide, il n'y a pas de création d'onglets
    if (townName === "") {
        return;
    };
    let existingTab = findTab(townName);
    if (existingTab) {
        setActiveTab(existingTab);
    } else {
        insertNewTab(townName, handleTabClick, deleteTownTab);
    };
};

// = Réaction au clic sur onglet =
async function handleTabClick(townName) {
    try {
        await loadCity(townName);
        setActiveTab(findTab(townName));
    } catch(error) {
        showRequestError(error);
    };
};

// == Supprimer un onglet ==
// supprime la ville du localStorage et l'onglet correspondant
// la suppresion d'un onglet affiche les données de la première ville du localStorage
// la suppression du dernier onglet, renvoie l'écran de bienvenue
async function deleteTownTab(townName) {
    removeFromLocalStorage(townName);
    let tab = findTab(townName);
    removeTab(tab);
    if (tab.classList.contains("active")) {
        let localStorage = importLocalStorage();
        let firstTown = localStorage[0];
        if (localStorage.length !== 0) {
            try {
                await loadCity(firstTown);
                setActiveTab(findTab(firstTown));
            } catch(error) {
                showRequestError(error);
            };
        } else {
            let permissionResult = await getPermissionStatus();
            if (permissionResult === "denied") {
                renderBlockedCard(false);
            } else {
                renderWelcomeCard(loadGeolocation, false);
            };
        };
    };
};

//== Savoir si des villes sont enregistrées comme onglets ==
function hasSavedTowns(){
    if (importLocalStorage().length > 0) {
        return true;
    };
};


// == Géolocalisation ==

// = Charge et affiche la météo par coordonnées, puis active ou crée l'onglet =
// les erreurs sont gérées par la fonction d'appel handleGeolocationSuccess
async function loadCityByCoords(lat,lon) {

    let currentUrlByCoords = getCurrentWeatherUrlByCoords(lat,lon, APIKEY, LANG, UNIT);
    let hourlyForecastUrlByCoords = getHourlyForecastUrlByCoords(lat,lon, APIKEY, LANG, UNIT);

    // sauvegarde des paramètres de la requête
    lastRequest = {
        "type" : "coords",
        "lat" : lat,
        "lon" : lon,
    };

    let loadingTimer = setTimeout(renderLoadingCard, 300);

    try {
        let data = await fetchWeatherData(currentUrlByCoords);
        let hourlyForecastData = await fetchWeatherData(hourlyForecastUrlByCoords);
        let townName = data["name"].toLowerCase().trim();

        // récupération et affichage des données du bloc météo actuelle
        renderCurrentWeather(data);
        renderHourlyForecast(hourlyForecastData);
        renderNextDays(hourlyForecastData);

        // enregistrement du nom de la ville, de la température et de l'heure
        saveLastData(data);

        // enregistrement du nom de la ville dans le localStorage
        let storageResult = saveToLocalStorage(townName,TAB_LIMIT);
        if (storageResult === "limit") {
            alert("Limite d'onglets atteinte. Votre recherche s'affichera mais ne disposera pas d'un onglet comme raccourci. Supprimez des onglets pour enregistrer des nouvelles villes");
            setActiveTab(null);
            return;
        };
        showCityTab(townName);

    } finally {
        clearTimeout(loadingTimer);
        clearCard(".loading-overlay");
    };
};

// = Récupérer les données de géolocalisation, lancer la requête, afficher le rendu et attraper les erreurs =
async function handleGeolocationSuccess(position) {
    let userLat = position.coords.latitude;
    let userLon = position.coords.longitude;

    try {
        await loadCityByCoords(userLat, userLon);
    } catch (error) {
        showRequestError(error);
    };
};

// = Gérer les erreurs de géolocalisation =
function handleGeolocationError(error) {
    switch(error.code) {
        // Refus
        case 1:
            alert("Localisation refusée. Veuillez utiliser la barre de recherche");
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
async function getPermissionStatus() {
    if ("geolocation" in navigator) {
        try {
            let result = await navigator.permissions.query({name:"geolocation"});
            return result.state;
        } catch (error) {
            console.log("Statut de permission non défini : ", error.message);
            // si le statut n'est pas défini, utilisation de prompt par défaut pour laisser le choix à l'utilisateur
            return "prompt";
        };
    } else {
        return "unavailable";
    };
};

// == Demander la position au navigateur et afficher la météo correspondante ==
function loadGeolocation() {
    // si le statut est "prompt" : appelle la fenêtre d'autorisation
    // si le statut est "granted" : affiche la météo directement sans fenêtre
    navigator.geolocation.getCurrentPosition(handleGeolocationSuccess, handleGeolocationError, GEOLOCATION_OPTIONS);
};

// == Gestion des requêtes et de l'affichage selon les autorisations ==
async function initGeolocation() {
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
            renderWelcomeCard(loadGeolocation, hasSavedTowns());
            break;

        // refus
        // l'utilisateur devra utiliser la barre de recherche
        case "denied":
            renderBlockedCard(hasSavedTowns());
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

// == FOOTER - INFORMATIONS LEGALES ==
async function loadLegalContent() {
    if (legalLoaded) {
        return;
    };
    try {
        const HTML = await fetchLegalDialog();
        renderLegalContent(HTML);
        legalLoaded = true;
    } catch(error) {
        showLegalError();
    };
};

// === CODE PRINCIPAL ===

// == Interrogation du localStorage ==
// Si le localStorage est vide, aucun onglet n'est crée
// Si le localStorage contient des données, un onglet est crée pour chaque ville et permet de lancer les requêtes correspondantes au clic
// un appui long sur un onglet supprime l'onglet et la ville du localStorage
insertLocalStorageTab(handleTabClick, deleteTownTab);

// == Récupération de l'input barre de recherche ==
let searchBar = document.querySelector("#search");
let searchInput = document.querySelector("#search-bar");

// == Lancement des requêtes depuis barre de recherche ==
searchBar.addEventListener("submit", async (getCityName) => {
    getCityName.preventDefault();
    let cityName = (searchInput.value).toLowerCase().trim();
    if (cityName === "") {
        alert(" Aucune ville recherchée, veuillez indiquer une ville dans la barre de recherche");
    } else {
        try {
            // récupération et affichage des données du bloc météo actuelle
            let search =  await loadCity(cityName);

            // vider la barre de recherche
            searchInput.value = "";

            // gestion des onglets
            if (search["storageResult"] === "limit") {
                return;
            };
            showCityTab(search["name"]);

        } catch(error) {
            showRequestError(error);
        };
    };
});

// == Recherche par géolocalisation ==
initGeolocation();

// Injecter l'adresse email dans le footer au chargement de la page
fillContactMail();

// ouverture de la feuille et chargement des informations légales
initLegalDialog(loadLegalContent);