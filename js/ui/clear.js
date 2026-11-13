// === SUPPRESSION D'ELEMENTS ===
// Supprimer une carte
export function clearCard(card) {
    let sectionCard = document.querySelector(card);
    if (sectionCard) {
        sectionCard.remove();
    };
};

// Retirer les cartes et masquer les prévisions
export function clearMainContent() {
    // Supprimer les cartes d'état
    let stateCard = ".state-card";
    clearCard(stateCard);

    // Supprimer la carte météo actuelle
    let weatherCard = ".weather-card";
    clearCard(weatherCard);

    // Cacher le titre et les cartes de prévisions horaires
    let sections = document.querySelectorAll(".forecast-section");
    for (let section of sections) {
        section.hidden = true;
    };
};