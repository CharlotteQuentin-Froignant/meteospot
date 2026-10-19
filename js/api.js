// === CREATION DES URLS ===
export function getCurrentWeatherUrl(city, APIKEY, LANG, UNIT){
    // protection contre l'injection de paramètres : encodage des données externes provenant de l'utilisateur
    let encodedCity = encodeURIComponent(city);
    let currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${APIKEY}&lang=${LANG}&units=${UNIT}`;
    return currentUrl;
};

export function getHourlyForecastUrl(city, APIKEY, LANG, UNIT){
    let encodedCity = encodeURIComponent(city);
    let urlHourlyForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&appid=${APIKEY}&lang=${LANG}&units=${UNIT}`;
    return urlHourlyForecast;
};

export function getCurrentWeatherUrlByCoords(lat, lon, APIKEY, LANG, UNIT){
    let currentUrlByCoords = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&lang=${LANG}&units=${UNIT}`;
    return currentUrlByCoords;
};

export function getHourlyForecastUrlByCoords(lat, lon, APIKEY, LANG, UNIT){
    let hourlyForecastUrlByCoords = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKEY}&lang=${LANG}&units=${UNIT}`;
    return hourlyForecastUrlByCoords;
};

// === REQUETES ===
const REQUEST_TIMEOUT = 10000;
// Lancement des requêtes, envoi des résulats sous forme json ou affichage d'une erreur
export async function fetchWeatherData(url){
    const RESPONSE = await fetch(url, {signal: AbortSignal.timeout(REQUEST_TIMEOUT)});
    let data = await RESPONSE.json();

    // gestion des erreurs
    if (!RESPONSE.ok){
        // erreur sur laquelle l'utilisateur peut intervenir
        if (RESPONSE.status === 404){
            // throw stoppe l'exécution de la fonction, et renvoie l'erreur dans le catch de main.js
            throw new Error("CITY_NOT_FOUND");
        } else {
            // pour les erreurs dues au système, l'erreur est créee avec le message renvoyé par OpenWeatherMap
            throw new Error(data.message);
        };
    };

    // si on arrive à cette étape, RESPONSE.ok est true
    return data;
};