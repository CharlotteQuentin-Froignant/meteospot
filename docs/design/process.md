# Processus de conception — MétéoSpot
> **Document historique.** Le design a évolué au cours du développement et les maquettes présentées ici ne correspondent plus au rendu visuel de l'application.

Ce document explique comment le design de MétéoSpot a été construit, par itérations avec Claude (Anthropic), et pourquoi je n'ai pas utilisé Figma pour cette étape.

## Pourquoi pas Figma ?

La raison principale est une contrainte de temps : itérer en conversation directe avec une IA va nettement plus vite que de construire une vraie maquette Figma de zéro, tout en produisant un rendu visuel réel à chaque étape, et pas seulement une description.

Egalement, la boucle de rétroaction est quasi instantanée (quelques secondes entre une remarque et un nouveau rendu), et chaque décision de design est documentée dans la conversation elle-même.


## 1. Point de départ

Le point de départ initial du projet était de développer une application météo mobile, tablette et desktop comprenant la météo actuelle, les prévisions horaires et un classement des extrêmes climatiques mondiaux.

La première maquette proposée était fonctionnelle mais reconnaissable et très proche du langage visuel de nombreuses applications avec dégradé bleu et icônes génériques. Utile comme base de discussion, mais pas comme identité propre.

![illustration de la maquette initiale](versions/1_prompt-initial.png)

## 2. Supprimer les éléments inutiles

Même si le rendu visuel était trop générique, la première projection m'a permis de réduire le périmètre en supprimant des éléments que je ne souhaitais pas intégrer dans mon application, telles que la barre de navigation, le menu et le compte utilisateur.

## 3. Trouver le bon design

Une fois la structure posée, de nombreuses itérations ont été nécessaires afin d'essayer de sortir des designs génériques édités par IA. Au final, plutôt que de changer la structure de l'application elle-même, le choix a été fait de partir sur une base un peu plus éditoriale avec l'ajout d'un arc de positionnement du soleil dans la carte principale et un gros chiffre de température.

![Versions 3](versions/2_V3-itération.png)

## 4. Un système de couleur dynamique

Plutôt qu'une couleur fixe, la couleur du bloc météo principal a été reliée à la température réelle selon 7 tranches, allant de "très froid" à "extrême", chacune avec un dégradé de texte et un fond dédiés. Après plusieures itérations pour trouver les bonnes associations, le rendu des 7 palliers devrait être le suivant:
![Palette couleurs représentant les 7 transches de températures](versions/3_Palette-couleurs.png)

## 5. Un vrai set d'icônes

Pour essayer de s'éloigner un peu plus loin des designs classiques, j'ai décidé de ne pas utiliser une librairie d'icônes, mais de réaliser un set d'icônes personnalisé avec l'IA.
Les icônes ont connu plusieurs versions avant validation : d'abord de simples formes géométriques (jugées trop pauvres), puis un style inspiré de la bibliothèque Skycons (formes non remplies au contour fin). Le set final compte 14 conditions météo, chacune livrée en deux versions : statique (pour les listes de prévisions) et animée  (pour le bloc principal).

![Visuel des icônes](versions/4_icones.png)

## 6. Typographie
Pour renforcer le style éditorial de l'application, et pour se différencier des polices actuellement utilisées partout comme Roboto, mon choix s'est arrêté sur **Newsreader** (serif éditoriale) pour les éléments vedettes : nom de ville, température, titres et **Manrope** (sans-serif neutre) pour le reste.

## 7. Nom
Une fois les sections et le design validés, une reflexion a été menée sur le nom et la phrase d'accroche de l'application. Le choix s'est finalement arrêté sur " **MéteoSpot**, la météo d'ici et d'ailleurs"

![version finale](versions/5_version-finale.png)

## 8. Les cas limites

Afin d'améliorer l'expérience utilisateur, j'ai souhaité intégrer des écrans d'état afin d'avertir l'utilisateur en cas d'erreur d'api ou de problème de localisation.

![visuels pour les différents états + version finale](versions/6_états.png)

## 9. Desktop et tablette

La quasi-totalité du travail a porté sur mobile. Les versions tablette et desktop ont été abordées plus tard, avec plusieurs allers-retours sur la disposition (breakpoint corrigé de 1280px à 1024px après remarque sur les tailles d'écran réelles de laptop, plusieurs répartitions de colonnes testées et rejetées avant la version retenue : ville actuelle en pleine hauteur à gauche, prévisions et extrêmes empilés à droite). La version tablette adoptera la même disposition que la vue mobile, tandis que la disposition en desktop sera réorganisée.

![design desktop](versions/7_desktop.png)

## Limites assumées de cette approche

Même si ce processus de conception est rapide, il a aussi ses limites :
- tout a été validé sur des maquettes statiques dans une conversation, jamais sur un vrai appareil ni dans un vrai navigateur.
- le contraste texte/fond des 7 tranches de couleur n'a pas encore été vérifié avec un outil d'accessibilité (WCAG).
- la robustesse de la mise en page desktop face à un contenu de longueur variable n'a pas été testée.
- cette direction reste elle-même une esthétique repérable du design assisté par IA.
- même avec un set d'icônes personnalisé, les icônes météo gardent une forme générique.