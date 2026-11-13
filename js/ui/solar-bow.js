// === ARC SOLAIRE ===
import { getTimePoint, getBezierPoint, getLocalDateTime } from "../utils.js";

export function renderSolarBow(data, weatherCard) {
    let sunriseTimestamp = data["sys"]["sunrise"];
    let sunsetTimestamp = data["sys"]["sunset"];
    let currentTimestamp = data["dt"];
    let timezoneOffset = data["timezone"];

    // configuration de l'arc pour la nuit
    // definition d'un booléen pour gérer la condition de nuit
    let isNight = currentTimestamp < sunriseTimestamp || currentTimestamp > sunsetTimestamp;
    let timePoint;
    if (isNight) {
        // choix d'un timepoint fixe pour placer le soleil endormi
        timePoint = 0.5;
    } else {
        // si on est en journée, la vraie position du soleil est calculée et affichée
        timePoint = getTimePoint(currentTimestamp, sunriseTimestamp, sunsetTimestamp);
    };

    let sunPosition = getBezierPoint(timePoint);

    let sunriseDateTime = getLocalDateTime(sunriseTimestamp, timezoneOffset);
    let sunsetDateTime = getLocalDateTime(sunsetTimestamp, timezoneOffset);
    let currentDateTime = getLocalDateTime(currentTimestamp, timezoneOffset);

    // injection de l'arc solaire, comme SVG n'est pas du html, il faut utiliser document.createElementNS
    // 1- dire au navigateur qu'il s'agit d'un svg
    const SVG_NS = "http://www.w3.org/2000/svg";

    // 2-créer l'élément svg
    let solarBow = document.createElementNS(SVG_NS, "svg");

    // 3-configurer le svg : utilisation de setAttribute (méthode standard pour définir tous les attributs d'un svg et utilisable aussi sur du html)
    // utilisation de toggle pour gérer facilement les changements nocturnes
    // si la condition isNight est vraie, alors la classe night-mode est ajoutée automatiquement
    solarBow.classList.toggle("night-mode", isNight);
    solarBow.setAttribute("viewBox","0 0 340 90");
    solarBow.setAttribute("role", "img");
    solarBow.setAttribute("aria-label", "Lever du soleil " + sunriseDateTime["time"] + ", coucher " + sunsetDateTime["time"] + ", mise à jour " + currentDateTime["time"]);
    weatherCard.appendChild(solarBow);

    let solarBowPath = document.createElementNS(SVG_NS, "path");
    solarBowPath.setAttribute("class","bow");
    solarBowPath.setAttribute("d","M 10 78 Q 170 -20 330 78");
    solarBow.appendChild(solarBowPath);

    let solarBowSunHalo = document.createElementNS(SVG_NS, "circle");
    solarBowSunHalo.setAttribute("class","halo");
    solarBowSunHalo.setAttribute("cx",sunPosition["x"]);
    solarBowSunHalo.setAttribute("cy",sunPosition["y"]);
    solarBowSunHalo.setAttribute("r", "15");
    solarBow.appendChild(solarBowSunHalo);

    let solarBowSun = document.createElementNS(SVG_NS, "circle");
    solarBowSun.setAttribute("class","sun");
    solarBowSun.setAttribute("cx",sunPosition["x"]);
    solarBowSun.setAttribute("cy",sunPosition["y"]);
    solarBowSun.setAttribute("r", "10");
    solarBow.appendChild(solarBowSun);

    // 4-injecter les heures et la date
    let sunriseTime = document.createElementNS(SVG_NS, "text");
    sunriseTime.setAttribute("class", "solar-bow-text sunrise-text");
    sunriseTime.setAttribute("x", "10");
    sunriseTime.setAttribute("y", "75");
    sunriseTime.setAttribute("text-anchor", "start");
    sunriseTime.textContent = sunriseDateTime["time"];
    solarBow.appendChild(sunriseTime);

    let sunriseLabel = document.createElementNS(SVG_NS, "text");
    sunriseLabel.setAttribute("class", "solar-bow-text sunrise-label");
    sunriseLabel.setAttribute("x", "10");
    sunriseLabel.setAttribute("y", "85");
    sunriseLabel.setAttribute("text-anchor", "start");
    sunriseLabel.textContent = "Lever";
    solarBow.appendChild(sunriseLabel);

    let currentTime = document.createElementNS(SVG_NS, "text");
    currentTime.setAttribute("class", "solar-bow-text current-label");
    currentTime.setAttribute("x", "170");
    currentTime.setAttribute("y", "75");
    currentTime.setAttribute("text-anchor", "middle");
    currentTime.textContent = currentDateTime["time"];
    solarBow.appendChild(currentTime);

    let currentDate = document.createElementNS(SVG_NS, "text");
    currentDate.setAttribute("class", "solar-bow-text current-text");
    currentDate.setAttribute("x", "170");
    currentDate.setAttribute("y", "85");
    currentDate.setAttribute("text-anchor", "middle");
    currentDate.textContent = currentDateTime["date"];
    solarBow.appendChild(currentDate);

    let sunsetTime = document.createElementNS(SVG_NS, "text");
    sunsetTime.setAttribute("class", "solar-bow-text sunset-text");
    sunsetTime.setAttribute("x", "325");
    sunsetTime.setAttribute("y", "75");
    sunsetTime.setAttribute("text-anchor", "end");
    sunsetTime.textContent = sunsetDateTime["time"];
    solarBow.appendChild(sunsetTime);

    let sunsetLabel = document.createElementNS(SVG_NS, "text");
    sunsetLabel.setAttribute("class", "solar-bow-text sunset-label");
    sunsetLabel.setAttribute("x", "330");
    sunsetLabel.setAttribute("y", "85");
    sunsetLabel.setAttribute("text-anchor", "end");
    sunsetLabel.textContent = "Coucher";
    solarBow.appendChild(sunsetLabel);

    // svg et texte à ajouter pour la nuit
    if (isNight) {
        let zzzText = document.createElementNS(SVG_NS, "text");
        zzzText.setAttribute("class", "zzz-text");
        zzzText.setAttribute("x", sunPosition["x"] + 10);
        zzzText.setAttribute("y", sunPosition["y"] - 5);
        zzzText.textContent = "zZz";
        solarBow.appendChild(zzzText);

        let nextSunrise = document.createElementNS(SVG_NS, "text");
        nextSunrise.setAttribute("class", "solar-bow-text current-text");
        nextSunrise.setAttribute("x", "170");
        nextSunrise.setAttribute("y", "55");
        nextSunrise.setAttribute("text-anchor", "middle");
        nextSunrise.textContent = "Prochain lever: " + sunriseDateTime["time"];
        solarBow.appendChild(nextSunrise);
    };
};