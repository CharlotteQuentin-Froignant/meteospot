// === ETATS DE L'APPLICATION ==

import { clearMainContent } from "./clear.js";
import { getLocalDateTime } from "../utils.js";

// == Création des cartes d'état ==
function createStateCard(stateParameters) {
    // Créer la carte
    let stateCard = document.createElement("div");
    stateCard.className = "state-card";
    stateCard.classList.add("state-card-" + stateParameters["stateType"]);
    stateCard.setAttribute("role", stateParameters["stateRole"]);

    // icône
    let stateCardIcon = document.createElement("img");
    stateCardIcon.className = "state-icon";
    stateCardIcon.src = stateParameters["stateIcon"];
    // le titre évoque déjà l'erreur et l'icone est décorative, mettre une description alt ferait doublon
    stateCardIcon.alt = "";
    stateCard.appendChild(stateCardIcon);

    // titre
    let stateCardTitle = document.createElement("h2");
    stateCardTitle.className = "state-card-title";
    stateCardTitle.textContent = stateParameters["stateTitle"];
    stateCard.appendChild(stateCardTitle);

    // message
    let stateCardText = document.createElement("p");
    stateCardText.className = "state-card-text";
    stateCardText.textContent = stateParameters["stateText"];
    stateCard.appendChild(stateCardText);

    // création d'un bouton uniquement si stateButtonTest est présent
    if (stateParameters["stateButtonText"]) {
        let stateCardButton = document.createElement("button");
        stateCardButton.className = "state-button";
        stateCardButton.textContent = stateParameters["stateButtonText"];
        stateCard.appendChild(stateCardButton);
    };
    return stateCard;
};


// == Etat : API Indisponible ==
export function downAPI (lastData, onRetry) {
    // Supprimer les cartes d'états et de météo déjà présentes et le bouton de localisation
    clearMainContent();

    // Créer la carte d'état
    // l'icône doit être préchargée dans index.html car son affichage est bloqué lors des échecs requêtes
    let stateParameters = {
        "stateType" : "error",
        "stateRole" : "alert",
        "stateIcon" : "assets/icons/static/unavailable.svg",
        "stateTitle" : "Météo indisponible",
        "stateText" : "Impossible de récupérer les données météo pour le moment. Vérifiez votre connexion, puis réessayer.",
        "stateButtonText" : "Réessayer",
    };

    let stateCard = createStateCard(stateParameters);

    // Relancer la dernière requête au clic et désactiver le bouton
    const API_BUTTON = stateCard.querySelector(".state-button");
    API_BUTTON.addEventListener("click", () => {
        API_BUTTON.disabled = true;
        onRetry();
    });

    // Obtenir et afficher les dernières données connues
    if (lastData !== null) {
        let apiLastData = document.createElement("div");
        apiLastData.className = "api-last-data";
        stateCard.appendChild(apiLastData);

        let apiLastText = document.createElement("span");
        apiLastText.className = "api-last-text";
        apiLastText.textContent = "Dernière donnée connue: ";
        apiLastData.appendChild(apiLastText);

        let apiLastCity = document.createElement("span");
        apiLastCity.className = "api-last-city";
        apiLastCity.textContent = lastData["city"] +", ";
        apiLastData.appendChild(apiLastCity);

        let apiLastTemp = document.createElement("span");
        apiLastTemp.className = "api-last-temp";
        apiLastTemp.textContent = Math.round(lastData["temp"]) + "°C ";
        apiLastData.appendChild(apiLastTemp);

        let apiLastTime = document.createElement("span");
        apiLastTime.className = "api-last-time";
        let localTime = getLocalDateTime(lastData["dt"], lastData["timezoneOffset"]);
        apiLastTime.textContent = "à " + localTime["time"];
        apiLastData.appendChild(apiLastTime);
    };

    // Insertion de la carte d'état
    let target = document.querySelector(".current-weather");
    target.appendChild(stateCard);
};


// == Etat : Bienvenue (prompt) ==
export function renderWelcomeCard(onActivate, hasTabs) {
    // vider le contenu existant
    clearMainContent();

    // paramètre pour la création de la carte d'état bienvenue
    let stateText;
    if (hasTabs) {
        stateText = "Autorisez la localisation, recherchez une ville, ou choisissez un de vos onglets pour afficher la météo."
    } else {
        stateText = "Autorisez la localisation pour voir la météo de votre ville, ou recherchez-en une pour commencer";
    };
    let stateParameters = {
        "stateType" : "info",
        "stateRole" : "status",
        "stateIcon" : "assets/icons/static/geolocation-off.svg",
        "stateTitle" : "Bienvenue",
        "stateText" : stateText,
        "stateButtonText" : "Autoriser la localisation",
    };

    let welcomeCard = createStateCard(stateParameters);

    // Ouvrir la fenêtre des permission du navigateur au clic
    const PERMISSION_BUTTON = welcomeCard.querySelector(".state-button");
    PERMISSION_BUTTON.addEventListener("click", (event) =>{
        event.preventDefault();
        onActivate();
    });

    // Insertion de la carte d'état
    let target = document.querySelector(".current-weather");
    target.appendChild(welcomeCard);
};


// == Etat : Localisation bloquée (denied) ==
export function renderBlockedCard(hasTabs) {
    // vider le contenu existant
    clearMainContent();

    // paramètre pour la création de la carte d'état bienvenue
    let stateText;
    if (hasTabs) {
        stateText = "Autorisez la localisation depuis la barre d'adresse du navigateur, recherchez une ville, ou choisissez un de vos onglets pour afficher la météo.";
    } else {
        stateText = "Autorisez la localisation depuis la barre d'adresse du navigateur, ou recherchez une ville pour afficher la météo.";
    };

    let stateParameters = {
        "stateType" : "info",
        "stateRole" : "status",
        "stateIcon" : "assets/icons/static/geolocation-off.svg",
        "stateTitle" : "Localisation désactivée",
        "stateText" : stateText,
    };

    let blockedCard = createStateCard(stateParameters);

    // Insertion de la carte d'état
    let target = document.querySelector(".current-weather");
    target.appendChild(blockedCard);
};


// == Etat : En cours de chargement ==
export function renderLoadingCard() {
    // paramètre pour la création de la carte d'état bienvenue
    let loadingOverlay = document.createElement("div");
    loadingOverlay.className = "loading-overlay";

    let stateParameters = {
        "stateType" : "loading",
        "stateRole" : "status",
        "stateIcon" : "assets/icons/animated/sunny-animated.svg",
        "stateTitle" : "Chargement en cours ...",
        "stateText" : "La météo s'affiche dans un instant",
    };

    let loadCard = createStateCard(stateParameters);
    loadingOverlay.appendChild(loadCard);

    // Insertion de la carte d'état
    let target = document.querySelector("main");
    target.appendChild(loadingOverlay);
};