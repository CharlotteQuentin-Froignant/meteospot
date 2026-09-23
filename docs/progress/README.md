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

---

## Convention de nommage

Chaque capture est préfixée d'un numéro croissant pour garder l'ordre chronologique dans l'explorateur de fichiers, suivi du ticket concerné et d'une courte description. (Exemple : `3_app-T4-meteo-actuelle.png` pour la 3ème capture du dossier, correspondant au Ticket 4).