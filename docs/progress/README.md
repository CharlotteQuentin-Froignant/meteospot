# Journal de progression — MétéoSpot

Ce dossier regroupe les captures illustrant l'avancement visuel du projet.
Le suivi détaillé des tickets se fait sur le GitHub Project [https://github.com/users/CharlotteQuentin-Froignant/projects/1].

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

Lintégration de l'API dans le bloc précisions horaires n'ayant pas modifié l'apparence de l'application, il n'y a pas de nouveau rendu visuel pour ce ticket

## Ticket #8 - Barre de recherche fonctionnelle

Tout comme le ticket 7, la connexion de la barre de recherche à l'API ainsi que la création/actualisation des onglets n'a pas entraîné de modification du visuel.

## Ticket #9 - Arc solaire

Lors du ticket 9, l'arc solaire avec calcul de la position en temps réel du soleil a été réalisé. Sur le visuel, on peut voir que l'arc n'est pas le même selon qu'il fasse jour ou nuit dans la ville recherchée. Ainsi, en journée, l'icone du soleil suit sa position réelle entre le lever et le coucher; tandis que pour la nuit, le soleil est endormi a une position fixe purement esthétique et indique l'heure de prochain lever de soleil. [voir la capture](6_app_T9-arc-solaire.png)

Par rapport au design-system, la date a également été ajoutée et l'heure d'actualisation a été placée au niveau de l'arc solaire, plutôt que dans le cadre avec les données principales.

## Ticket #10 - Géolocalisation
Lors de ce ticket, la recherche et l'affichage de la météo via les coordonnées gps ont été mises en place. Un bouton provisoire a été mis en place pour activer la demande de permission du navigateur, dont le rendu visuel sera traitée au ticket 12.

## Ticket #11 - Gestion d'état erreur d'API
Lorsqu'un problème réseau arrive ou que l'API n'est pas disponible, l'application affiche une carte d'état spécifique expliquant le problème à l'utilisateur et lui laisse la possibilité de relancer la requête. L'affichage de cet état a été vérifié sur un galaxy S23 réel et en simulation iPhone SE 2016 avec l'extension MOBILE FIRST. [voir la capture](7_app_T11-erreur-API.png)

La maquette présentée dans le fichier process.md montre le rendu visuel attendu quand une erreur réseau / API se produit et que l'utilisateur n'a pas de recherche enregistrée. Le rendu actuel a été effectué après une requête réussie, laissant ainsi apparaître l'onglet de la dernière ville affichée.


---

## Convention de nommage

Chaque capture est préfixée d'un numéro croissant pour garder l'ordre chronologique dans l'explorateur de fichiers, suivi du ticket concerné et d'une courte description. (Exemple : `3_app-T4-meteo-actuelle.png` pour la 3ème capture du dossier, correspondant au Ticket 4).