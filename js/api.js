// === CREATION DES URLS ===
export function getCurrentWeatherUrl(city, APIKEY, LANG, UNIT){
    // protection contre l'injection de paramètres : encodage des données externes provenant de l'utilateur
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
// ==  Météo actuelle ==
export async function fetchCurrentWeather(url){

    const RESPONSE = await fetch(url);
    let data = await RESPONSE.json();

    // gestion des erreurs
    if (!RESPONSE.ok){
        // erreur sur laquelle l'utilisateur peut intervenir
        if (RESPONSE.status === 404){
            // throw stoppe l'éxécution de la fonction, et renvoie l'erreur dans le catch de main.js
            throw new Error("CITY_NOT_FOUND");
        } else {
            // pour les erreurs dues au système, l'erreur est crée avec le message renvoyé par OpenWeatherMap
            throw new Error(data.message);
        };
    };

    // si on arrive à cette étape, RESPONSE.ok est true
    return data;
};

// == Prévisions horaires ==
export async function fetchHourlyForecast(urlHourlyForecast){

    const RESPONSE = await fetch(urlHourlyForecast);
    let hourlyForecastData = await RESPONSE.json();

    // interceptions des erreurs
    if (!RESPONSE.ok){
    if (RESPONSE.status === 404){
        throw new Error("CITY_NOT_FOUND");
    } else {
        throw new Error(hourlyForecastData.message);
    };
};
    return hourlyForecastData;
};
