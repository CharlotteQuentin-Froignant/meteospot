# Journal de progression — MétéoSpot

Ce dossier regroupe les captures illustrant l'avancement visuel du projet.
Le suivi détaillé des tickets se fait sur le GitHub Project ([voir le projet](https://github.com/users/CharlotteQuentin-Froignant/projects/1)).

---

## Ticket #1 — Initialisation du projet

Pas de capture associée : mise en place du repo, structure de dossiers,
GitHub Project. Aucun rendu visuel à ce stade.

## Ticket #2 — Structure HTML sémantique + variables CSS

Étape sans rendu visuel notable (sections vides, variables CSS déclarées).
Vérification effectuée : aucune erreur de console, toutes les requêtes en succès (favicon, polices, feuille de style).
[Voir la capture](1_app-T2-console-sans-erreur.png)

## Ticket #3 — Header, barre de recherche, onglets villes

Premier rendu visuel de l'application. Vérifications intermédiaires avec les DevTools, puis test final sur simulateur (iPhone SE 2016 via l'extension Chrome Mobile FIRST) et sur appareil réel (Galaxy S23).
[Voir la capture](2_app-T3-visuel-entete_barre-recherche_onglets.png)

**Correctif apporté après cette capture** : décalage vertical de l'onglet actif corrigé. La bordure inférieure était appliquée uniquement sur l'onglet actif, ce qui décalait sa hauteur par rapport aux autres. Voir `fix/ticket3-active-tab-border`.

## Ticket #4 — Bloc météo actuelle avec données statiques

Rendu visuel avec le bloc météo actuelle et la correction du décalage de l'onglet actif. Lors du test sur petits écrans avec l'iPhone SE 2016 des problèmes d'affichage ont été relevés sur la température ressentie et les données météo secondaires.

**Correctif apporté après cette capture** : modification de la disposition des éléments dans le fichier main.js et création d'une média query CSS dédiée afin d'améliorer le rendu esthétique de l'application sur petits écrans, sans perte d'informations. [voir la capture](3_app-T4-visuel-meteo-actuelle.png).

## Ticket #5 - Bloc prévisions horaires avec données statiques

Rendu visuel avec l'ajout du bloc prévisions haoraires. Pour s'adapter à la taille des écrans, une barre de scroll horizontal a été mise en place, et masquée à l'affichage pour éviter une surcharge visuelle. [voir la capture](4_app-T5-visuel-previsions-horaires.png)

## Ticket #6 - Intégration API OpenWeatherMap dans le bloc météo actuelle

Lors de l'intégration des données OpenWeatherMap, un décalage similaire à celui décrit au ticket 4 a pu être observé sur les écrans mobiles de taille moyenne (340 - 390px) affectant la température ressentie et les données secondaires. Pour y remédier, la media query a été modifiée avec:
- augmentation du seuil pour englober en plus les téléphones dont la taille d'écran est inférieure à 400px (contre 340px auparavant)
- modification de la répartition texte/icone du bloc météo actuelle avec 60% pour le texte et 40% pour l'icône (contre 50/50 auparavant)

Le visuel montre la correction apportée sur l'iPhone 12 Mini (taille d'écran 360px) via l'extension Mobile First, avec en comparatif l'iPhone 14 Pro (taille 428px) comme témoin d'appareil non concerné par le problème. [voir la capture](5_app_T6-fix-affichage.png)

## Ticket #7 - Intégration API OpenWeatherMap dans le bloc prévisions horaires

L'intégration de l'API dans le bloc précisions horaires n'ayant pas modifié l'apparence de l'application, il n'y a pas de nouveau rendu visuel pour ce ticket

## Ticket #8 - Barre de recherche fonctionnelle

Tout comme le ticket 7, la connexion de la barre de recherche à l'API ainsi que la création/actualisation des onglets n'a pas entraîné de modification du visuel.

## Ticket #9 - Arc solaire

Lors du ticket 9, l'arc solaire avec calcul de la position en temps réel du soleil a été réalisé. Sur le visuel, on peut voir que l'arc n'est pas le même selon qu'il fasse jour ou nuit dans la ville recherchée. Ainsi, en journée, l'icone du soleil suit sa position réelle entre le lever et le coucher; tandis que pour la nuit, le soleil est endormi a une position fixe purement esthétique et indique l'heure de prochain lever de soleil. [voir la capture](6_app_T9-arc-solaire.png)

Par rapport au design-system, la date a également été ajoutée et l'heure d'actualisation a été placée au niveau de l'arc solaire, plutôt que dans le cadre avec les données principales.

## Ticket #10 - Géolocalisation
Lors de ce ticket, la recherche et l'affichage de la météo via les coordonnées gps ont été mises en place. Un bouton provisoire a été mis en place pour activer la demande de permission du navigateur, dont le rendu visuel sera traitée au ticket 12.

## Ticket #11 - Gestion d'état : erreur d'API
Lorsqu'un problème réseau arrive ou que l'API n'est pas disponible, l'application affiche une carte d'état spécifique expliquant le problème à l'utilisateur et lui laisse la possibilité de relancer la requête. L'affichage de cet état a été vérifié sur un galaxy S23 réel et en simulation iPhone SE 2016 avec l'extension MOBILE FIRST. [voir la capture](7_app_T11-erreur-API.png)

La maquette présentée dans le fichier [process.md](../design/process.md) montre le rendu visuel attendu quand une erreur réseau / API se produit et que l'utilisateur n'a pas de recherche enregistrée. Le rendu actuel a été effectué après une requête réussie, laissant ainsi apparaître l'onglet de la dernière ville affichée.

## Ticket #12 - Gestion d'états : bienvenue / localisation désactivée
Selon l'état de permission de géolocalisation, l'application affiche une carte d'état expliquant quoi faire:
- La carte "Bienvenue" apparaît lorsque la permission d'accès à la localisation n'a pas encore été demandée. L'utilisateur peut ainsi décider d'afficher la fenêtre de permission ou rechercher directement une ville avec la barre de recherche.
- La carte "Localisation désactivée" apparaît lorsque l'utilisateur a refusé d'autoriser la localisation lors d'une précédente visite. La carte indique comment afficher de nouveau la fenêtre des permissions ou renvoie vers la barre de recherche.

Quelques changements par rapport aux maquettes :
- le bouton "Activer ma position" devient "Autoriser ma position" car l'action dépend du navigateur et non du téléphone. Les autres textes ont également été reformulés pour mieux guider l'utilisateur
- la couleur des boutons a été assombrie pour améliorer l'accessibilité
- la section météo des extrêmes n'ayant pas encore été traitée, elle n'est pas visible sur le rendu

Lors de la création de ces états, je me suis rendue compte qu'il serait également plus agréable pour l'utilisateur de voir l'état de chargement de la météo. Une carte de chargement a ainsi été ajoutée (ticket #23). [voir la capture](8_app_T12-etats.png)

**Update** : lors de l'enregistrement des villes dans le local storage et l'affichage des onglets au chargement de la page, les cartes "Bienvenue" et "Localisation désactivée" ont été adaptées et couvrent désormais les deux possibilités. [voir la capture](12_app_T12-etats-onglets.png).

Egalement, le tutoiement de toutes les cartes d'état a été remplacé par le vouvoiement afin d'être en harmonie avec les informations légales et les alertes du navigateur.

## Ticket #13 - Intégration des prévisions pour les 4 prochains jours

Comme pour le reste des données, l'affichage de la météo des 4 prochains jours a du être adapté selon la taille des écrans :
- pour les petits écrans (<=400px), les informations météo ont été réparties sur deux lignes avec les icones surplombant les données, et le rendu diffère donc de la maquette originale.
- pour les écrans de téléphone plus grands (>400px), les informations sont disposées en une seule ligne comme pour la maquette.

Le visuel montre le rendu sur un écran de petite taille (iPhone SE2016) et un écran plus grand (iPhone14 Pro Max) via l'extension MOBILE FIRST. [voir la capture](9_app_T13-visuel-prochains-jours.png)

## Ticket #14 - Couleurs en fonction de la température
Lors de ce ticket, la palette de couleurs a été intégrée selon les tranches de température définies dans le design-system afin que le fond de la carte et le chiffre changent en fonction de la température. Les outils DevTools ont été utilisés pour modifier manuellement les paliers de température et afficher l'aperçu réel. [voir la capture](10_app_T14-couleurs-dynamiques.png).

Avant de valider les couleurs, un contrôle du contraste a été réalisé entre le fond de la carte et les différentes écritures. Le tableau ci-dessous regroupe les différents résultats.

| Tranche | Chiffre (grande taille) | Nom de ville | Petits textes |
|---|---|---|---|
| Très froid | AA | AA + AAA | AA |
| Froid | AA + AAA | AA + AAA | AA |
| Frais | AA | AA + AAA | AA |
| Doux | AA | AA + AAA | AA |
| Chaud | AA | AA + AAA | AA |
| Très chaud | AA | AA + AAA | AA |
| Extrême | AA + AAA | AA + AAA | AA |

L'ensemble des textes sur le fond des cartes est conforme au niveau AA qui est le niveau exigé pour respecter le RGAA.

Un test unitaire a également été mis en place afin de vérifier que chaque température est classée dans la bonne tranche. Les règles testées ont été définies selon les critères du design-system.

| Tranche | Intervalle |
|---|---|
| `tres-froid` | < 0 |
| `froid` | 0 inclus à 10 exclu |
| `frais` | 10 inclus à 18 exclu |
| `doux` | 18 inclus à 24 exclu |
| `chaud` | 24 inclus à 35 exclu |
| `tres-chaud` | 35 inclus à 40 exclu |
| `extreme` | 40 et plus |
| (invalide) | `null` |

Les cas testés lors de ces tests incluent des valeurs intermédiaires dans chaque tranches, des valeurs situées aux proximités des bornes, les bornes elles-mêmes, des valeurs hors limites et des valeurs invalides.

| Catégorie | Valeurs testées | Résultat attendu |
|---|---|---|
| Une valeur par tranche | -18, 5, 14, 21, 30, 37, 43 | tres-froid, froid, frais, doux, chaud, tres-chaud, extreme |
| Bornes (de chaque côté) | -1 / 0, 9 / 10, 17 / 18, 23 / 24, 34 / 35, 39 / 40 | tranche de chaque côté de la limite |
| Valeurs extrêmes | -80, 70 | tres-froid, extreme |
| Valeur absente ou invalide | cas groupé | `null` |

Deux essais ont été réalisés : un test de mutation lors duquel la fonction a été modifiées afin de provoquer une erreur, et un test avec le code d'origine rétabli.

**Test 1** – bug introduit volontairement

Modification : `temp < 10` remplacé par `temp <= 10` pour la tranche `froid`.

| Total | Réussis | Échoués |
|---|---|---|
| 22 | 21 | **1** |

Test en échec : « 10 °C donne la tranche frais »

Le test détecte le bug exactement sur la borne concernée, les 21 autres conditions passent le test comme attendu.

**Test 2** – fonction corrigée

| Total | Réussis | Échoués |
|---|---|---|
| 22 | **22** | 0 |


Les 22 tests passent sur le code final.


# Ticket 16 - Local Storage
La mise en place de ce ticket permet d'afficher au chargement les onglets des villes recherchées préalablement pour faciliter l'accès aux données météo. Ce ticket n'entrraîne pas de modifications visuelles.


# Ticket 24 - Pied de page et informations légales
Lors de ce ticket, les éléments du pied de pages ont été mis en place. Pour faciliter l'utilisation, les informations légales sont disponibles sous la forme d'une dialogsheet qui se superpose à l'écran d'origine. [voir la capture](11_app_T24-footer.png)


# Mise à jour du set d'icônes
Avant le déploiement, le set d'icônes a été retravaillé : certaines icônes ont été redessinnées pour améliorer leur rendu, puis leur trait a été affiné. [voir la comparaison](13_app_ST_nouvelles-icones.png)

---

## Convention de nommage

Chaque capture est préfixée d'un numéro croissant pour garder l'ordre chronologique dans l'explorateur de fichiers, suivi du ticket concerné et d'une courte description. (Exemple : `3_app-T4-meteo-actuelle.png` pour la 3ème capture du dossier, correspondant au Ticket 4).