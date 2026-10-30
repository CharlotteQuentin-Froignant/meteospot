// === GESTION DES ICONES ===
const ICON_LABEL = {
    "01": "Ciel dégagé",
    "02": "Peu nuageux",
    "03": "Nuageux",
    "04": "Couvert",
    "09": "Averses",
    "10": "Pluie",
    "11": "Orage",
    "13": "Neige",
    "50": "Brume",
};

export function getIconLabel(iconCode){
    let icon = iconCode.slice(0,2);
    let label = ICON_LABEL[icon];
    if (label === undefined){
        return "";
    };
    return label;
};

export function getIcon(weatherID, iconCode){
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

export function getStaticIcon(staticWeatherID, staticIconCode){
    if (staticWeatherID === 906){
            return "assets/icons/static/hail.svg";
        } else {
            switch(staticIconCode){
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

// === PALETTE DYNAMIQUE DE COULEURS ===
// == Identifier la tranche à laquelle appartient la température actuelle
// Prend en paramètre la température récupérée par renderCurrentWeather(data) et return le nom de la tranche correspondante
export function getTempPalette(temp){
    // vérifier que la température est bien un nombre valide
    if(!Number.isFinite(temp)){
        return null;
    };
    // déclarer les limites des tranches de températures et leur description
    if(temp < 0){
        return "tres-froid";
    };
    if(temp < 10){
        return "froid";
    };
    if(temp < 18){
        return "frais";
    };
    if(temp < 24){
        return "doux";
    };
    if(temp < 35){
        return "chaud";
    };
    if(temp < 40){
        return "tres-chaud";
    };
    // 40°C et plus
    return "extreme";
    };

// == Appliquer la couleur selon la température actuelle ==
export function applyTempPalette(temp){
    let palette = getTempPalette(temp);
    let target = document.querySelector(".weather-card");
    if (target === null){
        return;
    };
    if(palette === null){
        target.removeAttribute("data-temp-palette");
        return;
    };
    target.setAttribute("data-temp-palette", palette);
};

// === GESTION DES HEURES ET DE LA DATE ===
// == Obtenir le jour, la date et l'heure locale ==

export function getLocalDateTime(timestamp, timezoneOffset){
    // addition du timestamp et du décalage horaire pour obtenir le temps local
    let fullTime = timestamp + timezoneOffset;
    // création d'un objet Date en JS, nécessité de convertir les s en ms pour le js
    let dateObject = new Date(fullTime *1000);

    let localDayName = dateObject.toLocaleDateString("fr-FR",
        {
            weekday : "short",
            timeZone: "UTC",
        });

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
            "dayName": localDayName,
            "date": localDate,
            "time": localTime,
        };
};

// Obtenir uniquement l'heure
export function getHoursOnly(timestamp, timezoneOffset){
    let fullTime = timestamp + timezoneOffset;
    let DateObject = new Date(fullTime *1000);

    // obtenir les heures
    let hours = DateObject.getUTCHours();
    return hours;
};

// === ARC SOLAIRE ===
// == Fonctions pour définir la position du soleil sur l'arc solaire ==
// conversion de l'heure actuelle en avancement de la journée (0 = lever ; 1=coucher)
export function getTimePoint(currentTimestamp, sunriseTimestamp, sunsetTimestamp){
    let timePoint = ((currentTimestamp - sunriseTimestamp)/(sunsetTimestamp - sunriseTimestamp));
    return timePoint;
};

// Calcule la position (X, Y) du soleil sur l'arc SVG (courbe de Bézier quadratique)
// solution la plus simple à metre en place pour réaliser un arc en svg car ne necessite que 3 points d'ancrage
export function getBezierPoint(timepoint){
    // Les valeurs correspondent aux 3 points (x,y) de la courbe : Départ (10,78), Zénith (170,-20), Arrivée (330,78).
    let xposition = ((1 - timepoint)**2) * 10 + 2 * (1 - timepoint) * timepoint * 170 + (timepoint**2) * 330;
    let yposition = ((1 - timepoint)**2) * 78 + 2 * (1 - timepoint) * timepoint * (-20) + (timepoint**2) * 78;
    return { x: xposition, y: yposition };
};

// === PREVISIONS DES PROCHAINS JOURS ===
// Les prévisions de l'API arrivent par créneaux de 3h, soit 40 créneaux sur 5 jours
// Les fonctions ci-dessous les regroupent par jour pour obtenir, pour chaque jour, les informations à afficher

// == Regrouper les créneaux par date locale ==
function groupForecastDataByDate(timezoneOffset, forecastDataList){
    let dates = {};

    for (let item of forecastDataList){
        let timestamp = item["dt"];
        // Classer toutes les données par date et obtenir le nom du jour
        let localDateTime = getLocalDateTime (timestamp, timezoneOffset);
        let dayName = localDateTime["dayName"];
        let localDate = localDateTime["date"];

        // paramétrer la date comme clé de l'objet
        if (!dates[localDate]){
            dates[localDate] = {
                "dayName" : dayName,
                "daySlots": [],
            };
        };
        // ajouter les données à la date correspondante
        dates[localDate]["daySlots"].push(item);
    };
    return dates;
};

// == Résumer un jour ==
// Reçoit les créneaux horaires d'un seul jour et renvoie les données qui seront affichées
function summarizeDay(daySlots, dayName ){
    let nextDayInfos = {};

    // regrouper les valeurs de chaque créneau
    // informations à afficher : icone météo, température min et max, probabilité de précipitation, vitesse maximale du vent
    let iconCodes = [];
    let temp = [];
    let rainProbabilities = [];
    let windSpeeds = [];

    for (let item of daySlots){
        let icon = item["weather"][0]["icon"];
        let iconValues = icon.slice(0,2); // 2 premiers caractères seulement pour regrouper jour et nuit
        iconCodes.push(iconValues);

        let tempValues = item["main"]["temp"];
        temp.push(tempValues);

        let popValues = item["pop"];
        rainProbabilities.push(popValues);

        let windValues = item["wind"]["speed"];
        windSpeeds.push(windValues)
    };

    // définition des valeurs minimales et / ou maximales et normalisation des données
    let minTemperature = Math.min(...temp);
    let maxTemperature = Math.max(...temp);
    let maxRainProbability = Math.round((Math.max(...rainProbabilities) * 100));
    let maxWindSpeed = Math.round((Math.max(...windSpeeds) * 3.6));

    // Obtenir l'icône la plus fréquente pour chaque jour
    let iconsCounts = {};
    for(let code of iconCodes){
        if (!iconsCounts[code]){
            iconsCounts[code] = 0;
        };
        iconsCounts[code] = iconsCounts[code] + 1;
    };

    let bestOccurence = "";
    let bestCount = 0;
    for (let occurence in iconsCounts){
        if (iconsCounts[occurence] > bestCount){
            bestOccurence = occurence;
            bestCount = iconsCounts[occurence];
        };
    };

    // Regrouper les données à afficher dans un objet
    nextDayInfos = {
        "dayName" : dayName,
        "icon" : bestOccurence,
        "minTemperature" : minTemperature,
        "maxTemperature" : maxTemperature,
        "maxRainProbability": maxRainProbability,
        "maxWindSpeed" : maxWindSpeed,
    };
    return nextDayInfos;
};


// == Obtenir les informations à afficher pour les 4 prochains jours ==
// La fenêtre de l'API s'arrêtant 5 jours après l'heure actuelle, le 5ème jour ne serait pas forcément complet à l'affichage. Pour éviter cela, seuls les 4 prochains jours sont affichés.
// Regroupe les créneaux horaires, retire la date d'aujourd'hui des données à afficher et calcule les données pour chaque jour
// Renvoie un tableau contenant les informations attendues pour les 4 jours
export function groupNextDays(hourlyForecastData){
    let timezoneOffset = hourlyForecastData["city"]["timezone"];
    let forecastDataList = hourlyForecastData["list"];

    // obtenir le jour actuel
    let today = (Date.now() / 1000); // Date.now renvoie le timestamp en ms et getLocalDateTime attend des secondes
    let todayDate = getLocalDateTime(today, timezoneOffset);

    let dates = groupForecastDataByDate(timezoneOffset, forecastDataList);

    let nextDaysData = [];
    for (let localDate in dates){
        let daySlots = dates[localDate]["daySlots"];
        let dayName = dates[localDate]["dayName"];

        // Ne pas prendre en compte la date du jour actuel
        if (localDate === todayDate["date"]){
            continue;
        };

        let dayData = summarizeDay(daySlots,dayName);
        nextDaysData.push(dayData);
    };
    return nextDaysData.slice(0,4);
};

// === LOCAL STORAGE ===
// Les noms des villes recherchées préalablement doivent être enregistrées dans le local storage pour que les onglets soient disponibles au chargement de l'application

// == Enregistrer les noms de villes ==
// création d'un tableau vide si la clé "searched-towns" n'exsite pas dans le localStorage
// selon l'action effectuée, retourne 'duplicate', 'success', ou 'limit'
export function saveToLocalStorage(townName, TAB_LIMIT){
    let searchedTowns = JSON.parse(localStorage.getItem("searched-towns"));
    if (searchedTowns === null){
        searchedTowns =[];
    };

    // éviter les doublons
    if (searchedTowns.includes(townName)){
        return "duplicate";
    };

    if (searchedTowns.length < TAB_LIMIT){
        searchedTowns.push(townName);
        localStorage.setItem("searched-towns", JSON.stringify(searchedTowns));
        return "success";
    } else {
        return "limit";
    };
};

// == Récupérer les données du localStorage
// renvoie un tableau vide si le local storage est vide
export function importLocalStorage(){
    let searchedTowns = JSON.parse(localStorage.getItem("searched-towns"));
    if (searchedTowns === null){
        return [];
    };
    let towns = [];
    for (let i = 0; i < searchedTowns.length; i++){
        towns.push(searchedTowns[i]);
    };
    return towns;
}

// == Supprimer une ville du localStorage ==
// utilisatio de filtrer pour conserver les autres villes dans le localStorage
// filter renvoie 'true' si la condition est vraie, 'false' si elle ne l'est pas
export function removeFromLocalStorage(townName){
    let searchedTowns = JSON.parse(localStorage.getItem("searched-towns"));
    let newTowns = searchedTowns.filter((town) => town !== townName);
    localStorage.setItem("searched-towns", JSON.stringify(newTowns));
};

// === EVENEMENTS ===
// == Ajouter un appui long sur l'onglet ==
// l'action ne sera déclenchée qu'après expiration du timer
// le temps est en millisecondes
// ajoute les évènements pour l'utilisation mobile tactile et une utilisation avec la souris
export function attachLongPress(tab, townName, onLongPress){
    let pressTimer;

    function startPress(){
        pressTimer = setTimeout(() => onLongPress(townName),900);
    };

    function cancelPress(){
        clearTimeout(pressTimer);
    };

    // la détection de l'appuie déclenche le timer
    tab.addEventListener("mousedown", startPress);
    tab.addEventListener("touchstart", startPress);

    // l'arrêt de l'appui ou un déplacement en dehors de l'onglet arrête le timer
    tab.addEventListener("mouseup", cancelPress);
    tab.addEventListener("mouseleave", cancelPress);
    tab.addEventListener("touchend", cancelPress);
    tab.addEventListener("touchcancel", cancelPress);
};