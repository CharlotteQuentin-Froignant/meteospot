// === FOOTER - INFORMATIONS LEGALES === //
export const EMAIL = "meteospot.contact@gmail.com";
export function fillContactMail() {
    let targets = document.querySelectorAll("[data-contact-mail]");
    for (let target of targets) {
        target.textContent = EMAIL;
    };
};

// == Afficher le contenu des informations légales ==
export function renderLegalContent(HTML) {
    const LEGAL_BODY = document.querySelector(".legal-body");
    LEGAL_BODY.innerHTML = HTML;
    fillContactMail();
};

export function showLegalError() {
    const LEGAL_BODY = document.querySelector(".legal-body");
    LEGAL_BODY.textContent = "Impossible de charger les informations légales. Veuillez vérifier votre connexion, puis réessayer";
};

export function initLegalDialog(onOpen) {
    const LEGAL_DIALOG = document.querySelector("#legal-dialog");
    const OPEN_LEGAL_BUTTON = document.querySelector(".legal-link");
    const CLOSE_LEGAL_BUTTON = document.querySelector(".legal-close");

    // ouvrir la feuille et lancer le chargement des informations légales
    OPEN_LEGAL_BUTTON.addEventListener("click", async () => {
        LEGAL_DIALOG.showModal();
        await onOpen();
    });

    // fermeture de la feuille en cliquant sur la croix
    CLOSE_LEGAL_BUTTON.addEventListener("click", async () => {
        LEGAL_DIALOG.close();
    });

    // fermeture en cliquant hors de la feuille
    LEGAL_DIALOG.addEventListener("click", (event) => {
        if (event.target === LEGAL_DIALOG) {
            LEGAL_DIALOG.close();
        };
    });
};