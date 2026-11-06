# MétéoSpot ![icone soleil](assets/icons/static/sunny.svg)

MétéoSpot est une application météo mobile-first, développée en HTML, CSS et JavaScript vanilla.

## Fonctionnalités

- Recherche d'une ville et météo actuelle
- Prévisions de la journée (par créneaux) et des 4 prochains jours
- Arc représentant la trajectoire du soleil
- Géolocalisation
- Onglets des villes recherchées, conservés dans le navigateur
- Palette de couleurs qui varie selon la température
- Gestion des états : bienvenue, localisation désactivée, erreur de l'API

## Contexte

Ce projet part d'un exercice de ma formation CDA (Concepteur Développeur d'Applications) portant sur la manipulation du DOM et les appels API fetch. Le périmètre initial étant limité, j'ai choisi d'en faire un vrai projet personnel complet avec une maquette, un backlog structuré et un workflow git, afin de développer une petite application de A à Z et de la déployer, plutôt que de coder une fonctionnalité isolée.

Ce travail est réalisé en dehors des heures de formation, avec une disponibilité variable selon la charge des cours.

## Méthode

Travaillant seule et avec une disponibilité réduite, je n'ai pas retenu la notion de sprint, mais j'ai plutôt adapté deux outils agiles à mon contexte :

- Backlog priorisé sur GitHub Projects, avec un rétroplanning par ticket (date de début/fin propre à chaque tâche) ([voir le projet](https://github.com/users/CharlotteQuentin-Froignant/projects/1)) ;
- Priorisation MoSCoW pour trancher ce qui est indispensable de ce qui est accessoire (voir sur le backlog);

## Stack technique

- HTML5, CSS3 et JavaScript vanilla.
- API météo : [OpenWeatherMap](https://openweathermap.org/) (offre gratuite avec météo actuelle et prévisions sur 5 jours avec un pas de 3h).
- Aucun framework Javascript ni de librairie CSS: choix volontaire pour comprendre le DOM et le CSS en profondeur avant d'utiliser des outils plus automatisés.
- Tests unitaires avec le lanceur intégré à Node (node --test), sans dépendance.

## Architecture du projet

```plaintext
meteospot/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js            # orchestration : événements, enchaînement des appels
│   ├── api.js             # construction des URL et requêtes (fetch), sans accès au DOM
│   ├── ui.js              # tout ce qui touche au DOM (cartes, arc solaire, onglets)
│   ├── utils.js           # fonctions pures (icônes, heures locales, arc, palette)
│   ├── config.js          # clé API personnelle (ignoré par Git)
│   └── config.example.js  # modèle de config.js, versionné
├── partials/
│   └── legal.html         # contenu des informations légales
├── tests/
│   └── palette.test.js    # tests unitaires de la palette de température
├── assets/
│   ├── favicon.ico
│   ├── fonts/             # Newsreader et Manrope, avec leurs licences (OFL)
│   ├── icons/
│   │   ├── static/        # icônes des listes de prévisions
│   │   └── animated/      # icônes animées de la météo actuelle
│   └── images/            # logo OpenWeather
├── docs/
│   ├── design/
│   │   ├── process.md          # historique de la conception (maquettes anciennes)
│   │   ├── design-system.md    # référence actuelle (palette, typographie, icônes)
│   │   └── archive/            # ancienne version du design system
│   └── progress/               # journal de progression en captures
├── package.json
├── LICENSE
├── README.md
└── .gitignore
```

Le code est organisé selon une architecture modulaire afin de séparer les responsabilités. Chaque fichier JavaScript a ainsi un rôle unique afin de rendre le projet plus lisible, plus facile à tester et à faire évoluer.

## Design

La maquette a été conçue par itérations successives avec l'aide de l'IA, sans passer par Figma. La direction de départ, de type dashboard bleu en glassmorphism m'a semblé trop générique. Je l'ai donc retravaillée vers une identité plus sobre: fond clair, typographies Newsreader et Manrope, palette de couleurs évolutive.

Le détail du processus de conception est décrit dans [docs/design/process.md](docs/design/process.md). Ce document est historique, car le design et l'esthétique ont évolué au cours du projet et les maquettes qu'il présente ne correspondent plus à l'application.
La référence actuelle (couleurs, typographie, icônes) est résumée dans le fichier [docs/design/design-system.md](docs/design/design-system.md)

L'application se distingue par un arc qui représente la trajectoire du soleil entre le lever et le coucher du soleil. La nuit, le soleil reste en position fixe au centre de l'arc et l'heure du prochain lever est indiquée. Egalement, la couleur du fond de la carte météo, de sa bordure et du chiffre de la température varie selon la température affichée, afin de donner une indication visuelle immédiate du ressenti climatique.

## Place de l'IA dans le projet

J'ai eu recours à l'IA (Claude, Anthropic) tout au long du projet, comme un "tuteur" pour comprendre de nouvelles notions, diagnostiquer et résoudre des bugs, ou comparer des options de conception. Certaines solutions m'ont été proposées par l'IA, le plus souvent avec une explication ligne par ligne afin de pouvoir bien comprendre ce que fait le code (et pourquoi) et savoir l'expliquer.

L'IA a également été utilisée pour le rendu visuel des maquettes, la création des icônes et des tests unitaires de la palette des couleurs ; et sur une grande partie de la documentation, afin d'accélérer le processus d'écriture. Toute la documentation a été relue, complétée et modifiée par mes soins avant intégration.

## Avancement
Un journal de suivi a été mis en place, afin d'avoir un historique d'évolution visuelle du projet selon son avancement ([voir le document](docs/progress)).

## Installation et tests
### Installer le projet

1. Cloner le projet :
   ```bash
   git clone https://github.com/CharlotteQuentin-Froignant/meteospot
   cd meteospot
   ```
2. Créer une clé API gratuite sur [openweathermap.org](https://openweathermap.org/).
3. Copier le fichier de configuration et y renseigner la clé :
   ```bash
   cp js/config.example.js js/config.js
   ```
   ```js
   // js/config.js
   export const APIKEY = "votre_cle_ici";
   ```
4. Lancer l'app avec un serveur local (ex : extension **Live Server** de VS Code, clic droit sur `index.html` → *Open with Live Server*).

**Remarques**:
- `js/config.js` est ignoré par Git et ne doit jamais être commité.
- Les modules ES et la géolocalisation nécessitent un serveur local ou HTTPS : l'ouverture directe de `index.html` ne fonctionne pas.
- Sans backend, la clé reste visible côté client (limite assumée pour ce projet d'apprentissage).

### Lancer les tests unitaires
Le lancement des tests unitaires s'effectue par la ligne de commande `npm test`.

## Crédits
- Données météo : OpenWeather.
- Polices : Newsreader et Manrope, sous licence SIL Open Font License 1.1 (licences dans assets/fonts/).
- Icônes et maquettes : créées par itérations avec Claude (Anthropic).

## Licence
Le code est publié sous licence MIT (voir LICENSE).
Les polices conservent leur propre licence, et le logo reste la propriété d'OpenWeather.