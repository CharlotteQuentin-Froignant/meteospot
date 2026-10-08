// === GESTION DES ICONES ===
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

export function getStaticIcon(hourlyWeatherID, hourlyIconCode){
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

// === GESTION DES HEURES ET DE LA DATE ===
// == Obtenir la date et l'heure locale ==

export function getLocalDateTime(timestamp, timezoneOffset){
    // addition du timestamp et du décalage horaire pour obtenir le temps local
    let fullTime = timestamp + timezoneOffset;
    // création d'un objet Date en JS, nécessité de convertir les s en ms pour le js
    let dateObject = new Date(fullTime *1000);

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
            "date": localDate,
            "time": localTime};
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

