// Exporte toutes les fonctions de manipulation du DOM utilisées dans main.js
// La manipulation du DOM est divisée en 6 sous parties, chacune contenant les fonctionnalités d'un rendu visuel précis (onglets, arc solaire, affichage des données météo, cartes d'états, mentions légales, nettoyage)

export { clearCard } from "./ui/clear.js";
export {fillContactMail, renderLegalContent, showLegalError, initLegalDialog} from "./ui/footer.js";
export {downAPI, renderWelcomeCard, renderBlockedCard, renderLoadingCard} from "./ui/states.js";
export {renderCurrentWeather, renderHourlyForecast, renderNextDays} from "./ui/weather.js";
export {findTab, insertNewTab, setActiveTab, insertLocalStorageTab, removeTab} from "./ui/tabs.js";