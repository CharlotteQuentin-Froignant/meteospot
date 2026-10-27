# MétéoSpot ![icone soleil](assets/icons/static/sunny.svg)

Application météo mobile-first, développée en HTML/CSS/JS vanilla.

## Contexte

Point de départ : un exercice de ma formation CDA (Concepteur Développeur d'Applications) pour pratiquer la manipulation du DOM et les appels API fetch. Le scope initial étant limité, j'ai choisi de le transformer en un vrai projet personnel complet avec un design, une structure de backlog et un workflow git, afin de développer une petite application complète plutôt que de coder une fonctionnalité isolée.

Ce travail est réalisé en dehors des heures de formation, avec un temps disponible qui varie d'un jour à l'autre selon la charge de cours.

## Méthode

Vu que je travaille seule et avec une disponibilité réduite, je n'ai pas retenu la notion de sprint mais j'ai plutôt adapté deux outils agiles à mon contexte :

- **Priorisation MoSCoW** pour trancher ce qui est indispensable de ce qui est un bonus (voir plus bas)
- **Backlog priorisé sur GitHub Projects** [https://github.com/users/CharlotteQuentin-Froignant/projects/1], avec un rétroplanning par ticket (date de début/fin propre à chaque tâche)

## MoSCoW

**Must have**
- [x] Barre de recherche
- [x] Météo actuelle
- [x] Prévisions de la journée
- [x] Design mobile-first

**Should have**
- [x] Arc lever/coucher du soleil
- [x] Icônes météo cohérentes et distinctes selon la météo
- [x] Géolocalisation
- [x] Gestion des différents états (erreur API, bienvenue, localisation désactivée)
- [x] Prévisions sur 4 jours
- [ ] Palette dynamique selon la température
- [ ] Responsive tablette

**Could have**
- [ ] Historique des recherches
- [ ] Responsive desktop
- [ ] Dark mode
- [ ] Accessibilité (contraste, alt text, navigation clavier — en continu)

**Won't have (pour l'instant)**
- Météo des extrêmes (sélection de villes emblématiques)
- Carte interactive
- Notifications
- Alertes météo (vigilance, etc.)

## Stack technique

- HTML5 / CSS3 vanilla / JavaScript vanilla
- API météo : [OpenWeatherMap](https://openweathermap.org/) (offre gratuite avec météo actuelle + prévisions sur 5 jours avec un pas de 3h)
- Pas de framework JS ni de librairie CSS — choix volontaire pour comprendre le DOM et le CSS en profondeur avant de m'appuyer sur des outils plus automatisés

## Architecture du projet
Le code est organisé selon une architecture modulaire afin de séparer les responsabilités. Chaque fichier JavaScript a ainsi un rôle unique afin de rendre le projet plus lisible, plus facile à tester et à faire évoluer.
```plaintext
meteospot/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js            # orchestration : événements, enchaînement des appels
│   ├── api.js             # construction des URL + requêtes (fetch), aucun accès au DOM
│   ├── ui.js              # tout ce qui touche au DOM (cartes météo, arc solaire, onglets)
│   ├── utils.js           # fonctions pures (icônes, heures locales, calcul de l'arc)
│   ├── config.js          # clé API personnelle (ignoré par Git)
│   └── config.example.js  # modèle de config.js, versionné
├── assets/
│   ├── favicon.ico
│   └── icons/
│       ├── static/        # icônes pour les listes de prévisions
│       └── animated/      # icônes animées du bloc météo actuelle
├── docs/
│   ├── design/            # process de conception, design system
│   └── progress/          # journal de progression en captures
├── README.md
└── .gitignore
```

## Design

Maquette conçue par itérations successives avec l'aide de l'IA (échanges de prompts et retours, sans passer par Figma). Point de départ : une direction type dashboard bleu/glassmorphism, jugée trop générique, puis retravaillée vers une identité plus sobre et distinctive (fond pastel, typographie Newsreader + Manrope, palette évolutive).

Détail complet du processus (points de bascule, versions intermédiaires) : [docs/design/process.md](docs/design/process.md)

Référence technique d'implémentation (palette, typographie, icônes, ...): [docs/design/design-system](docs/design/design-system.md)

**Particularité visuelle du projet :** un arc représente la trajectoire du soleil entre le lever et le coucher, la nuit le soleil a une position fixe au centre de l'arc et l'heure du prochain lever est affiché. Le fond du bloc météo actuelle, le dégradé du chiffre de température et la couleur des icônes changent selon la température de la ville affichée (7 paliers, de "très froid" à "canicule"), pour donner une indication visuelle immédiate du ressenti climatique.

## Assistance IA

J'utilise l'IA de façon ciblée, avec trois cas d'usage principaux :

- **Points techniques que je ne maîtrise pas encore** (ex : calcul de position sur l'arc lever/coucher du soleil) : je demande une explication du fonctionnement, pas juste le code. Je relis ligne par ligne et je dois être capable de l'expliquer moi-même avant de l'intégrer.

- **Aide à la conception** (choix d'architecture, de disposition, structure d'une fonction, organisation des fichiers) : je demande un avis ou plusieurs options à l'IA pour orienter ma décision tout en vérifiant les informations fournies; le code est en grande partie écrit par moi-même.

- **Résolution d'erreurs et de bugs** (CSS qui ne s'affiche pas comme prévu, erreur JS, réponse API inattendue) : j'essaie d'abord de comprendre et corriger seule. Si je bloque après un vrai essai, je demande à l'IA d'expliquer la cause du problème plutôt qu'une correction toute faite, puis je reteste moi-même en modifiant un paramètre pour vérifier que j'ai bien compris

Dans les trois cas, la règle est la même : comprendre avant d'intégrer, et vérifier plutôt que de faire confiance par défaut.

## Avancement

Suivi détaillé sur le GitHub Project : https://github.com/users/CharlotteQuentin-Froignant/projects/1
Journal visuel des étapes clés : [docs/progress/](docs/progress)

## Installation


1. Cloner le projet :
   ```bash
   git clone [ton lien]
   cd meteospot
   ```
2. Créer sa clé API gratuite sur [openweathermap.org](https://openweathermap.org/).
3. Copier le fichier de configuration et y coller sa clé :
   ```bash
   cp js/config.example.js js/config.js
   ```
   ```js
   // js/config.js
   export const APIKEY = "ta_cle_ici";
   ```
4. Lancer l'app avec un serveur local (ex : extension **Live Server** de VS Code, clic droit sur `index.html` → *Open with Live Server*).

**Remarques**:
- `js/config.js` est ignoré par Git : ne jamais le commiter.
- Les modules ES et la géolocalisation nécessitent un serveur local ou HTTPS : l'ouverture directe de `index.html` ne fonctionne pas.
- Sans backend, la clé reste visible côté client (limite assumée pour ce projet d'apprentissage).
