// === ONGLETS ===
import {  importLocalStorage, attachLongPress, attachKeyBoardDelete } from "../utils.js";


// == Déterminer si la ville recherchée a déjà un onglet ou non ==
export function findTab(townName) {
    // interrogation du DOM
    let allTabs = document.querySelectorAll(".town-tab");
    for (let item of allTabs) {
        let town = item.textContent.toLowerCase().trim();
        if (town === townName) {
            return item;
        };
    };
    return null;
};

// == Créer les onglets ==
// prend en paramètres 'onClick' pour lancer les requêtes API au clic et 'onLongPress' pour supprimer l'onglet avec un appui long
// attribuer une double classe pour l'onglet actif
// type button pour gérer l'accessibilité et l'interaction avec le clavier
export function insertNewTab(townName, onClick, onLongPress) {
    // création et insertion de l'onglet
    let targetTab = document.querySelector(".searched-towns");
    let tab = document.createElement("button");
    tab.className = "town-tab";
    tab.textContent = townName;
    tab.setAttribute("aria-label", townName + ". Touche entrée lance la recherche météo, touches supp/retour arrière supprime l'onglet");
    targetTab.appendChild(tab);

    // ajout de l'écouteur d'évènement sur le clic
    // fonction onClick à configurer dans main.js
    tab.addEventListener("click", () => onClick(townName));
    attachLongPress(tab,townName, onLongPress);
    attachKeyBoardDelete(tab, townName, onLongPress);
    setActiveTab(findTab(townName));
};

// == Changement de classe des onglets ==
export function setActiveTab(tabToActivate){
    let activeTab = document.querySelector(".town-tab.active");
    if (activeTab) {
        activeTab.className = "town-tab";
    };

    if (tabToActivate) {
        tabToActivate.className = "town-tab active";
    };
};

// == Afficher les onglets des villes recherchées au chargement de la page ==
// utilisation du LocalStorage
// prend en paramètres onClick et onLongPress pour utilisation avec la fonction insertNewTab
export function insertLocalStorageTab(onClick, onLongPress) {
    let storedTowns = importLocalStorage();
    for (let town of storedTowns){
        insertNewTab(town, onClick, onLongPress);
    };
};

// == Supprimer un onglet ==
export function removeTab(tab) {
    if(tab) {
        tab.remove();
    };
};