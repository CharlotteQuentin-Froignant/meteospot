# Design system de MétéoSpot

Ce document décrit le design tel qu'il est implémenté aujourd'hui (mise à jour du 6 novembre 2026).
En cas de divergence, la configuration appliquée est celle écrite dans le fichier`css/style.css`.

La spécification initiale, rédigée avant le développement, est conservée dans [archive/design-system-initial.md](archive/design-system-initial.md) à titre historique.


## Principes

L'interface tient dans une colonne unique centrée, d'une largeur maximale de 768 px, pensée d'abord pour le mobile. Le fond est blanc et les cartes sont d'un gris très clair. J'utilise Newsreader pour les titres et les chiffres, et Manrope pour le reste.

Aucune ressource externe n'est chargée : les polices et les icônes sont hébergées dans `assets/`.

## Couleurs

### Neutres

| Variable | Valeur | Usage |
|---|---|---|
| `--text-primary` | `#1A1A18` | titres, valeurs importantes |
| `--text-secondary` | `#5F5E5A` | texte courant, libellés |
| `--background-color` | `#FFFFFF` | fond de page, carte de chargement, fenêtre légale |
| `--background-section` | `#f3f3f758` | fond des cartes |
| `--border` | `#f5f5f4` | bordures des cartes et de la recherche |


### Boutons

| Variable | Valeur |
|---|---|
| `--info-button` | `#C05407` |
| `--alert-button` | `#b70b0b` |

### Palette de température

La palette est appliquée par l'attribut `data-temp-palette` posé sur `.weather-card`. Chaque palier définit trois couleurs :

- `--temp-tint` : la teinte de fin du dégradé de fond de la carte (`linear-gradient(160deg, #FFFFFF 0%, tint 100%)`) ;
- `--temp-accent` : la bordure de la carte (mélangée à 20 % de blanc) et les rayons du soleil ;
- `--temp-num` : le grand chiffre de la température.

| Palier | `--temp-tint` | `--temp-accent` | `--temp-num` |
|---|---|---|---|
| `tres-froid` | `#E3F7FA` | `#4FD1E8` | `#2F98A8` |
| `froid` | `#E6F1FB` | `#185FA5` | `#185FA5` |
| `frais` | `#DFF1EC` | `#3AA898` | `#258F80` |
| `doux` | `#FDF6E0` | `#D9A62E` | `#BD810A` |
| `chaud` | `#F9E3D4` | `#F18432` | `#CB6710` |
| `tres-chaud` | `#FCDDD8` | `#E63946` | `#E63946` |
| `extreme` | `#F1DFE4` | `#7A1D4D` | `#7A1D4D` |

Les seuils de température de chaque palier sont définis dans la fonction `getTempPalette` (`js/utils.js`, testée dans `tests/palette.test.js`). Avant l'application d'un palier, les valeurs par défaut sont celles de « chaud ».

### Couleurs écrites en dur

| Où | Valeur |
|---|---|
| Arc solaire de jour (`.bow`, `.sun`, `.halo`) | `#FFC233` |
| Arc solaire de nuit (`.night-mode`) | `rgb(66, 31, 66)`, `rgb(121, 73, 121)`, `rgb(219, 138, 219)` |
| Soulignement de l'onglet actif | `#FF9A44` |
| Séparateur des informations secondaires | `rgb(235, 227, 227)` |
| Fond de l'overlay de chargement | `rgb(0 0 0 / 0.4)`, avec un flou de 4 px |
| Trait sous le titre de la fenêtre légale | `black` |

## Typographie

Les deux polices sont hébergées dans `assets/fonts/` (format woff2, `font-display: swap`, licence SIL OFL 1.1) :

- Newsreader (`--font-family-titles`), en graisses 500 et 600 ;
- Manrope (`--font-family-secondary`), en graisses 400, 500 et 600.

### Tailles

| Variable | Valeur | Usage |
|---|---|---|
| `--font-size-ui` | 0.7rem | textes secondaires, onglets, slogan (minimum de l'application) |
| `--font-size-city-name` | 0.9rem | pied de page, jours des prévisions, fenêtre légale |
| `--font-size-section-title` | 1rem | champ de recherche, texte des cartes d'état |
| `--font-size-forecast-temp` | 1.1rem | températures horaires, nom du jour, boutons d'état |
| `--font-size-app-name` | 1.4rem | titre de l'application, titres des cartes d'état |

Certaines tailles sont écrites en dur : le nom de la ville (1.6rem, Newsreader 500), la température principale (3.5rem), le titre des prévisions (1.4rem) et le titre de la fenêtre légale (1.6rem).

Les onglets, la description météo et le nom du jour utilisent `text-transform: capitalize`.

## Espacements, rayons et bordures

| Variable | Valeur | Usage |
|---|---|---|
| `--spacing-block` | 22 px | espace vertical entre les blocs |
| `--spacing-card-gap` | 8 px | espace entre les cartes horaires |
| `--spacing-app` | `0 15px 8px 15px` | marge extérieure des blocs |
| `--radius-card` | 12 px | cartes horaires, jours, cartes d'état |
| `--radius-block` | 16 px | carte météo principale |
| `--radius-app` | 14 px | coins supérieurs de la fenêtre légale |

Le champ de recherche a un rayon de 6 px, les boutons d'état de 30 px, et les bordures font 1 px.

## Composants

**En-tête et recherche.** L'en-tête contient le titre (Newsreader 600, 1.4rem) et un slogan en 0.7rem. Le champ de recherche reprend le fond des cartes, avec un texte et un placeholder en `--text-secondary` et une loupe de 18 px ajoutée en `::before`.

**Onglets des villes.** Les onglets sont des boutons sans bordure, avec un `min-height: 24px` pour respecter la taille de cible minimale de WCAG 2.2, un texte en 0.7rem et un `cursor: pointer`.
L'onglet actif est souligné de 2 px en `#FF9A44`.

**Carte météo principale.** Le fond est un dégradé du blanc vers `--temp-tint`, avec une bordure de 1 px. Elle comprend deux zones côte à côte : les textes (50 % de la largeur, 60 % sous 400 px) et l'icône animée (50 %, puis 40 %), agrandie à 1.2 et décalée de 10 px. Humidité, pluie et vent figurent en dessous, sous un séparateur de 1 px. Le ressenti est précédé d'un « - » ajouté en CSS, retiré sous 400 px.

**Arc solaire.** C'est un SVG injecté par JavaScript. De jour, l'arc est en pointillés `#FFC233` à 50 % d'opacité, avec un soleil `#FFC233`, un halo à 25 % et des rayons en `--temp-accent`. De nuit (`.night-mode`), les teintes deviennent violettes, le soleil reste fixe au centre et les textes de lever et de coucher sont masqués (`display: none`) ; seul le « zzz » reste. Son nom accessible est fourni par `role="img"` et un `aria-label` mis à jour par JavaScript.

**Prévisions horaires.** La liste défile horizontalement (barre de défilement masquée, parcours possible avec les flèches du clavier). Chaque carte est une colonne centrée avec une icône de 45 px et une température en Newsreader 600, 1.1rem.

**Prévisions sur 4 jours.** Chaque jour occupe une ligne, en grille `1fr 2.8fr 1.7fr 2.4fr` (nom, icône et températures, pluie, vent). Sous 400 px, la grille passe à `1fr 2.6fr 1.5fr 2.4fr`, les valeurs s'empilent et la taille monte à 1rem.

**Cartes d'état.** Les cartes d'état forment une colonne centrée, avec les mêmes fond, bordure et rayon que les cartes horaires. Le titre est en Newsreader 600 (1.4rem), le texte en Manrope 500 (1rem) et le bouton en forme de pilule.

| État | Bouton | Rôle ARIA |
|---|---|---|
| Bienvenue | info (`#C05407`) | `status` |
| Localisation désactivée | info | `status` |
| Chargement (sous un overlay plein écran) | aucun, fond blanc | `status` |
| Météo indisponible | alerte (`#b70b0b`, via `.state-card-error`) | `alert` |

Sur la carte Météo Indisponible, le bloc « dernières données connues »  est en 0.7rem, en `--text-secondary`, centré.

**Pied de page et fenêtre légale.** Le pied de page comprend un séparateur de 1 px, des textes en 0.9rem, le lien OpenWeather souligné, le logo (30 px de haut) et le bouton pour afficher les informations légales. La fenêtre légale est un `<dialog id="legal-dialog">` posé en bas de l'écran (92 dvh au maximum, animation `sheet-up` de 0,25 s). Son contenu vient de `partials/legal.html`, ses liens sont soulignés et son bouton de fermeture mesure 40 × 40 px.

## Icônes

Le projet compte 12 icônes animées, utilisées dans la carte principale. Ce sont des SVG autonomes (`viewBox="0 0 64 64"`), pilotés par des variables CSS (`--wi-ink`, `--wi-soft`, `--wi-sun`, `--wi-water`, `--wi-moon`, `--wi-shade`, avec des valeurs de repli). Chacun contient sa propre règle `prefers-reduced-motion: reduce` qui coupe les animations. Cette règle doit se trouver dans le SVG lui-même, puisqu'il est chargé via `<img>` et que le CSS de la page ne s'y applique pas.

Les 17 icônes statiques servent aux prévisions, aux états, à la recherche, à la goutte, au vent et à la géolocalisation. Elles font 45 px dans les prévisions, 18 px pour la loupe. Les icônes ne changent pas de couleur selon la température, le CSS n'y touche pas.

Une icône qui porte une information a un `alt` descriptif, une icône décorative a `alt=""`. Elles ont été dessinées par itérations avec Claude, dans un style inspiré de Skycons.

## Disposition

La mise en page n'a qu'un seul point de rupture : `max-width: 400px`. J'ai testé les largeurs de 320 px (sans défilement horizontal), 401 px et 768 px. Sur grand écran, la colonne reste centrée à 768 px sans autre adaptation.

## Accessibilité

Le niveau visé est WCAG 2.2 AA, sans revendication de conformité RGAA. Ce qui a été mis en place pour le moment:

- tous les éléments interactifs sont atteignables au clavier, avec le focus par défaut du navigateur ;
- les onglets font au moins 24 px de haut et le bouton de fermeture 40 × 40 px ;
- la barre de recherche est nommée par un `aria-label` (pas de `<label>` visible) ;
- le texte courant fait au moins 0.7rem (hors exception ci-dessous) et respecte un contraste d'au moins 4,5:1 ;
- les cartes d'état portent `role="status"` ou `role="alert"`, les boutons n'en portent pas.
